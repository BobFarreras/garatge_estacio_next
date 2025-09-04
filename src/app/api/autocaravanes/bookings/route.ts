import { NextResponse } from 'next/server';
import Airtable from 'airtable';
import { createGoogleCalendarRentalEvent } from '@/lib/google-calendar';
import { sendMotorhomeBookingEmails } from '@/lib/email';
import { z } from 'zod';

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID!);

const motorhomeBookingSchema = z.object({
    customer_name: z.string().min(1),
    customer_email: z.string().email(),
    customer_phone: z.string().min(9),
    start_date: z.string(),
    end_date: z.string(),
    Vehicle_Name: z.string(),
    Vehicle_ID: z.array(z.string()),
    privacyPolicy: z.boolean().refine(val => val === true),
    lang: z.enum(['ca', 'es']), // Validamos el idioma
});

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // 1. VALIDACIÓN CON ZOD
    const validation = motorhomeBookingSchema.safeParse(data);
    if(!validation.success) {
        return NextResponse.json({ error: "Datos inválidos", details: validation.error.flatten().fieldErrors }, { status: 400 });
    }
    
    const { customer_name, customer_email, start_date, end_date, Vehicle_Name } = validation.data;
    const newStartDate = new Date(start_date);
    const newEndDate = new Date(end_date);

    // 2. COMPROBACIÓN DE DISPONIBILIDAD
    const existingBookings = await base('ReservesAutocaravanes').select({
      filterByFormula: `AND({Vehicle} = '${Vehicle_Name}', OR({status} = 'Confirmada', {status} = 'Pendent'))`,
    }).all();

    const isOverlapping = existingBookings.some(record => {
      const existingStart = new Date(record.fields.start_date as string);
      const existingEnd = new Date(record.fields.end_date as string);
      return newStartDate <= existingEnd && newEndDate >= existingStart;
    });

    if (isOverlapping) {
      return NextResponse.json({ error: "Estas fechas ya no están disponibles." }, { status: 409 });
    }

    // 3. CREAR EN AIRTABLE
    const createdRecords = await base('ReservesAutocaravanes').create([{
      fields: {
        'customer_name': customer_name,
        'customer_email': customer_email,
        'customer_phone': validation.data.customer_phone,
        'start_date': start_date,
        'end_date': end_date,
        'status': 'Pendent',
        'Vehicle': validation.data.Vehicle_ID,
        'data_reserva': new Date().toISOString(),
      }
    }]);
    const airtableRecordId = createdRecords[0].getId();

    // 4. CREAR EVENTO EN GOOGLE CALENDAR
    const gcalEvent = await createGoogleCalendarRentalEvent(validation.data, airtableRecordId);
    if (gcalEvent) {
      await base('ReservesAutocaravanes').update(airtableRecordId, {
        'GoogleEventId': gcalEvent.id,
        'GoogleEventLink': gcalEvent.htmlLink,
      });
    }

    // 5. ENVIAR EMAILS
    await sendMotorhomeBookingEmails(validation.data); // validation.data ya incluye el idioma

    return NextResponse.json({ message: 'Reserva creada con éxito' });

  } catch (error) {
    console.error("Error al crear la reserva:", error);
    return NextResponse.json({ error: "No se pudo procesar la solicitud." }, { status: 500 });
  }
}