import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Inicialitza Resend amb la clau API del teu .env.local
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    // Validació bàsica
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Falten camps obligatoris' }, { status: 400 });
    }

    // Envia l'email
    const { data, error } = await resend.emails.send({
      from: 'Contacte Web <onboarding@resend.dev>', // Ha de ser un domini verificat a Resend
      to: ['info@garatgeestacio.com'], // El teu email on vols rebre els contactes
      replyTo: email,
      subject: subject || `Nou Missatge de Contacte de ${name}`,
      html: `
        <h1>Nou missatge des de la web</h1>
        <p><strong>Nom:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Telèfon:</strong> ${phone || 'No especificat'}</p>
        <hr />
        <h2>Missatge:</h2>
        <p>${message}</p>
      `,
    });

    if (error) {
      console.error('Error de Resend:', error);
      return NextResponse.json({ error: 'Error en enviar el correu' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Correu enviat correctament' }, { status: 200 });

  } catch (error) {
    console.error('Error a l\'API de contacte:', error);
    return NextResponse.json({ error: 'Error intern del servidor' }, { status: 500 });
  }
}