import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useTranslation } from 'react-i18next';

// El hook rep la data seleccionada com a argument
export function useAvailableSlots(selectedDate: string) {
    const { toast } = useToast();
    const { t } = useTranslation();
    const [availableSlots, setAvailableSlots] = useState<string[]>([]);
    const [isLoadingSlots, setIsLoadingSlots] = useState(false);

    useEffect(() => {
        // Si no hi ha data, no fem res
        if (!selectedDate) {
            setAvailableSlots([]);
            return;
        }

        // Comprovem si és cap de setmana
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
                toast({ title: t('toast.loadSlotsErrorTitle'), description: t('toast.loadSlotsErrorDescription'), variant: "destructive"});
            } finally {
                setIsLoadingSlots(false);
            }
        };

        fetchAvailableSlots();
        
    // Aquest efecte es tornarà a executar cada cop que 'selectedDate' canviï
    }, [selectedDate, toast, t]);

    // El hook retorna l'estat que el component necessita
    return { availableSlots, isLoadingSlots };
}