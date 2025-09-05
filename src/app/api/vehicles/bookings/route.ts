import { NextResponse } from 'next/server';
import Airtable from 'airtable';
import { z } from 'zod';
// ✅ Importem les noves funcions que hem creat
import { createGoogleCalendarVehicleEvent } from '@/lib/google-calendar';
import { sendVehicleBookingEmails } from '@/lib/email';

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID!);

// Esquema Zod adaptat per a vehicles
const vehicleBookingSchema = z.object({
    customer_name: z.string().min(1),
    customer_email: z.string().email(),
    customer_phone: z.string().min(9),
    start_date: z.string(),
    end_date: z.string(),
    vehicle_name: z.string(),
    vehicle_id: z.string(), // L'ID del vehicle que rebem del formulari
    privacyPolicy: z.boolean().refine(val => val === true),
    lang: z.enum(['ca', 'es']),
});

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // 1. VALIDACIÓ AMB ZOD
    const validation = vehicleBookingSchema.safeParse(data);
    if(!validation.success) {
        return NextResponse.json({ error: "Dades invàlides", details: validation.error.flatten().fieldErrors }, { status: 400 });
    }
    
    const { customer_name, customer_email, start_date, end_date, vehicle_name, vehicle_id } = validation.data;
    const newStartDate = new Date(start_date);
    const newEndDate = new Date(end_date);

    // 2. COMPROVACIÓ DE DISPONIBILITAT
    const existingBookings = await base('ReservesVehicles').select({
      // Comprovem si hi ha reserves per al mateix vehicle que no estiguin cancel·lades
      filterByFormula: `AND({Vehicle} = '${vehicle_name}', OR({status} = 'Confirmada', {status} = 'Pendent'))`,
    }).all();

    const isOverlapping = existingBookings.some(record => {
      const existingStart = new Date(record.fields.start_date as string);
      const existingEnd = new Date(record.fields.end_date as string);
      return newStartDate <= existingEnd && newEndDate >= existingStart;
    });

    if (isOverlapping) {
      return NextResponse.json({ error: "Aquestes dates ja no estan disponibles per aquest vehicle." }, { status: 409 });
    }

    // 3. CREAR REGISTRE A AIRTABLE
    const createdRecords = await base('ReservesVehicles').create([{
      fields: {
        'customer_name': customer_name,
        'customer_email': customer_email,
        'customer_phone': validation.data.customer_phone,
        'start_date': start_date,
        'end_date': end_date,
        'status': 'Pendent',
        'Vehicle': [vehicle_id], // Enllacem el vehicle
        'data_reserva': new Date().toISOString(),
      }
    }]);
    const airtableRecordId = createdRecords[0].getId();

    // 4. CREAR EVENT A GOOGLE CALENDAR
    const gcalEvent = await createGoogleCalendarVehicleEvent(validation.data, airtableRecordId);
    if (gcalEvent) {
      await base('ReservesVehicles').update(airtableRecordId, {
        'GoogleEventId': gcalEvent.id,
        'GoogleEventLink': gcalEvent.htmlLink,
      });
    }

    // 5. ENVIAR EMAILS
    await sendVehicleBookingEmails(validation.data);

    return NextResponse.json({ message: 'Reserva creada amb èxit' });

  } catch (error) {
    console.error("Error al crear la reserva:", error);
    return NextResponse.json({ error: "No s'ha pogut processar la sol·licitud." }, { status: 500 });
  }
}