import { eachDayOfInterval, isBefore } from 'date-fns';
import type { DateRange } from 'react-day-picker';
import type { Pricing } from '@/types';

/**
 * Determina la temporada (baixa, alta, especial) basant-se en una data.
 */
export const getSeason = (date: Date): keyof Pricing => {
  const month = date.getMonth() + 1; // +1 perquè els mesos van de 0 a 11
  const day = date.getDate();

  // Temporada Especial
  if (month === 8) {
    return 'special_season';
  }

  // Temporada Alta
  if (
    (month === 6 && day >= 23) || // Sant Joan endavant
    month === 7 ||               // Juliol
    (month === 9 && day <= 11) || // Fins a la Diada
    (month === 12 && day >= 20) || // Nadal
    (month === 1 && day <= 7) ||  // Reis
    month === 3 ||               // Març (Setmana Santa)
    month === 4                  // Abril (Setmana Santa)
  ) {
    return 'high_season';
  }

  // Temporada Baixa
  return 'low_season';
};

/**
 * Calcula el preu total d'un lloguer d'autocaravana basant-se en el rang de dates i els preus per temporada.
 */
export const calculateMotorhomePrice = (range: DateRange | undefined, pricing: Pricing | null) => {
  if (!pricing || !range?.from || !range?.to || isBefore(range.to, range.from)) {
    return { total: 0, days: 0, error: null };
  }

  const interval = eachDayOfInterval({ start: range.from, end: range.to });
  const days = interval.length;

  if (days < 3) {
    return { total: 0, days, error: "La reserva mínima és de 3 dies" };
  }

  const total = interval.reduce((sum, date) => {
    const season = getSeason(date);
    return sum + (pricing[season] || 0);
  }, 0);

  return { total, days, error: null };
};