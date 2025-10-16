// src/hooks/useAvailableSlots.ts

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from "sonner"; // Assuming 'sonner' for toasts

// El hook rep la data seleccionada com a argument
export function useAvailableSlots(selectedDate: string) {
    const { t } = useTranslation();
    const [availableSlots, setAvailableSlots] = useState<string[]>([]);
    const [isLoadingSlots, setIsLoadingSlots] = useState(false);

    useEffect(() => {
        // Si no hi ha data, no fem res
        if (!selectedDate) {
            setAvailableSlots([]);
            return;
        }

        // Bloqueig de l'API si la data ja ha estat filtrada per Zod
        const day = new Date(selectedDate).getUTCDay();
        if (day === 0 || day === 6) {
            setAvailableSlots([]);
            return;
        }

        const fetchAvailableSlots = async () => {
            setIsLoadingSlots(true);
            setAvailableSlots([]); // Resetejem les hores prèvies
            try {
                const response = await fetch(`/api/cites/slots?date=${selectedDate}`);
                if (!response.ok) throw new Error('Network error');
                const data = await response.json();
                setAvailableSlots(data.slots || []);
            } catch (error) {
                // Utilitzem sonner.toast
                toast.error(t('toast.loadSlotsErrorTitle'), { 
                    description: t('toast.loadSlotsErrorDescription') 
                });
            } finally {
                setIsLoadingSlots(false);
            }
        };

        fetchAvailableSlots();
        
    }, [selectedDate, t]); // selectedDate és la dependència clau

    // El hook retorna l'estat que el component necessita
    return { availableSlots, isLoadingSlots };
}