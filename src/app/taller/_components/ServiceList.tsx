// app/taller/ServiceList.tsx
"use client";

import React, { useState, useRef, useEffect } from 'react'; // <-- useRef, useEffect afegits
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner'; // <-- Importem toast per a la notificació del bypass
import AppointmentForm from './AppointmentForm'; 
import type { Service } from '@/types/service';

interface ServiceListProps {
    services: Service[];
}

export default function ServiceList({ services }: ServiceListProps) {
    const { t } = useTranslation();
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [selectedService, setSelectedService] = useState<string | null>(null);

    // ---------------------------------------------------------------------
    // ✅ Lògica del "Mode de Desenvolupament" (Easter Egg)
    // ---------------------------------------------------------------------
    const [isBypassMode, setIsBypassMode] = useState(false);
    const clickCountRef = useRef(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const handleTitleClick = () => {
        clickCountRef.current += 1;

        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        timerRef.current = setTimeout(() => {
            clickCountRef.current = 0;
            timerRef.current = null;
        }, 500);

        if (clickCountRef.current >= 3) {
            if (!isBypassMode) {
                setIsBypassMode(true);
                toast.info("Mode Bypass de Data activat!", {
                    description: "Ara pots seleccionar qualsevol dia. No oblidis recarregar per desactivar-ho.",
                });
            }
            clickCountRef.current = 0; // Reinicia el comptador
        }
    };
    
    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, []);
    // ---------------------------------------------------------------------

    const handleServiceSelection = (serviceTitle: string) => {
        setSelectedService(serviceTitle);
        setIsBookingOpen(true);
    };

    return (


        <>
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
            <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
                <DialogContent className="w-full max-w-lg sm:max-w-2xl max-h-[90vh] overflow-y-auto px-4 py-6 sm:px-8 sm:py-8">
                    <DialogHeader>
                        <DialogTitle
                            className="text-xl sm:text-2xl cursor-pointer" // ✅ Afegim cursor-pointer
                            onClick={handleTitleClick} // ✅ Afegim l'esdeveniment de clic aquí
                        >
                            {t('appointment.bookingFor')}{' '}
                            <span className="text-red-600">{selectedService}</span>
                        </DialogTitle>
                        <DialogDescription className="text-sm sm:text-base">
                            {t('appointment.fillForm')}
                        </DialogDescription>
                    </DialogHeader>
                    <AppointmentForm
                        selectedService={selectedService}
                        onFormSubmit={() => setIsBookingOpen(false)}
                        // ✅ Propaguem l'estat del bypass al formulari
                        isBypassMode={isBypassMode}
                    />
                </DialogContent>
            </Dialog>
        </>
    );
}