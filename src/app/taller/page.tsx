"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import Image, { StaticImageData } from 'next/image';
import * as z from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addDays, format, isBefore } from 'date-fns';

import { Wrench, Settings, Phone, ArrowRight, Loader2, Car, BatteryCharging, Wind, Shield, MessageCircle, Truck, Building, MoreHorizontal, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Checkbox } from "@/components/ui/checkbox";

import bannerTaller from '@/../public/images/banner-taller.avif';

// ✅ Importaciones de las nuevas imágenes para los servicios
import canviPneumatics from "@/../public/images/servies/neumatics.jpeg";
import canviAmortidors from "@/../public/images/servies/canviAmortidors.jpeg";
import canviBateria from "@/../public/images/servies/canviBateria.jpeg";
import canvimanteniment from "@/../public/images/servies/manteniment.jpeg";
import canvipastilelsFre from "@/../public/images/servies/pastillesdefre.jpeg";
import canviProPostITV from "@/../public/images/servies/proPostitv.jpeg";
import vehiclesPesants from "@/../public/images/servies/vehiclesPesants.jpeg"; // Nueva imagen
import reparacioIntegral from "@/../public/images/servies/reparacioIntegral3.jpeg"; // Nueva imagen
import altresServeis from "@/../public/images/servies/altresServeis.jpeg"; // Nueva imagen

// ✅ Definimos un tipo para nuestros objetos de servicio para más seguridad
interface Service {
    id: number;
    title: string;
    description: string;
    image: StaticImageData;
    icon: React.ElementType;
}
// ✅ Constants per a la validació d'arxius
const MAX_FILES = 3;
const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const Taller = () => {
    const { t, i18n } = useTranslation();
    const { toast } = useToast();
    
    const minBookingDate = addDays(new Date(), 3);
    const minBookingDateString = format(minBookingDate, 'yyyy-MM-dd');

    const appointmentSchema = useMemo(() => z.object({
        name: z.string().min(2, t('validation.nameRequired')),
        email: z.string().email(t('validation.emailInvalid')),
        phone: z.string().min(9, t('validation.phoneInvalid')),
        vehicleBrand: z.string().min(2, "La marca es obligatoria."),
        vehicleModel: z.string().min(1, "El modelo es obligatorio."),
        service: z.string().nonempty(t('validation.serviceRequired')),
        date: z.string()
            .nonempty(t('validation.dateRequired'))
            .refine(date => !isBefore(new Date(date), new Date(minBookingDateString)), {
                message: `La reserva debe ser con al menos 3 días de antelación.`,
            }),
        time: z.string().nonempty(t('validation.timeRequired')),
        message: z.string().optional(),
        privacyPolicy: z.boolean().refine(val => val === true, {
            message: t('validation.privacyRequired'),
        }),
        // ✅ Esquema de validació per a múltiples arxius
        attachments: z
            .custom<FileList>()
            .optional()
            .refine((files) => !files || files.length <= MAX_FILES, `No pots pujar més de ${MAX_FILES} arxius.`)
            .refine((files) => !files || Array.from(files).every((file) => file.size <= MAX_FILE_SIZE_BYTES), `Cada arxiu ha de pesar menys de ${MAX_FILE_SIZE_MB}MB.`),
    }), [t, minBookingDateString]);

    const { control, register, handleSubmit, formState: { errors, isSubmitting, isValid }, reset, watch, setValue } = useForm({
        resolver: zodResolver(appointmentSchema),
        mode: 'onChange',
        defaultValues: { name: "", email: "", phone: "", vehicleBrand: "", vehicleModel: "", service: "", date: "", time: "", message: "", privacyPolicy: false }
    });
    
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [selectedService, setSelectedService] = useState<string | null>(null);
    const selectedDate = watch('date');
    const attachmentFiles = watch('attachments');
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    
    const [availableSlots, setAvailableSlots] = useState<string[]>([]);
    const [isLoadingSlots, setIsLoadingSlots] = useState(false);
    
    // Estat per acumular arxius seleccionats
const [files, setFiles] = useState<File[]>([]);

const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const newFiles = event.target.files ? Array.from(event.target.files) : [];
  const updatedFiles = [...files, ...newFiles].slice(0, MAX_FILES); // màxim 3
  setFiles(updatedFiles);
  setValue("attachments", updatedFiles as any, { shouldValidate: true });
};

