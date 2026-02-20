import { AppointmentRepository, IAppointmentData } from '@/repositories/appointment.repository';
import { createGoogleCalendarEvent, deleteGoogleCalendarEvent } from '@/lib/google-calendar';
import { sendWorkshopAppointmentEmails, sendCancellationNotificationEmail, sendErrorNotificationEmail } from '@/lib/email';
import { APPOINTMENT_CONFIG } from '@/config/taller';
import { addDays, isBefore, startOfDay } from 'date-fns';
import crypto from 'crypto';
import { v2 as cloudinary } from 'cloudinary';

// Configuració de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Importem la carpeta des de config per no tenir strings màgics
import { CLOUDINARY_FOLDERS } from '@/config/taller';

export class AppointmentService {
  
  /**
   * Puja arxius a Cloudinary (Replica exacta de la teva funció uploadToCloudinary)
   */
  private static async uploadAttachments(files: File[], identifier: string): Promise<string[]> {
    if (!files || files.length === 0) return [];

    const uploadPromises = files.map(async (file) => {
      const fileBuffer = await file.arrayBuffer();
      const base64Data = Buffer.from(fileBuffer).toString('base64');
      const fileUri = `data:${file.type};base64,${base64Data}`;
      
      const result = await cloudinary.uploader.upload(fileUri, {
        folder: CLOUDINARY_FOLDERS.WORKSHOP_APPOINTMENTS,
        public_id: `cita_${identifier.replace(/\s+/g, '_')}_${Date.now()}`,
      });
      return result.secure_url;
    });

    return Promise.all(uploadPromises);
  }

  /**
   * Lògica principal de creació de cita
   */
  static async createAppointment(formData: any, attachments: File[], isBypassMode: boolean) {
    const { name, email, phone, vehicleBrand, vehicleModel, service, date, time, message, lang } = formData;

    // 1. Validació de Lògica de Negoci (Dates)
    // IMPORTANT: Afegim l'hora per evitar problemes de fus horari, com tenies al teu codi original.
    const selectedDate = new Date(date + 'T12:00:00Z');
    
    if (!isBypassMode) {
      const minBookingDate = startOfDay(addDays(new Date(), APPOINTMENT_CONFIG.MIN_BOOKING_DAYS_AHEAD));
      
      if (isBefore(selectedDate, minBookingDate)) {
        return { success: false, error: `La reserva ha de ser amb almenys ${APPOINTMENT_CONFIG.MIN_BOOKING_DAYS_AHEAD} dies d'antelació.` };
      }
    }

    const dayOfWeek = selectedDate.getUTCDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return { success: false, error: 'No es poden reservar cites en cap de setmana.' };
    }

    // 2. Comprovar disponibilitat (via Repositori)
    const existing = await AppointmentRepository.findByDateTime(date, time);
    if (existing) {
      return { success: false, error: `L'hora seleccionada (${time}) ja no està disponible.` };
    }

    let airtableRecordId: string | null = null;

    try {
      // 3. Pujar imatges
      const attachmentUrls = await this.uploadAttachments(attachments, name);

      // 4. Generar Token
      const cancellationToken = crypto.randomBytes(32).toString('hex');

      // 5. Crear Registre a la BD
      const appointmentData: IAppointmentData = {
        name, email, phone, vehicleBrand, vehicleModel, service, date, time, message, cancellationToken, attachmentUrls
      };

      airtableRecordId = await AppointmentRepository.create(appointmentData);

      // 6. Integracions Externes (Google Calendar & Email)
      const fullData = { ...appointmentData, lang };
      
      const gcalEvent = await createGoogleCalendarEvent(fullData, airtableRecordId);

      if (gcalEvent) {
        await AppointmentRepository.updateGoogleEvent(airtableRecordId, gcalEvent.id!, gcalEvent.htmlLink!);
      }

      await sendWorkshopAppointmentEmails(fullData);

      return { success: true, message: "Cita creada correctament! Rebràs un email de confirmació." };

    } catch (error: any) {
      console.error("🔴 Error al Servei de Creació:", error);
      
      // Rollback manual si falla després de crear a Airtable
      if (airtableRecordId) {
        console.warn(`🟠 ROLLBACK: Esborrant el registre ${airtableRecordId}`);
        await AppointmentRepository.delete(airtableRecordId);
      }
      
      // Notificar al desenvolupador
      await sendErrorNotificationEmail(error);
      
      throw error; // Propaguem l'error perquè el Server Action el gestioni
    }
  }

  /**
   * Obté els slots disponibles per a un dia (Replica la lògica del teu antic route.ts)
   */
  static async getAvailableSlots(date: string): Promise<string[]> {
    // Validació bàsica de format
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return [];

    const selectedDate = new Date(date + 'T12:00:00Z');
    const dayOfWeek = selectedDate.getUTCDay();

    // Cap de setmana tancat
    if (dayOfWeek === 0 || dayOfWeek === 6) return [];

    const allSlots = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00','14:00','15:00'];
    
    // Obtenim cites del repositori
    const records = await AppointmentRepository.findByDate(date);
    
    // Extreiem les hores ocupades
    const bookedSlots = records.map((record) => record.fields.Time as string).filter(Boolean);
    
    return allSlots.filter(slot => !bookedSlots.includes(slot));
  }

  /**
   * Cancel·la una cita
   */
  static async cancelAppointment(token: string) {
    const record = await AppointmentRepository.findByToken(token);
    
    if (!record) {
      return { success: false, error: 'Cita no trobada o ja cancel·lada.' };
    }

    try {
      const googleEventId = record.get('GoogleEventId') as string | undefined;
      
      if (googleEventId) {
        await deleteGoogleCalendarEvent(googleEventId);
      }

      // Enviem email abans d'esborrar per tenir les dades
      await sendCancellationNotificationEmail(record.fields);
      
      await AppointmentRepository.delete(record.id);

      return { success: true, message: 'La teva cita ha estat cancel·lada correctament.' };
    } catch (error) {
      console.error("Error al servei de cancel·lació:", error);
      throw new Error("Error intern en cancel·lar la cita.");
    }
  }
}