// Fitxer: BookingCalendar.tsx (Versió Corregida i Definitiva)
"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, Loader2, AlertTriangle, ArrowRight } from 'lucide-react';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, startOfToday } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { motion } from 'framer-motion';
import type { Motorhome } from '@/types';
import { calculateMotorhomePrice } from '@/lib/motorhomeUtils';
import 'react-day-picker/dist/style.css';
// ✅ Imports per a la traducció
import { useTranslation } from 'react-i18next';
import { ca, es } from 'date-fns/locale';
type BookingCalendarProps = {
  motorhome: Motorhome;
  bookedDays: Date[];
  loadingDates: boolean;
  onBook: (range: DateRange) => void;
};

const BookingCalendar = ({ motorhome, bookedDays, loadingDates, onBook }: BookingCalendarProps) => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
    // ✅ Obtenim l'idioma actual amb el hook de traducció
  const { i18n } = useTranslation();
  
  // ✅ Determinem l'objecte 'locale' de date-fns basat en l'idioma actiu
  const currentLocale = i18n.language === 'es' ? es : ca;
  const priceInfo = calculateMotorhomePrice(dateRange, motorhome.pricing);

  const handleBooking = () => {
    if (dateRange) {
      onBook(dateRange);
    }
  };

  if (loadingDates) {
    return (
      <div className="flex justify-center items-center h-full min-h-[250px] sm:min-h-[300px]">
        <Loader2 className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 border rounded-lg sm:rounded-2xl flex flex-col bg-gray-50 shadow-md">
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
      
      {/* Botons amb Popover */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        {/* Botó Recollida */}
        <Popover>
          <PopoverTrigger asChild>{/* ... */}</PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={dateRange?.from}
              onSelect={(day) => setDateRange({ from: day, to: undefined })}
              disabled={[{ before: startOfToday() }, ...bookedDays]}
              // ✅ Afegim les noves propietats
              locale={currentLocale}
              weekStartsOn={1} // 1 correspon a dilluns
            />
          </PopoverContent>
        </Popover>
        
        {/* Botó Entrega */}
        <Popover>
          <PopoverTrigger asChild>{/* ... */}</PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={dateRange?.to}
              onSelect={(day) => setDateRange((prev) => ({ from: prev?.from, to: day }))}
              disabled={[{ before: dateRange?.from! }, ...bookedDays]}
              // ✅ Afegim les noves propietats
              locale={currentLocale}
              weekStartsOn={1}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Calendari principal visible sempre */}
      <div className="mb-4">
        <Calendar
          mode="range"
          selected={dateRange}
          onSelect={setDateRange}
          disabled={[{ before: startOfToday() }, ...bookedDays]}
          className="rounded-md border bg-white text-black p-1 text-xs sm:p-2 sm:text-sm w-full"
          numberOfMonths={1}
          // ✅ Afegim les noves propietats
          locale={currentLocale}
          weekStartsOn={1}
        />
      </div>

      {/* Secció de Preu */}
      <div className="mt-auto space-y-3">
        {priceInfo.error && (
          <p className="text-red-600 font-bold flex items-center text-sm">
            <AlertTriangle className="h-4 w-4 mr-2" /> {priceInfo.error}
          </p>
        )}
        <motion.div
          key={priceInfo.total}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl sm:text-3xl font-bold text-gray-900 text-center"
        >
          Total: {priceInfo.total.toFixed(2)}€
          <span className="text-base font-normal text-gray-500">
            {" "}({priceInfo.days} {priceInfo.days === 1 ? 'dia' : 'dies'})
          </span>
        </motion.div>
      </div>

      {/* Botó de reserva */}
      <div className="sticky bottom-0 bg-white pt-3 sm:p-0 sm:static -mx-4 -mb-4 sm:mx-0 sm:mb-0 px-4 sm:px-0 mt-4">
        <Button
          onClick={handleBooking}
          disabled={!!priceInfo.error || !dateRange?.to}
          className="w-full h-12 rounded-full text-lg font-semibold bg-red-600 hover:bg-red-700 transition-colors shadow-lg hover:shadow-xl"
        >
          Reservar Ara <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default BookingCalendar;