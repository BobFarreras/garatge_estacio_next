"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, Loader2, Check, AlertTriangle, ArrowRight } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format, isBefore, startOfToday, eachDayOfInterval } from 'date-fns';
import { DateRange } from 'react-day-picker';
import Lightbox from "yet-another-react-lightbox";
import { motion } from 'framer-motion';
import Image from 'next/image';

// ✅ Importacions d’imatges locals
import menjardorAutocaravana from '@/../public/images/autocaravanes/menjardorAutocaravana.jpg';
import cuinaAutocaravana from '@/../public/images/autocaravanes/cuinaAutocaravana.jpg';
import llitAutocaravana from '@/../public/images/autocaravanes/llitAutocaravana.jpg';
import maleteruAutocaravana from '@/../public/images/autocaravanes/MaleteruAutocaravana.jpg';
import llit2Autocaravana from '@/../public/images/autocaravanes/llit2Autocaravana.jpg';
import perfilAutocaravana from '@/../public/images/autocaravanes/perfilAutocaravana.jpg';
import raderaAutocaravana from '@/../public/images/autocaravanes/raderaAutocaravana.jpg';
import neveraAutocarabana from '@/../public/images/autocaravanes/neveraAutocarabana.jpg';

type Pricing = { low_season: number; high_season: number; special_season: number; };
type Motorhome = {
  id: string;
  name: string;
  included_items: string[];
  pricing: Pricing;
};

type DialogProps = {
  motorhome: Motorhome | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBook: (range: DateRange) => void;
};

// --- Funcions de càlcul ---
const getSeason = (date: Date): keyof Pricing => {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  if (month === 8) return 'special_season';
  if ((month === 6 && day >= 23) || month === 7 || (month === 9 && day <= 11) || (month === 12 && day >= 20) || (month === 1 && day <= 7)) return 'high_season';
  return 'low_season';
};

const calculateMotorhomePrice = (range: DateRange | undefined, pricing: Pricing | null) => {
  if (!pricing || !range?.from || !range?.to || isBefore(range.to, range.from)) return { total: 0, days: 0, error: null };
  const interval = eachDayOfInterval({ start: range.from, end: range.to });
  const days = interval.length;
  if (days < 3) return { total: 0, days, error: "Reserva mínima de 3 dies" };
  const total = interval.reduce((sum, date) => sum + (pricing[getSeason(date)] || 0), 0);
  return { total, days, error: null };
};

