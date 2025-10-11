"use client";

import React, { useEffect, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { addDays, format, isBefore, startOfDay } from 'date-fns';
import Link from 'next/link';
import Image from 'next/image';
import { useActionState } from 'react';
import { Loader2, Upload, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner"; // ✅ CANVI: Importem 'toast' des de 'sonner'

import { useAvailableSlots } from '../_hooks/useAvailableSlots';
import { useFileUpload } from '../_hooks/useFileUpload';
import { createAppointmentAction } from '../actions';
import { APPOINTMENT_CONFIG } from '@/config/taller';
import type { FormState } from '@/types/actions';
import { Button } from '@/components/ui/button';

interface AppointmentFormProps {
  selectedService: string | null;
  onFormSubmit: () => void;
}

export default function AppointmentForm({ selectedService, onFormSubmit }: AppointmentFormProps) {
  const { t, i18n } = useTranslation();

  const initialState: FormState = { success: false, error: null, errors: null };
  const [state, formAction] = useActionState(createAppointmentAction, initialState);

  // ✅ CORRECCIÓ CLAU: Fem servir la constant del fitxer de configuració.
  const minBookingDate = addDays(new Date(), APPOINTMENT_CONFIG.MIN_BOOKING_DAYS_AHEAD);
  const minBookingDateString = format(minBookingDate, 'yyyy-MM-dd');

  const appointmentSchema = useMemo(() => z.object({
    name: z.string().min(2, t('validation.nameRequired')),
    email: z.string().email(t('validation.emailInvalid')),
    phone: z.string().min(9, t('validation.phoneInvalid')),
    vehicleBrand: z.string().min(2, "La marca és obligatòria."),
    vehicleModel: z.string().min(1, "El model és obligatori."),
    service: z.string().nonempty(t('validation.serviceRequired')),
    date: z.string()
      .nonempty(t('validation.dateRequired'))
      .refine(date => !isBefore(new Date(date), startOfDay(minBookingDate)), {
        message: `La reserva ha de ser amb almenys ${APPOINTMENT_CONFIG.MIN_BOOKING_DAYS_AHEAD} dies d'antelació.`,
      })
      // ✅ AFEGIM AQUESTA LÍNIA
      .refine(date => {
        const day = new Date(date).getUTCDay(); // Diumenge = 0, Dissabte = 6
        return day !== 0 && day !== 6;
      }, {
        message: "No es poden reservar cites en cap de setmana.",
      }),
    time: z.string().nonempty(t('validation.timeRequired')),
    message: z.string().optional(),
    privacyPolicy: z.boolean().refine(val => val === true, {
      message: t('validation.privacyRequired'),
    }),
  }), [t, minBookingDate]);

  // ✅ Recuperem 'handleSubmit' i l'estat 'isSubmitting' de useForm
  const { control, register, handleSubmit, formState: { errors, isSubmitting }, watch, setValue, reset } = useForm({
    resolver: zodResolver(appointmentSchema),
    mode: 'onChange',
  });

  const privacyPolicyValue = watch('privacyPolicy');

  const selectedDate = watch('date');
  const { availableSlots, isLoadingSlots } = useAvailableSlots(selectedDate);
  const { files, imagePreviews, handleFileChange, removeFile } = useFileUpload();

  // ✅ Nova funció 'onSubmit' que fa de pont i crida la Server Action
  const onSubmit = async (data: z.infer<typeof appointmentSchema>) => {
    // 🔵 1. LOG AL CLIENT: Just abans de cridar l'acció
    console.log("🔵 CLIENT: Dades validades per react-hook-form que s'enviaran:", data);

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'privacyPolicy') {
        // Si 'privacyPolicy' és true, afegim 'on', si no, no afegim res.
        if (value === true) {
          formData.append(key, 'on');
        }
      } else if (key !== 'attachments' && value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });
    formData.append('lang', i18n.language.startsWith('es') ? 'es' : 'ca');
    files.forEach(file => {
      formData.append('attachments', file);
    });

    // Cridem a la Server Action
    const initialState: FormState = { success: false, error: null, errors: null };
    const result = await createAppointmentAction(initialState, formData);
    // 🔵 2. LOG AL CLIENT: Just després de rebre la resposta del servidor
    console.log("🔵 CLIENT: Resposta rebuda del servidor:", result);

    if (result.success) {
      toast.success(t('toast.submitSuccessTitle'), {
        description: result.message,
      });
      reset();
      onFormSubmit();
    } else {
      toast.error(t('toast.submitErrorTitle'), {
        description: result.error,
      });
    }
  };

  // Els teus altres useEffects per omplir camps es mantenen igual
  useEffect(() => {
    if (selectedService) setValue('service', selectedService, { shouldValidate: true });
  }, [selectedService, setValue]);

  useEffect(() => {
    setValue('time', '');
  }, [selectedDate, setValue]);


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">{t('form.labelName')}</Label>
          <Input id="name" {...register('name')} placeholder={t('form.namePlaceholder')} />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <Label htmlFor="phone">{t('form.labelPhone')}</Label>
          <Input id="phone" {...register('phone')} placeholder={t('form.phonePlaceholder')} />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
        </div>
      </div>

      <div>
        <Label htmlFor="email">{t('form.labelEmail')}</Label>
        <Input id="email" type="email" {...register('email')} placeholder={t('form.emailPlaceholder')} />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="vehicleBrand">Marca del Vehicle</Label>
          <Input id="vehicleBrand" {...register('vehicleBrand')} placeholder="Ej: BMW" />
          {errors.vehicleBrand && <p className="text-red-500 text-sm mt-1">{errors.vehicleBrand.message}</p>}
        </div>
        <div>
          <Label htmlFor="vehicleModel">Model del Vehicle</Label>
          <Input id="vehicleModel" {...register('vehicleModel')} placeholder="Ej: Serie 3" />
          {errors.vehicleModel && <p className="text-red-500 text-sm mt-1">{errors.vehicleModel.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="date">{t('form.labelDate')}</Label>
          {/* Aquesta variable 'minBookingDateString' ara es calcula amb el valor correcte */}
          <Input id="date" type="date" {...register('date')} min={minBookingDateString} />
          {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>}
        </div>
        <div>
          <Label htmlFor="time">{t('form.labelTime')}</Label>
          <div className="relative">
            {isLoadingSlots && <Loader2 className="absolute right-3 top-2.5 h-5 w-5 animate-spin text-gray-400" />}
            <select
              {...register('time')}
              id="time"
              disabled={!selectedDate || isLoadingSlots || availableSlots.length === 0}
              className="w-full p-2 border rounded-md bg-white disabled:bg-gray-100 focus:ring-2 focus:ring-red-500"
            >
              <option value="">
                {isLoadingSlots ? t('form.loading') : availableSlots.length > 0 ? t('form.selectTime') : t('form.noSlots')}
              </option>
              {availableSlots.map((slot) => (<option key={slot} value={slot}>{slot}</option>))}
            </select>
          </div>
          {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time.message}</p>}
        </div>
      </div>

      <div>
        <Label htmlFor="message">{t('form.labelMessageOptional')}</Label>
        <Textarea id="message" {...register('message')} placeholder={t('form.messagePlaceholder')} />
      </div>

      <div>
        <Label htmlFor="attachments">Adjuntar Imatges (Opcional, màx. {APPOINTMENT_CONFIG.MAX_FILES})</Label>
        <div className="relative mt-1">
          <Upload className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <Input
            id="attachments"
            name="attachments"
            type="file"
            multiple
            accept="image/png, image/jpeg, image/webp"
            className="pl-10 file:text-sm file:font-medium file:text-red-600 hover:file:text-red-700"
            onChange={handleFileChange}
          />
        </div>
        {imagePreviews.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-4">
            {imagePreviews.map((src, index) => (
              <div key={src} className="relative w-24 h-24 rounded-lg overflow-hidden border">
                <Image src={src} alt={`Previsualització ${index + 1}`} fill className="object-cover" />
                <button type="button" className="absolute top-1 right-1 bg-black/60 rounded-full p-1" onClick={() => removeFile(index)}>
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="items-top flex space-x-2 pt-2">
        <Controller
          name="privacyPolicy"
          control={control}
          render={({ field }) => (
            <Checkbox id="privacyPolicy-taller" checked={field.value} onCheckedChange={field.onChange} />
          )}
        />
        <div className="grid gap-1.5 leading-none">
          <Label htmlFor="privacyPolicy-taller" className="text-sm font-medium leading-none">
            {t('form.privacyAccept')}{' '}
            <Link href="/politica-de-privacitat" target="_blank" rel="noopener noreferrer" className="underline text-red-600 hover:text-red-800">
              {t('form.privacyPolicy')}
            </Link>.
          </Label>
          {errors.privacyPolicy && <p className="text-red-500 text-sm mt-1">{errors.privacyPolicy.message}</p>}
        </div>
      </div>
     
      <input type="hidden" {...register('service')} />
      <input type="hidden" name="lang" value={i18n.language.startsWith('es') ? 'es' : 'ca'} />
      {/* No necessitem camps ocults per a 'service' i 'lang' perquè els afegim manualment
          al FormData dins de la funció 'onSubmit' */}

      {/* ✅ El botó ara fa servir l'estat 'isSubmitting' de react-hook-form */}
      <Button type="submit" disabled={isSubmitting} className="w-full bg-red-600 hover:bg-red-700 py-3 text-lg mb-6">
        {isSubmitting ? (
          <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t('form.sending')}</>
        ) : (
          <>{t('form.submitButton')}</>
        )}
      </Button>
    </form>
  );
}