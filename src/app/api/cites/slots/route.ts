import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    // Comprovem si la data existeix i té el format correcte (YYYY-MM-DD)
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return NextResponse.json({ error: "No s'ha especificat una data amb el format correcte (YYYY-MM-DD)." }, { status: 400 });
    }

    try {
        // --- VALIDACIÓ DE CAP DE SETMANA ---
        const selectedDate = new Date(date + 'T12:00:00Z'); // Afegim hora per evitar problemes de fus horari
        const dayOfWeek = selectedDate.getUTCDay(); // 0 és diumenge, 6 és dissabte

        if (dayOfWeek === 0 || dayOfWeek === 6) {
            // Si és dissabte o diumenge, retornem un array de franges buit
            return NextResponse.json({ slots: [] });
        }

        // Si és un dia laborable, continuem amb la lògica normal
        const allSlots = ['08:00', '09:00', '10:00', '11:00', '12:00', '15:00', '16:00', '17:00'];

        // S'HA CORREGIT AQUÍ: Utilitzem process.env.AIRTABLE_API_KEY
        // per ser consistents amb el codi de creació de cites que funciona.
        const airtableToken = process.env.AIRTABLE_API_KEY;
        const airtableBaseId = process.env.AIRTABLE_BASE_ID;
        const tableName = 'Cites';

        // Aquesta comprovació és la que estava generant el teu error.
        // Ara hauria de funcionar.
        if (!airtableToken || !airtableBaseId) {
            console.error('ERROR: AIRTABLE_API_KEY o AIRTABLE_BASE_ID no estan definits. Si us plau, verifica el teu fitxer .env.local i reinicia el servidor.');
            return NextResponse.json({ error: 'Error de configuració del servidor. Si us plau, contacteu amb l\'administrador.' }, { status: 500 });
        }

        const formula = `IS_SAME({Date}, DATETIME_PARSE('${date}', 'YYYY-MM-DD'), 'day')`;
        const airtableUrl = `https://api.airtable.com/v0/${airtableBaseId}/${encodeURIComponent(tableName)}?filterByFormula=${encodeURIComponent(formula)}`;

        const response = await fetch(airtableUrl, {
            headers: { 'Authorization': `Bearer ${airtableToken}` },
            cache: 'no-store' // No emmagatzema a la memòria cau per obtenir dades en temps real
        });

        if (!response.ok) {
            console.error('Airtable API error:', response.status, response.statusText);
            throw new Error(`Error en la connexió amb Airtable: ${response.statusText}`);
        }

        const airtableData = await response.json();
        
        // Registra la resposta completa d'Airtable per a depuració.
        console.log('Resposta d\'Airtable completa:', JSON.stringify(airtableData, null, 2));

        const records = airtableData.records || [];

        // Verifica si els camps es diuen realment 'Time' i 'Date'
        const bookedSlots = records.map((record: any) => record?.fields?.Time).filter(Boolean);
        const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));

        return NextResponse.json({ slots: availableSlots });

    } catch (error) {
        console.error('Error al obtenir les hores lliures:', error);
        return NextResponse.json({ error: 'Error intern del servidor' }, { status: 500 });
    }
}
