"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, User, Mail, Phone, Calendar as CalendarIcon } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { format, eachDayOfInterval, isBefore, startOfToday } from 'date-fns';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useTranslation } from 'react-i18next';
import { DateRange } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import Image, { StaticImageData } from 'next/image';
import Head from 'next/head';
import MotorhomeCard from '@/components/lloguer/MotorhomeCard';
import MotorhomeDetailsDialog from '@/components/lloguer/MotorhomeDetailsDialog';
import type { Motorhome } from '@/types';
// ✅ Importem les imatges locals que es necessiten en aquesta pàgina
import heroImage from '@/../public/images/autocaravanes/perfilAutocaravana.jpg';
import logoImage from '@/../public/images/logo-garatge-estacio.png';


const LloguerAutocaravanes = () => {
    const { t, i18n } = useTranslation();
    const { toast } = useToast();

    const bookingSchema = useMemo(() => z.object({
        customer_name: z.string().min(2, t('validation.nameRequired')),
        customer_email: z.string().email(t('validation.emailInvalid')),
        customer_phone: z.string().min(9, t('validation.phoneInvalid')),
        privacyPolicy: z.boolean().refine(val => val === true, {
            message: t('validation.privacyRequired'),
        }),
    }), [t]);

    const [motorhomes, setMotorhomes] = useState<Motorhome[]>([]);
    const [loading, setLoading] = useState(true);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [bookingOpen, setBookingOpen] = useState(false);
    const [selectedMotorhome, setSelectedMotorhome] = useState<Motorhome | null>(null);
    const [selectedRange, setSelectedRange] = useState<DateRange | undefined>();

    const { register, handleSubmit, control, formState: { errors, isSubmitting }, reset } = useForm({
        resolver: zodResolver(bookingSchema),
        mode: 'onChange',
        defaultValues: { customer_name: '', customer_email: '', customer_phone: '', privacyPolicy: false }
    });

    useEffect(() => {
        const fetchMotorhomes = async () => {
            setLoading(true);
            try {
                const lang = i18n.language || 'ca';
                const response = await fetch(`/api/autocaravanes?lang=${lang}`);
                if (!response.ok) throw new Error(`Server error: ${response.status}`);
                const data = await response.json();
                setMotorhomes(data);
            } catch (error) {
                toast({ title: t('toastBookingErrorTitle'), description: t('motorhomeRentalPage.toastLoadingError'), variant: "destructive" });
            } finally {
                setLoading(false);
            }
        };
        fetchMotorhomes();
    }, [toast, t, i18n.language]);

    const handleShowDetails = (motorhome: Motorhome) => {
        setSelectedMotorhome(motorhome);
        setDetailsOpen(true);
    };

    const handleStartBooking = (range: DateRange) => {
        if (!range?.from || !range?.to) return;
        setSelectedRange(range);
        setDetailsOpen(false);
        setBookingOpen(true);
    };

    const onSubmit = async (formData: any) => {
        if (!selectedMotorhome || !selectedRange?.from || !selectedRange.to) return;
        const bookingData = {
            ...formData,
            Vehicle_ID: [selectedMotorhome.id],
            Vehicle_Name: selectedMotorhome.name,
            start_date: format(selectedRange.from, 'yyyy-MM-dd'),
            end_date: format(selectedRange.to, 'yyyy-MM-dd'),
            lang: i18n.language.startsWith('es') ? 'es' : 'ca',

            
        };
        try {
            const response = await fetch('/api/autocaravanes/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookingData),
            });
            const responseData = await response.json();
            if (!response.ok) throw new Error(responseData.error || 'Server response error.');

            toast({ title: t('motorhomeRentalPage.toastBookingSuccessTitle'), description: t('motorhomeRentalPage.toastBookingSuccessDescription') });
            setBookingOpen(false);
            reset();
        } catch (error: any) {
            toast({ title: t('motorhomeRentalPage.toastBookingErrorTitle'), description: error.message, variant: "destructive" });
        }
    };

    if (loading) return <div className="flex justify-center items-center h-[60vh]"><Loader2 className="h-12 w-12 animate-spin text-red-600" /></div>;
    
    const businessSchema = { /* ... (your schema data) ... */ };

    return (
        <>
            <Head>
                <script type="application/ld+json">{JSON.stringify(businessSchema)}</script>
            </Head>
            <div className="bg-white">
                <section className="relative py-24 bg-gray-800 text-white">
                    <div className="absolute inset-0">
                        {/* ✅ CANVI AQUÍ: Utilitzem la imatge local importada */}
                        <Image 
                            src={heroImage} 
                            alt="Motorhome background" 
                            fill 
                            className="object-cover" 
                            priority
                        />
                    </div>
                    <div className="absolute inset-0 bg-black/60"></div>
                    <div className="container mx-auto px-4 relative z-10 text-center">
                        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-6xl font-bold mb-4">{t('motorhomeRentalPage.pageTitle')}</motion.h1>
                        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-lg md:text-xl max-w-3xl mx-auto text-gray-200">{t('motorhomeRentalPage.pageSubtitle')}</motion.p>
                    </div>
                </section>
                <main className="py-20 container mx-auto px-4">
                    <div className="text-center mb-16 max-w-3xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold">{t('motorhomeRentalPage.fleetTitle')}</h2>
                        <p className="text-gray-600 mt-4">{t('motorhomeRentalPage.fleetSubtitle')}</p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                        {motorhomes.map(motorhome => <MotorhomeCard key={motorhome.id} motorhome={motorhome} onShowDetails={handleShowDetails} />)}
                    </div>
                </main>
                <MotorhomeDetailsDialog motorhome={selectedMotorhome} open={detailsOpen} onOpenChange={setDetailsOpen} onBook={handleStartBooking} />
                <Dialog open={bookingOpen} onOpenChange={setBookingOpen}>
  <DialogContent className="w-full max-w-lg mx-auto rounded-2xl p-6">
    <DialogHeader>
      <DialogTitle>
        {t('motorhomeRentalPage.bookingDialogTitle')}
      </DialogTitle>
      <DialogDescription>
        {t('motorhomeRentalPage.bookingDialogDescription', {
          motorhomeName: selectedMotorhome?.name,
          startDate: selectedRange?.from ? format(selectedRange.from, 'dd/MM/yyyy') : '',
          endDate: selectedRange?.to ? format(selectedRange.to, 'dd/MM/yyyy') : ''
        })}
      </DialogDescription>
    </DialogHeader>

    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
      <div className="grid gap-2">
        <Label htmlFor="customer_name">{t('motorhomeRentalPage.formNameLabel')}</Label>
        <div className="relative">
          <User className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input id="customer_name" {...register("customer_name")} />
        </div>
        {errors.customer_name && <p className="text-red-500 text-sm">{errors.customer_name.message}</p>}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="customer_email">{t('motorhomeRentalPage.formEmailLabel')}</Label>
        <div className="relative">
          <Mail className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input id="customer_email" type="email" {...register("customer_email")} />
        </div>
        {errors.customer_email && <p className="text-red-500 text-sm">{errors.customer_email.message}</p>}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="customer_phone">{t('motorhomeRentalPage.formPhoneLabel')}</Label>
        <div className="relative">
          <Phone className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input id="customer_phone" type="tel" {...register("customer_phone")} />
        </div>
        {errors.customer_phone && <p className="text-red-500 text-sm">{errors.customer_phone.message}</p>}
      </div>

      <div className="flex items-center space-x-2">
        <Controller
          name="privacyPolicy"
          control={control}
          render={({ field }) => (
            <Checkbox
              id="privacyPolicy"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />
        <label htmlFor="privacyPolicy" className="text-sm">
          {t('form.privacyAccept')}{' '}
          <a
            href="/politica-privacitat.html"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-red-600 hover:text-red-800"
          >
            {t('form.privacyPolicy')}
          </a>.
        </label>
      </div>
      {errors.privacyPolicy && <p className="text-red-500 text-sm">{errors.privacyPolicy.message}</p>}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-red-600 hover:bg-red-700"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {t('motorhomeRentalPage.submittingButton')}
          </>
        ) : (
          t('motorhomeRentalPage.submitButton')
        )}
      </Button>
    </form>
  </DialogContent>
</Dialog>

            </div>
        </>
    );
};

export default LloguerAutocaravanes;