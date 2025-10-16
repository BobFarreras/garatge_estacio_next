// src/app/taller/_components/AppointmentFormUI.tsx (VERSIÓ CORREGIDA DE DISSENY)

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { UseFormReturn, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Loader2, Upload, X } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from '@/components/ui/button';

import { AppointmentSchemaType, ACCEPTED_IMAGE_TYPES } from '@/lib/utils/appointmentValidation';
// Assumint que aquesta configuració existeix
// import { APPOINTMENT_CONFIG } from '@/config/taller'; 

// -------------------------------------------------------------
// Tipus de propietats del component (mantingut)
// -------------------------------------------------------------
interface AppointmentFormUIProps {
  form: UseFormReturn<AppointmentSchemaType>;
  availableSlots: string[];
  isLoadingSlots: boolean;
  minBookingDateString: string;
  imagePreviews: string[];
  removeFile: (index: number) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isSubmitting: boolean;
  selectedDate: string;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
}

// ✅ Constant per a l'atribut accept
const ACCEPT_ATTRIBUTE = ACCEPTED_IMAGE_TYPES.join(',');

// -------------------------------------------------------------
// Component principal
// -------------------------------------------------------------
export default function AppointmentFormUI({
  form,
  availableSlots,
  isLoadingSlots,
  minBookingDateString,
  imagePreviews,
  removeFile,
  handleFileChange,
  isSubmitting,
  selectedDate,
  onSubmit,
  
}: AppointmentFormUIProps) {

  const { t } = useTranslation();

  // Extraiem mètodes del formulari
  const {
    register,
    control,
    formState: { errors },
  } = form;

  const attachmentError = errors.attachments?.message;
  const maxFiles = 3;
  const acceptedFormatsDisplay = ACCEPTED_IMAGE_TYPES.map(t => t.split('/')[1]).join(', ');

  // -----------------------------------------------------------
  // Renderitzat
  // -----------------------------------------------------------
  return (
    // ✅ Augmentem l'espaiat general per separar millor els blocs
    <form onSubmit={onSubmit} className="space-y-6 pt-4">

      {/* -------------------------------------------------------
         🧍 Camps de contacte
      ------------------------------------------------------- */}
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

      {/* -------------------------------------------------------
         ✉️ Correu electrònic
      ------------------------------------------------------- */}
      <div className="space-y-1">
        <Label htmlFor="email">{t('form.labelEmail')}</Label>
        <Input id="email" type="email" {...register('email')} placeholder={t('form.emailPlaceholder')} />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
      </div>

      {/* -------------------------------------------------------
         🚗 Dades del vehicle
      ------------------------------------------------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Marca */}
        <div className="space-y-1">
          <Label htmlFor="vehicleBrand">{t('form.labelVehicleBrand')}</Label>
          <Input id="vehicleBrand" {...register('vehicleBrand')} placeholder={t('form.brandPlaceholder')} />
          {errors.vehicleBrand && <p className="text-red-500 text-sm mt-1">{errors.vehicleBrand.message}</p>}
        </div>

        {/* Model/Matrícula */}
        <div className="space-y-1">
          <Label htmlFor="vehicleModel">{t('form.labelVehiclePlate')}</Label>
          <Input
            id="vehicleModel"
            {...register('vehicleModel')}
            placeholder={t('form.platePlaceholder')}
            onChange={(e) => {
              e.target.value = e.target.value.toUpperCase();
              register('vehicleModel').onChange(e);
            }}
            maxLength={7}
          />
          {errors.vehicleModel && <p className="text-red-500 text-sm mt-1">{errors.vehicleModel.message}</p>}
        </div>
      </div>

      {/* -------------------------------------------------------
         📅 Data i hora
      ------------------------------------------------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Data */}
        <div className="space-y-1">
          <Label htmlFor="date">{t('form.labelDate')}</Label>
          <Input id="date" type="date" {...register('date')} min={minBookingDateString} />
          {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>}
        </div>

        {/* Hora */}
        <div className="space-y-1">
          <Label htmlFor="time">{t('form.labelTime')}</Label>
          <div className="relative">
            {isLoadingSlots && (
              <Loader2 className="absolute right-3 top-2.5 h-5 w-5 animate-spin text-gray-400" />
            )}
            <select
              {...register('time')}
              id="time"
              disabled={!selectedDate || isLoadingSlots || availableSlots.length === 0}
              // ✅ Estil ajustat per tenir una aparença consistent amb Input (alçada i padding)
              className="w-full h-10 p-2 border rounded-md bg-white disabled:bg-gray-100 focus:ring-2 focus:ring-red-500 appearance-none"
            >
              <option value="">
                {isLoadingSlots
                  ? t('form.loading')
                  : availableSlots.length > 0
                    ? t('form.selectTime')
                    : t('validation.noWeekend')}
              </option>
              {availableSlots.map((slot: string) => (
                <option key={slot} value={slot}>{slot}</option>
              ))}
            </select>
          </div>
          {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time.message}</p>}
        </div>
      </div>

      {/* -------------------------------------------------------
         💬 Missatge
      ------------------------------------------------------- */}
      <div className="space-y-1">
        <Label htmlFor="message">{t('form.labelMessageOptional')}</Label>
        <Textarea id="message" {...register('message')} placeholder={t('form.messagePlaceholder')} />
        {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
      </div>

      {/* -------------------------------------------------------
         📎 Adjunts d’imatge
      ------------------------------------------------------- */}
      <div className="space-y-1">
        <Label htmlFor="attachments">
          Adjuntar Imatges (Opcional, màx. {maxFiles})
        </Label>
        <p className="text-xs text-gray-500 mt-1 mb-2">
          Formats acceptats: {acceptedFormatsDisplay}
        </p>

        <div className="relative mt-1">
          <Upload className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <input
            id="attachments"
            name="attachments"
            type="file"
            multiple
            accept={ACCEPT_ATTRIBUTE}
            className="w-full pl-10 p-2 border rounded-md bg-white disabled:bg-gray-100 focus:ring-2 focus:ring-red-500 file:text-sm file:font-medium file:text-red-600 hover:file:text-red-700"
            onChange={handleFileChange}
          />
        </div>

        {attachmentError && <p className="text-red-500 text-sm mt-1">{attachmentError}</p>}

        {imagePreviews.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-4">
            {imagePreviews.map((src, index) => (
              <div key={src} className="relative w-24 h-24 rounded-lg overflow-hidden border">
                <Image src={src} alt={`Previsualització ${index + 1}`} fill className="object-cover" />
                <button
                  type="button"
                  className="absolute top-1 right-1 bg-black/60 rounded-full p-1"
                  onClick={() => removeFile(index)}
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* -------------------------------------------------------
         🔒 Política de privacitat
      ------------------------------------------------------- */}
      <div className="items-top flex space-x-2 pt-2">
        <div className="grid gap-1.5 leading-none">
          <Controller
            name="privacyPolicy"
            control={control}
            render={({ field }) => (
              <Checkbox
                id="privacyPolicy-taller"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
          <Label htmlFor="privacyPolicy-taller" className="text-sm font-medium leading-none">
            {t('form.privacyAccept')}{' '}
            <Link
              href="/politica_de_privacitat"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-red-600 hover:text-red-800"
            >
              {t('form.privacyPolicy')}
            </Link>.
          </Label>
          {errors.privacyPolicy && (
            <p className="text-red-500 text-sm mt-1">{errors.privacyPolicy.message}</p>
          )}
        </div>
      </div>

      {/* Camp ocult */}
      <input type="hidden" {...register('service')} />

      {/* -------------------------------------------------------
         🚀 Botó d’enviament
      ------------------------------------------------------- */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-red-600 hover:bg-red-700 py-3 text-lg mb-6"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {t('form.sending')}
          </>
        ) : (
          <>{t('form.submitButton')}</>
        )}
      </Button>
    </form>
  );
}