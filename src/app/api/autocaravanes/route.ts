// src/app/api/autocaravanes/route.ts

import { NextResponse } from 'next/server';
import Airtable from 'airtable';

// Configura Airtable (afegeix les claus al teu .env.local)
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID!);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get('lang') === 'es' ? 'es' : 'ca'; // Per defecte 'ca'

  try {
    const records = await base('Autocaravanes')
      .select({
        filterByFormula: "AND({is_available}=1, {show_on_web}=1)",
        sort: [{ field: 'id', direction: 'asc' }],
      })
      .all();

    const processArrayField = (fieldValue: string | undefined): string[] => {
        if (!fieldValue) return [];
        // Intenta decodificar JSON primer, si no, separa per comes
        try {
            const decoded = JSON.parse(fieldValue);
            return Array.isArray(decoded) ? decoded : [String(fieldValue)];
        } catch (e) {
            return fieldValue.split(',').map(s => s.trim()).filter(Boolean);
        }
    };
      
    const motorhomes = records.map((record) => {
        const fields = record.fields;
        return {
            id: record.id,
            id_numeric: fields.id,
            name: fields[`name_${lang}`] || fields.name_ca,
            description: fields[`description_${lang}`] || fields.description_ca,
            image_url: fields.image_url,
            gallery_images: processArrayField(fields.gallery_images as string),
            features: processArrayField(fields[`features_${lang}`] as string || fields.features_ca as string),
            included_items: processArrayField(fields[`included_items_${lang}`] as string || fields.included_items_ca as string),
            passengers: fields.passengers,
            length: fields.length,
            width: fields.width,
            height: fields.height,
            is_available: fields.is_available,
            pricing: fields.pricing ? JSON.parse(fields.pricing as string) : {},
        };
    });

    return NextResponse.json(motorhomes);

  } catch (error) {
    console.error("Error obtenint autocaravanes d'Airtable:", error);
    return NextResponse.json({ error: "No s'han pogut carregar les dades de les autocaravanes." }, { status: 500 });
  }
}