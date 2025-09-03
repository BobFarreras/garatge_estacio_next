// src/app/api/autocaravanes/availability/route.ts

import { NextResponse } from 'next/server';
import Airtable from 'airtable';
import { eachDayOfInterval, format } from 'date-fns';

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
      const startDate = record.fields.start_date as string;
      const endDate = record.fields.end_date as string;

      if (startDate && endDate) {
        const interval = eachDayOfInterval({
          start: new Date(startDate),
          end: new Date(endDate),
        });
        bookedDates.push(...interval.map(date => format(date, 'yyyy-MM-dd')));
      }
    });

    return NextResponse.json({ booked_dates: [...new Set(bookedDates)] }); // Retorna dates úniques

  } catch (error) {
    console.error("Error obtenint disponibilitat d'Airtable:", error);
    return NextResponse.json({ error: "No s'ha pogut verificar la disponibilitat." }, { status: 500 });
  }
}