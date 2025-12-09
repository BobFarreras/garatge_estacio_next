import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AppointmentService } from '@/services/AppointmentService';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    if (!date) {
        return NextResponse.json({ error: "No s'ha especificat una data." }, { status: 400 });
    }

    try {
        // La validació de cap de setmana i la lògica d'Airtable ara viuen al Servei.
        const slots = await AppointmentService.getAvailableSlots(date);
        
        return NextResponse.json({ slots });
        
    } catch (error) {
        console.error('Error al obtenir les hores lliures:', error);
        return NextResponse.json({ error: 'Error intern del servidor' }, { status: 500 });
    }
}