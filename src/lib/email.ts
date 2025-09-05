import { Resend } from 'resend';
import { format } from 'date-fns';

const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_EMAIL = 'info@garatgeestacio.com';
const FROM_EMAIL = 'Garatge Estació <web@garatgeestacio.com>';

/**
 * Envia els emails de confirmació per a una cita al taller.
 */
export async function sendWorkshopAppointmentEmails(data: any) {
  const appointmentDate = new Date(`${data.date}T${data.time}`);
  const formattedDate = format(appointmentDate, 'dd/MM/yyyy');
  // ✅ CORRECCIÓ: El nom de la columna és 'cancellationToken' (normalment en camelCase a l'objecte)
  const cancellationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/cites/cancelar?token=${data.cancellationToken}`;

  console.log("URL de cancel·lació generada:", cancellationUrl); // <--- AFEGEIX AIXÒ  
  const addToCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`Cita Taller: ${data.service}`)}&dates=${format(appointmentDate, "yyyyMMdd'T'HHmmss")}/${format(new Date(appointmentDate.getTime() + 60 * 60 * 1000), "yyyyMMdd'T'HHmmss")}&details=${encodeURIComponent(`Servei: ${data.service}\nClient: ${data.name}`)}&location=${encodeURIComponent("Garatge Estació, La Bisbal d'Empordà")}`;
  const lang: 'ca' | 'es' = (data.lang === 'es') ? 'es' : 'ca';

  const clientTexts = {
    ca: {
        subject: "✅ Cita al taller confirmada - Garatge Estació",
        title: "La teva cita està confirmada!",
        greeting: `Hola, <strong>${data.name}</strong>,`,
        body: "Ens complau confirmar que la teva cita ha estat registrada correctament. T'hi esperem!",
        summaryTitle: "Detall de la teva cita",
        service: "Servei",
        date: "Data",
        time: "Hora",
        yourMessage: "El teu missatge",
        addToCalendar: "Afegeix a Google Calendar",
        manageTitle: "Gestiona la teva cita",
        manageBody: "Si necessites cancel·lar la teva cita, pots fer-ho a través del següent enllaç.",
        cancelButton: "Cancel·lar la meva cita"
    },
    es: {
        subject: "✅ Cita en el taller confirmada - Garaje Estació",
        title: "¡Tu cita está confirmada!",
        greeting: `Hola, <strong>${data.name}</strong>,`,
        body: "Nos complace confirmar que tu cita ha sido registrada correctamente. ¡Te esperamos!",
        summaryTitle: "Detalles de tu cita",
        service: "Servicio",
        date: "Fecha",
        time: "Hora",
        yourMessage: "Tu mensaje",
        addToCalendar: "Añadir a Google Calendar",
        manageTitle: "Gestiona tu cita",
        manageBody: "Si necesitas cancelar tu cita, puedes hacerlo a través del siguiente enlace.",
        cancelButton: "Cancelar mi cita"
    }
  };

  const texts = clientTexts[lang];

  // --- 1. Email per al client ---
  const { data: clientEmailData, error: clientEmailError } = await resend.emails.send({
    from: FROM_EMAIL,
    to: data.email,
    subject: texts.subject,
    replyTo: ADMIN_EMAIL,
    html: `<!DOCTYPE html><html lang="${lang}">
    <head>
      <meta charset="UTF-8">
      <title>${texts.subject}</title>
      <style>
        body {margin: 0; padding: 0; background-color: #f4f4f4; font-family: system-ui, sans-serif}
        .button-cancel{background-color:#6b7280;color:#ffffff;padding:12px 24px;text-decoration:none;border-radius:8px;font-weight:bold;display:inline-block}
        .button-calendar{background-color:#16a34a;color:#ffffff;padding:12px 24px;text-decoration:none;border-radius:8px;font-weight:bold;display:inline-block}
      </style>
    </head>
    <body style="margin:0;padding:0;background-color:#f4f4f4">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%" style="background-color:#f4f4f4">
        <tr>
          <td align="center">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width:600px;margin:0 auto;background-color:#ffffff">
              <tr>
                <td align="center" style="padding:20px 0;background-color:#111827">
                  <img src="https://res.cloudinary.com/dvqhfapep/image/upload/v1754671222/fadfasdfasd-removebg-preview_iyvhre.png" alt="Logotip Garatge Estació" width="200">
                </td>
              </tr>
              <tr>
                <td style="padding:40px;color:#333333">
                  <h1 style="margin:0 0 20px;font-size:28px;font-weight:bold;color:#111827">${texts.title}</h1>
                  <p style="margin:0 0 20px;font-size:18px;line-height:1.5">${texts.greeting}</p>
                  <p style="margin:0 0 30px;font-size:18px;line-height:1.5">${texts.body}</p>
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom:30px">
                    <tr>
                      <td style="background-color:#f8f8f8;padding:20px;border-radius:8px">
                        <h2 style="margin:0 0 15px;font-size:20px;font-weight:bold;color:#111827">${texts.summaryTitle}</h2>
                        <p style="margin:0 0 10px;font-size:18px"><strong>${texts.service}:</strong> ${data.service}</p>
                        <p style="margin:0 0 10px;font-size:18px"><strong>Marca:</strong> ${data.vehicleBrand}</p>
                        <p style="margin:0 0 10px;font-size:18px"><strong>Model:</strong> ${data.vehicleModel}</p>
                        <p style="margin:0 0 10px;font-size:18px"><strong>${texts.date}:</strong> ${formattedDate}</p>
                        <p style="margin:0;font-size:18px"><strong>${texts.time}:</strong> ${data.time}</p>
                        ${data.message ? `<p style="margin:10px 0 0;font-size:18px"><strong>${texts.yourMessage}:</strong> ${data.message}</p>` : ''}
                        ${data.attachmentUrls && data.attachmentUrls.length > 0
                          ? `<div style="margin:10px 0 0;font-size:18px">
                              <strong>Adjunts:</strong>
                              <ul>
                                ${data.attachmentUrls.map((url: string, i: number) =>
                                  `<li><a href="${url}" target="_blank" style="color:#1d4ed8;text-decoration:underline;">Fitxer ${i + 1}</a></li>`
                                ).join('')}
                              </ul>
                            </div>`
                          : ''
                        }
                      </td>
                    </tr>
                  </table>
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom:30px;text-align:center">
                    <tr>
                      <td><a href="${addToCalendarUrl}" target="_blank" 
   style="background-color:#16a34a; color:#ffffff; padding:12px 24px; text-decoration:none; border-radius:8px; font-weight:bold; display:inline-block;">
   ${texts.addToCalendar}</a></td>
                    </tr>
                  </table>
                  <h2 style="margin:0 0 15px;font-size:20px;font-weight:bold;color:#111827;text-align:center">${texts.manageTitle}</h2>
                  <p style="margin:0 0 20px;font-size:16px;line-height:1.5;text-align:center">${texts.manageBody}</p>
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                    <tr>
                      <td align="center"><a href="${cancellationUrl}" target="_blank" 
   style="background-color:#bd2211; color:#ffffff; padding:12px 24px; text-decoration:none; border-radius:8px; font-weight:bold; display:inline-block;">
   ${texts.cancelButton}</a></td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="background-color:#f4f4f4;padding:20px;text-align:center;color:#666666;font-size:12px">
                  <p style="margin:0 0 10px">Garatge Estació © ${new Date().getFullYear()}. Tots els drets reservats.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>`
  });

  if (clientEmailError) {
    console.error("Error en enviar l'email al client:", clientEmailError);
    throw new Error("No s'ha pogut enviar l'email de confirmació al client.");
  }


  // --- 2. Email para el administrador (con los nuevos campos) ---
  const { error: adminEmailError } = await resend.emails.send({
    from: FROM_EMAIL,
    to: ADMIN_EMAIL,
    subject: `🛠️ Nueva Cita Taller: ${data.service} (${data.vehicleBrand} ${data.vehicleModel})`,
    replyTo: data.email,
    html: `
        <!DOCTYPE html>
        <html lang="ca">
        <head><meta charset="UTF-8"><title>Nueva Cita</title></head>
        <body style="font-family:Arial,sans-serif;background-color:#f9f9f9;padding:20px">
            <div style="max-width:600px;margin:0 auto;background:#ffffff;padding:20px;border-radius:10px">
                <h2 style="color:#111827;text-align:center">Nueva Cita Registrada</h2>
                <table style="width:100%;border-collapse:collapse;margin-top:20px;font-size:16px;">
                    <tr><td style="padding:8px;border:1px solid #ddd"><strong>Cliente:</strong></td><td style="padding:8px;border:1px solid #ddd">${data.name}</td></tr>
                    <tr><td style="padding:8px;border:1px solid #ddd"><strong>Email:</strong></td><td style="padding:8px;border:1px solid #ddd">${data.email}</td></tr>
                    <tr><td style="padding:8px;border:1px solid #ddd"><strong>Teléfono:</strong></td><td style="padding:8px;border:1px solid #ddd">${data.phone}</td></tr>
                    <tr style="background-color:#f8f8f8;"><td style="padding:8px;border:1px solid #ddd"><strong>Marca:</strong></td><td style="padding:8px;border:1px solid #ddd">${data.vehicleBrand}</td></tr>
                    <tr style="background-color:#f8f8f8;"><td style="padding:8px;border:1px solid #ddd"><strong>Modelo:</strong></td><td style="padding:8px;border:1px solid #ddd">${data.vehicleModel}</td></tr>
                    <tr><td style="padding:8px;border:1px solid #ddd"><strong>Servicio:</strong></td><td style="padding:8px;border:1px solid #ddd">${data.service}</td></tr>
                    <tr><td style="padding:8px;border:1px solid #ddd"><strong>Fecha:</strong></td><td style="padding:8px;border:1px solid #ddd">${formattedDate}</td></tr>
                    <tr><td style="padding:8px;border:1px solid #ddd"><strong>Hora:</strong></td><td style="padding:8px;border:1px solid #ddd">${data.time}</td></tr>
                    ${data.message ? `<tr><td style="padding:8px;border:1px solid #ddd"><strong>Mensaje:</strong></td><td style="padding:8px;border:1px solid #ddd">${data.message}</td></tr>` : ''}
                    ${data.attachmentUrls && data.attachmentUrls.length > 0
                      ? `<tr>
                           <td style="padding:8px;border:1px solid #ddd"><strong>Archivos Adjuntos:</strong></td>
                           <td style="padding:8px;border:1px solid #ddd">
                             <ul style="margin:0;padding-left:18px">
                               ${data.attachmentUrls.map((url: string, i: number) => 
                                  `<li><a href="${url}" target="_blank">Archivo ${i + 1}</a></li>`
                               ).join('')}
                             </ul>
                           </td>
                         </tr>`
                      : ''
                    }
                    
                </table>
            </div>
        </body>
        </html>
    `
  });
  
  if (adminEmailError) {
    console.error("Error al enviar el email al administrador:", adminEmailError);
  }
}


