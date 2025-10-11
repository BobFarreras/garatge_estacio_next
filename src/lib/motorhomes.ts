import Airtable from 'airtable';
import type { Motorhome } from '@/types';
import { getLocale } from 'next-intl/server'; // Per a detectar l'idioma al servidor

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID!);
const TABLE_NAME = 'Autocaravanes';

// Funció auxiliar per a processar camps que poden ser JSON o text
const processArrayField = (fieldValue: unknown): string[] => {
    if (typeof fieldValue !== 'string' || !fieldValue) return [];
    try {
        const decoded = JSON.parse(fieldValue);
        return Array.isArray(decoded) ? decoded : [String(fieldValue)];
    } catch (e) {
        return fieldValue.split(',').map(s => s.trim()).filter(Boolean);
    }
};

export async function getMotorhomes(): Promise<Motorhome[]> {
  try {
    const locale = await getLocale(); // Detecta si és 'ca' o 'es'
    const lang = locale === 'es' ? 'es' : 'ca';

    const records = await base(TABLE_NAME).select({
      filterByFormula: "AND({is_available}=1, {show_on_web}=1)",
      sort: [{ field: 'id', direction: 'asc' }],
    }).all();

    const motorhomes = records.map((record): Motorhome => {
        const fields = record.fields;
        return {
            id: record.id,
            id_numeric: fields.id as number,
            name: (fields[`name_${lang}`] || fields.name_ca) as string,
            description: (fields[`description_${lang}`] || fields.description_ca) as string,
            image_url: fields.image_url as string,
            gallery_images: processArrayField(fields.gallery_images),
            features: processArrayField(fields[`features_${lang}`] || fields.features_ca),
            included_items: processArrayField(fields[`included_items_${lang}`] || fields.included_items_ca),
            passengers: fields.passengers as number,
            length: fields.length as number,
            width: fields.width as number,
            height: fields.height as number,
            is_available: !!fields.is_available,
            pricing: fields.pricing ? JSON.parse(fields.pricing as string) : {},
        };
    });

    return motorhomes;
  } catch (error) {
    console.error("Error en carregar les autocaravanes des d'Airtable:", error);
    return [];
  }
}