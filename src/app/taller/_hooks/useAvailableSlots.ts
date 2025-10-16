// src/app/taller/_hooks/useAvailableSlots.ts
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from "sonner"; 

// El hook rep la data seleccionada com a argument
export function useAvailableSlots(selectedDate: string): { availableSlots: string[], isLoadingSlots: boolean } {
    const { t } = useTranslation();
    const [availableSlots, setAvailableSlots] = useState<string[]>([]);
    const [isLoadingSlots, setIsLoadingSlots] = useState(false);

    useEffect(() => {
        // Si no hi ha data, no fem res
        if (!selectedDate) {
            setAvailableSlots([]);
            return;
        }

        // Lògica de comprovació de cap de setmana (encara que Zod ho filtri, és una bona pràctica aquí)
        const day = new Date(selectedDate).getUTCDay();
        if (day === 0 || day === 6) { // 0 = Diumenge, 6 = Dissabte
            setAvailableSlots([]);
            return;
        }

        const fetchAvailableSlots = async () => {
            setIsLoadingSlots(true);
            setAvailableSlots([]); 
            try {
                // ✅ Crida REAL al vostre API
                const response = await fetch(`/api/cites/slots?date=${selectedDate}`);
                if (!response.ok) throw new Error('Network error or slots not available');
                const data = await response.json();
                setAvailableSlots(data.slots || []);
            } catch (error) {
                toast.error(t('toast.loadSlotsErrorTitle'), { 
                    description: t('toast.loadSlotsErrorDescription') 
                });
            } finally {
                setIsLoadingSlots(false);
            }
        };

        fetchAvailableSlots();
        
    }, [selectedDate, t]); 

    return { availableSlots, isLoadingSlots };
}