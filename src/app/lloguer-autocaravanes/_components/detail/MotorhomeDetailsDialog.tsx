// Fitxer: _components/MotorhomeDetailsDialog.tsx (Versió Corregida)
"use client";

import React, { useState, useEffect } from 'react'; // ✅ Hem de tornar a importar useState i useEffect
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import type { DateRange } from 'react-day-picker';
import type { Motorhome } from '@/types';

// Importa els components fills que hem creat
import MotorhomeGallery from './MotorhomeGallery';
import MotorhomeInfoTabs from './MotorhomeInfoTabs';
import BookingCalendar from './BookingCalendar';

// Importacions d'imatges locals
import menjardorAutocaravana from '@/../public/images/autocaravanes/menjardorAutocaravana.jpg';
import cuinaAutocaravana from '@/../public/images/autocaravanes/cuinaAutocaravana.jpg';
import llitAutocaravana from '@/../public/images/autocaravanes/llitAutocaravana.jpg';
import maleteruAutocaravana from '@/../public/images/autocaravanes/MaleteruAutocaravana.jpg';
import llit2Autocaravana from '@/../public/images/autocaravanes/llit2Autocaravana.jpg';
import perfilAutocaravana from '@/../public/images/autocaravanes/perfilAutocaravana.jpg';
import raderaAutocaravana from '@/../public/images/autocaravanes/raderaAutocaravana.jpg';
import neveraAutocarabana from '@/../public/images/autocaravanes/neveraAutocarabana.jpg';

type DialogProps = {
  motorhome: Motorhome | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBook: (range: DateRange) => void;
};

const localImages = [
  perfilAutocaravana, menjardorAutocaravana, cuinaAutocaravana,
  llitAutocaravana, llit2Autocaravana, raderaAutocaravana,
  neveraAutocarabana, maleteruAutocaravana,
];

const MotorhomeDetailsDialog = ({ motorhome, open, onOpenChange, onBook }: DialogProps) => {
  // ✅ PAS 1: Tornem a definir els estats per a les dates ocupades
  const [bookedDays, setBookedDays] = useState<Date[]>([]);
  const [loadingDates, setLoadingDates] = useState(true);

  // ✅ PAS 2: Restaurem el useEffect per fer la crida a l'API Route de disponibilitat
  useEffect(() => {
    // Només executem la crida si el diàleg està obert i tenim una autocaravana seleccionada
    if (open && motorhome) {
      setLoadingDates(true);
      fetch(`/api/autocaravanes/availability?vehicle_name=${encodeURIComponent(motorhome.name_ca)}`)
        .then(res => res.json())
        .then(data => {
          if (data.booked_dates) {
            setBookedDays(data.booked_dates.map((dateStr: string) => new Date(dateStr)));
          }
        })
        .catch(err => console.error("Error carregant disponibilitat:", err))
        .finally(() => setLoadingDates(false));
    }
  }, [open, motorhome]); // Aquest efecte es re-executarà cada cop que s'obri el diàleg per a una AC diferent

  if (!motorhome) {
    return null;
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-full sm:max-w-4xl h-[95vh] sm:h-auto overflow-y-auto p-0 rounded-none sm:rounded-2xl">
        <DialogHeader className="p-4 sm:p-6 border-b border-gray-200">
          <DialogTitle className="text-2xl sm:text-3xl font-bold">{motorhome.name}</DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            Explora tots els detalls i la disponibilitat.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-6 lg:gap-x-8 lg:gap-y-8 p-4 sm:p-6">
          <div className="space-y-4">
            <MotorhomeGallery images={localImages} motorhomeName={motorhome.name} />
            <MotorhomeInfoTabs motorhome={motorhome} />
          </div>

          {/* ✅ PAS 3: Passem les dates carregades i l'estat de càrrega al component del calendari */}
          <BookingCalendar
            motorhome={motorhome}
            bookedDays={bookedDays}
            loadingDates={loadingDates}
            onBook={onBook}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MotorhomeDetailsDialog;