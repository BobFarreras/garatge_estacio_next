import { NextResponse } from 'next/server';
import Airtable from 'airtable';
import crypto from 'crypto';
import { createGoogleCalendarEvent } from '@/lib/google-calendar';
import { sendWorkshopAppointmentEmails } from '@/lib/email';
import { addDays, isBefore, startOfDay } from 'date-fns';

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID!);
const TABLE_NAME = 'Cites';

export async function POST(request: Request) {
  console.log("--- Nova petició de creació de cita rebuda ---");
  try {
    const data = await request.json();
    console.log("Dades rebudes del formulari:", data);

    // 1. VALIDATION
    if (!data.name || !data.email || !data.date || !data.time || !data.service) {
      return NextResponse.json({ error: "Falten camps obligatoris." }, { status: 400 });
    }

    // ✅ NEW: Server-side validation for the 3-day rule
    const minBookingDate = startOfDay(addDays(new Date(), 3));
    const selectedDate = new Date(data.date);

    if (isBefore(selectedDate, minBookingDate)) {
      console.warn("Validació fallida: La data és massa aviat.");
      return NextResponse.json({ error: "La data de la cita ha de ser com a mínim 3 dies a partir d'avui." }, { status: 400 });
    }

    console.log("Pas 1: Validació de dades OK.");

    // 2. CHECK FOR DUPLICATES
    const existingAppointments = await base(TABLE_NAME).select({
      filterByFormula: `AND({Date} = '${data.date}', {Time} = '${data.time}')`,
      maxRecords: 1
    }).firstPage();

    if (existingAppointments.length > 0) {
      return NextResponse.json({ error: `L'hora seleccionada (${data.time}) ja no està disponible.` }, { status: 409 });
    }
    console.log("Pas 2: Comprovació de duplicats OK. L'hora està lliure.");

    // 3. GENERATE CANCELLATION TOKEN
    const cancellationToken = crypto.randomBytes(32).toString('hex');
    
    // 4. CREATE IN AIRTABLE
    const createdRecords = await base(TABLE_NAME).create([{
      fields: {
        'Name': data.name,
        'Email': data.email,
        'Phone': data.phone,
        'Date': data.date,
        'Time': data.time,
        'Service': data.service,
        'Message': data.message,
        'Status': 'Pendent',
        'CancellationToken': cancellationToken
      }
    }]);
    const airtableRecordId = createdRecords[0].getId();
    
    const fullData = { ...data, cancellationToken };

    // 5. CREATE GOOGLE CALENDAR EVENT
    const gcalEvent = await createGoogleCalendarEvent(fullData, airtableRecordId);
    if (gcalEvent) {
      await base(TABLE_NAME).update(airtableRecordId, {
        'GoogleEventId': gcalEvent.id,
        'GoogleEventLink': gcalEvent.htmlLink,
      });
    }

    // 6. SEND EMAILS
    await sendWorkshopAppointmentEmails(fullData);

    return NextResponse.json({ message: 'Cita creada i emails enviats amb èxit' });

  } catch (error) {
    console.error("🔴 ERROR FATAL en crear la cita:", error);
    return NextResponse.json({ error: "No s'ha pogut processar la sol·licitud interna." }, { status: 500 });
  }
}