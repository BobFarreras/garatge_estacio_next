import { google } from 'googleapis';
import { format as formatDate, addDays, addMinutes } from 'date-fns';
import crypto from 'crypto';

// --- 1. CONFIGURA EL CLIENT D'AUTENTICACIÓ OAUTH 2.0 ---
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
);

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
const calendarId = process.env.GOOGLE_CALENDAR_ID;
const timeZone = 'Europe/Madrid';

// --- 2. FUNCIONS HELPER ---

function generateEventId(seed: string): string {
  const hash = crypto.createHash('sha256').update(seed).digest('hex');
  return hash.substring(0, 32).replace(/[g-z]/gi, (match) => {
    return String.fromCharCode(match.charCodeAt(0) - 7);
  });
}

export async function createGoogleCalendarEvent(data: any, airtableRecordId: string): Promise<{ id: string, htmlLink: string } | null> {
  try {
    const startDateTime = new Date(`${data.date}T${data.time}`);
    const endDateTime = addMinutes(startDateTime, 60);

    const event = {
      id: generateEventId(airtableRecordId),
      summary: `Cita: ${data.service} - ${data.name}`,
      description: `Client: ${data.name}\nEmail: ${data.email}\nTelèfon: ${data.phone}\nServei: ${data.service}\n\nMissatge: ${data.message ?? ''}`,
      start: { dateTime: startDateTime.toISOString(), timeZone: timeZone },
      end: { dateTime: endDateTime.toISOString(), timeZone: timeZone },
      attendees: [{ email: data.email, displayName: data.name }],
      conferenceData: { createRequest: { requestId: crypto.randomUUID() } },
      reminders: { useDefault: true },
    };

    const createdEvent = await calendar.events.insert({
      calendarId: calendarId,
      requestBody: event,
      conferenceDataVersion: 1,
      sendUpdates: 'none',
    });

    if (!createdEvent.data.id || !createdEvent.data.htmlLink) throw new Error("L'esdeveniment no s'ha creat correctament a Google.");
    
    return { id: createdEvent.data.id, htmlLink: createdEvent.data.htmlLink };
  } catch (error) {
    console.error('Google Calendar API error (Cita): ', error);
    return null;
  }
}

export async function createGoogleCalendarRentalEvent(data: any, airtableRecordId: string): Promise<{ id: string, htmlLink: string } | null> {
    try {
        const startDate = new Date(data.start_date);
        const endDate = new Date(data.end_date);
        const googleEndDate = addDays(endDate, 1);
    
        const event = {
          id: generateEventId(airtableRecordId),
          summary: `Lloguer: ${data.Vehicle_Name} - ${data.customer_name}`,
          description: `Client: ${data.customer_name}\nEmail: ${data.customer_email}\nTelèfon: ${data.customer_phone}`,
          start: { date: formatDate(startDate, 'yyyy-MM-dd') },
          end: { date: formatDate(googleEndDate, 'yyyy-MM-dd') },
          attendees: [{ email: data.customer_email, displayName: data.customer_name }],
          reminders: { useDefault: true },
        };
    
        const createdEvent = await calendar.events.insert({
            calendarId: calendarId,
            requestBody: event,
            sendUpdates: 'none',
        });
    
        if (!createdEvent.data.id || !createdEvent.data.htmlLink) throw new Error("L'esdeveniment no s'ha creat correctament a Google.");
    
        return { id: createdEvent.data.id, htmlLink: createdEvent.data.htmlLink };
    } catch (error) {
        console.error('Google Calendar API error (Lloguer): ', error);
        return null;
    }
}

// ✅ NOVA FUNCIÓ PER ELIMINAR ESDEVENIMENTS
export async function deleteGoogleCalendarEvent(eventId: string): Promise<boolean> {
  try {
    await calendar.events.delete({
      calendarId: calendarId,
      eventId: eventId,
      sendUpdates: 'all', // Notifica als assistents (el client) de la cancel·lació
    });
    console.log(`Esdeveniment ${eventId} eliminat de Google Calendar.`);
    return true;
  } catch (error: any) {
    // Si l'error és un 404 (Not Found) o 410 (Gone), significa que l'esdeveniment ja no existeix.
    // Ho tractem com un èxit per evitar que el procés s'aturi.
    if (error.code === 404 || error.code === 410) {
      console.warn(`L'esdeveniment ${eventId} ja estava eliminat de Google Calendar.`);
      return true;
    }
    console.error(`Error en eliminar l'esdeveniment ${eventId} de Google Calendar:`, error);
    return false;
  }
}
export async function createGoogleCalendarVehicleEvent(data: any, airtableRecordId: string): Promise<{ id: string, htmlLink: string } | null> {
  try {
      const startDate = new Date(data.start_date);
      const endDate = new Date(data.end_date);
      const googleEndDate = addDays(endDate, 1); // Google Calendar exclou l'últim dia en esdeveniments de dia sencer
  
      const event = {
        id: generateEventId(airtableRecordId),
        // ✅ CANVI: Adaptem el resum per a vehicles
        summary: `Lloguer Vehicle: ${data.vehicle_name} - ${data.customer_name}`,
        description: `Client: ${data.customer_name}\nEmail: ${data.customer_email}\nTelèfon: ${data.customer_phone}`,
        start: { date: formatDate(startDate, 'yyyy-MM-dd') },
        end: { date: formatDate(googleEndDate, 'yyyy-MM-dd') },
        attendees: [{ email: data.customer_email, displayName: data.customer_name }],
        reminders: { useDefault: true },
      };
  
      const createdEvent = await calendar.events.insert({
          calendarId: calendarId,
          requestBody: event,
          sendUpdates: 'none',
      });
  
      if (!createdEvent.data.id || !createdEvent.data.htmlLink) throw new Error("L'esdeveniment no s'ha creat correctament a Google.");
  
      return { id: createdEvent.data.id, htmlLink: createdEvent.data.htmlLink };
  } catch (error) {
      console.error('Google Calendar API error (Lloguer Vehicle): ', error);
      return null;
  }
}