import { NextResponse } from 'next/server';
import Airtable from 'airtable';
import { deleteGoogleCalendarEvent } from '@/lib/google-calendar'; // ✅ Importem la nova funció

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID!);
const TABLE_NAME = 'CitesTaller'; // Assegura't que sigui el nom correcte

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token || typeof token !== 'string') {
    return NextResponse.redirect(new URL('/cancelar-cita?status=error&message=Token_no_valid', request.url));
  }

  try {
    // 1. BUSCAR LA CITA A AIRTABLE AMB EL TOKEN
    const records = await base(TABLE_NAME).select({
      filterByFormula: `{cancellationToken} = '${token}'`,
      maxRecords: 1,
    }).firstPage();

    if (records.length === 0) {
      return NextResponse.redirect(new URL('/cancelar-cita?status=error&message=Cita_no_trobada', request.url));
    }

    const record = records[0];
    const googleEventId = record.get('GoogleEventId') as string | undefined;

    // 2. ELIMINAR DE GOOGLE CALENDAR (SI EXISTEIX)
    if (googleEventId) {
        // ✅ Utilitzem la nostra nova funció
        await deleteGoogleCalendarEvent(googleEventId);
    }

    // 3. ELIMINAR D'AIRTABLE
    await base(TABLE_NAME).destroy(record.id);

    // 4. REDIRIGIR A LA PÀGINA D'ÈXIT
    return NextResponse.redirect(new URL('/cancelar-cita?status=success', request.url));

  } catch (error) {
    console.error("Error en cancel·lar la cita:", error);
    return NextResponse.redirect(new URL('/cancelar-cita?status=error&message=Error_intern', request.url));
  }
}