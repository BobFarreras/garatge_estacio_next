"use client";
// app/taller/page.tsx

import Image from 'next/image';
import { useTranslation } from 'react-i18next'; // <-- Fem servir el hook que ja tenies
import { Button } from '@/components/ui/button';
import ServiceList from './_components/ServiceList'; // <-- El nostre nou component interactiu
import type { Service } from '@/types/service'; // <-- Recomanat: mou la definició de 'Service' a types/index.ts

import bannerTaller from '@/../public/images/banner-taller.avif';
import canviPneumatics from "@/../public/images/servies/neumatics.jpeg";
import canviAmortidors from "@/../public/images/servies/canviAmortidors.jpeg";
import canviBateria from "@/../public/images/servies/canviBateria.jpeg";
import canvimanteniment from "@/../public/images/servies/manteniment.jpeg";
import canvipastilelsFre from "@/../public/images/servies/pastillesdefre.jpeg";
import canviProPostITV from "@/../public/images/servies/proPostitv.jpeg";
import vehiclesPesants from "@/../public/images/servies/vehiclesPesants.jpeg";
import canvidoli from "@/../public/images/servies/canviDoli.jpeg";
import altresServeis from "@/../public/images/servies/altresServeis.jpeg";

import { Wrench, Settings, Car, BatteryCharging, Wind, Shield, Truck, Building, MoreHorizontal, MessageCircle } from 'lucide-react';


// Aquesta pàgina ja no té "use client". Es renderitza al servidor.
export default function TallerPage() {
    const { t } = useTranslation(); // Fem servir el hook que ja tenies

    // La llista de serveis es genera aquí, al servidor.
    // És contingut estàtic, perfecte per a un Server Component.
    const services: Service[] = [
        { id: 1, title: t('workshopServices.canviDoli'), description: t('workshopServices.canviDoliDesc'), image: canvidoli, icon: Building },

        { id: 2, title: t('workshopServices.tires'), description: t('workshopServices.tiresDesc'), image: canviPneumatics, icon: Car },
        { id: 3, title: t('workshopServices.brakes'), description: t('workshopServices.brakesDesc'), image: canvipastilelsFre, icon: Shield },
        { id: 4, title: t('workshopServices.battery'), description: t('workshopServices.batteryDesc'), image: canviBateria, icon: BatteryCharging },
        { id: 5, title: t('workshopServices.suspension'), description: t('workshopServices.suspensionDesc'), image: canviAmortidors, icon: Wind },
        { id: 6, title: t('workshopServices.ac'), description: t('workshopServices.acDesc'), image: canvimanteniment, icon: Settings },
        { id: 7, title: t('workshopServices.itv'), description: t('workshopServices.itvDesc'), image: canviProPostITV, icon: Wrench },
        { id: 8, title: t('workshopServices.heavy'), description: t('workshopServices.heavyDesc'), image: vehiclesPesants, icon: Truck },
        //{ id: 8, title: t('workshopServices.integral'), description: t('workshopServices.integralDesc'), image: reparacioIntegral, icon: Building },
        { id: 9, title: t('workshopServices.other'), description: t('workshopServices.otherDesc'), image: altresServeis, icon: MoreHorizontal },
    ];

    return (
        <div className="bg-white">
            <section className="relative py-24 bg-gray-900 text-white">
                <div className="absolute inset-0">
                    <Image
                        src={bannerTaller}
                        alt={t('workshopPage.title')}
                        suppressHydrationWarning
                        fill
                        priority
                        className="object-cover filter brightness-[0.4]"
                    />
                </div>
                <div className="relative z-10 container mx-auto px-4 text-center">
                    {/* ✅ I L'AFEGIM AQUÍ al títol */}
                    <h1
                        className="text-5xl md:text-6xl font-bold mb-4 text-shadow-md"
                        suppressHydrationWarning
                    >
                        {t('workshopPage.title')}
                    </h1>
                    <p
                        className="text-lg md:text-xl max-w-3xl mx-auto text-shadow-md"
                        suppressHydrationWarning
                    >
                        {t('workshopPage.subtitle')}
                    </p>
                </div>
            </section>

            {/*
              Aquí deleguem tota la part interactiva (llista de serveis + diàleg)
              al nou component 'ServiceList'. Li passem les dades per props.
            */}
            <ServiceList services={services} />

            <section className="py-20 bg-gray-800 text-white">
                <div className="container mx-auto px-4 text-center">
                    <h3 className="text-3xl font-bold">{t('otherRepairs.title')}</h3>
                    <p className="text-gray-300 mt-4 mb-8 max-w-2xl mx-auto">{t('otherRepairs.subtitle')}</p>
                    <Button asChild size="lg" className="bg-green-500 hover:bg-green-600 rounded-full">
                        <a href="https://wa.me/34626981978" target="_blank" rel="noopener noreferrer">
                            <MessageCircle className="mr-2 h-5 w-5" /> {t('otherRepairs.contactWhatsApp')}
                        </a>
                    </Button>
                </div>
            </section>
        </div>
    );
}