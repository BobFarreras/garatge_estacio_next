import { NextResponse } from 'next/server';
import Airtable from 'airtable';

// Configuració d'Airtable
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID!);
const TABLE_NAME = 'Vehicles';

export async function GET() {
  try {
    const records = await base(TABLE_NAME)
      .select({
        // ✅ LÒGICA EXACTA DEL TEU PHP:
        // Filtra només els vehicles que tenen ambdues caselles marcades.
        filterByFormula: "AND({is_available}=1, {show_on_web}=1)",
        sort: [{ field: "id", direction: "asc" }],
      })
      .all();

    const vehicles = records.map((record) => {
      const fields = record.fields;
      return {
        id: record.id,
        name: fields.name,
        description: fields.description,
        image_url: fields.image_url,
        passengers: fields.passengers,
        transmission: fields.transmission,
        fuel_type: fields.fuel_type,
        category: fields.category,
        pricing: fields.pricing ? JSON.parse(fields.pricing as string) : null,
      };
    });

    return NextResponse.json(vehicles);

  } catch (error) {
    console.error("Error obtenint vehicles d'Airtable:", error);
    return NextResponse.json({ error: "No s'han pogut carregar les dades dels vehicles." }, { status: 500 });
  }
}