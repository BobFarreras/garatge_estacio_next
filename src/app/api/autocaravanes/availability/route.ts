// src/app/api/autocaravanes/availability/route.ts

import { NextResponse } from 'next/server';
import Airtable from 'airtable';
import { eachDayOfInterval, format } from 'date-fns';

// ✅ 1. BLINDATGE ANTI-CACHE: Obliguem a consultar Airtable SEMPRE
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID!);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const vehicleName = searchParams.get('vehicle_name');

  if (!vehicleName) {
    return NextResponse.json({ error: 'Falta el nom del vehicle' }, { status: 400 });
  }

  try {
    const records = await base('ReservesAutocaravanes')
      .select({
        filterByFormula: `AND({Vehicle} = '${vehicleName}', OR({status} = 'Confirmada', {status} = 'Pendent'))`,
      })
      .all();

    let bookedDates: string[] = [];
    records.forEach((record) => {
      const startDateStr = record.fields.start_date as string;
      const endDateStr = record.fields.end_date as string;

      if (startDateStr && endDateStr) {
        // ✅ 2. BLINDATGE DE FUS HORARI: Extraiem els números exactes
        // per evitar que el servidor resti hores i ens mogui la data al dia anterior.
        const [startYear, startMonth, startDay] = startDateStr.split('-').map(Number);
        const [endYear, endMonth, endDay] = endDateStr.split('-').map(Number);

        // Creem la data manualment: El mes a Javascript comença per 0 (gener = 0, febrer = 1...)
        const interval = eachDayOfInterval({
          start: new Date(startYear, startMonth - 1, startDay),
          end: new Date(endYear, endMonth - 1, endDay),
        });
        
        bookedDates.push(...interval.map(date => format(date, 'yyyy-MM-dd')));
      }
    });

    return NextResponse.json({ booked_dates: [...new Set(bookedDates)] }); 

  } catch (error) {
    console.error("Error obtenint disponibilitat d'Airtable:", error);
    return NextResponse.json({ error: "No s'ha pogut verificar la disponibilitat." }, { status: 500 });
  }
}