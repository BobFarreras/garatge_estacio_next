// Fitxer: app/actions/motorhomeActions.ts
"use server";

import { z } from 'zod';
import Airtable from 'airtable';

// Imports de les nostres llibreries internes
import { createGoogleCalendarRentalEvent } from '@/lib/google-calendar';
import { sendMotorhomeBookingEmails, sendErrorNotificationEmail } from '@/lib/email';
import type { FormState } from '@/types/actions'; // Assegura't que aquest tipus existeix

// --- CONFIGURACIÓ ---
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID!);
const bookingsTable = base('ReservesAutocaravanes');

// --- ESQUEMA DE VALIDACIÓ AMB ZOD ---
const motorhomeBookingActionSchema = z.object({
  customer_name: z.string().min(2, "El nom és obligatori."),
  customer_email: z.string().email("L'email no és vàlid."),
  customer_phone: z.string().min(9, "El telèfon no és vàlid."),
  start_date: z.string().nonempty("La data d'inici és obligatòria."),
  end_date: z.string().nonempty("La data de finalització és obligatòria."),
  Vehicle_Name: z.string().nonempty(),
  Vehicle_ID: z.string().nonempty(),
  lang: z.enum(['ca', 'es']),
  privacyPolicy: z.boolean().refine(val => val === true, {
    message: "Has d'acceptar la política de privacitat.",
  }),
});

// --- SERVER ACTION PER CREAR LA RESERVA ---
export async function createMotorhomeBookingAction(prevState: FormState, formData: FormData): Promise<FormState> {
  console.log("\n--- 🟢 INICI DE L'ACCIÓ DE RESERVA D'AUTOCARAVANA ---");

  // 1. Preparació i Validació de dades amb Zod
  const objectToValidate = {
    ...Object.fromEntries(formData),
    privacyPolicy: formData.get('privacyPolicy') === 'on',
  };

  const validation = motorhomeBookingActionSchema.safeParse(objectToValidate);

  if (!validation.success) {
    const fieldErrors = validation.error.flatten().fieldErrors;


    const firstErrorMessage = Object.values(fieldErrors).flat()[0] || "Si us plau, revisa els errors del formulari.";

    console.error("🔴 SERVER: La validació de Zod ha fallat:", validation.error.flatten().fieldErrors);
    return {
      success: false,
      error: firstErrorMessage, // <-- Aquí enviem l'error específic
      errors: validation.error.flatten().fieldErrors,
    };
  }

  const validatedData = validation.data;
  const { start_date, end_date, Vehicle_Name } = validatedData;
  let airtableRecordId: string | null = null; // Declarem l'ID fora per al rollback

  try {
    // 2. Comprovació de disponibilitat al servidor (pas de seguretat CRÍTIC)
    console.log(`🟢 SERVER: Comprovant disponibilitat per a '${Vehicle_Name}'...`);
    const newStartDate = new Date(start_date);
    const newEndDate = new Date(end_date);

    const existingBookings = await bookingsTable.select({
      filterByFormula: `AND({Vehicle} = '${Vehicle_Name}', OR({status} = 'Confirmada', {status} = 'Pendent'))`,
    }).all();

    const isOverlapping = existingBookings.some(record => {
      const existingStart = new Date(record.fields.start_date as string);
      const existingEnd = new Date(record.fields.end_date as string);
      return newStartDate <= existingEnd && newEndDate >= existingStart;
    });

    if (isOverlapping) {
      console.warn("🟠 SERVER: Error de lògica - Les dates ja no estan disponibles.");
      return { success: false, error: "Aquestes dates ja no estan disponibles. Si us plau, tria'n unes altres." };
    }
    console.log("🟢 SERVER: Disponibilitat confirmada.");

    // 3. Crear registre a Airtable
    const [createdRecord] = await bookingsTable.create([{
      fields: {
        'customer_name': validatedData.customer_name,
        'customer_email': validatedData.customer_email,
        'customer_phone': validatedData.customer_phone,
        'start_date': start_date,
        'end_date': end_date,
        'status': 'Pendent',
        'Vehicle': [validatedData.Vehicle_ID], // Airtable espera un array per a camps Link
        'data_reserva': new Date().toISOString(),
      }
    }]);
    airtableRecordId = createdRecord.id;
    console.log(`🟢 SERVER: Registre creat a Airtable amb ID: ${airtableRecordId}`);

    // 4. Crear esdeveniment a Google Calendar
    const gcalEvent = await createGoogleCalendarRentalEvent(validatedData, airtableRecordId);

    // 5. Actualitzar Airtable amb les dades de Google Calendar
    if (gcalEvent) {
      await bookingsTable.update([
        {
          id: airtableRecordId,
          fields: {
            GoogleEventId: gcalEvent.id ?? undefined,
            GoogleEventLink: gcalEvent.htmlLink ?? undefined,
          }
        }
      ]);
      console.log("🟢 SERVER: Registre d'Airtable actualitzat amb dades de Google Calendar.");
    }

    // 6. Enviar emails de notificació
    await sendMotorhomeBookingEmails(validatedData);
    console.log("🟢 SERVER: Emails de notificació enviats.");

    return { success: true, message: "Sol·licitud de reserva enviada! Rebràs un email en breus." };

  } catch (error) {
    console.error('🔴 ERROR a createMotorhomeBookingAction:', error);
    // (Opcional) Enviar email de notificació d'error al desenvolupador
    await sendErrorNotificationEmail(error);

    // Lògica de Rollback: si hem creat el registre a Airtable però alguna cosa ha fallat després, l'esborrem
    if (airtableRecordId) {
      console.warn(`🟠 ROLLBACK: Esborrant el registre d'Airtable ${airtableRecordId} a causa d'un error.`);
      await bookingsTable.destroy([airtableRecordId]);
    }

    return { success: false, error: "S'ha produït un error inesperat. Si us plau, intenta-ho més tard." };
  }
}