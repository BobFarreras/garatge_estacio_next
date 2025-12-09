"use server";

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { AppointmentService } from '@/services/AppointmentService';
import type { FormState } from '@/types/actions';

// Esquema de validació idèntic al teu original
const appointmentActionSchema = z.object({
    name: z.string().min(2, "El nom és obligatori."),
    email: z.string().email("L'email no és vàlid."),
    phone: z.string().min(9, "El telèfon no és vàlid."),
    vehicleBrand: z.string().min(2, "La marca és obligatòria."),
    vehicleModel: z.string().min(1, "El model és obligatori."),
    service: z.string().nonempty("El servei és obligatori."),
    date: z.string().nonempty("La data és obligatòria."),
    time: z.string().nonempty("L'hora és obligatòria."),
    message: z.string().optional(),
    lang: z.enum(['ca', 'es']),
    privacyPolicy: z.boolean().refine(val => val === true, {
       message: "Has d'acceptar la política de privacitat.",
    }),
});

// -------------------------------------------------------------
// ✅ ACCIÓ 1: CREAR CITA
// -------------------------------------------------------------
export async function createAppointmentAction(prevState: FormState, formData: FormData): Promise<FormState> {
    console.log("\n--- 🟢 INICI ACTION: CREATE APPOINTMENT (Secure) ---");

    const isBypassMode = formData.get('isBypassMode') === 'true';

    const objectToValidate = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        vehicleBrand: formData.get('vehicleBrand'),
        vehicleModel: formData.get('vehicleModel'),
        service: formData.get('service'),
        date: formData.get('date'),
        time: formData.get('time'),
        message: formData.get('message'),
        lang: formData.get('lang'),
        privacyPolicy: formData.get('privacyPolicy') === 'on',
    };

    // 1. Validació Zod
    const validation = appointmentActionSchema.safeParse(objectToValidate);
    if (!validation.success) {
        console.error("🔴 Validation Error:", validation.error.flatten().fieldErrors);
        return {
            success: false,
            error: "Si us plau, revisa els errors del formulari.",
            errors: validation.error.flatten().fieldErrors,
        };
    }

    try {
        // 2. Extracció d'arxius
        const attachments = formData.getAll('attachments').filter((v): v is File => v instanceof File && v.size > 0);

        // 3. Delegació al Servei
        const result = await AppointmentService.createAppointment(validation.data, attachments, isBypassMode);

        if (result.success) {
            revalidatePath('/taller');
            return { success: true, message: result.message };
        } else {
            return { success: false, error: result.error };
        }

    } catch (error) {
        console.error('🔴 CRITICAL SERVER ERROR:', error);
        return { success: false, error: "S'ha produït un error inesperat. Si us plau, intenta-ho més tard." };
    }
}

// -------------------------------------------------------------
// ✅ ACCIÓ 2: CANCEL·LAR CITA
// -------------------------------------------------------------
export async function cancelAppointmentAction(token: string): Promise<FormState> {
    if (!token) return { success: false, error: 'Token no vàlid.' };

    try {
        const result = await AppointmentService.cancelAppointment(token);
        
        if (result.success) {
            revalidatePath('/admin/cites'); // Per si de cas tens panell d'admin
            return { success: true, message: result.message };
        } else {
             return { success: false, error: result.error };
        }
    } catch (error) {
        console.error('🔴 Cancel Error:', error);
        return { success: false, error: "S'ha produït un error intern en cancel·lar la cita." };
    }
}