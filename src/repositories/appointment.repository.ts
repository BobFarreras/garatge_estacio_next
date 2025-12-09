import Airtable, { FieldSet, Record as AirtableRecord } from 'airtable';
import { AIRTABLE_TABLES } from '@/config/taller';

// Comprovació de seguretat inicial
if (!process.env.AIRTABLE_API_KEY || !process.env.AIRTABLE_BASE_ID) {
  throw new Error("❌ Error crític: Falten les variables d'entorn d'Airtable (AIRTABLE_API_KEY o AIRTABLE_BASE_ID).");
}

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);
const table = base(AIRTABLE_TABLES.APPOINTMENTS);

export interface IAppointmentData {
  name: string;
  email: string;
  phone: string;
  vehicleBrand: string;
  vehicleModel: string;
  service: string;
  date: string;
  time: string;
  message?: string;
  cancellationToken: string;
  attachmentUrls?: string[];
}

export class AppointmentRepository {
  /**
   * Cerca una cita per data i hora per evitar duplicats
   */
  static async findByDateTime(date: string, time: string): Promise<AirtableRecord<FieldSet> | null> {
    try {
      // Formula: AND(Date = 'YYYY-MM-DD', Time = 'HH:mm')
      const formula = `AND(DATETIME_FORMAT({Date}, 'YYYY-MM-DD') = '${date}', {Time} = '${time}')`;
      const records = await table.select({
        filterByFormula: formula,
        maxRecords: 1,
      }).firstPage();

      // ✅ SOLUCIÓ ERROR TS(4104): Retornem el primer element o null
      return records.length > 0 ? records[0] : null;
    } catch (error) {
      console.error('🔴 Error Repository [findByDateTime]:', error);
      throw new Error("Error connectant amb la base de dades Airtable.");
    }
  }

  /**
   * Cerca totes les cites d'un dia específic
   */
  static async findByDate(date: string): Promise<AirtableRecord<FieldSet>[]> {
    try {
      const formula = `IS_SAME({Date}, DATETIME_PARSE('${date}', 'YYYY-MM-DD'), 'day')`;
      const records = await table.select({
        filterByFormula: formula,
      }).all();
      
      // ✅ SOLUCIÓ ERROR TS(4104): Convertim ReadonlyArray a Array mutable
      return [...records]; 
    } catch (error) {
      console.error('🔴 Error Repository [findByDate]:', error);
      throw new Error("Error obtenint les cites del dia.");
    }
  }

  /**
   * Crea una nova cita
   */
  static async create(data: IAppointmentData): Promise<string> {
    try {
      // Mapegem els adjunts al format que espera Airtable
      const airtableAttachments = data.attachmentUrls?.map(url => ({ url })) || undefined;

      const [createdRecord] = await table.create([{
        fields: {
          'Name': data.name,
          'Email': data.email,
          'Phone': data.phone,
          'VehicleBrand': data.vehicleBrand,
          'Matricula': data.vehicleModel, // Mantingut igual que al teu codi original
          'Date': data.date,
          'Time': data.time,
          'Service': data.service,
          'Message': data.message,
          'Status': 'Pendent',
          'CancellationToken': data.cancellationToken,
          'Attachments': airtableAttachments,
        } as FieldSet
      }]);

      return createdRecord.id;
    } catch (error) {
      console.error('🔴 Error Repository [create]:', error);
      throw new Error("No s'ha pogut guardar la cita a la base de dades.");
    }
  }

  /**
   * Actualitza una cita (ex: per afegir el Google Event ID)
   */
  static async updateGoogleEvent(recordId: string, eventId: string, eventLink: string): Promise<void> {
    try {
      await table.update([{
        id: recordId,
        fields: {
          GoogleEventId: eventId,
          GoogleEventLink: eventLink
        }
      }]);
    } catch (error) {
      console.error('🔴 Error Repository [updateGoogleEvent]:', error);
      // No llencem error aquí per no trencar el flux principal si falla l'update secundari
    }
  }

  /**
   * Cerca per Token de cancel·lació
   */
  static async findByToken(token: string): Promise<AirtableRecord<FieldSet> | null> {
    try {
      const records = await table.select({
        filterByFormula: `{CancellationToken} = '${token}'`,
        maxRecords: 1,
      }).firstPage();
      
      return records.length > 0 ? records[0] : null;
    } catch (error) {
      console.error('🔴 Error Repository [findByToken]:', error);
      throw new Error("Error verificant el token.");
    }
  }

  /**
   * Elimina una cita
   */
  static async delete(recordId: string): Promise<void> {
    try {
      await table.destroy([recordId]);
    } catch (error) {
      console.error('🔴 Error Repository [delete]:', error);
      throw new Error("No s'ha pogut eliminar la cita.");
    }
  }
}