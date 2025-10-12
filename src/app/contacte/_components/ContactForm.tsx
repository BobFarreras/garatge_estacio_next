"use client";

import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from "sonner";
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mail, Phone, Send, User, MessageSquare, Tag, Loader2 } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from "@/components/ui/checkbox";
import { sendContactEmail, type ContactFormData } from '../actions';

// Aquest component ara gestiona tot el formulari
export const ContactForm = () => {
    const { t } = useTranslation();

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

    type ClientFormData = z.infer<typeof contactSchema>;

    const { control, register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ClientFormData>({
        resolver: zodResolver(contactSchema),
        mode: 'onChange',
        defaultValues: {
            name: "", email: "", phone: "", subject: "", message: "", privacyPolicy: false
        }
    });

    const onSubmit = async (data: ClientFormData) => {
        try {
            const result = await sendContactEmail(data as ContactFormData);
            if (!result.success) {
                throw new Error(result.error || 'Error desconegut del servidor.');
            }
            toast.success(t('contactPage.toastSuccessTitle'), {
                description: t('contactPage.toastSuccessDescription'),
            });
            reset();
        } catch (error: any) {
            toast.error(t('contactPage.toastErrorTitle'), {
                description: error.message,
            });
        }
    };

    return (
        <div className="bg-gray-50 p-8 rounded-xl shadow-lg">
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
                            <Link href="/politica_de_privacitat" target="_blank" rel="noopener noreferrer" className="underline text-red-600 hover:text-red-800">{t('form.privacyPolicy')}</Link>.
                        </Label>
                        {errors.privacyPolicy && <p className="text-red-500 text-sm mt-1">{errors.privacyPolicy.message}</p>}
                    </div>
                </div>
                <Button type="submit" disabled={isSubmitting} className="w-full bg-red-600 hover:bg-red-700 text-white text-lg py-3 disabled:opacity-50 disabled:cursor-not-allowed">
                    {isSubmitting ? (<><Loader2 className="mr-2 h-5 w-5 animate-spin" />{t('form.sending')}</>) : (<><Send className="mr-2 h-5 w-5" />{t('contactPage.formSendButton')}</>)}
                </Button>
            </form>
        </div>
    );
};