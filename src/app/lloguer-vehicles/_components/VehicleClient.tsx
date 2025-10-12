"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Calendar, Users, GitCommitVertical, Fuel, Loader2, Car, Info, Clock, User, Mail, Phone } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { differenceInDays, format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';

import type { Vehicle, Pricing } from '@/types/vehicle';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from "@/components/ui/checkbox";
import { createVehicleBookingAction, type VehicleBookingFormData } from '../actions';

interface VehicleClientProps {
  initialVehicles: Vehicle[];
}

export default function VehicleClient({ initialVehicles }: VehicleClientProps) {
    const { t, i18n } = useTranslation();

    const bookingSchema = useMemo(() => z.object({
        customer_name: z.string().min(2, t('validation.nameRequired')),
        customer_email: z.string().email(t('validation.emailInvalid')),
        customer_phone: z.string().min(9, t('validation.phoneInvalid')),
        start_date: z.string(),
        end_date: z.string(),
        privacyPolicy: z.boolean().refine(val => val === true, { message: t('validation.privacyRequired') }),
    }), [t]);
    
    type ClientFormData = z.infer<typeof bookingSchema>;

    const [vehicles] = useState<Vehicle[]>(initialVehicles);
    const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const today = format(new Date(), 'yyyy-MM-dd');
    const [startDate, setStartDate] = useState(today);
    const [endDate, setEndDate] = useState(format(new Date(new Date().setDate(new Date().getDate() + 1)), 'yyyy-MM-dd'));
    
    const { register, handleSubmit, control, formState: { errors, isSubmitting }, setValue, reset } = useForm<ClientFormData>({
        resolver: zodResolver(bookingSchema),
        mode: 'onChange',
        defaultValues: { customer_name: "", customer_email: "", customer_phone: "", start_date: startDate, end_date: endDate, privacyPolicy: false }
    });

    useEffect(() => {
        setValue('start_date', startDate);
        setValue('end_date', endDate);
    }, [startDate, endDate, setValue]);

    const calculatePrice = (start: string, end: string, pricing: Pricing): number => {
        if (!pricing || !start || !end || new Date(end) < new Date(start)) return 0;
        const days = differenceInDays(new Date(end), new Date(start)) + 1;
        if (days >= 15) return days * pricing.day_15_plus;
        if (days >= 8) return days * pricing.day_8_14;
        if (days === 7) return pricing.week;
        if (days >= 1) return days * pricing.day_1_6;
        return 0;
    };

    const onSubmit = async (data: ClientFormData) => {
        if (!selectedVehicle) return;

        // Construïm l'objecte complet que espera la Server Action
        const bookingData: VehicleBookingFormData = {
            ...data,
            privacyPolicy: true, // Assegurem que és `true`
            vehicle_id: selectedVehicle.id,
            vehicle_name: selectedVehicle.name,
            lang: i18n.language.startsWith('es') ? 'es' : 'ca',
        };

        try {
            const result = await createVehicleBookingAction(bookingData);
            if (!result.success) {
                throw new Error(result.error || 'Error en processar la reserva.');
            }
            
            toast.success(t('carRentalPage.toastSuccessTitle'), { description: result.message });
            reset();
            setIsDialogOpen(false);
        } catch (error: any) {
            toast.error(t('carRentalPage.toastErrorTitle'), { description: error.message });
        }
    };
    
    return (
        <main className="py-20 container mx-auto px-4">
            <div className="grid lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-8">
                    <h2 className="text-3xl md:text-4xl font-bold">{t('carRentalPage.fleetTitle')}</h2>
                    {vehicles.length > 0 ? (
                        vehicles.map((vehicle) => {
                            const totalPrice = calculatePrice(startDate, endDate, vehicle.pricing);
                            return (
                                <motion.div key={vehicle.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex flex-col md:flex-row bg-white border rounded-lg shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
                                    <div className="relative w-full md:w-1/3 h-64 md:h-auto"><Image fill className="object-cover" alt={`Imatge de ${vehicle.name}`} src={vehicle.image_url} sizes="(max-width: 768px) 100vw, 33vw"/></div>
                                    <div className="p-6 flex flex-col flex-grow w-full">
                                        <h3 className="text-2xl font-bold">{vehicle.name}</h3>
                                        <p className="text-gray-600 mt-1 mb-4 text-sm flex-grow">{vehicle.description}</p>
                                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-700 mb-4">
                                            <div className="flex items-center"><Users className="h-4 w-4 mr-2 text-red-600" />{vehicle.passengers} {t('carRentalPage.passengers')}</div>
                                            <div className="flex items-center"><GitCommitVertical className="h-4 w-4 mr-2 text-red-600" />{vehicle.transmission}</div>
                                            <div className="flex items-center"><Fuel className="h-4 w-4 mr-2 text-red-600" />{vehicle.fuel_type}</div>
                                            <div className="flex items-center"><Car className="h-4 w-4 mr-2 text-red-600" />{vehicle.category}</div>
                                        </div>
                                        <div className="mt-auto text-right">
                                            <div className="text-3xl font-bold text-gray-800">
                                                {totalPrice > 0 ? `${totalPrice.toFixed(2)}€` : (vehicle.pricing?.day_1_6 ? `${vehicle.pricing.day_1_6}€` : 'N/A')}
                                                <span className="text-lg font-normal text-gray-500"> {totalPrice > 0 ? t('carRentalPage.priceTotal') : t('carRentalPage.pricePerDay')}</span>
                                            </div>
                                            <Button onClick={() => { setSelectedVehicle(vehicle); setIsDialogOpen(true); }} className="w-full mt-4 bg-red-600 hover:bg-red-700"><Calendar className="mr-2 h-4 w-4" /> {t('carRentalPage.bookNow')}</Button>
                                        </div>
                                    </div>
                                </motion.div>
                            )
                        })
                    ) : <p className="text-center text-gray-600 py-10">{t('carRentalPage.noVehicles')}</p> }
                </div>
                <aside className="lg:col-span-1">
                    <div className="sticky top-28 space-y-8">
                        <div className="p-6 border rounded-lg bg-gray-50">
                            <h2 className="text-2xl font-bold mb-2 text-center">{t('carRentalPage.priceCalculatorTitle')}</h2>
                            <p className="text-gray-600 mb-6 text-center text-sm">{t('carRentalPage.priceCalculatorSubtitle')}</p>
                            <div className="space-y-4">
                                <div><Label htmlFor="start-date-calc" className="mb-2 block font-semibold">{t('carRentalPage.pickupDate')}</Label><Input id="start-date-calc" type="date" value={startDate} min={today} onChange={(e) => setStartDate(e.target.value)} className="text-center"/></div>
                                <div><Label htmlFor="end-date-calc" className="mb-2 block font-semibold">{t('carRentalPage.returnDate')}</Label><Input id="end-date-calc" type="date" value={endDate} min={startDate} onChange={(e) => setEndDate(e.target.value)} className="text-center"/></div>
                            </div>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold mb-6">{t('carRentalPage.infoTitle')}</h2>
                            <Accordion type="multiple" defaultValue={['item-1']} className="w-full">
                                <AccordionItem value="item-1"><AccordionTrigger><Info className="h-5 w-5 mr-2" />{t('carRentalPage.generalConditions')}</AccordionTrigger><AccordionContent className="text-gray-600 space-y-2"><p>{t('carRentalPage.conditionAge')}</p><p>{t('carRentalPage.conditionInsurance')}</p><p>{t('carRentalPage.conditionClientCosts')}</p><p>{t('carRentalPage.conditionVat')}</p></AccordionContent></AccordionItem>
                                <AccordionItem value="item-2"><AccordionTrigger><Clock className="h-5 w-5 mr-2" />{t('carRentalPage.scheduleTitle')}</AccordionTrigger><AccordionContent className="text-gray-600 space-y-2"><p>{t('carRentalPage.scheduleWeekdays')}</p><p>{t('carRentalPage.scheduleWeekends')}</p></AccordionContent></AccordionItem>
                            </Accordion>
                        </div>
                    </div>
                </aside>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-4xl w-full max-h-[90vh] p-0 flex flex-col md:flex-row">
                    <div className="hidden md:block md:w-1/2 relative">
                        {selectedVehicle && <Image src={selectedVehicle.image_url} alt={`Imatge de ${selectedVehicle.name}`} fill className="object-cover rounded-l-lg" />}
                    </div>
                    <div className="w-full md:w-1/2 p-8 overflow-y-auto">
                        <DialogHeader className="text-left mb-4">
                            <DialogTitle className="text-2xl font-bold">{t('carRentalPage.bookingModalTitle')}</DialogTitle>
                            <DialogDescription>
                                {t('carRentalPage.bookingModalSubtitle', { 
                                    vehicleName: selectedVehicle?.name, 
                                    startDate: format(new Date(startDate), 'dd/MM/yyyy'), 
                                    endDate: format(new Date(endDate), 'dd/MM/yyyy') 
                                })}
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                           <div className="grid gap-2">
                                <Label>{t('carRentalPage.formFullName')}</Label>
                                <div className="relative"><User className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input {...register("customer_name")} /></div>
                                {errors.customer_name && <p className="text-red-500 text-sm">{errors.customer_name.message}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label>{t('carRentalPage.formEmail')}</Label>
                                <div className="relative"><Mail className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input type="email" {...register("customer_email")} /></div>
                                {errors.customer_email && <p className="text-red-500 text-sm">{errors.customer_email.message}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label>{t('carRentalPage.formPhone')}</Label>
                                <div className="relative"><Phone className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input type="tel" {...register("customer_phone")} /></div>
                                {errors.customer_phone && <p className="text-red-500 text-sm">{errors.customer_phone.message}</p>}
                            </div>
                            <div className="flex items-center space-x-2 pt-2">
                               <Controller name="privacyPolicy" control={control} render={({ field }) => (<Checkbox id="privacyPolicy-vehicles" checked={field.value} onCheckedChange={field.onChange} />)} />
                               <Label htmlFor="privacyPolicy-vehicles" className="text-sm font-normal leading-tight">{t('form.privacyAccept')} <Link href="/politica_de_privacitat" target="_blank" rel="noopener noreferrer" className="underline text-red-600 hover:text-red-800">{t('form.privacyPolicy')}</Link>.</Label>
                            </div>
                            {errors.privacyPolicy && <p className="text-red-500 text-sm">{errors.privacyPolicy.message}</p>}
                            <Button type="submit" disabled={isSubmitting} className="w-full bg-red-600 hover:bg-red-700 !mt-6">
                                {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> {t('form.sending')}</> : t('carRentalPage.submitButton')}
                            </Button>
                        </form>
                    </div>
                </DialogContent>
            </Dialog>
        </main>
    );
}