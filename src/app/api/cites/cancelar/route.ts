// /api/cites/cancelar/route.ts

import { NextResponse } from 'next/server';
import Airtable from 'airtable';
import { Resend } from 'resend';
import { deleteGoogleCalendarEvent } from '@/lib/google-calendar';
import { format } from 'date-fns';

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID!);
const resend = new Resend(process.env.RESEND_API_KEY);
const TABLE_NAME = 'Cites';
const ADMIN_EMAIL = 'info@garatgeestacio.com';
const FROM_EMAIL = 'Garatge Estació <web@garatgeestacio.com>';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    // ✅ CANVI: Redirigim a la nova URL d'error
    return NextResponse.redirect(new URL('/cancelar-cita/error?motiu=Token_no_valid', request.url));
  }

  try {
    const records = await base(TABLE_NAME).select({
      filterByFormula: `{CancellationToken} = '${token}'`,
      maxRecords: 1,
    }).firstPage();

    if (records.length === 0) {
      // ✅ CANVI: Redirigim a la nova URL d'error
      return NextResponse.redirect(new URL('/cancelar-cita/error?motiu=Cita_no_encontrada', request.url));
    }

    const record = records[0];
    // ... (la lògica per enviar email i esborrar es queda igual)
    const googleEventId = record.get('GoogleEventId') as string | undefined;
     try {
        const clientName = record.get('Name');
        const clientEmail = record.get('Email');
        const clientPhone = record.get('Phone');
        const vehicleBrand = record.get('Vehicle Brand');
        const vehicleModel = record.get('Vehicle Model');
        const service = record.get('Service');
        const appointmentDate = record.get('Date');
        const appointmentTime = record.get('Time');
        const formattedDate = format(new Date(appointmentDate as string), 'dd/MM/yyyy');
        await resend.emails.send({
            from: FROM_EMAIL,
            to: ADMIN_EMAIL,
            subject: `❌ Cita Cancel·lada: ${clientName} - ${service}`,
            html: `...` // El teu HTML de l'email
        });
    } catch (emailError) {
        console.error("Error en enviar l'email de notificació:", emailError);
    }
    if (googleEventId) {
      await deleteGoogleCalendarEvent(googleEventId);
    }
    await base(TABLE_NAME).destroy(record.id);

    // ✅ CANVI CLAU: Redirigim a la nova URL D'ÈXIT
    return NextResponse.redirect(new URL('/cancelar-cita/exit', request.url));

  } catch (error) {
    console.error("Error en cancel·lar la cita:", error);
    // ✅ CANVI: Redirigim a la nova URL d'error
    return NextResponse.redirect(new URL('/cancelar-cita/error?motiu=Error_intern', request.url));
  }
}