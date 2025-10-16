// src/app/taller/actions.ts
"use server";

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import crypto from 'crypto';
import { v2 as cloudinary } from 'cloudinary';
import Airtable, { FieldSet } from 'airtable';
import { addDays, isBefore, startOfDay } from 'date-fns';

// --- Imports de la nostra pròpia estructura ---
import { createGoogleCalendarEvent, deleteGoogleCalendarEvent } from '@/lib/google-calendar';
import { sendWorkshopAppointmentEmails, sendCancellationNotificationEmail, sendErrorNotificationEmail } from '@/lib/email';
// Assumint que la configuració s'importa correctament:
import { APPOINTMENT_CONFIG, AIRTABLE_TABLES, CLOUDINARY_FOLDERS } from '@/config/taller';
import type { FormState } from '@/types/actions';

// --- CONFIGURACIÓ (Mantingut) ---
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID!);
const appointmentsTable = base(AIRTABLE_TABLES.APPOINTMENTS);

// --- ESQUEMA DE VALIDACIÓ (Mantingut) ---
const appointmentActionSchema = z.object({
    name: z.string().min(2, "El nom és obligatori."),
    email: z.string().email("L'email no és vàlid."),
    phone: z.string().min(9, "El telèfon no és vàlid."),
    vehicleBrand: z.string().min(2, "La marca és obligatòria."),
    vehicleModel: z.string().min(1, "El model és obligatori."),
    service: z.string().nonempty("El servei és obligatori."),
    date: z.string().nonempty("La data és obligatòria."),
    time: z.string().nonempty("L'hora és obligatòria."),
    message: z.string().optional(),
    lang: z.enum(['ca', 'es']),
    privacyPolicy: z.boolean().refine(val => val === true, {
        message: "Has d'acceptar la política de privacitat.",
    }),
});

// --- Funcions auxiliars (Mantingut) ---
async function uploadToCloudinary(file: File, identifier: string): Promise<string> {
    const fileBuffer = await file.arrayBuffer();
    const base64Data = Buffer.from(fileBuffer).toString('base64');
    const fileUri = `data:${file.type};base64,${base64Data}`;
    const result = await cloudinary.uploader.upload(fileUri, {
        folder: CLOUDINARY_FOLDERS.WORKSHOP_APPOINTMENTS,
        public_id: `cita_${identifier.replace(/\s+/g, '_')}_${Date.now()}`,
    });
    return result.secure_url;
}

