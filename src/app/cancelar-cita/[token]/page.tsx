"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2, AlertTriangle } from 'lucide-react';
import { cancelAppointmentAction } from '@/app/taller/actions';
import type { FormState } from '@/types/actions';

// ✅ SOLUCIÓ: Canviem el tipus explícit per 'any' per evitar l'error de build de Next.js.
// Next.js injectarà els paràmetres correctament en temps d'execució.
export default function CancelarCitaPage({ params }: { params: any }) {
  // Mantenim la seguretat de tipus extraient el token a una variable tipada.
  const token: string = params.token;
  
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<FormState | null>(null);

  const handleCancel = async () => {
    setIsLoading(true);
    try {
      const actionResult = await cancelAppointmentAction(token);
      setResult(actionResult);
    } catch (error) {
      setResult({ success: false, error: "S'ha produït un error inesperat." });
    } finally {
      setIsLoading(false);
    }
  };

  // Si ja tenim un resultat, mostrem l'estat final
  if (result) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-md">
          {result.success ? (
            <>
              <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
              <h1 className="mt-4 text-2xl font-bold text-gray-900">Cita Cancel·lada</h1>
              <p className="mt-2 text-gray-600">{result.message}</p>
            </>
          ) : (
            <>
              <XCircle className="mx-auto h-16 w-16 text-red-500" />
              <h1 className="mt-4 text-2xl font-bold text-gray-900">Error en la Cancel·lació</h1>
              <p className="mt-2 text-gray-600">{result.error}</p>
            </>
          )}
          <Button asChild className="mt-6 w-full bg-blue-600 hover:bg-blue-700">
            <Link href="/">Tornar a l'inici</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Vista inicial de confirmació
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-md">
        <AlertTriangle className="mx-auto h-16 w-16 text-yellow-500" />
        <h1 className="mt-4 text-2xl font-bold text-gray-900">Confirmar Cancel·lació</h1>
        <p className="mt-2 text-gray-600">
          Estàs a punt de cancel·lar la teva cita. Aquesta acció no es pot desfer.
        </p>
        <div className="mt-6 flex flex-col gap-3">
            <Button
                onClick={handleCancel}
                disabled={isLoading}
                className="w-full bg-red-600 hover:bg-red-700"
            >
                {isLoading ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Cancel·lant...</>
                ) : (
                    "Sí, cancel·la la cita"
                )}
            </Button>
            <Button asChild variant="outline" className="w-full">
                <Link href="/">No, tornar a l'inici</Link>
            </Button>
        </div>
      </div>
    </div>
  );
}