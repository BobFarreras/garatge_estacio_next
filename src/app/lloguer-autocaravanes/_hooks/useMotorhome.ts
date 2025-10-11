// Fitxer: useMotorhomes.ts
"use client";

import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useTranslation } from 'react-i18next';
import type { Motorhome } from '@/types';

export function useMotorhomes() {
  const [motorhomes, setMotorhomes] = useState<Motorhome[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const fetchMotorhomes = async () => {
      setLoading(true);
      try {
        const lang = i18n.language || 'ca';
        const response = await fetch(`/api/autocaravanes?lang=${lang}`);
        if (!response.ok) {
          throw new Error(`Error del servidor: ${response.status}`);
        }
        const data = await response.json();
        setMotorhomes(data);
      } catch (error) {
        toast({
          title: t('toastBookingErrorTitle'),
          description: t('motorhomeRentalPage.toastLoadingError'),
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMotorhomes();
  }, [toast, t, i18n.language]); // Es tornarà a executar si canvia l'idioma

  return { motorhomes, loading };
}