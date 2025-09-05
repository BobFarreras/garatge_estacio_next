"use client";

import React, { useEffect, useMemo } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/components/ui/use-toast';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useSearchParams } from 'next/navigation';
import { Mail, Phone, MapPin, Send, User, MessageSquare, Tag, Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from "@/components/ui/checkbox";
import imatgeFaçana from "@/../public/images/façana.jpeg";
const MapaContacte = dynamic(() => import('@/components/MapaContacte'), { 
    ssr: false,
    loading: () => <div className="flex justify-center items-center h-full bg-gray-200">Loading map...</div> 
});

const Contacte = () => {
    const { t } = useTranslation();
    const { toast } = useToast();
    const searchParams = useSearchParams();
    const vehicleId = searchParams.get('vehicle');
    const vehicleModel = searchParams.get('model');

    // ✅ FINAL FIX: Changed z.literal to z.boolean().refine()
    const contactSchema = useMemo(() => z.object({
        name: z.string().min(2, t('validation.nameRequired')),
        email: z.string().email(t('validation.emailInvalid')),
        phone: z.string().optional(),
        subject: z.string().optional(),
        message: z.string().min(10, t('validation.messageTooShort')),
        privacyPolicy: z.boolean().refine(val => val === true, {
            message: t('validation.privacyRequired'),
        }),
    }), [t]);

    const { control, register, handleSubmit, formState: { errors, isSubmitting, isValid }, reset, setValue } = useForm({
        resolver: zodResolver(contactSchema),
        mode: 'onChange',
        defaultValues: { name: "", email: "", phone: "", subject: "", message: "", privacyPolicy: false }
    });

    useEffect(() => {
        if (vehicleId && vehicleModel) {
            setValue('subject', `Interest in used vehicle: ${vehicleModel} (Ref: ${vehicleId})`);
            setValue('message', `Hello, I am interested in the vehicle ${vehicleModel} with reference ${vehicleId}. I would like to receive more information. Thank you.`);
        }
    }, [vehicleId, vehicleModel, setValue]);

    const onSubmit = async (data: z.infer<typeof contactSchema>) => {
        try {
            const response = await fetch('/api/contacte', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Server error');
            }
            toast({ title: t('contactPage.toastSuccessTitle'), description: t('contactPage.toastSuccessDescription') });
            reset();
        } catch (error: any) {
            toast({ title: t('contactPage.toastErrorTitle'), description: error.message, variant: "destructive" });
        }
    };

    return (
        <div className="bg-white">
            <section className="relative py-24 min-h-[400px] md:min-h-[500px] bg-gray-900 text-white flex items-center justify-center">
                <div className="absolute inset-0 bg-black/60"></div>
                <Image
                    fill
                    priority
                    className="object-cover"
                    alt="Contacte Garatge Estació"
                    src= {imatgeFaçana}
                    sizes="100vw"
                />
            </section>
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                        <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }} viewport={{ once: true }} className="space-y-8">
                            <div>
                                <h2 className="text-3xl font-bold mb-6">{t('contactPage.contactInfo')}</h2>
                                <div className="space-y-4">
                                    <div className="flex items-start"><MapPin className="h-6 w-6 mr-4 text-red-600 mt-1 flex-shrink-0" /><div><p className="font-semibold">{t('contactPage.address')}</p><p className="text-gray-600">Carrer Ramon Serradell, 21<br/>17100 La Bisbal d'Empordà, Girona</p></div></div>
                                    <div className="flex items-start"><Phone className="h-6 w-6 mr-4 text-red-600 mt-1 flex-shrink-0" /><div><p className="font-semibold">{t('contactPage.phone')}</p><a href="tel:+34972640204" className="text-gray-600 hover:text-red-600">972 640 204</a></div></div>
                                    <div className="flex items-start"><Mail className="h-6 w-6 mr-4 text-red-600 mt-1 flex-shrink-0" /><div><p className="font-semibold">{t('contactPage.email')}</p><a href="mailto:info@garatgeestacio.com" className="text-gray-600 hover:text-red-600">info@garatgeestacio.com</a></div></div>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold mb-4">{t('contactPage.schedule')}</h3>
                                <p className="text-gray-600"><strong>{t('contactPage.weekdays')}</strong> 8:00 - 18:00</p>
                                <p className="text-gray-600"><strong>{t('contactPage.saturday')}</strong> {t('contactPage.closed')}</p>
                                <p className="text-gray-600"><strong>{t('contactPage.sunday')}</strong> {t('contactPage.closed')}</p>
                            </div>
                            <div className="h-96 md:h-[500px] rounded-lg overflow-hidden shadow-lg">
                                <MapaContacte />
                            </div>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }} viewport={{ once: true }} className="bg-gray-50 p-8 rounded-xl shadow-lg">
                            <h2 className="text-3xl font-bold mb-6">{t('contactPage.formTitle')}</h2>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                <div><Label htmlFor="name">{t('contactPage.formName')}</Label><div className="relative mt-1"><User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" /><Input id="name" {...register("name")} placeholder={t('contactPage.formNamePlaceholder')} className="pl-10" /></div>{errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}</div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6"><div><Label htmlFor="email">{t('contactPage.formEmail')}</Label><div className="relative mt-1"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" /><Input id="email" {...register("email")} type="email" placeholder={t('contactPage.formEmailPlaceholder')} className="pl-10" /></div>{errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}</div><div><Label htmlFor="phone">{t('contactPage.formPhone')}</Label><div className="relative mt-1"><Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" /><Input id="phone" {...register("phone")} type="tel" placeholder={t('contactPage.formPhonePlaceholder')} className="pl-10" /></div></div></div>
                                <div><Label htmlFor="subject">{t('contactPage.formSubject')}</Label><div className="relative mt-1"><Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" /><Input id="subject" {...register("subject")} placeholder={t('contactPage.formSubjectPlaceholder')} className="pl-10" /></div></div>
                                <div><Label htmlFor="message">{t('contactPage.formMessage')}</Label><div className="relative mt-1"><MessageSquare className="absolute left-3 top-4 h-5 w-5 text-gray-400" /><Textarea id="message" {...register("message")} rows={5} placeholder={t('contactPage.formMessagePlaceholder')} className="pl-10" /></div>{errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}</div>
                                <div className="items-top flex space-x-2">
                                    <Controller name="privacyPolicy" control={control} render={({ field }) => (<Checkbox id="privacyPolicy-contact" checked={field.value} onCheckedChange={field.onChange} />)} />
                                    <div className="grid gap-1.5 leading-none">
                                        <Label htmlFor="privacyPolicy-contact" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                            {t('form.privacyAccept')}{' '}
                                            <Link href="/politica_de_privacitat" target="_blank" rel="noopener noreferrer" className="underline text-red-600 hover:text-red-800">
                                                {t('form.privacyPolicy')}
                                            </Link>
                                            .
                                        </Label>
                                        {errors.privacyPolicy && <p className="text-red-500 text-sm mt-1">{errors.privacyPolicy.message}</p>}
                                    </div>
                                </div>
                                <Button type="submit" disabled={isSubmitting || !isValid} className="w-full bg-red-600 hover:bg-red-700 text-white text-lg py-3 disabled:opacity-50 disabled:cursor-not-allowed">
                                    {isSubmitting ? (<><Loader2 className="mr-2 h-5 w-5 animate-spin" />{t('form.sending')}</>) : (<><Send className="mr-2 h-5 w-5" />{t('contactPage.formSendButton')}</>)}
                                </Button>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contacte;