// -------------------------------------------------------------
// ✅ ACCIÓ 1: CREAR CITA
// -------------------------------------------------------------
// --- ACCIÓ PER CREAR CITA ---
export async function createAppointmentAction(prevState: FormState, formData: FormData): Promise<FormState> {
    console.log("\n--- 🟢 INICI DE L'ACCIÓ AL SERVIDOR ---");

    // 1. ✅ MODIFICACIÓ CLAU: LLEGIR LA BANDERA DE BYPASS I ELIMINAR-LA DEL FORMULARIO
    const isBypassMode = formData.get('isBypassMode') === 'true';
    formData.delete('isBypassMode'); // <-- Eliminem la clau del FormData

    // 2. Mapeig de FormData a Objecte amb Conversió Booleana
    const objectToValidate = {
        ...Object.fromEntries(formData),
        // La bandera isBypassMode ja no està aquí si l'hem eliminat a dalt, 
        // però privacyPolicy s'ha de mantenir:
        privacyPolicy: formData.get('privacyPolicy') === 'on',
    };

    // 3. Validació de dades amb Zod
    // Ja que hem eliminat isBypassMode del FormData, objectToValidate només conté 
    // camps coneguts per l'esquema de Zod.
    const validation = appointmentActionSchema.safeParse(objectToValidate);
    if (!validation.success) {
        console.error("🔴 SERVER: La validació de Zod ha fallat:", validation.error.flatten().fieldErrors);
        return {
            success: false,
            error: "Si us plau, revisa els errors del formulari.",
            errors: validation.error.flatten().fieldErrors,
        };
    }
    console.log("🟢 SERVER: Validació de Zod superada.");

    const validatedData = validation.data;

    // 4. Validacions de Lògica de Negoci al Servidor (utilitzant la variable 'isBypassMode' aïllada)
    const selectedDate = new Date(validatedData.date + 'T12:00:00Z');

    if (!isBypassMode) { // <-- Utilitzem la variable local isBypassMode (true/false)
        // Només s'executa si el mode bypass NO està activat
        const minBookingDate = startOfDay(addDays(new Date(), APPOINTMENT_CONFIG.MIN_BOOKING_DAYS_AHEAD));

        if (isBefore(selectedDate, minBookingDate)) {
            return { success: false, error: `La reserva ha de ser con al menos ${APPOINTMENT_CONFIG.MIN_BOOKING_DAYS_AHEAD} dies d'antelació.` };
        }
    } else {
        console.log("🟢 SERVER: Mode Bypass detectat. S'ignora la validació de 7 dies.");
    }

    // Validació de cap de setmana (es manté)
    const dayOfWeek = selectedDate.getUTCDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
        return { success: false, error: 'No es poden reservar cites en cap de setmana.' };
    }

    let airtableRecordId: string | null = null;

    try {
        // ... (resta del codi d'Airtable, Cloudinary, etc.)

        // 5. Comprovació de disponibilitat (Mantingut)
        const formula = `AND(DATETIME_FORMAT({Date}, 'YYYY-MM-DD') = '${validatedData.date}', {Time} = '${validatedData.time}')`;
        const existingAppointments = await appointmentsTable.select({
            filterByFormula: formula,
            maxRecords: 1,
        }).firstPage();

        if (existingAppointments.length > 0) {
            console.warn("🟠 SERVER: L'hora ja estava ocupada.");
            return { success: false, error: `L'hora seleccionada (${validatedData.time}) ja no està disponible.` };
        }

        // 6. Pujada d'arxius a Cloudinary (Mantingut)
        const attachments = formData.getAll('attachments').filter((v): v is File => v instanceof File && v.size > 0);
        const attachmentUrls = await Promise.all(
            attachments.map(file => uploadToCloudinary(file, validatedData.name))
        );

        // 7. Crear registre a Airtable (Mantingut)
        const cancellationToken = crypto.randomBytes(32).toString('hex');
        const airtableAttachments: ReadonlyArray<{ url: string }> = attachmentUrls.map(url => ({ url }));

        const [createdRecord] = await appointmentsTable.create([{
            fields: {
                'Name': validatedData.name,
                'Email': validatedData.email,
                'Phone': validatedData.phone,
                'VehicleBrand': validatedData.vehicleBrand,
                'Matricula': validatedData.vehicleModel,
                'Date': validatedData.date,
                'Time': validatedData.time,
                'Service': validatedData.service,
                'Message': validatedData.message,
                'Status': 'Pendent',
                'CancellationToken': cancellationToken,
                'Attachments': airtableAttachments.length ? airtableAttachments : undefined,
            } as FieldSet
        }]);
        airtableRecordId = createdRecord.id;

        // 8. Integracions (Mantingut)
        const fullData = { ...validatedData, cancellationToken, attachmentUrls };
        const gcalEvent = await createGoogleCalendarEvent(fullData, airtableRecordId);

        if (gcalEvent) {
            await appointmentsTable.update([
                {
                    id: airtableRecordId,
                    fields: {
                        GoogleEventId: gcalEvent.id ?? undefined,
                        GoogleEventLink: gcalEvent.htmlLink ?? undefined,
                    },
                },
            ]);
        }

        await sendWorkshopAppointmentEmails(fullData);

        revalidatePath('/taller');
        console.log("🟢 SERVER: Acció completada amb èxit.");

        return { success: true, message: "Cita creada correctament! Rebràs un email de confirmació." };

    } catch (error) {
        console.error('🔴 ERROR a createAppointmentAction:', error);
        await sendErrorNotificationEmail(error);

        // ROLLBACK
        if (airtableRecordId) {
            console.warn(`🟠 ROLLBACK: Esborrant el registre d'Airtable ${airtableRecordId} a causa d'un error.`);
            await appointmentsTable.destroy([airtableRecordId]);
        }

        return { success: false, error: "S'ha produït un error inesperat. Si us plau, intenta-ho més tard." };
    }
}


// -------------------------------------------------------------
// ✅ ACCIÓ 2: CANCEL·LAR CITA
// -------------------------------------------------------------
export async function cancelAppointmentAction(token: string): Promise<FormState> {
    if (!token) {
        return { success: false, error: 'Token no vàlid.' };
    }

    try {
        const records = await appointmentsTable.select({
            filterByFormula: `{CancellationToken} = '${token}'`,
            maxRecords: 1,
        }).firstPage();

        if (records.length === 0) {
            return { success: false, error: 'Cita no trobada o ja cancel·lada.' };
        }

        const record = records[0];
        const googleEventId = record.get('GoogleEventId') as string | undefined;

        if (googleEventId) {
            await deleteGoogleCalendarEvent(googleEventId);
        }

        await sendCancellationNotificationEmail(record.fields);
        await appointmentsTable.destroy([record.id]);

        revalidatePath('/admin/cites');

        return { success: true, message: 'La teva cita ha estat cancel·lada correctament.' };
    } catch (error) {
        console.error("Error en cancel·lar la cita:", error);
        return { success: false, error: "S'ha produït un error intern en cancel·lar la cita." };
    }
}