// src/lib/email.ts
import { Resend } from 'resend';
import { format } from 'date-fns';

const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_EMAIL = 'info@garatgeestacio.com';
const FROM_EMAIL = 'Garatge Estació <onboarding@resend.dev>'; // Important: El domini ha d'estar verificat a Resend

// --- Email per a Cites del Taller ---

export async function sendWorkshopAppointmentEmails(data: any) {
  const subjectCustomer = "✅ Cita al taller confirmada - Garatge Estació";
  const subjectAdmin = `🛠️ Nova Cita al Taller: ${data.service}`;

  // 1. Email per al client
  await resend.emails.send({
    from: FROM_EMAIL,
    to: data.email,
    subject: subjectCustomer,
    html: `<h1>Hola ${data.name},</h1>
           <p>Hem rebut i confirmat la teva cita per al servei de <strong>${data.service}</strong>.</p>
           <p><strong>Data:</strong> ${format(new Date(data.date), 'dd/MM/yyyy')}</p>
           <p><strong>Hora:</strong> ${data.time}</p>
           <p>Gràcies per la teva confiança. T'esperem!</p>
           <p><strong>Garatge Estació</strong></p>`
  });

  // 2. Email per a l'administrador
  await resend.emails.send({
    from: FROM_EMAIL,
    to: ADMIN_EMAIL,
    subject: subjectAdmin,
    html: `<h2>Nova Cita de Taller</h2>
           <p><strong>Client:</strong> ${data.name}</p>
           <p><strong>Email:</strong> ${data.email}</p>
           <p><strong>Telèfon:</strong> ${data.phone}</p>
           <p><strong>Servei:</strong> ${data.service}</p>
           <p><strong>Data:</strong> ${format(new Date(data.date), 'dd/MM/yyyy')} a les ${data.time}</p>
           <p><strong>Missatge:</strong> ${data.message || 'Cap'}</p>`
  });
}


// --- Email per a Reserves d'Autocaravanes ---

export async function sendMotorhomeBookingEmails(data: any) {
  const startDate = new Date(data.start_date);
  const endDate = new Date(data.end_date);
  const days = (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24) + 1;

  const subjectCustomer = "🏕️ Sol·licitud de Reserva Rebuda - Garatge Estació";
  const subjectAdmin = `🚐 Nova Reserva d'Autocaravana: ${data.Vehicle_Name}`;

  // 1. Email per al client
  await resend.emails.send({
    from: FROM_EMAIL,
    to: data.customer_email,
    subject: subjectCustomer,
    html: `<h1>Hola ${data.customer_name},</h1>
           <p>Hem rebut correctament la teva sol·licitud de reserva per a l'autocaravana <strong>${data.Vehicle_Name}</strong>.</p>
           <p><strong>Dates:</strong> del ${format(startDate, 'dd/MM/yyyy')} al ${format(endDate, 'dd/MM/yyyy')} (${days} dies).</p>
           <p>En breu, un membre del nostre equip es posarà en contacte amb tu per confirmar tots els detalls i formalitzar la reserva.</p>
           <p>Gràcies per triar-nos per a la teva aventura!</p>
           <p><strong>Garatge Estació</strong></p>`
  });

  // 2. Email per a l'administrador
  await resend.emails.send({
    from: FROM_EMAIL,
    to: ADMIN_EMAIL,
    subject: subjectAdmin,
    html: `<h2>Nova Sol·licitud de Reserva d'Autocaravana</h2>
           <p><strong>Client:</strong> ${data.customer_name}</p>
           <p><strong>Email:</strong> ${data.customer_email}</p>
           <p><strong>Telèfon:</strong> ${data.customer_phone}</p>
           <hr>
           <p><strong>Vehicle:</strong> ${data.Vehicle_Name}</p>
           <p><strong>Dates:</strong> ${format(startDate, 'dd/MM/yyyy')} - ${format(endDate, 'dd/MM/yyyy')} (${days} dies).</p>`
  });
}