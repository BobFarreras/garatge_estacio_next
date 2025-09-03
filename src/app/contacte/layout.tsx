import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Contacte - Garatge Estació | La Bisbal d'Empordà",
  description: "Contacta amb Garatge Estació. Visita'ns a La Bisbal d'Empordà, truca'ns o envia'ns un missatge per a qualsevol consulta sobre taller o lloguer.",
  alternates: {
    canonical: '/contacte',
  },
};

export default function ContacteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}