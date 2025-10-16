"use client";

import React, { useEffect, useMemo, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { zodResolver } from '@hookform/resolvers/zod';
import { useActionState } from 'react';
import { toast } from "sonner";
import { format, addDays } from 'date-fns';

import { getAppointmentSchema, AppointmentSchemaType, ACCEPTED_IMAGE_TYPES } from '@/lib/utils/appointmentValidation';
import AppointmentFormUI from './AppointmentFormUI';
// ✅ Assumim que aquesta és la ruta correcta del vostre fitxer de configuració
// NOTA: Aquest fitxer NO estava en els uploads, però s'assumeix la seva existència
// per a APPOINTMENT_CONFIG.MAX_FILES, etc.
const APPOINTMENT_CONFIG = {
    MIN_BOOKING_DAYS_AHEAD: 3,
    MAX_FILES: 3,
    MAX_FILE_SIZE_MB: 5
}; 


// --- Substituts temporals (mantinguts com a referència) ---
type FormState = { success: boolean; error: string | null; errors: any | null; message: string | null }; 

// --- SUBSTITUT useAvailableSlots (Mantenim la teva implementació) ---
function useAvailableSlots(selectedDate: string): { availableSlots: string[], isLoadingSlots: boolean } {
  const { t } = useTranslation();
  const [availableSlots, setAvailableSlots] = React.useState<string[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = React.useState(false);

  React.useEffect(() => {
    if (!selectedDate) {
      setAvailableSlots([]);
      return;
    }
    const day = new Date(selectedDate).getUTCDay();
    if (day === 0 || day === 6) {
      setAvailableSlots([]);
      return;
    }

    const fetchAvailableSlots = async () => {
      setIsLoadingSlots(true);
      setAvailableSlots([]);
      try {
        // Simulació de la crida a /api/cites/slots
        const slots = ['08:00', '09:00', '10:00', '11:00', '12:00', '15:00', '16:00', '17:00'];
        await new Promise(resolve => setTimeout(resolve, 500));
        setAvailableSlots(slots);
      } catch (error) {
        console.error("Error fetching slots:", error);
      } finally {
        setIsLoadingSlots(false);
      }
    };
    fetchAvailableSlots();
  }, [selectedDate, t]);
  return { availableSlots, isLoadingSlots };
}

// ✅ HOOK useFileUpload AMB VALIDACIÓ DE TOAST (Corregit amb t)
export function useFileUpload(t: (key: string, options?: any) => string) {
    const [files, setFiles] = React.useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = React.useState<string[]>([]);

    const MAX_FILES = APPOINTMENT_CONFIG.MAX_FILES;
    const MAX_FILE_SIZE_MB = APPOINTMENT_CONFIG.MAX_FILE_SIZE_MB;
    const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
    const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newFiles = event.target.files ? Array.from(event.target.files) : [];
        
        let validFiles: File[] = [];
        let hasError = false;
        let errorMessage = '';

        // 1. Validació de cada nou arxiu individualment (Format/Mida)
        for (const file of newFiles) {
            if (file.size > MAX_FILE_SIZE_BYTES) {
                errorMessage = `L'arxiu "${file.name}" supera el límit de ${MAX_FILE_SIZE_MB}MB.`;
                hasError = true;
                break;
            }
            if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
                errorMessage = t('validation.invalidFileType', { 
                    formats: ACCEPTED_IMAGE_TYPES.map(t => t.split('/')[1]).join(', ') 
                });
                hasError = true;
                break;
            }
            
            validFiles.push(file);
        }
        
        const finalFiles = [...files, ...validFiles];

        // 2. Comprovació del límit total
        if (!hasError && finalFiles.length > MAX_FILES) {
            const excess = finalFiles.length - MAX_FILES;
            errorMessage = `No pots pujar més de ${MAX_FILES} arxius en total. S'han omès ${excess} arxiu(s).`;
            hasError = true;
        }
        
        if (hasError) {
            toast.error(t('toast.submitErrorTitle'), {
                description: errorMessage,
            });
            // Manté la llista màxima de fitxers vàlids sense l'error
            setFiles(finalFiles.slice(0, MAX_FILES));
            event.target.value = '';
        } else {
            setFiles(finalFiles);
            event.target.value = '';
        }
    };


    const removeFile = (indexToRemove: number) => {
        setFiles(files => files.filter((_, index) => index !== indexToRemove));
    };

    const resetFiles = () => {
        setFiles([]);
    }

    React.useEffect(() => {
        if (files.length > 0) {
            const newPreviews = files.map(file => URL.createObjectURL(file));
            setImagePreviews(newPreviews);
            return () => newPreviews.forEach(url => URL.revokeObjectURL(url));
        } else {
            setImagePreviews([]);
        }
    }, [files]);

    return { files, imagePreviews, handleFileChange, removeFile, resetFiles };
}


