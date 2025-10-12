import Airtable from 'airtable';
import type { Vehicle } from '@/types/vehicle';

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID!);
const TABLE_NAME = 'Vehicles';

// Aquesta funció conté la lògica per obtenir els vehicles disponibles d'Airtable.
// Pot ser cridada des de qualsevol lloc del servidor.
export async function getAvailableVehicles(): Promise<Vehicle[]> {
  try {
    const records = await base(TABLE_NAME)
      .select({
        filterByFormula: "AND({is_available}=1, {show_on_web}=1)",
        sort: [{ field: "id", direction: "asc" }],
      })
      .all();

    const vehicles: Vehicle[] = records.map((record) => {
      const fields = record.fields;
      return {
        id: record.id,
        name: fields.name as string,
        description: fields.description as string,
        image_url: fields.image_url as string,
        passengers: fields.passengers as number,
        transmission: fields.transmission as string,
        fuel_type: fields.fuel_type as string,
        category: fields.category as string,
        pricing: fields.pricing ? JSON.parse(fields.pricing as string) : null,
      };
    });

    return vehicles;

  } catch (error) {
    console.error("Error obtenint vehicles d'Airtable:", error);
    return []; // Retornem un array buit en cas d'error per evitar que la pàgina es trenqui.
  }
}