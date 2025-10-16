// src/lib/utils/appointmentValidation.ts

import * as z from 'zod';
import { addDays, isBefore, startOfDay } from 'date-fns';
// ✅ Importem la configuració des d'un fitxer centralitzat (cal que existeixi)
import { APPOINTMENT_CONFIG } from '@/config/taller';


// === Constants per a la validació d'arxius ===
const MAX_FILES = APPOINTMENT_CONFIG.MAX_FILES;
const MAX_FILE_SIZE_MB = APPOINTMENT_CONFIG.MAX_FILE_SIZE_MB;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
// ✅ Formats acceptats per al negoci (incloent jpg i jpeg com demanes)
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];

// Format: 4 números i 3 lletres (majúscules, sense vocals, Q ni Ñ)
const SPANISH_PLATE_REGEX = /^[0-9]{4}[BCDFGHJKLMNPRSTVWXYZ]{3}$/i;

// ✅ MODIFICACIÓ CLAU: La funció rep la bandera de bypass
export const getAppointmentSchema = (t: (key: string, options?: any) => string, isBypassModeClient: boolean) => {
    // La data mínima per a la validació estricta (7 dies)
    const minBookingDate = addDays(new Date(), APPOINTMENT_CONFIG.MIN_BOOKING_DAYS_AHEAD);
    const minBookingDateStartOfDay = startOfDay(minBookingDate);
    console.log("ZOD - isBypassModeClient rebut per Zod:", isBypassModeClient);
    return z.object({
        name: z.string().min(2, t('validation.nameRequired')),
        email: z.string().email(t('validation.emailInvalid')),
        phone: z.string().min(9, t('validation.phoneInvalid')),
        vehicleBrand: z.string().min(2, t('validation.brandRequired')),
        vehicleModel: z.string()
            .min(1, t('validation.plateRequired'))
            .regex(SPANISH_PLATE_REGEX, t('validation.plateInvalid')),
        service: z.string().nonempty(t('validation.serviceRequired')),
        date: z.string()
            .nonempty(t('validation.dateRequired'))
            // ✅ CONDICIÓ CLAU: Si el mode bypass està actiu, saltem la validació de 7 dies
            .refine(date => {
                if (isBypassModeClient) {
                    console.log("ZOD - BYPASS ACTIU, saltant validació d'antelació.");
                    return true;
                }
                const isValid = !isBefore(new Date(date), minBookingDateStartOfDay);
                console.log("ZOD - BYPASS INACTIU, comprovant antelació:", isValid);
                return isValid;
            }, {
                message: t('validation.dateTooSoon', { days: APPOINTMENT_CONFIG.MIN_BOOKING_DAYS_AHEAD }),
            })
            .refine(date => {
                const day = new Date(date).getUTCDay();
                return day !== 0 && day !== 6;
            }, {
                message: t('validation.noWeekend'),
            }),
        time: z.string().nonempty(t('validation.timeRequired')),
        message: z.string().optional(),
        privacyPolicy: z.boolean().refine(val => val === true, {
            message: t('validation.privacyRequired'),
        }),
        // ✅ VALIDACIÓ PASSIVA: El hook ho gestiona, però mantenim la validació final
        attachments: z
            .custom<File[]>()
            .optional()
            .refine(files => !files || files.length <= MAX_FILES,
                `No pots pujar més de ${MAX_FILES} arxius.`
            )
            .refine(files =>
                !files || files.every(file => file.size <= MAX_FILE_SIZE_BYTES),
                `Cada arxiu ha de pesar menys de ${MAX_FILE_SIZE_MB}MB.`
            )
            .refine(files =>
                !files || files.every(file => ACCEPTED_IMAGE_TYPES.includes(file.type)),
                t('validation.invalidFileType', {
                    formats: ACCEPTED_IMAGE_TYPES.map(t => t.split('/')[1]).join(', ')
                })
            ),
    });
};

export type AppointmentSchemaType = z.infer<ReturnType<typeof getAppointmentSchema>>;

// ✅ EXPORTEM ELS TIPUS ACCEPTATS PER AL COMPONENT UI
export { ACCEPTED_IMAGE_TYPES };