// La funció sendMotorhomeBookingEmails es manté igual, ja que no afecta la cancel·lació
// ...

/**
 * Envia els emails per a reserves d'autocaravanes.
 */
export async function sendMotorhomeBookingEmails(data: any) {
  const startDate = new Date(data.start_date);
  const endDate = new Date(data.end_date);
  const days = (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24) + 1;
  const formattedStartDate = format(startDate, 'dd/MM/yyyy');
  const formattedEndDate = format(endDate, 'dd/MM/yyyy');
  const lang: 'ca' | 'es' = (data.lang === 'es') ? 'es' : 'ca';

  const clientTexts = {
    ca: {
      subject: "🏕️ Sol·licitud de Reserva Rebuda - Garatge Estació",
      title: "Sol·licitud de Reserva Rebuda!",
      greeting: `Hola, <strong>${data.customer_name}</strong>,`,
      body1: "Hem rebut la teva sol·licitud per llogar una de les nostres autocaravanes. Estem molt contents que hagis triat Garatge Estació per a la teva pròxima aventura!",
      body2: "Un membre del nostre equip revisarà la disponibilitat i et contactarà al més aviat possible per a <strong>confirmar la reserva definitivament</strong> i explicar-te els següents passos (contracte, paga i senyal, etc.).",
      summaryTitle: "Resum de la teva sol·licitud",
      vehicle: "Vehicle",
      pickup: "Data de Recollida",
      return: "Data de Retorn",
      duration: "Durada",
      days: "dies",
      closing: "Si tens qualsevol dubte, estem a la teva disposició."
    },
    es: {
      subject: "🏕️ Solicitud de Reserva Recibida - Garatge Estació",
      title: "¡Solicitud de Reserva Recibida!",
      greeting: `Hola, <strong>${data.customer_name}</strong>,`,
      body1: "Hemos recibido tu solicitud para alquilar una de nuestras autocaravanas. ¡Estamos muy contentos de que hayas elegido Garatge Estació para tu próxima aventura!",
      body2: "Un miembro de nuestro equipo revisará la disponibilidad y te contactará lo antes posible para <strong>confirmar la reserva definitivamente</strong> y explicarte los siguientes pasos (contrato, paga y señal, etc.).",
      summaryTitle: "Resumen de tu solicitud",
      vehicle: "Vehículo",
      pickup: "Fecha de Recogida",
      return: "Fecha de Devolución",
      duration: "Duración",
      days: "días",
      closing: "Si tienes cualquier duda, estamos a tu disposición."
    }
  };
  
  const texts = clientTexts[lang];

  // --- 1. Email per al client (amb multi-idioma) ---
  await resend.emails.send({
    from: FROM_EMAIL,
    to: data.customer_email,
    subject: texts.subject,
    replyTo: ADMIN_EMAIL,
    html: `<!DOCTYPE html><html lang="${lang}"><head><meta charset="UTF-8"><title>${texts.subject}</title></head><body style="margin:0;padding:0;background-color:#f4f4f4;font-family:sans-serif"><table role="presentation" width="100%"><tr><td align="center" style="padding:20px"><table role="presentation" width="100%" style="max-width:600px;margin:0 auto;background-color:#fff"><tr><td align="center" style="padding:20px;background-color:#111827"><img src="https://res.cloudinary.com/dvqhfapep/image/upload/v1754671222/fadfasdfasd-removebg-preview_iyvhre.png" alt="Logo" width="200"></td></tr><tr><td style="padding:40px"><h1 style="font-size:28px;color:#111827">${texts.title}</h1><p style="font-size:18px;line-height:1.5">${texts.greeting}</p><p style="font-size:18px;line-height:1.5">${texts.body1}</p><p style="font-size:18px;line-height:1.5">${texts.body2}</p><div style="background-color:#f8f8f8;padding:20px;border-radius:8px;margin:20px 0"><h2 style="font-size:20px;margin:0 0 15px">${texts.summaryTitle}</h2><p style="font-size:18px"><strong>${texts.vehicle}:</strong> ${data.Vehicle_Name}</p><p style="font-size:18px"><strong>${texts.pickup}:</strong> ${formattedStartDate}</p><p style="font-size:18px"><strong>${texts.return}:</strong> ${formattedEndDate}</p><p style="font-size:18px"><strong>${texts.duration}:</strong> ${days} ${texts.days}</p></div><p style="font-size:18px;line-height:1.5">${texts.closing}</p></td></tr><tr><td style="background-color:#f4f4f4;padding:20px;text-align:center;font-size:12px;color:#666"><p style="margin:0">Garatge Estació &copy; ${new Date().getFullYear()}</p></td></tr></table></td></tr></table></body></html>`
  });

  // --- 2. Email per a l'administrador (es queda en català) ---
  await resend.emails.send({
    from: FROM_EMAIL,
    to: ADMIN_EMAIL,
    subject: `🚐 Nova Reserva d'Autocaravana: ${data.Vehicle_Name}`,
    replyTo: data.customer_email,
    html: `<!DOCTYPE html><html lang="ca"><head><meta charset="UTF-8"><title>Nova Reserva Autocaravana</title></head><body style="font-family:Arial,sans-serif;color:#333;background-color:#f9f9f9;padding:20px"><div style="max-width:600px;margin:0 auto;background:#ffffff;padding:20px;border-radius:10px"><h2 style="color:#111827;text-align:center">Nova Reserva d'Autocaravana</h2><table style="width:100%;border-collapse:collapse;margin-top:20px"><tr><td style="padding:8px;border:1px solid #ddd"><strong>Client:</strong></td><td style="padding:8px;border:1px solid #ddd">${data.customer_name}</td></tr><tr><td style="padding:8px;border:1px solid #ddd"><strong>Email:</strong></td><td style="padding:8px;border:1px solid #ddd">${data.customer_email}</td></tr><tr><td style="padding:8px;border:1px solid #ddd"><strong>Telèfon:</strong></td><td style="padding:8px;border:1px solid #ddd">${data.customer_phone}</td></tr><tr><td style="padding:8px;border:1px solid #ddd"><strong>Autocaravana:</strong></td><td style="padding:8px;border:1px solid #ddd">${data.Vehicle_Name}</td></tr><tr><td style="padding:8px;border:1px solid #ddd"><strong>Data Inici:</strong></td><td style="padding:8px;border:1px solid #ddd">${formattedStartDate}</td></tr><tr><td style="padding:8px;border:1px solid #ddd"><strong>Data Fi:</strong></td><td style="padding:8px;border:1px solid #ddd">${formattedEndDate}</td></tr><tr><td style="padding:8px;border:1px solid #ddd"><strong>Durada:</strong></td><td style="padding:8px;border:1px solid #ddd">${days} dies</td></tr></table></div></body></html>`
  });
}

