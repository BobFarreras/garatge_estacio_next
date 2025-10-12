import { NextResponse } from 'next/server';
import { getAvailableVehicles } from '@/lib/vehicles'; // ✅ Importem la funció centralitzada

export async function GET() {
  try {
    const vehicles = await getAvailableVehicles();
    return NextResponse.json(vehicles);
  } catch (error) {
    console.error("Error a l'API Route de vehicles:", error);
    return NextResponse.json({ error: "No s'han pogut carregar les dades dels vehicles." }, { status: 500 });
  }
}