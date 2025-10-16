// src/app/taller/_components/AppointmentForm.tsx
"use client";

import React, { useEffect, useMemo, useTransition, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { zodResolver } from '@hookform/resolvers/zod';
import { useActionState } from 'react';
import { toast } from "sonner";
import { format, addDays } from 'date-fns';
import { useForm } from 'react-hook-form';

// ✅ Importacions dels hooks EXTERNS
import { useAvailableSlots } from '../_hooks/useAvailableSlots';
import { useFileUpload } from '../_hooks/useFileUpload';

// ✅ Importació de la Server Action REAL
import { createAppointmentAction } from '../actions';
import { getAppointmentSchema, AppointmentSchemaType } from '@/lib/utils/appointmentValidation';
import AppointmentFormUI from './AppointmentFormUI';


// ✅ Assumim que aquesta és la ruta correcta del vostre fitxer de configuració
const APPOINTMENT_CONFIG = {
    MIN_BOOKING_DAYS_AHEAD: 7,
    MAX_FILES: 3,
    MAX_FILE_SIZE_MB: 5
};

// --- Tipus ---
type FormState = { success: boolean; error: string | null; errors: any | null; message: string | null };
const initialState: FormState = { success: false, error: null, errors: null, message: null };

interface AppointmentFormProps {
    selectedService: string | null;
    onFormSubmit: () => void;
    isBypassMode: boolean; // <-- La propietat que rebem
}

// ✅ Rebem i utilitzem la prop isBypassMode
export default function AppointmentForm({ selectedService, onFormSubmit, isBypassMode }: AppointmentFormProps) {
    const { t, i18n } = useTranslation();
    const [isTransitioning, startTransition] = useTransition();

    // Gestió del Toast (mantinguda)
    const [lastProcessedMessage, setLastProcessedMessage] = useState<string | null>(null);

    // 1. Ús dels hooks externs
    const { files, imagePreviews, handleFileChange, removeFile, resetFiles } = useFileUpload(t, APPOINTMENT_CONFIG);
    // DEBUG 1: Comprovem el valor de la prop rebuda
    console.log("CLIENT - isBypassMode prop rebuda:", isBypassMode);
    const appointmentSchema = useMemo(() => getAppointmentSchema(t, isBypassMode), [t, isBypassMode]);

    const form = useForm<AppointmentSchemaType>({
        resolver: zodResolver(appointmentSchema),
        mode: 'onChange',
        defaultValues: {
            name: "", email: "", phone: "", vehicleBrand: "", vehicleModel: "", service: selectedService || "", date: "", time: "", message: "", privacyPolicy: false,
            attachments: [] as File[],
        }
    });

    const { handleSubmit, watch, setValue, reset, formState: { isSubmitting } } = form;

    const selectedDate = watch('date');
    // 2. Ús del hook extern useAvailableSlots
    const { availableSlots, isLoadingSlots } = useAvailableSlots(selectedDate);

    // 3. useActionState amb l'acció REAL
    const [state, dispatchAction] = useActionState(createAppointmentAction, initialState);


    // ---------------------------------------------------------------------
    // Gestió de Toasts (mantinguda)
    useEffect(() => {
        const currentMessageId = `${state.success}-${state.message}-${state.error}`;
        if ((state.message || state.error) && currentMessageId !== lastProcessedMessage) {
            if (state.success) {
                toast.success(t('toast.submitSuccessTitle'), {
                    description: state.message || t('toast.submitSuccessDescription'),
                });
                reset();
                resetFiles();
                onFormSubmit();
            } else {
                toast.error(t('toast.submitErrorTitle'), {
                    description: state.error || t('toast.submitErrorDescription', { errorMessage: state.error }),
                });
            }
            setLastProcessedMessage(currentMessageId);
        }
    }, [state, reset, resetFiles, onFormSubmit, t, lastProcessedMessage]);
    // ---------------------------------------------------------------------

    // SINCRONITZACIÓ AMB RHF (mantinguda)
    useEffect(() => {
        setValue('attachments', files as any, { shouldValidate: false });
    }, [files, setValue]);

    const onSubmitLogic = async (data: AppointmentSchemaType) => {
        // 1. Preparem FormData
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (key === 'privacyPolicy') {
                if (value === true) formData.append(key, 'on');
            } else if (key !== 'attachments' && value !== undefined && value !== null) {
                formData.append(key, String(value));
            }
        });

        // Afegim els fitxers de l'estat local
        files.forEach(file => { formData.append('attachments', file); });
        formData.append('lang', i18n.language.startsWith('es') ? 'es' : 'ca');

        // ✅ MODIFICACIÓ CLAU: Enviar la bandera al servidor
        // Això és essencial per comunicar l'estat del "triple click" a la Server Action.
        if (isBypassMode) {
            formData.append('isBypassMode', 'true');
        }

        // ✅ 2. Embolcallem la crida a l'acció en startTransition
        startTransition(() => {
            dispatchAction(formData);
        });
    };

    // ✅ Lògica CORREGIDA: Utilitzem la prop isBypassMode rebuda
    const minDaysAhead = isBypassMode ? 0 : APPOINTMENT_CONFIG.MIN_BOOKING_DAYS_AHEAD;
    const minBookingDateString = format(addDays(new Date(), minDaysAhead), 'yyyy-MM-dd');

    const combinedSubmitting = isSubmitting || isTransitioning;

    return (
        <div className="w-full">
            <AppointmentFormUI
                form={form}
                onSubmit={handleSubmit(onSubmitLogic)}
                availableSlots={availableSlots}
                isLoadingSlots={isLoadingSlots}
                minBookingDateString={minBookingDateString} // <-- Aquí passem la data mínima corregida
                imagePreviews={imagePreviews}
                removeFile={removeFile}
                handleFileChange={handleFileChange}
                isSubmitting={combinedSubmitting}
                selectedDate={selectedDate}
            />
        </div>
    );
}