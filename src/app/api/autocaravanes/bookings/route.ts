// src/app/api/autocaravanes/bookings/route.ts
import { NextResponse } from 'next/server';
import Airtable from 'airtable';
import { createGoogleCalendarRentalEvent } from '@/lib/google-calendar';
import { sendMotorhomeBookingEmails } from '@/lib/email';
import { format, isBefore } from 'date-fns';

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID!);

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // 1. VALIDACIÓ
    if (!data.customer_name || !data.customer_email || !data.start_date || !data.end_date || !data.Vehicle_Name) {
      return NextResponse.json({ error: "Falten camps obligatoris." }, { status: 400 });
    }

    const newStartDate = new Date(data.start_date);
    const newEndDate = new Date(data.end_date);

    // 2. COMPROVACIÓ DE DISPONIBILITAT
    const existingBookings = await base('ReservesAutocaravanes').select({
      filterByFormula: `AND({Vehicle} = '${data.Vehicle_Name}', OR({status} = 'Confirmada', {status} = 'Pendent'))`,
    }).all();

    const isOverlapping = existingBookings.some(record => {
      const existingStart = new Date(record.fields.start_date as string);
      const existingEnd = new Date(record.fields.end_date as string);
      return newStartDate <= existingEnd && newEndDate >= existingStart;
    });

    if (isOverlapping) {
      return NextResponse.json({ error: "Aquestes dates ja no estan disponibles." }, { status: 409 });
    }

    // 3. CREAR A AIRTABLE
    const createdRecords = await base('ReservesAutocaravanes').create([{
      fields: {
        'customer_name': data.customer_name,
        'customer_email': data.customer_email,
        'customer_phone': data.customer_phone,
        'start_date': data.start_date,
        'end_date': data.end_date,
        'status': 'Pendent',
        'Vehicle': data.Vehicle_ID,
        'data_reserva': new Date().toISOString(),
      }
    }]);
    const airtableRecordId = createdRecords[0].getId();

    // 4. CREAR A GOOGLE CALENDAR I ACTUALITZAR AIRTABLE
    const gcalEvent = await createGoogleCalendarRentalEvent(data, airtableRecordId);
    if (gcalEvent) {
      await base('ReservesAutocaravanes').update(airtableRecordId, {
        'GoogleEventId': gcalEvent.id,
        'GoogleEventLink': gcalEvent.htmlLink,
      });
    }

    // 5. ENVIAR EMAILS DE NOTIFICACIÓ
    await sendMotorhomeBookingEmails(data);

    return NextResponse.json({ message: 'Reserva creada amb èxit' });

  } catch (error) {
    console.error("Error al crear la reserva:", error);
    return NextResponse.json({ error: "No s'ha pogut processar la sol·licitud." }, { status: 500 });
  }
}