// lib/google-calendar.ts

import { google } from 'googleapis';
import { format, addDays } from 'date-fns';

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
// La resta de les teves funcions, ara utilitzant el nou mètode d'autenticació
export async function createGoogleCalendarEvent(data: any, airtableRecordId: string) {
  const calendarId = process.env.GOOGLE_CALENDAR_ID;
  if (!calendarId) {
    console.error('GOOGLE_CALENDAR_ID no està definit.');
    return null;
  }

  try {
    const calendar = await getAuthenticatedClient();
    
    // 💡 DECISIÓ CLAU: Crear la cadena de Data i Hora Local sense forçar UTC
    // data.date = YYYY-MM-DD
    // data.time = HH:MM
    const startDateTimeLocal = `${data.date}T${data.time}:00`;

    // Utilitzem l'objecte Date SENSE la 'Z' al final per manipular el temps
    // Això encara podria dependre de la TZ de Vercel, per això la manipulació amb date-fns és més neta,
    // però per consistència amb el vostre codi, farem la manipulació en la cadena de temps:

    // 1. Convertim la hora a Number
    const [hours, minutes] = data.time.split(':').map(Number);
    
    // 2. Calculem l'hora de finalització (sumant 1 hora)
    const endHours = hours + 1;
    const endMinutes = minutes;
    
    // 3. Format de nou a string (assegurant dos dígits)
    const endDateTimeLocal = `${data.date}T${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}:00`;


    const event = {
      summary: `Cita Taller: ${data.service} - ${data.name}`,
      description: `Client: ${data.name}\nTelèfon: ${data.phone}\nEmail: ${data.email}\n\nVehicle: ${data.vehicleBrand} ${data.vehicleModel}\nServei: ${data.service}\n\nMissatge del client:\n${data.message || 'Cap'}\n\nID Airtable: ${airtableRecordId}`,
      start: {
        // ✅ CORRECCIÓ: Enviem la data i hora LOCAL com a string (YYYY-MM-DDTHH:MM:SS)
        dateTime: startDateTimeLocal, 
        timeZone: 'Europe/Madrid', // <-- Aquesta zona horària indica com interpretar l'string anterior
      },
      end: {
        // ✅ CORRECCIÓ: Enviem la data i hora de finalització LOCAL com a string
        dateTime: endDateTimeLocal,
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
    throw error; 
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
        
        const event = {
            summary: `Lloguer AC: ${data.Vehicle_Name} - ${data.customer_name}`,
            description: `Client: ${data.customer_name}\nTelèfon: ${data.customer_phone}\nEmail: ${data.customer_email}\n\nID Airtable: ${airtableRecordId}`,
            start: {
                date: data.start_date,
            },
            end: {
                // ✅ 2. ARA LA FUNCIÓ 'addDays' EXISTEIX I FUNCIONARÀ CORRECTAMENT
                date: format(addDays(new Date(data.end_date), 1), 'yyyy-MM-dd'),
            },
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

// ✅ --- NOVA FUNCIÓ PER AL LLOGUER DE VEHICLES ---
export async function createGoogleCalendarVehicleEvent(data: any, airtableRecordId: string) {
  const calendarId = process.env.GOOGLE_CALENDAR_ID;
  if (!calendarId) {
    console.error('GOOGLE_CALENDAR_ID no està definit.');
    return null;
  }

  try {
    const calendar = await getAuthenticatedClient();
    
    // Google Calendar necessita que la data final sigui un dia després per a esdeveniments de dia sencer
    const endDateForGoogle = format(addDays(new Date(data.end_date), 1), 'yyyy-MM-dd');

    const event = {
        summary: `Lloguer Vehicle: ${data.vehicle_name} - ${data.customer_name}`,
        description: `Client: ${data.customer_name}\nTelèfon: ${data.customer_phone}\nEmail: ${data.customer_email}\n\nID Airtable: ${airtableRecordId}`,
        start: {
            date: data.start_date, // Format YYYY-MM-DD
        },
        end: {
            date: endDateForGoogle, // Format YYYY-MM-DD
        },
        // Un altre color per diferenciar-los (ex: 5 per a Groc)
        colorId: '5', 
    };

    const createdEvent = await calendar.events.insert({
        calendarId: calendarId,
        requestBody: event,
    });

    console.log('✅ Event de Lloguer de Vehicle a Google Calendar creat:', createdEvent.data.htmlLink);
    return createdEvent.data;

  } catch (error) {
    console.error('🔴 Google Calendar API error (Lloguer Vehicle):', error);
    throw error; // Rellancem l'error
  }
}