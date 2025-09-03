import { NextResponse } from 'next/server';
import Airtable from 'airtable';

// Configura Airtable (recorda tenir les claus al .env.local)
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID!);
const TABLE_NAME = 'Vehicles'; // Assegura't que aquest sigui el nom de la teva taula a Airtable

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get('lang') === 'es' ? 'es' : 'ca';

  try {
    const records = await base(TABLE_NAME)
      .select({
        // Filtrem només els vehicles que estiguin marcats com actius
        filterByFormula: "{active} = 1",
        sort: [{ field: "id", direction: "asc" }],
      })
      .all();

    const vehicles = records.map((record) => {
      const fields = record.fields;
      return {
        id: record.id,
        name: fields[`name_${lang}`] || fields.name_ca,
        description: fields[`description_${lang}`] || fields.description_ca,
        image_url: fields.image_url,
        passengers: fields.passengers,
        transmission: fields.transmission,
        fuel_type: fields.fuel_type,
        category: fields.category,
        // El pricing ha d'estar en format JSON a Airtable
        pricing: fields.pricing ? JSON.parse(fields.pricing as string) : null, 
      };
    });

    return NextResponse.json(vehicles);

  } catch (error) {
    console.error("Error obtenint vehicles d'Airtable:", error);
    return NextResponse.json({ error: "No s'han pogut carregar les dades dels vehicles." }, { status: 500 });
  }
}