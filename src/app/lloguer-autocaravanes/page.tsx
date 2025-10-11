// Fitxer: LloguerAutocaravanes.tsx (o page.tsx)
"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { DateRange } from 'react-day-picker';
import Image from 'next/image';
import Head from 'next/head';

// Components importats
import MotorhomeCard from './_components/MotorhomeCard';
import MotorhomeDetailsDialog from './_components/detail/MotorhomeDetailsDialog';
import { BookingFormDialog } from './_components/BookingFormDialog';

// El nostre nou Hook per a les dades
import { useMotorhomes } from './_hooks/useMotorhome';

// Tipus i imatges
import type { Motorhome } from '@/types';
import heroImage from '@/../public/images/autocaravanes/perfilAutocaravana.jpg';

const LloguerAutocaravanes = () => {
  const { t } = useTranslation();
  const { motorhomes, loading } = useMotorhomes();

  // Estats per controlar el flux de l'usuari (quins diàlegs es mostren)
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedMotorhome, setSelectedMotorhome] = useState<Motorhome | null>(null);
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>();

  // Aquesta funció s'executa quan l'usuari fa clic a "Veure detalls"
  const handleShowDetails = (motorhome: Motorhome) => {
    setSelectedMotorhome(motorhome);
    setDetailsOpen(true);
  };

  // Aquesta funció s'executa quan l'usuari tria dates i clica "Reservar ara"
  const handleStartBooking = (range: DateRange) => {
    if (!range?.from || !range?.to) return;
    setSelectedRange(range);
    setDetailsOpen(false); // Tanquem el diàleg de detalls
    setBookingOpen(true);  // Obrim el del formulari
  };

  // Aquesta funció s'executa quan la reserva es completa amb èxit
  const handleBookingSuccess = () => {
    setBookingOpen(false);
    // Podríem resetejar estats aquí si fos necessari
    setSelectedMotorhome(null);
    setSelectedRange(undefined);
  };

  // Pantalla de càrrega
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-red-600" />
      </div>
    );
  }

  const businessSchema = { /* ... (your schema data) ... */ };

  return (
    <>
      <Head>
        <script type="application/ld+json">{JSON.stringify(businessSchema)}</script>
      </Head>
      <div className="bg-white">
        {/* Secció Hero */}
        <section className="relative py-24 bg-gray-800 text-white">
          <div className="absolute inset-0">
            <Image src={heroImage} alt="Motorhome background" fill className="object-cover" priority />
          </div>
          <div className="absolute inset-0 bg-black/60"></div>
          <div className="container mx-auto px-4 relative z-10 text-center">
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-6xl font-bold mb-4">{t('motorhomeRentalPage.pageTitle')}</motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-lg md:text-xl max-w-3xl mx-auto text-gray-200">{t('motorhomeRentalPage.pageSubtitle')}</motion.p>
          </div>
        </section>

        {/* Llistat d'Autocaravanes */}
        <main className="py-20 container mx-auto px-4">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold">{t('motorhomeRentalPage.fleetTitle')}</h2>
            <p className="text-gray-600 mt-4">{t('motorhomeRentalPage.fleetSubtitle')}</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {motorhomes.map(motorhome => (
              <MotorhomeCard key={motorhome.id} motorhome={motorhome} onShowDetails={handleShowDetails} />
            ))}
          </div>
        </main>

        {/* Diàlegs (ara només gestionen l'estat, la lògica és a dins) */}
        <MotorhomeDetailsDialog
          motorhome={selectedMotorhome}
          open={detailsOpen}
          onOpenChange={setDetailsOpen}
          onBook={handleStartBooking}
        />

        {/* ✅ CORRECCIÓ: Només renderitzem el diàleg de reserva quan 'bookingOpen' és true */}
        {bookingOpen && (
          <BookingFormDialog
            open={bookingOpen}
            onOpenChange={setBookingOpen}
            motorhome={selectedMotorhome}
            dateRange={selectedRange}
            onBookingSuccess={handleBookingSuccess}
          />
        )}
      </div>
    </>
  );
};

export default LloguerAutocaravanes;