const MotorhomeDetailsDialog = ({ motorhome, open, onOpenChange, onBook }: DialogProps) => {
  if (!motorhome) return null;

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [bookedDays, setBookedDays] = useState<Date[]>([]);
  const [loadingDates, setLoadingDates] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  // ✅ Ara definim les imatges locals a usar
  const localImages = [
    menjardorAutocaravana,
    cuinaAutocaravana,
    llitAutocaravana,
    maleteruAutocaravana,
    llit2Autocaravana,
    perfilAutocaravana,
    raderaAutocaravana,
    neveraAutocarabana
  ];

  const lightboxSlides = localImages.map(img => ({ src: img.src }));
  const priceInfo = calculateMotorhomePrice(dateRange, motorhome.pricing);

  useEffect(() => {
    if (open && motorhome) {
      setLoadingDates(true);
      setDateRange(undefined);
      fetch(`/api/autocaravanes/availability?vehicle_name=${encodeURIComponent(motorhome.name)}`)
        .then(res => res.json())
        .then(data => { if (data.booked_dates) setBookedDays(data.booked_dates.map((dateStr: string) => new Date(dateStr))) })
        .catch(err => console.error("Error carregant disponibilitat:", err))
        .finally(() => setLoadingDates(false));
    }
  }, [open, motorhome]);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
  <DialogContent className="w-full max-w-full sm:max-w-4xl h-[95vh] sm:h-auto overflow-y-auto p-0 rounded-none sm:rounded-2xl">
    <DialogHeader className="p-4 sm:p-6 border-b border-gray-200">
      <DialogTitle className="text-2xl sm:text-3xl font-bold">{motorhome.name}</DialogTitle>
      <DialogDescription className="text-sm sm:text-base">
        Explora tots els detalls i la disponibilitat.
      </DialogDescription>
    </DialogHeader>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-6 lg:gap-x-8 lg:gap-y-8 p-4 sm:p-6">
      {/* Galeria */}
      <div className="space-y-4">
        <Carousel className="w-full relative group rounded-xl overflow-hidden shadow-lg">
          <CarouselContent>
            {localImages.map((img, i) => (
              <CarouselItem
                key={i}
                onClick={() => { setImageIndex(i); setLightboxOpen(true); }}
                className="cursor-pointer"
              >
                <div className="aspect-video bg-gray-100 relative">
                  <Image
                    src={img}
                    alt={`${motorhome.name} ${i + 1}`}
                    fill
                    className="w-full h-full object-cover"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {localImages.length > 1 && (
            <>
              <CarouselPrevious className="absolute left-3 opacity-0 group-hover:opacity-100" />
              <CarouselNext className="absolute right-3 opacity-0 group-hover:opacity-100" />
            </>
          )}
        </Carousel>

        {/* Tabs */}
        <Tabs defaultValue="equipment" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-100 rounded-lg">
            <TabsTrigger value="equipment">Equipament</TabsTrigger>
            <TabsTrigger value="rates">Tarifes</TabsTrigger>
          </TabsList>
          <TabsContent value="equipment" className="pt-3 sm:pt-4 text-sm bg-white p-3 sm:p-4 rounded-lg shadow-sm">
            <h4 className="font-bold mb-2 text-base sm:text-lg">Inclòs:</h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5">
              {(motorhome.included_items || []).map(item => (
                <li key={item} className="flex items-start text-gray-700">
                  <Check className="h-4 w-4 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </TabsContent>
          <TabsContent value="rates" className="pt-3 sm:pt-4 text-sm bg-white p-3 sm:p-4 rounded-lg shadow-sm">
            <ul className="divide-y divide-gray-200">
              <li className="flex justify-between py-2 items-center">
                <span className="font-semibold text-gray-800">T. Baixa</span>
                <span className="font-mono text-gray-600">{motorhome.pricing.low_season}€/dia</span>
              </li>
              <li className="flex justify-between py-2 items-center">
                <span className="font-semibold text-gray-800">T. Alta</span>
                <span className="font-mono text-gray-600">{motorhome.pricing.high_season}€/dia</span>
              </li>
              <li className="flex justify-between py-2 items-center">
                <span className="font-semibold text-gray-800">T. Especial</span>
                <span className="font-mono text-gray-600">{motorhome.pricing.special_season}€/dia</span>
              </li>
            </ul>
          </TabsContent>
        </Tabs>
      </div>

      {/* Bloc de reserva */}
      <div className="p-4 sm:p-6 border rounded-lg sm:rounded-2xl flex flex-col bg-gray-50 shadow-md relative">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg sm:text-xl font-bold">Disponibilitat i Reserva</h3>
          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-1 text-xs text-blue-600 hover:text-blue-800"
            onClick={() => setDateRange(undefined)}
          >
            Esborrar
          </Button>
        </div>

        {loadingDates ? (
          <div className="flex justify-center items-center h-full min-h-[250px] sm:min-h-[300px]">
            <Loader2 className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400 animate-spin" />
          </div>
        ) : (
          <>
            {/* Només popovers en mòbil, calendari complet en sm+ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              {/* Botó Recollida */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal rounded-full text-black">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? format(dateRange.from, "dd/MM/yyyy") : "Recollida"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateRange?.from}
                    onSelect={(day) => setDateRange({ from: day, to: undefined })}
                    disabled={[{ before: startOfToday() }, ...bookedDays]}
                  />
                </PopoverContent>
              </Popover>
              {/* Botó Entrega */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal rounded-full text-black"
                    disabled={!dateRange?.from}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.to ? format(dateRange.to, "dd/MM/yyyy") : "Entrega"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateRange?.to}
                    onSelect={(day) => setDateRange({ from: dateRange?.from, to: day })}
                    disabled={[{ before: dateRange?.from! }, ...bookedDays]}
                  />
                </PopoverContent>
              </Popover>
            </div>

        {/* Calendari sempre visible */}
            <div className="mb-4">
            <Calendar
                mode="range"
                selected={dateRange}
                onSelect={setDateRange}
                disabled={[{ before: startOfToday() }, ...bookedDays]}
                className="rounded-md border bg-white text-black
                        p-1 text-xs
                        sm:p-2 sm:text-sm"
            />
            </div>

            {/* Preu i botó reserva */}
            <div className="mt-auto">
              {priceInfo.error && (
                <p className="text-red-600 font-bold flex items-center text-sm mb-2">
                  <AlertTriangle className="h-4 w-4 mr-2" /> {priceInfo.error}
                </p>
              )}
              <motion.div
                key={priceInfo.total}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-4"
              >
                Total: {priceInfo.total.toFixed(2)}€
                <span className="text-base font-normal text-gray-500">
                  {" "}({priceInfo.days} {priceInfo.days === 1 ? 'dia' : 'dies'})
                </span>
              </motion.div>
            </div>
          </>
        )}

        {/* Botó fix en mòbil */}
        <div className="sticky bottom-0 left-0 right-0 bg-white p-3 sm:p-0 sm:static">
          <Button
            onClick={() => onBook(dateRange!)}
            disabled={!!priceInfo.error || !dateRange?.to}
            className="w-full h-12 rounded-full text-lg font-semibold bg-red-600 hover:bg-red-700 transition-colors shadow-lg hover:shadow-xl"
          >
            Reservar Ara <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  </DialogContent>
</Dialog>

            <Lightbox open={lightboxOpen} close={() => setLightboxOpen(false)} slides={lightboxSlides} index={imageIndex} />
        </>
    );
};

export default MotorhomeDetailsDialog;
