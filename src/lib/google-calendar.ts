// lib/google-calendar.ts

import { google } from 'googleapis';
import { format } from 'date-fns';

// Funció per obtenir un client autenticat amb el Compte de Servei
async function getAuthenticatedClient() {
  // 1. Llegeix la variable d'entorn (que ara està en Base64)
  const credentialsBase64 = process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS;

  if (!credentialsBase64) {
    throw new Error('La variable d\'entorn GOOGLE_SERVICE_ACCOUNT_CREDENTIALS no està definida.');
  }

  // 2. Descodifica el text de Base64 a un string JSON normal
  const credentialsJson = Buffer.from(credentialsBase64, 'base64').toString('utf-8');

  // 3. Ara, el JSON.parse hauria de funcionar sense problemes
  const credentials = JSON.parse(credentialsJson);

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/calendar'],
  });

  // No cal obtenir el client, només passa l'objecte GoogleAuth
  return google.calendar({ version: 'v3', auth });
}

// La resta de les teves funcions, ara utilitzant el nou mètode d'autenticació
export async function createGoogleCalendarEvent(data: any, airtableRecordId: string) {
  const calendarId = process.env.GOOGLE_CALENDAR_ID;
  if (!calendarId) {
    console.error('GOOGLE_CALENDAR_ID no està definit.');
    return null;
  }

  try {
    const calendar = await getAuthenticatedClient();
    const appointmentDate = new Date(`${data.date}T${data.time}`);
    const endDate = new Date(appointmentDate.getTime() + 60 * 60 * 1000); // 1 hora de durada

    const event = {
      summary: `Cita Taller: ${data.service} - ${data.name}`,
      description: `Client: ${data.name}\nTelèfon: ${data.phone}\nEmail: ${data.email}\n\nVehicle: ${data.vehicleBrand} ${data.vehicleModel}\nServei: ${data.service}\n\nMissatge del client:\n${data.message || 'Cap'}\n\nID Airtable: ${airtableRecordId}`,
      start: {
        dateTime: appointmentDate.toISOString(),
        timeZone: 'Europe/Madrid',
      },
      end: {
        dateTime: endDate.toISOString(),
        timeZone: 'Europe/Madrid',
      },
      //COLOR DEL CALENDARI
      colorId: '11',

    };

    const createdEvent = await calendar.events.insert({
      calendarId: calendarId,
      requestBody: event,
    });

    console.log('✅ Event de Google Calendar creat:', createdEvent.data.htmlLink);
    return createdEvent.data;

  } catch (error) {
    console.error('🔴 Google Calendar API error (Cita):', error);
    throw error; // <-- Rellancem l'error perquè l'acció principal el capturi
  }
}

export async function deleteGoogleCalendarEvent(eventId: string) {
  const calendarId = process.env.GOOGLE_CALENDAR_ID;
  if (!calendarId) {
    console.error('GOOGLE_CALENDAR_ID no està definit.');
    return;
  }

  try {
    const calendar = await getAuthenticatedClient();
    await calendar.events.delete({
      calendarId: calendarId,
      eventId: eventId,
    });
    console.log(`✅ Event de Google Calendar esborrat: ${eventId}`);
  } catch (error) {
    console.error(`🔴 Error en esborrar l'event ${eventId} de Google Calendar:`, error);
  }
}

// ✅ --- NOVA FUNCIÓ PER AL LLOGUER D'AUTOCARAVANES ---
export async function createGoogleCalendarRentalEvent(data: any, airtableRecordId: string) {
  const calendarId = process.env.GOOGLE_CALENDAR_ID;
  if (!calendarId) {
    console.error('GOOGLE_CALENDAR_ID no està definit.');
    return null;
  }

  try {
    const calendar = await getAuthenticatedClient();
    
    // Per a reserves de diversos dies, creem un esdeveniment de "tot el dia"
    const event = {
      summary: `Lloguer AC: ${data.Vehicle_Name} - ${data.customer_name}`,
      description: `Client: ${data.customer_name}\nTelèfon: ${data.customer_phone}\nEmail: ${data.customer_email}\n\nID Airtable: ${airtableRecordId}`,
      start: {
        // Data d'inici (format YYYY-MM-DD)
        date: data.start_date,
      },
      end: {
        // La data final en esdeveniments de tot el dia és exclusiva,
        // per la qual cosa hem de sumar un dia.
        date: format(addDays(new Date(data.end_date), 1), 'yyyy-MM-dd'),
      },
      // Canviem el color per a diferenciar-lo de les cites de taller (verd clar)
      colorId: '2', 
    };

    const createdEvent = await calendar.events.insert({
      calendarId: calendarId,
      requestBody: event,
    });

    console.log('✅ Event de Lloguer a Google Calendar creat:', createdEvent.data.htmlLink);
    return createdEvent.data;

  } catch (error) {
    console.error('🔴 Google Calendar API error (Lloguer):', error);
    throw error;
  }
}

function addDays(arg0: Date, arg1: number): any {
  throw new Error('Function not implemented.');
}
