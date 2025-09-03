"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import Image from 'next/image';
import * as z from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Wrench, Settings, Phone, ArrowRight, Loader2, Car, BatteryCharging, Wind, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Checkbox } from "@/components/ui/checkbox";

const Taller = () => {
    const { t } = useTranslation();
    const { toast } = useToast();

    // ✅ FINAL FIX: Changed z.literal to z.boolean().refine()
    const appointmentSchema = useMemo(() => z.object({
        name: z.string().min(2, t('validation.nameRequired')),
        email: z.string().email(t('validation.emailInvalid')),
        phone: z.string().min(9, t('validation.phoneInvalid')),
        service: z.string().nonempty(t('validation.serviceRequired')),
        date: z.string().nonempty(t('validation.dateRequired')),
        time: z.string().nonempty(t('validation.timeRequired')),
        message: z.string().optional(),
        privacyPolicy: z.boolean().refine(val => val === true, {
            message: t('validation.privacyRequired'),
        }),
    }), [t]);

    const { control, register, handleSubmit, formState: { errors, isSubmitting, isValid }, reset, watch, setValue } = useForm({
        resolver: zodResolver(appointmentSchema),
        mode: 'onChange',
        defaultValues: { name: "", email: "", phone: "", service: "", date: "", time: "", message: "", privacyPolicy: false }
    });
    
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [selectedService, setSelectedService] = useState<string | null>(null);
    const selectedDate = watch('date');
    const [availableSlots, setAvailableSlots] = useState<string[]>([]);
    const [isLoadingSlots, setIsLoadingSlots] = useState(false);
    
    useEffect(() => {
        if (selectedDate) {
            const day = new Date(selectedDate).getUTCDay();
            if (day === 0 || day === 6) { // Sunday or Saturday
                setAvailableSlots([]);
                return;
            }
            setIsLoadingSlots(true);
            setAvailableSlots([]);
            setValue('time', ''); // Reset selected time
            
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
        try {
            const response = await fetch(`/api/cites/crear`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            const responseData = await response.json();
            if (!response.ok) {
                throw new Error(responseData.error || 'Server response error');
            }
            toast({ title: t('toast.submitSuccessTitle'), description: t('toast.submitSuccessDescription')});
            reset();
            setIsBookingOpen(false);
        } catch (error: any) {
            toast({ title: t('toast.submitErrorTitle'), description: t('toast.submitErrorDescription', { errorMessage: error.message }), variant: "destructive" });
        }
    };

    const services = useMemo(() => [
        { id: 1, icon: Settings, title: t('workshopServices.tires'), description: t('workshopServices.tiresDesc') },
        { id: 2, icon: Shield, title: t('workshopServices.brakes'), description: t('workshopServices.brakesDesc') },
        { id: 3, icon: BatteryCharging, title: t('workshopServices.battery'), description: t('workshopServices.batteryDesc') },
        { id: 4, icon: Car, title: t('workshopServices.suspension'), description: t('workshopServices.suspensionDesc') },
        { id: 5, icon: Wind, title: t('workshopServices.ac'), description: t('workshopServices.acDesc') },
        { id: 6, icon: Wrench, title: t('workshopServices.itv'), description: t('workshopServices.itvDesc') },
    ], [t]);

    return (
        <div className="bg-white">
            <section className="relative py-24 bg-gray-900 text-white">
                <div className="absolute inset-0">
                    <Image 
                        src="https://images.gestionaweb.cat/2611/img-960-412/banner8-1963893.jpg?v=1" 
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

            <section id="services" className="py-20">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">{t('workshopPage.servicesTitle')}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((service) => (
                            <motion.div key={service.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }} className="bg-gray-50 p-8 rounded-lg shadow-md text-center flex flex-col items-center">
                                <div className="bg-red-100 text-red-600 rounded-full p-4 mb-4"><service.icon className="h-8 w-8" /></div>
                                <h3 className="text-2xl font-bold mb-2">{service.title}</h3>
                                <p className="text-gray-600">{service.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section id="appointment-form" className="py-20 bg-gray-100">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">{t('appointment.title')}</h2>
                        <p className="text-xl text-gray-600">{t('appointment.subtitle')}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-12">
                        <motion.div whileHover={{ y: -5 }} onClick={() => handleServiceSelection(t('appointment.service1'))} className="bg-white p-8 rounded-xl shadow-lg cursor-pointer border-2 border-transparent hover:border-red-500 transition-all">
                            <Wrench className="h-10 w-10 text-red-600 mb-4" />
                            <h3 className="text-2xl font-bold mb-2">{t('appointment.service1')}</h3>
                            <p className="text-gray-600 mb-4">{t('appointment.service1Desc')}</p>
                            <span className="font-semibold text-red-600 flex items-center">{t('appointment.bookNow')} <ArrowRight className="ml-2 h-4 w-4" /></span>
                        </motion.div>
                        <motion.div whileHover={{ y: -5 }} onClick={() => handleServiceSelection(t('appointment.service2'))} className="bg-white p-8 rounded-xl shadow-lg cursor-pointer border-2 border-transparent hover:border-red-500 transition-all">
                            <Settings className="h-10 w-10 text-red-600 mb-4" />
                            <h3 className="text-2xl font-bold mb-2">{t('appointment.service2')}</h3>
                            <p className="text-gray-600 mb-4">{t('appointment.service2Desc')}</p>
                            <span className="font-semibold text-red-600 flex items-center">{t('appointment.bookNow')} <ArrowRight className="ml-2 h-4 w-4" /></span>
                        </motion.div>
                    </div>
                    <div className="text-center max-w-3xl mx-auto mt-16 pt-10 border-t">
                        <h3 className="text-2xl font-bold">{t('otherRepairs.title')}</h3>
                        <p className="text-gray-600 mt-2 mb-6">{t('otherRepairs.subtitle')}</p>
                        <Button asChild><Link href="/contacte"><Phone className="mr-2 h-4 w-4"/> {t('otherRepairs.contactNow')}</Link></Button>
                    </div>
                </div>
            </section>

            <Dialog open={isBookingOpen} onOpenChange={(isOpen) => { if (!isOpen) { reset(); } setIsBookingOpen(isOpen); }}>
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl">{t('appointment.bookingFor')} <span className="text-red-600">{selectedService}</span></DialogTitle>
                        <DialogDescription>{t('appointment.fillForm')}</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6"><div><Label htmlFor="name">{t('form.labelName')}</Label><Input id="name" {...register("name")} placeholder={t('form.namePlaceholder')}/>{errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}</div><div><Label htmlFor="email">{t('form.labelEmail')}</Label><Input id="email" type="email" {...register("email")} placeholder={t('form.emailPlaceholder')}/>{errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}</div></div>
                        <div><Label htmlFor="phone">{t('form.labelPhone')}</Label><Input id="phone" {...register("phone")} placeholder={t('form.phonePlaceholder')}/>{errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6"><div><Label htmlFor="date">{t('form.labelDate')}</Label><Input id="date" type="date" {...register("date")} min={new Date().toISOString().split('T')[0]}/>{errors.date && <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>}</div><div><Label htmlFor="time">{t('form.labelTime')}</Label><div className="relative">{isLoadingSlots && <Loader2 className="absolute right-3 top-2.5 h-5 w-5 animate-spin text-gray-400" />}<select {...register("time")} id="time" disabled={!selectedDate || isLoadingSlots || availableSlots.length === 0} className="w-full p-2 border rounded-md bg-white disabled:bg-gray-100 focus:ring-2 focus:ring-red-500"><option value="">{isLoadingSlots ? t('form.loading') : (availableSlots.length > 0 ? t('form.selectTime') : t('form.noSlots'))}</option>{availableSlots.map(slot => <option key={slot} value={slot}>{slot}</option>)}</select></div>{errors.time && <p className="text-red-500 text-sm mt-1">{errors.time.message}</p>}</div></div>
                        <div><Label htmlFor="message">{t('form.labelMessageOptional')}</Label><Textarea id="message" {...register("message")} placeholder={t('form.messagePlaceholder')} /></div>
                        <div className="items-top flex space-x-2">
                            <Controller name="privacyPolicy" control={control} render={({ field }) => (<Checkbox id="privacyPolicy-taller" checked={field.value} onCheckedChange={field.onChange} />)}/>
                            <div className="grid gap-1.5 leading-none">
                                <Label htmlFor="privacyPolicy-taller" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{t('form.privacyAccept')} <a href="/politica-privacitat.html" target="_blank" rel="noopener noreferrer" className="underline text-red-600 hover:text-red-800">{t('form.privacyPolicy')}</a>.</Label>
                                {errors.privacyPolicy && <p className="text-red-500 text-sm mt-1">{errors.privacyPolicy.message}</p>}
                            </div>
                        </div>
                        <Button type="submit" disabled={isSubmitting || !isValid} className="w-full bg-red-600 hover:bg-red-700 py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed">
                            {isSubmitting ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t('form.sending')}</>) : (<>{t('form.submitButton')}</>)}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Taller;