// Previsualització
useEffect(() => {
  if (files.length > 0) {
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(newPreviews);
    return () => newPreviews.forEach(url => URL.revokeObjectURL(url));
  } else {
    setImagePreviews([]);
  }
}, [files]);

    
    useEffect(() => {
        if (selectedDate) {
            const day = new Date(selectedDate).getUTCDay();
            if (day === 0 || day === 6) {
                setAvailableSlots([]);
                return;
            }
            setIsLoadingSlots(true);
            setAvailableSlots([]);
            setValue('time', '');
            
            const fetchAvailableSlots = async () => {
                try {
                    const response = await fetch(`/api/cites/slots?date=${selectedDate}`);
                    if (!response.ok) throw new Error('Network error');
                    const data = await response.json();
                    setAvailableSlots(data.slots || []);
                } catch (error) {
                    toast({ title: t('toast.loadSlotsErrorTitle'), description: t('toast.loadSlotsErrorDescription'), variant: "destructive"});
                } finally {
                    setIsLoadingSlots(false);
                }
            };
            fetchAvailableSlots();
        }
    }, [selectedDate, toast, t, setValue]);
    
    const handleServiceSelection = (service: string) => {
        setSelectedService(service);
        setValue('service', service, { shouldValidate: true });
        setIsBookingOpen(true);
    };

    const onSubmit = async (data: z.infer<typeof appointmentSchema>) => {
        const formData = new FormData();
        
        // Añadimos todos los campos de texto al FormData
        Object.entries(data).forEach(([key, value]) => {
            if (key !== 'attachment') {
                formData.append(key, value as string);
            }
        });

        // Añadimos el idioma
        formData.append('lang', i18n.language.startsWith('es') ? 'es' : 'ca');
        
        // ✅ Lògica per afegir múltiples arxius
        if (data.attachments) {
        Array.from(data.attachments).forEach((file: File) => {
            formData.append('attachments', file); // La clau ha de ser la mateixa per a tots
        });
    }

        try {
            const response = await fetch(`/api/cites/crear`, {
                method: 'POST',
                body: formData, // No usamos JSON.stringify, enviamos FormData directamente
            });

            const responseData = await response.json();
            if (!response.ok) {
                throw new Error(responseData.error || 'Server response error');
            }
            toast({ title: t('toast.submitSuccessTitle'), description: t('toast.submitSuccessDescription')});
            reset();
            setIsBookingOpen(false);
        } catch (error: any) {
            toast({ title: t('toast.submitErrorTitle'), description: error.message, variant: "destructive" });
        }
    };

    // ✅ Lista de servicios actualizada con los nuevos items y un campo 'icon'
    const services: Service[] = useMemo(() => [
        { id: 1, title: t('workshopServices.tires'), description: t('workshopServices.tiresDesc'), image: canviPneumatics, icon: Car },
        { id: 2, title: t('workshopServices.brakes'), description: t('workshopServices.brakesDesc'), image: canvipastilelsFre, icon: Shield },
        { id: 3, title: t('workshopServices.battery'), description: t('workshopServices.batteryDesc'), image: canviBateria, icon: BatteryCharging },
        { id: 4, title: t('workshopServices.suspension'), description: t('workshopServices.suspensionDesc'), image: canviAmortidors, icon: Wind },
        { id: 5, title: t('workshopServices.ac'), description: t('workshopServices.acDesc'), image: canvimanteniment, icon: Settings },
        { id: 6, title: t('workshopServices.itv'), description: t('workshopServices.itvDesc'), image: canviProPostITV, icon: Wrench },
        { id: 7, title: t('workshopServices.heavy'), description: t('workshopServices.heavyDesc'), image: vehiclesPesants, icon: Truck },
        { id: 8, title: t('workshopServices.integral'), description: t('workshopServices.integralDesc'), image: reparacioIntegral, icon: Building },
        { id: 9, title: t('workshopServices.other'), description: t('workshopServices.otherDesc'), image: altresServeis, icon: MoreHorizontal },
    ], [t]);

    return (
        <div className="bg-white">
            <section className="relative py-24 bg-gray-900 text-white">
                <div className="absolute inset-0">
                    <Image 
                        src={bannerTaller}
                        alt={t('workshopPage.title')}
                        fill
                        priority
                        className="object-cover filter brightness-[0.4]"
                    />
                </div>
                <div className="relative z-10 container mx-auto px-4 text-center">
                    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-5xl md:text-6xl font-bold mb-4 text-shadow-md">{t('workshopPage.title')}</motion.h1>
                    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-lg md:text-xl max-w-3xl mx-auto text-shadow-md">{t('workshopPage.subtitle')}</motion.p>
                </div>
            </section>

            {/* ✅ SECCIÓN DE SERVICIOS MEJORADA */}
            <section id="services" className="py-24 bg-gray-50">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">{t('workshopPage.servicesTitle')}</h2>
                        <p className="max-w-2xl mx-auto text-lg text-gray-600">{t('workshopPage.servicesSubtitle')}</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((service, index) => (
                            <motion.div
                                key={service.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.05 }}
                                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col overflow-hidden cursor-pointer"
                                onClick={() => handleServiceSelection(service.title)}
                            >
                                <div className="relative w-full h-56 overflow-hidden">
                                    <Image
                                        src={service.image}
                                        alt={service.title}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                                    <div className="absolute bottom-4 left-4 flex items-center space-x-3">
                                        
                                    </div>
                                </div>
                                <div className="p-6 flex flex-col flex-grow">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
                                    <p className="text-gray-600 text-sm flex-grow leading-relaxed">{service.description}</p>
                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                        <span className="font-semibold text-red-600 flex items-center group-hover:underline">
                                            {t('appointment.bookNow')} <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20 bg-gray-800 text-white">
                <div className="container mx-auto px-4 text-center">
                    <h3 className="text-3xl font-bold">{t('otherRepairs.title')}</h3>
                    <p className="text-gray-300 mt-4 mb-8 max-w-2xl mx-auto">{t('otherRepairs.subtitle')}</p>
                    <Button asChild size="lg" className="bg-green-500 hover:bg-green-600 rounded-full">
                        <a href="https://wa.me/34626981978" target="_blank" rel="noopener noreferrer">
                            <MessageCircle className="mr-2 h-5 w-5"/> {t('otherRepairs.contactWhatsApp')}
                        </a>
                    </Button>
                </div>
            </section>

            <Dialog
  open={isBookingOpen}
  onOpenChange={(isOpen) => {
    if (!isOpen) {
      reset();
    }
    setIsBookingOpen(isOpen);
  }}
>
  <DialogContent
    className="w-full max-w-lg sm:max-w-2xl max-h-[90vh] overflow-y-auto px-4 py-6 sm:px-8 sm:py-8"
  >
    <DialogHeader>
      <DialogTitle className="text-xl sm:text-2xl">
        {t('appointment.bookingFor')}{' '}
        <span className="text-red-600">{selectedService}</span>
      </DialogTitle>
      <DialogDescription className="text-sm sm:text-base">
        {t('appointment.fillForm')}
      </DialogDescription>
    </DialogHeader>

    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 pt-4"
    >
      {/* Datos de contacto */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">{t('form.labelName')}</Label>
          <Input
            id="name"
            {...register('name')}
            placeholder={t('form.namePlaceholder')}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">
              {errors.name.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="phone">{t('form.labelPhone')}</Label>
          <Input
            id="phone"
            {...register('phone')}
            placeholder={t('form.phonePlaceholder')}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">
              {errors.phone.message}
            </p>
          )}
        </div>
      </div>

      {/* Email */}
      <div>
        <Label htmlFor="email">{t('form.labelEmail')}</Label>
        <Input
          id="email"
          type="email"
          {...register('email')}
          placeholder={t('form.emailPlaceholder')}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Vehicle */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="vehicleBrand">Marca del Vehicle</Label>
          <Input
            id="vehicleBrand"
            {...register('vehicleBrand')}
            placeholder="Ej: BMW"
          />
          {errors.vehicleBrand && (
            <p className="text-red-500 text-sm mt-1">
              {errors.vehicleBrand.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="vehicleModel">Model del Vehicle</Label>
          <Input
            id="vehicleModel"
            {...register('vehicleModel')}
            placeholder="Ej: Serie 3"
          />
          {errors.vehicleModel && (
            <p className="text-red-500 text-sm mt-1">
              {errors.vehicleModel.message}
            </p>
          )}
        </div>
      </div>

      {/* Data i hora */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="date">{t('form.labelDate')}</Label>
          <Input
            id="date"
            type="date"
            {...register('date')}
            min={minBookingDateString}
          />
          {errors.date && (
            <p className="text-red-500 text-sm mt-1">
              {errors.date.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="time">{t('form.labelTime')}</Label>
          <div className="relative">
            {isLoadingSlots && (
              <Loader2 className="absolute right-3 top-2.5 h-5 w-5 animate-spin text-gray-400" />
            )}
            <select
              {...register('time')}
              id="time"
              disabled={
                !selectedDate ||
                isLoadingSlots ||
                availableSlots.length === 0
              }
              className="w-full p-2 border rounded-md bg-white disabled:bg-gray-100 focus:ring-2 focus:ring-red-500"
            >
              <option value="">
                {isLoadingSlots
                  ? t('form.loading')
                  : availableSlots.length > 0
                  ? t('form.selectTime')
                  : t('form.noSlots')}
              </option>
              {availableSlots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>
          {errors.time && (
            <p className="text-red-500 text-sm mt-1">
              {errors.time.message}
            </p>
          )}
        </div>
      </div>

      {/* Missatge */}
      <div>
        <Label htmlFor="message">
          {t('form.labelMessageOptional')}
        </Label>
        <Textarea
          id="message"
          {...register('message')}
          placeholder={t('form.messagePlaceholder')}
        />
      </div>

      <div>
  <Label htmlFor="attachments">Adjuntar Imatges (Opcional, màx. 3)</Label>
  <div className="relative mt-1">
    <Upload className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
    <Input
      id="attachments"
      type="file"
      multiple
      accept="image/png, image/jpeg, image/webp"
      className="pl-10 file:text-sm file:font-medium file:text-red-600 hover:file:text-red-700"
      onChange={handleFileChange} // 👈 usem la funció nova
    />
  </div>
  {errors.attachments && (
    <p className="text-red-500 text-sm mt-1">{errors.attachments.message as string}</p>
  )}

  {imagePreviews.length > 0 && (
    <div className="mt-4 flex flex-wrap gap-4">
      {imagePreviews.map((src, index) => (
        <div key={index} className="relative w-24 h-24 rounded-lg overflow-hidden border">
          <Image src={src} alt={`Previsualització ${index + 1}`} fill className="object-cover" />
          {/* Botó per eliminar un fitxer concret */}
          <button
            type="button"
            className="absolute top-1 right-1 bg-black/60 rounded-full p-1"
            onClick={() => {
              const updated = files.filter((_, i) => i !== index);
              setFiles(updated);
              setValue("attachments", updated as any, { shouldValidate: true });
            }}
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      ))}
    </div>
  )}
</div>


      {/* Política de privacitat */}
      <div className="items-top flex space-x-2 pt-2">
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
        <div className="grid gap-1.5 leading-none">
          <Label
            htmlFor="privacyPolicy-taller"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {t('form.privacyAccept')}{' '}
            <Link
              href="/politica-de-privacitat"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-red-600 hover:text-red-800"
            >
              {t('form.privacyPolicy')}
            </Link>
            .
          </Label>
          {errors.privacyPolicy && (
            <p className="text-red-500 text-sm mt-1">
              {errors.privacyPolicy.message}
            </p>
          )}
        </div>
      </div>

      {/* Botó de submit més amunt (margin bottom extra) */}
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
  </DialogContent>
</Dialog>

        </div>
    );
};

export default Taller;