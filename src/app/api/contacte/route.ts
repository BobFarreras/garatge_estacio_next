import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';

const resend = new Resend(process.env.RESEND_API_KEY);

// Esquema de validació de Zod al servidor
const contactSchema = z.object({
  name: z.string().min(1, { message: "El nom és obligatori" }),
  email: z.string().email({ message: "L'email no és vàlid" }),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(10, { message: "El missatge és massa curt" }),
  privacyPolicy: z.boolean().refine(val => val === true, {
    message: "Has d'acceptar la política de privacitat.",
  }),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Validació robusta amb Zod
    const validation = contactSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: 'Dades invàlides', details: validation.error.flatten().fieldErrors }, { status: 400 });
    }
    
    const { name, email, phone, subject, message } = validation.data;

    // 2. Enviament de l'email amb HTML directament
    const { data, error } = await resend.emails.send({
      from: 'Garatge Estació <web@garatgeestacio.com>',
      to: ['info@garatgeestacio.com'],
      replyTo: email,
      subject: subject || `Nou Missatge de Contacte de ${name}`,
      // ✅ Utilitzem la plantilla HTML directament aquí
      html: `
        <body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: sans-serif;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td align="center" style="padding: 20px;">
                <table role="presentation" style="max-width: 600px; width: 100%; background-color: #ffffff; border-collapse: collapse;">
                  <tr>
                    <td align="center" style="padding: 20px; background-color: #111827;">
                      <img src="https://res.cloudinary.com/dvqhfapep/image/upload/v1754671222/fadfasdfasd-removebg-preview_iyvhre.png" alt="Garatge Estació Logo" width="200">
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 40px;">
                      <h1 style="font-size: 28px; color: #111827;">Nou Missatge de la Web</h1>
                      <p style="font-size: 16px;">Has rebut una nova consulta a través del formulari de contacte.</p>
                      <div style="background-color: #f8f8f8; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
                        <h2 style="font-size: 20px; margin: 0 0 15px;">Detalls del Missatge</h2>
                        <p><strong>De:</strong> ${name}</p>
                        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                        <p><strong>Telèfon:</strong> ${phone || 'No especificat'}</p>
                        <p><strong>Assumpte:</strong> ${subject || 'Sense assumpte'}</p>
                        <hr style="border: 0; border-top: 1px solid #dddddd; margin: 15px 0;">
                        <p style="line-height: 1.5;">${message}</p>
                      </div>
                      <div style="text-align: center;">
                        <a href="mailto:${email}" style="background-color: #dc2626; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                          Respondre a ${name}
                        </a>
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      `
    });

    if (error) {
      console.error('Error de Resend:', error);
      return NextResponse.json({ error: "No s'ha pogut enviar el correu" }, { status: 500 });
    }

    return NextResponse.json({ message: 'Correu enviat correctament' });

  } catch (error) {
    console.error('Error a l\'API de contacte:', error);
    return NextResponse.json({ error: 'Error intern del servidor' }, { status: 500 });
  }
}