"use server";

import Airtable from 'airtable';
import { z } from 'zod';
import { createGoogleCalendarVehicleEvent } from '@/lib/google-calendar';
import { sendVehicleBookingEmails } from '@/lib/email';
import type { FormState } from '@/types/actions';

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID!);

const vehicleBookingSchema = z.object({
    customer_name: z.string().min(1),
    customer_email: z.string().email(),
    customer_phone: z.string().min(9),
    start_date: z.string(),
    end_date: z.string(),
    vehicle_name: z.string(),
    vehicle_id: z.string(),
    privacyPolicy: z.literal(true), // Validació estricta al servidor
    lang: z.enum(['ca', 'es']),
});

export type VehicleBookingFormData = z.infer<typeof vehicleBookingSchema>;

export async function createVehicleBookingAction(data: VehicleBookingFormData): Promise<FormState> {
    const validation = vehicleBookingSchema.safeParse(data);
    if (!validation.success) {
        return { success: false, error: "Dades del formulari invàlides." };
    }

    const { customer_name, customer_email, start_date, end_date, vehicle_name, vehicle_id } = validation.data;
    
    try {
        const newStartDate = new Date(start_date);
        const newEndDate = new Date(end_date);
        const existingBookings = await base('ReservesVehicles').select({
            filterByFormula: `AND({Vehicle} = '${vehicle_name}', OR({status} = 'Confirmada', {status} = 'Pendent'))`,
        }).all();

        const isOverlapping = existingBookings.some(record => {
            const existingStart = new Date(record.fields.start_date as string);
            const existingEnd = new Date(record.fields.end_date as string);
            return newStartDate <= existingEnd && newEndDate >= existingStart;
        });

        if (isOverlapping) {
            return { success: false, error: "Aquestes dates ja no estan disponibles per a aquest vehicle." };
        }

        const createdRecords = await base('ReservesVehicles').create([{
            fields: {
                'customer_name': customer_name,
                'customer_email': customer_email,
                'customer_phone': validation.data.customer_phone,
                'start_date': start_date,
                'end_date': end_date,
                'status': 'Pendent',
                'Vehicle': [vehicle_id],
                'data_reserva': new Date().toISOString(),
            }
        }]);
        const airtableRecordId = createdRecords[0].getId();

        const gcalEvent = await createGoogleCalendarVehicleEvent(validation.data, airtableRecordId);
        if (gcalEvent) {
            await base('ReservesVehicles').update([{
                id: airtableRecordId,
                fields: {
                    'GoogleEventId': gcalEvent.id ?? undefined,
                    'GoogleEventLink': gcalEvent.htmlLink ?? undefined,
                }
            }]);
        }

        await sendVehicleBookingEmails(validation.data);

        return { success: true, message: `La teva sol·licitud per al ${vehicle_name} ha estat enviada.` };

    } catch (error) {
        console.error("Error en crear la reserva:", error);
        return { success: false, error: "No s'ha pogut processar la sol·licitud." };
    }
}