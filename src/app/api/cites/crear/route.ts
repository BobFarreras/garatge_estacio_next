import { NextResponse } from 'next/server';
import Airtable from 'airtable';
import crypto from 'crypto';
import { createGoogleCalendarEvent } from '@/lib/google-calendar';
import { sendWorkshopAppointmentEmails } from '@/lib/email';

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID!);
const TABLE_NAME = 'Cites';

export async function POST(request: Request) {
  console.log("--- Nova petició de creació de cita rebuda ---");
  try {
    const data = await request.json();
    console.log("Dades rebudes del formulari:", data);

    // 1. VALIDATION
    if (!data.name || !data.email || !data.date || !data.time || !data.service) {
      console.error("Validació fallida: falten camps obligatoris.");
      return NextResponse.json({ error: "Falten camps obligatoris." }, { status: 400 });
    }
    console.log("Pas 1: Validació de dades OK.");

    // 2. CHECK FOR DUPLICATES
    console.log("Pas 2: Comprovant si ja existeix una cita a Airtable...");
    const existingAppointments = await base(TABLE_NAME).select({
      filterByFormula: `AND({date} = '${data.date}', {time} = '${data.time}')`,
      maxRecords: 1
    }).firstPage();

    if (existingAppointments.length > 0) {
      console.warn("Conflicte: L'hora ja estava reservada.");
      return NextResponse.json({ error: `L'hora seleccionada (${data.time}) ja no està disponible.` }, { status: 409 });
    }
    console.log("Pas 2: Comprovació de duplicats OK. L'hora està lliure.");

    // 3. GENERATE CANCELLATION TOKEN
    const cancellationToken = crypto.randomBytes(32).toString('hex');
    console.log("Pas 3: Token de cancel·lació generat.");

    // 4. CREATE IN AIRTABLE
    console.log("Pas 4: Creant el registre a Airtable...");
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
    console.log(`Pas 4: Registre creat a Airtable amb ID: ${airtableRecordId}`);
    
    const fullData = { ...data, cancellationToken };

    // 5. CREATE GOOGLE CALENDAR EVENT
    console.log("Pas 5: Creant l'esdeveniment a Google Calendar...");
    const gcalEvent = await createGoogleCalendarEvent(fullData, airtableRecordId);
    if (gcalEvent) {
      console.log(`Pas 5: Esdeveniment de Google Calendar creat amb ID: ${gcalEvent.id}. Actualitzant Airtable...`);
      await base(TABLE_NAME).update(airtableRecordId, {
        'GoogleEventId': gcalEvent.id,
        'GoogleEventLink': gcalEvent.htmlLink,
      });
      console.log("Pas 5: Registre d'Airtable actualitzat amb la info del calendari.");
    } else {
        console.warn(`AVÍS: No s'ha pogut crear l'esdeveniment a Google Calendar per a la reserva ${airtableRecordId}.`);
    }

    // 6. SEND EMAILS
    console.log("Pas 6: Enviant emails de confirmació...");
    await sendWorkshopAppointmentEmails(fullData);
    console.log("Pas 6: Emails enviats correctament.");

    return NextResponse.json({ message: 'Cita creada i emails enviats amb èxit' });

  } catch (error) {
    // This will now print the detailed error to your terminal
    console.error("🔴 ERROR FATAL en crear la cita:", error);
    return NextResponse.json({ error: "No s'ha pogut processar la sol·licitud interna." }, { status: 500 });
  }
}