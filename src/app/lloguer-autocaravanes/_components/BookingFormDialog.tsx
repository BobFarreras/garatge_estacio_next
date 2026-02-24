// Fitxer: _components/BookingFormDialog.tsx (Versió Corregida per a React 19)
"use client";

// ✅ 1. Importem useActionState des de 'react' en lloc de 'react-dom'
import React, { useEffect, useRef, useCallback, useActionState } from 'react'; 
import { useFormStatus } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { toast } from "sonner";
import { format } from 'date-fns';
import Link from 'next/link';
import type { DateRange } from 'react-day-picker';
import type { Motorhome } from '@/types';

// Components UI
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, User, Mail, Phone } from 'lucide-react';

// Server Action
import { createMotorhomeBookingAction } from '../actions';

// Tipus i estat inicial
type BookingFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  motorhome: Motorhome | null;
  dateRange: DateRange | undefined;
  onBookingSuccess: () => void;
};
const initialState = { success: false, error: null, errors: {} };

// Botó de Submit
function SubmitButton() {
  const { pending } = useFormStatus();
  const { t } = useTranslation();
  return (
    <Button type="submit" disabled={pending} className="w-full bg-red-600 hover:bg-red-700">
      {pending ? (
        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t('motorhomeRentalPage.submittingButton')}</>
      ) : (
        t('motorhomeRentalPage.submitButton')
      )}
    </Button>
  );
}

export const BookingFormDialog = ({ open, onOpenChange, motorhome, dateRange, onBookingSuccess }: BookingFormDialogProps) => {
  const { t, i18n } = useTranslation();
  const formRef = useRef<HTMLFormElement>(null);

  // ✅ 2. Canviem useFormState per useActionState
  const [state, formAction] = useActionState(createMotorhomeBookingAction, initialState);

  useEffect(() => {
    if (state.success) {
      toast.success(t('motorhomeRentalPage.toastBookingSuccessTitle'), {
        description: state.message,
      });
      onBookingSuccess();
      formRef.current?.reset();
    } else if (state.error) {
      toast.error(t('motorhomeRentalPage.toastBookingErrorTitle'), {
        description: state.error, 
      });
    }
  }, [state, onBookingSuccess, t]);

  const handleOpenChange = useCallback((isOpen: boolean) => {
    if (!isOpen) {
      formRef.current?.reset();
    }
    onOpenChange(isOpen);
  }, [onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="w-full max-w-lg mx-auto rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle>{t('motorhomeRentalPage.bookingDialogTitle')}</DialogTitle>
          <DialogDescription>
            {t('motorhomeRentalPage.bookingDialogDescription', {
              motorhomeName: motorhome?.name,
              startDate: dateRange?.from ? format(dateRange.from, 'dd/MM/yyyy') : '',
              endDate: dateRange?.to ? format(dateRange.to, 'dd/MM/yyyy') : '',
            })}
          </DialogDescription>
        </DialogHeader>

        <form ref={formRef} action={formAction} className="space-y-4 pt-4">
          <input type="hidden" name="Vehicle_ID" value={motorhome?.id ?? ''} />
          <input type="hidden" name="Vehicle_Name" value={motorhome?.name ?? ''} />
          <input type="hidden" name="start_date" value={dateRange?.from ? format(dateRange.from, 'yyyy-MM-dd') : ''} />
          <input type="hidden" name="end_date" value={dateRange?.to ? format(dateRange.to, 'yyyy-MM-dd') : ''} />
          <input type="hidden" name="lang" value={i18n.language.startsWith('es') ? 'es' : 'ca'} />

          {/* Camp Nom */}
          <div className="grid gap-2">
            <Label htmlFor="customer_name">{t('motorhomeRentalPage.formNameLabel')}</Label>
            <div className="relative">
              <User className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input id="customer_name" name="customer_name" />
            </div>
            {state.errors?.customer_name && <p className="text-red-500 text-sm">{state.errors.customer_name[0]}</p>}
          </div>

          {/* Camp Email */}
          <div className="grid gap-2">
            <Label htmlFor="customer_email">{t('motorhomeRentalPage.formEmailLabel')}</Label>
            <div className="relative">
              <Mail className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input id="customer_email" name="customer_email" type="email" />
            </div>
            {state.errors?.customer_email && <p className="text-red-500 text-sm">{state.errors.customer_email[0]}</p>}
          </div>

          {/* Camp Telèfon */}
          <div className="grid gap-2">
            <Label htmlFor="customer_phone">{t('motorhomeRentalPage.formPhoneLabel')}</Label>
            <div className="relative">
              <Phone className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input id="customer_phone" name="customer_phone" type="tel" />
            </div>
            {state.errors?.customer_phone && <p className="text-red-500 text-sm">{state.errors.customer_phone[0]}</p>}
          </div>

          {/* Checkbox Privacitat */}
          <div className="flex items-start space-x-3">
            <Checkbox id="privacyPolicy" name="privacyPolicy" className="mt-0.5" />
            <div className="grid gap-1.5 leading-none">
              <Label htmlFor="privacyPolicy" className="text-sm font-medium">
                {t('form.privacyAccept')}{' '}
                <Link href="/politica_de_privacitat" target="_blank" rel="noopener noreferrer" className="underline text-red-600 hover:text-red-800">
                  {t('form.privacyPolicy')}
                </Link>.
              </Label>
              {state.errors?.privacyPolicy && <p className="text-red-500 text-sm">{state.errors.privacyPolicy[0]}</p>}
            </div>
          </div>

          <SubmitButton />
        </form>
      </DialogContent>
    </Dialog>
  );
};