/**
 * Envia els emails per a reserves de vehicles.
 */
export async function sendVehicleBookingEmails(data: any) {
  const startDate = new Date(data.start_date);
  const endDate = new Date(data.end_date);
  const days = (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24) + 1;
  const formattedStartDate = format(startDate, 'dd/MM/yyyy');
  const formattedEndDate = format(endDate, 'dd/MM/yyyy');
  const lang: 'ca' | 'es' = (data.lang === 'es') ? 'es' : 'ca';

  const clientTexts = {
      ca: {
          subject: "🚗 Sol·licitud de Reserva de Vehicle Rebuda - Garatge Estació",
          title: "Sol·licitud de Reserva Rebuda!",
          greeting: `Hola, <strong>${data.customer_name}</strong>,`,
          body1: "Hem rebut la teva sol·licitud per llogar un dels nostres vehicles.",
          body2: "Un membre del nostre equip revisarà la disponibilitat i et contactarà al més aviat possible per a <strong>confirmar la reserva definitivament</strong> i explicar-te els següents passos.",
          summaryTitle: "Resum de la teva sol·licitud",
          vehicle: "Vehicle",
          pickup: "Data de Recollida",
          return: "Data de Retorn",
          duration: "Durada",
          days: "dies",
          closing: "Si tens qualsevol dubte, estem a la teva disposició."
      },
      es: {
          subject: "🚗 Solicitud de Reserva de Vehículo Recibida - Garatge Estació",
          title: "¡Solicitud de Reserva Recibida!",
          greeting: `Hola, <strong>${data.customer_name}</strong>,`,
          body1: "Hemos recibido tu solicitud para alquilar uno de nuestros vehículos.",
          body2: "Un miembro de nuestro equipo revisará la disponibilidad y te contactará lo antes posible para <strong>confirmar la reserva definitivamente</strong> y explicarte los siguientes pasos.",
          summaryTitle: "Resumen de tu solicitud",
          vehicle: "Vehículo",
          pickup: "Fecha de Recogida",
          return: "Fecha de Devolución",
          duration: "Duración",
          days: "días",
          closing: "Si tienes cualquier duda, estamos a tu disposición."
      }
  };
  
  const texts = clientTexts[lang];

  // --- 1. Email per al client ---
  await resend.emails.send({
      from: FROM_EMAIL,
      to: data.customer_email,
      subject: texts.subject,
      replyTo: ADMIN_EMAIL,
      html: `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <title>${texts.subject}</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:sans-serif">
  <table role="presentation" width="100%">
      <tr>
          <td align="center" style="padding:20px">
              <table role="presentation" width="100%" style="max-width:600px;margin:0 auto;background-color:#fff">
                  <tr>
                      <td align="center" style="padding:20px;background-color:#111827">
                          <img src="https://res.cloudinary.com/dvqhfapep/image/upload/v1754671222/fadfasdfasd-removebg-preview_iyvhre.png" alt="Garatge Estació Logo" width="200">
                      </td>
                  </tr>
                  <tr>
                      <td style="padding:40px">
                          <h1 style="font-size:28px;color:#111827">${texts.title}</h1>
                          <p style="font-size:18px;line-height:1.5">${texts.greeting}</p>
                          <p style="font-size:18px;line-height:1.5">${texts.body1}</p>
                          <p style="font-size:18px;line-height:1.5">${texts.body2}</p>
                          <div style="background-color:#f8f8f8;padding:20px;border-radius:8px;margin:30px 0;">
                              <h2 style="font-size:20px;margin:0 0 15px">${texts.summaryTitle}</h2>
                              <p style="font-size:18px;margin:10px 0;"><strong>${texts.vehicle}:</strong> ${data.vehicle_name}</p>
                              <p style="font-size:18px;margin:10px 0;"><strong>${texts.pickup}:</strong> ${formattedStartDate}</p>
                              <p style="font-size:18px;margin:10px 0;"><strong>${texts.return}:</strong> ${formattedEndDate}</p>
                              <p style="font-size:18px;margin:10px 0;"><strong>${texts.duration}:</strong> ${days} ${texts.days}</p>
                          </div>
                          <p style="font-size:18px;line-height:1.5">${texts.closing}</p>
                      </td>
                  </tr>
                  <tr>
                      <td style="background-color:#f4f4f4;padding:20px;text-align:center;font-size:12px;color:#666">
                          <p style="margin:0">Garatge Estació &copy; ${new Date().getFullYear()}</p>
                      </td>
                  </tr>
              </table>
          </td>
      </tr>
  </table>
</body>
</html>`
  });

  // --- 2. Email per a l'administrador ---
  await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `🚗 Nova Reserva de Vehicle: ${data.vehicle_name}`,
      replyTo: data.customer_email,
      html: `<!DOCTYPE html>
<html lang="ca">
<head>
  <meta charset="UTF-8">
  <title>Nova Reserva de Vehicle</title>
</head>
<body style="font-family:Arial,sans-serif;color:#333;background-color:#f9f9f9;padding:20px">
  <div style="max-width:600px;margin:0 auto;background:#ffffff;padding:20px;border-radius:10px">
      <h2 style="color:#111827;text-align:center">Nova Sol·licitud de Reserva de Vehicle</h2>
      <table style="width:100%;border-collapse:collapse;margin-top:20px;font-size:16px;">
          <tr><td style="padding:10px;border:1px solid #ddd;background-color:#f8f8f8;"><strong>Client:</strong></td><td style="padding:10px;border:1px solid #ddd;">${data.customer_name}</td></tr>
          <tr><td style="padding:10px;border:1px solid #ddd;background-color:#f8f8f8;"><strong>Email:</strong></td><td style="padding:10px;border:1px solid #ddd;"><a href="mailto:${data.customer_email}">${data.customer_email}</a></td></tr>
          <tr><td style="padding:10px;border:1px solid #ddd;background-color:#f8f8f8;"><strong>Telèfon:</strong></td><td style="padding:10px;border:1px solid #ddd;"><a href="tel:${data.customer_phone}">${data.customer_phone}</a></td></tr>
          <tr><td style="padding:10px;border:1px solid #ddd;background-color:#f8f8f8;"><strong>Vehicle:</strong></td><td style="padding:10px;border:1px solid #ddd;">${data.vehicle_name}</td></tr>
          <tr><td style="padding:10px;border:1px solid #ddd;background-color:#f8f8f8;"><strong>Data Inici:</strong></td><td style="padding:10px;border:1px solid #ddd;">${formattedStartDate}</td></tr>
          <tr><td style="padding:10px;border:1px solid #ddd;background-color:#f8f8f8;"><strong>Data Fi:</strong></td><td style="padding:10px;border:1px solid #ddd;">${formattedEndDate}</td></tr>
          <tr><td style="padding:10px;border:1px solid #ddd;background-color:#f8f8f8;"><strong>Durada:</strong></td><td style="padding:10px;border:1px solid #ddd;">${days} dies</td></tr>
      </table>
  </div>
</body>
</html>`
  });
}