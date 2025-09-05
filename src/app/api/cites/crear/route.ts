import { NextResponse } from 'next/server';

import crypto from 'crypto';
import { createGoogleCalendarEvent } from '@/lib/google-calendar';
import { sendWorkshopAppointmentEmails } from '@/lib/email';
import { addDays, isBefore, startOfDay } from 'date-fns';
import { z } from 'zod';
import { v2 as cloudinary } from 'cloudinary';
import Airtable, { Attachment } from 'airtable';
import { FieldSet, Records } from 'airtable';
// ✅ Configuració Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Configuració Airtable
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID!
);
const TABLE_NAME = 'Cites';

// ✅ Esquema de validació
const appointmentApiSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  vehicleBrand: z.string(),
  vehicleModel: z.string(),
  service: z.string(),
  date: z.string(),
  time: z.string(),
  message: z.string().optional(),
  lang: z.enum(['ca', 'es']),
});

// ✅ Funció de pujada a Cloudinary
async function uploadToCloudinary(file: File, identifier: string): Promise<string> {
  const fileBuffer = await file.arrayBuffer();
  const mime = file.type;
  const encoding = 'base64';
  const base64Data = Buffer.from(fileBuffer).toString('base64');
  const fileUri = `data:${mime};${encoding},${base64Data}`;

  const result = await cloudinary.uploader.upload(fileUri, {
    folder: 'cites_taller',
    public_id: `cita_${identifier}_${Date.now()}`,
    unique_filename: true,
  });

  return result.secure_url;
}

// ✅ Handler POST
export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    // Convertim formData a objecte pla
    const data: { [key: string]: any } = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });

    // Validació
    const validation = appointmentApiSchema.safeParse(data);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Datos del formulario inválidos',
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }
    const validatedData = validation.data;

    // Validació de la data (mínim 3 dies vista)
    const minBookingDate = startOfDay(addDays(new Date(), 3));
    const selectedDate = new Date(validatedData.date);
    if (isBefore(selectedDate, minBookingDate)) {
      return NextResponse.json(
        {
          error:
            'La fecha de la cita debe ser con al menos 3 días de antelación.',
        },
        { status: 400 }
      );
    }

    // Comprovar disponibilitat a Airtable
    const existingAppointments = await base(TABLE_NAME)
      .select({
        filterByFormula: `AND({Date} = '${validatedData.date}', {Time} = '${validatedData.time}')`,
        maxRecords: 1,
      })
      .firstPage();

    if (existingAppointments.length > 0) {
      return NextResponse.json(
        {
          error: `La hora seleccionada (${validatedData.time}) ya no está disponible.`,
        },
        { status: 409 }
      );
    }

    // ✅ Pujada d'arxius
    const attachments = formData
      .getAll('attachments')
      .filter((v): v is File => v instanceof File);

    if (attachments.length > 3) {
      return NextResponse.json(
        { error: 'Només es permeten fins a 3 arxius adjunts.' },
        { status: 400 }
      );
    }

    const attachmentUrls: string[] = [];

    if (attachments.length > 0) {
      const uploadPromises = attachments
        .filter((file) => file.size > 0)
        .map((file, index) =>
          uploadToCloudinary(file, `${validatedData.name}_${index}`)
        );

      const settledResults = await Promise.allSettled(uploadPromises);

      settledResults.forEach((result) => {
        if (result.status === 'fulfilled') {
          attachmentUrls.push(result.value);
        } else {
          console.error("Ha fallat la pujada d'un arxiu:", result.reason);
        }
      });

      if (attachmentUrls.length === 0) {
        return NextResponse.json(
          { error: "No s'ha pogut pujar cap arxiu adjunt." },
          { status: 500 }
        );
      }
    }

    // ✅ Crear token de cancel·lació
    const cancellationToken = crypto.randomBytes(32).toString('hex');


    const airtableAttachments: any = attachmentUrls.map(url => ({
      url, // Airtable només necessita això
      // filename: opcional, però pot donar problemes a TS
    }));
    
    const createdRecords: Records<FieldSet> = await base(TABLE_NAME).create([{
      fields: {
        'Name': validatedData.name,
        'Email': validatedData.email,
        'Phone': validatedData.phone,
        'VehicleBrand': validatedData.vehicleBrand,
        'VehicleModel': validatedData.vehicleModel,
        'Date': validatedData.date,
        'Time': validatedData.time,
        'Service': validatedData.service,
        'Message': validatedData.message,
        'Status': 'Pendent',
        'CancellationToken': cancellationToken,
        'Attachments': airtableAttachments.length ? airtableAttachments : undefined,
      }
    }]);
    
    const airtableRecordId = createdRecords[0].id;
    
    

    // ✅ Crear event a Google Calendar
    const fullData = { ...validatedData, cancellationToken, attachmentUrls };
    const gcalEvent = await createGoogleCalendarEvent(fullData, airtableRecordId);

    if (gcalEvent) {
      await base(TABLE_NAME).update(airtableRecordId, {
        GoogleEventId: gcalEvent.id,
        GoogleEventLink: gcalEvent.htmlLink,
      });
    }

    // ✅ Enviar emails
    await sendWorkshopAppointmentEmails(fullData);

    return NextResponse.json({
      message: 'Cita creada i emails enviats amb èxit',
      recordId: airtableRecordId,
      attachments: attachmentUrls,
      calendarEvent: gcalEvent?.htmlLink ?? null,
    });
  } catch (error) {
    console.error('🔴 ERROR FATAL en crear la cita:', error);
    return NextResponse.json(
      { error: 'No se pudo procesar la solicitud interna.' },
      { status: 500 }
    );
  }
}