// Simulació del Server Action (Només per a tipatge)
const createAppointmentAction = async (initialState: FormState, formData: FormData): Promise<FormState> => {
  // Aquesta crida és al vostre Server Action real
  // ...
  await new Promise(resolve => setTimeout(resolve, 1500));
  return { success: true, error: null, errors: null, message: 'La teva cita ha estat registrada amb èxit.' };
};
// --- Fi substituts temporals ---


interface AppointmentFormProps {
  selectedService: string | null;
  onFormSubmit: () => void;
}

export default function AppointmentForm({ selectedService, onFormSubmit }: AppointmentFormProps) {
  const { t, i18n } = useTranslation();
  const [isTransitioning, startTransition] = useTransition(); 

  // Utilitzem l'hook de fitxers amb el `t` per a les traduccions
  const { files, imagePreviews, handleFileChange, removeFile, resetFiles } = useFileUpload(t); 

  const appointmentSchema = useMemo(() => getAppointmentSchema(t), [t]);

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
  const { availableSlots, isLoadingSlots } = useAvailableSlots(selectedDate);

  const initialState: FormState = { success: false, error: null, errors: null, message: null };
  const [state, dispatchAction] = useActionState(createAppointmentAction, initialState); 

// ---------------------------------------------------------------------
// ✅ FIX 1: useEffect per gestionar els efectes secundaris (toasts, reset)
// ---------------------------------------------------------------------
  useEffect(() => {
    // Només executem si l'acció ha tingut èxit o error (no a l'estat inicial)
    if (state.message || state.error) { 
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
    }
  }, [state, reset, resetFiles, onFormSubmit, t]);
// ---------------------------------------------------------------------
  
  // ✅ SINCRONITZACIÓ AMB RHF: Manté el camp 'attachments' de RHF sincronitzat amb l'estat local.
  // Això permet que Zod pugui validar l'array 'files' a la validació final.
  useEffect(() => {
    setValue('attachments', files as any, { shouldValidate: false }); 
  }, [files, setValue]);


  const onSubmitLogic = async (data: AppointmentSchemaType) => {
    
    // 1. SINCRONITZACIÓ (ja es fa a l'useEffect)
    // 2. FORCEM LA VALIDACIÓ FINAL DE ZOD
    const isValid = await form.trigger(); 

    if (!isValid) {
        // GESTIÓ D'ERROR DE VALIDACIÓ
        const attachmentError = form.formState.errors.attachments?.message;

        if (attachmentError) {
            // Aquesta línia només captura errors de Zod (mida o límit que hagin passat el hook)
            toast.error(t('toast.submitErrorTitle'), {
                description: attachmentError as string,
            });
        }
        return;
    }
    
    // 3. Preparem FormData
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'privacyPolicy') {
        if (value === true) formData.append(key, 'on');
      } else if (key !== 'attachments' && value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    // Afegim els fitxers de l'estat local (que ja sabem que són vàlids)
    files.forEach(file => { formData.append('attachments', file); });
    
    formData.append('lang', i18n.language.startsWith('es') ? 'es' : 'ca');

    // 4. ✅ FIX 2: Embolcallar la crida a l'acció en startTransition
    startTransition(() => {
        dispatchAction(formData); 
    });
  };

  // Ús de la constant real per calcular la data mínima per al camp HTML 'min'
  const minBookingDateString = format(addDays(new Date(), APPOINTMENT_CONFIG.MIN_BOOKING_DAYS_AHEAD), 'yyyy-MM-dd');
  
    // isSubmitting combina l'estat intern de RHF i isTransitioning (isPending)
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