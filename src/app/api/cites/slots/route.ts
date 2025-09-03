import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');

  if (!date) {
    return NextResponse.json({ error: 'Falta la data' }, { status: 400 });
  }

  try {
    // --- LÒGICA DE BACKEND ---
    // AQUESTA PART ÉS UN EXEMPLE. L'HAURÀS DE MODIFICAR.
    // 1. Defineix totes les hores disponibles del taller.
    const allSlots = ['09:00', '10:00', '11:00', '12:00', '15:00', '16:00', '17:00'];
    
    // 2. Connecta't a Airtable (o la teva base de dades) per obtenir les cites
    //    que ja estan reservades per a la data seleccionada.
    //
    //    const airtableApiKey = process.env.AIRTABLE_API_KEY;
    //    const bookedSlots = await getBookedSlotsFromAirtable(date, airtableApiKey);
    
    // 3. Filtra les hores totals per eliminar les que ja estan ocupades.
    //    const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));
    
    // Per ara, simulem que a les 11:00 ja està ocupat.
    const bookedSlots = ['11:00'];
    const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));

    // Simulem un petit retard per a la càrrega
    await new Promise(resolve => setTimeout(resolve, 500));

    return NextResponse.json({ slots: availableSlots });

  } catch (error) {
    console.error('Error al obtenir les hores lliures:', error);
    return NextResponse.json({ error: 'Error intern del servidor' }, { status: 500 });
  }
}