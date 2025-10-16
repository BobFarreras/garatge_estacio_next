// src/app/taller/_components/AppointmentForm.tsx
"use client";

import React, { useEffect, useMemo, useTransition, useState } from 'react'; // <-- Importem useState
import { useTranslation } from 'react-i18next';
import { zodResolver } from '@hookform/resolvers/zod';
import { useActionState } from 'react';
import { toast } from "sonner";
import { format, addDays } from 'date-fns';

// ✅ Importacions dels hooks EXTERNS per evitar conflictes
import { useAvailableSlots } from '../_hooks/useAvailableSlots';
import { useFileUpload } from '../_hooks/useFileUpload';

// ✅ Importació de la Server Action REAL
import { createAppointmentAction } from '../actions';
import { useForm } from 'react-hook-form';
import { getAppointmentSchema, AppointmentSchemaType } from '@/lib/utils/appointmentValidation';
import AppointmentFormUI from './AppointmentFormUI';


// ✅ Assumim que aquesta és la ruta correcta del vostre fitxer de configuració
const APPOINTMENT_CONFIG = {
    MIN_BOOKING_DAYS_AHEAD: 7,
    MAX_FILES: 3,
    MAX_FILE_SIZE_MB: 5
};

// --- Tipus (Assumint import des de '@/types/actions') ---
type FormState = { success: boolean; error: string | null; errors: any | null; message: string | null };
const initialState: FormState = { success: false, error: null, errors: null, message: null };

interface AppointmentFormProps {
    selectedService: string | null;
    onFormSubmit: () => void;
}

export default function AppointmentForm({ selectedService, onFormSubmit }: AppointmentFormProps) {
    const { t, i18n } = useTranslation();
    // ✅ 1. Reintroduïm useTransition per envoltar l'acció
    const [isTransitioning, startTransition] = useTransition();
    // 1. Ús dels hooks externs
    const { files, imagePreviews, handleFileChange, removeFile, resetFiles } = useFileUpload(t, APPOINTMENT_CONFIG);

    const appointmentSchema = useMemo(() => getAppointmentSchema(t), [t]);
    const [lastProcessedMessage, setLastProcessedMessage] = useState<string | null>(null);
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
    // ✅ FIX: Gestió de Toasts amb Detecció de Missatge Repetit
    // ---------------------------------------------------------------------
    useEffect(() => {
        // Identificador únic per al missatge (ajudant a evitar la repetició)
        const currentMessageId = `${state.success}-${state.message}-${state.error}`;

        // 2. Condició per executar: Només si hi ha un missatge/error i NO l'hem processat abans
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

            // 3. Marquem aquest missatge com a processat
            setLastProcessedMessage(currentMessageId);
        }
        // NOTE: No cal afegir lastProcessedMessage a les dependències ja que s'actualitza amb setLastProcessedMessage
    }, [state, reset, resetFiles, onFormSubmit, t, lastProcessedMessage]); // Afegim lastProcessedMessage com a dependència per garantir que l'efecte es reexecuta si es canvia.
    // ---------------------------------------------------------------------
    // ---------------------------------------------------------------------

    // SINCRONITZACIÓ AMB RHF: Manté el camp 'attachments' de RHF sincronitzat amb l'estat local.
    useEffect(() => {
        // shouldValidate: false per evitar validacions addicionals cada vegada que s'afegeix un fitxer.
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

        // ✅ 2. Embolcallem la crida a l'acció en startTransition per resoldre el warning
        startTransition(() => {
            dispatchAction(formData);
        });
    };

    // Càlcul de la data mínima
    const minBookingDateString = format(addDays(new Date(), APPOINTMENT_CONFIG.MIN_BOOKING_DAYS_AHEAD), 'yyyy-MM-dd');

    const combinedSubmitting = isSubmitting || isTransitioning;
    return (
        <div className="w-full">
            <AppointmentFormUI
                form={form}
                onSubmit={handleSubmit(onSubmitLogic)}
                availableSlots={availableSlots}
                isLoadingSlots={isLoadingSlots}
                minBookingDateString={minBookingDateString}
                imagePreviews={imagePreviews}
                removeFile={removeFile}
                handleFileChange={handleFileChange}
                isSubmitting={combinedSubmitting}
                selectedDate={selectedDate}
            />
        </div>
    );
}