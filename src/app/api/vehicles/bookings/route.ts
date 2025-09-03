import { NextResponse } from 'next/server';
import Airtable from 'airtable';
import { Resend } from 'resend';
import { format } from 'date-fns';

// --- CONFIGURACIÓ ---
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID!);
const resend = new Resend(process.env.RESEND_API_KEY);
const TABLE_NAME = 'VehicleBookings'; // Assegura't que aquest sigui el nom de la teva taula de reserves
const ADMIN_EMAIL = 'info@garatgeestacio.com';
const FROM_EMAIL = 'Garatge Estació <onboarding@resend.dev>';

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // 1. VALIDACIÓ DE DADES BÀSICA
    if (!data.customer_name || !data.customer_email || !data.start_date || !data.end_date || !data.vehicle_name) {
      return NextResponse.json({ error: "Falten camps obligatoris." }, { status: 400 });
    }

    const newStartDate = new Date(data.start_date);
    const newEndDate = new Date(data.end_date);

    // 2. COMPROVACIÓ DE DISPONIBILITAT (evitar reserves solapades)
    const existingBookings = await base(TABLE_NAME).select({
      filterByFormula: `AND({vehicle_name} = '${data.vehicle_name}', {status} != 'Cancel·lada')`,
    }).all();

    const isOverlapping = existingBookings.some(record => {
      const existingStart = new Date(record.fields.start_date as string);
      const existingEnd = new Date(record.fields.end_date as string);
      return newStartDate <= existingEnd && newEndDate >= existingStart;
    });

    if (isOverlapping) {
      return NextResponse.json({ error: "Les dates seleccionades ja no estan disponibles." }, { status: 409 });
    }

    // 3. CREACIÓ DE LA RESERVA A AIRTABLE
    await base(TABLE_NAME).create([{
      fields: {
        'customer_name': data.customer_name,
        'customer_email': data.customer_email,
        'customer_phone': data.customer_phone,
        'start_date': data.start_date,
        'end_date': data.end_date,
        'vehicle_id_relation': [data.vehicle_id], // Si tens un camp de relació a Airtable
        'vehicle_name': data.vehicle_name,
        'total_price': data.total_price,
        'status': 'Pendent',
      }
    }]);

    // 4. ENVIAMENT D'EMAILS DE NOTIFICACIÓ
    // Email a l'administrador
    await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `🚗 Nova Reserva de Vehicle: ${data.vehicle_name}`,
      html: `<h2>Nova sol·licitud de reserva de vehicle</h2>
             <p><strong>Client:</strong> ${data.customer_name}</p>
             <p><strong>Email:</strong> ${data.customer_email}</p>
             <p><strong>Telèfon:</strong> ${data.customer_phone}</p>
             <hr>
             <p><strong>Vehicle:</strong> ${data.vehicle_name}</p>
             <p><strong>Dates:</strong> del ${format(newStartDate, 'dd/MM/yyyy')} al ${format(newEndDate, 'dd/MM/yyyy')}</p>
             <p><strong>Preu Total Estimat:</strong> ${data.total_price.toFixed(2)}€</p>`
    });
    
    // Email al client
    await resend.emails.send({
      from: FROM_EMAIL,
      to: data.customer_email,
      subject: "✅ Sol·licitud de Reserva Rebuda - Garatge Estació",
      html: `<h1>Hola ${data.customer_name},</h1>
             <p>Hem rebut correctament la teva sol·licitud per al vehicle <strong>${data.vehicle_name}</strong>.</p>
             <p><strong>Dates sol·licitades:</strong> del ${format(newStartDate, 'dd/MM/yyyy')} al ${format(newEndDate, 'dd/MM/yyyy')}.</p>
             <p>En breu contactarem amb tu per confirmar la disponibilitat i els següents passos.</p>
             <p>Gràcies per la teva confiança!</p>`
    });

    return NextResponse.json({ message: 'Reserva creada amb èxit' });

  } catch (error) {
    console.error("Error al crear la reserva del vehicle:", error);
    return NextResponse.json({ error: "No s'ha pogut processar la sol·licitud." }, { status: 500 });
  }
}