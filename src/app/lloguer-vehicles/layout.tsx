import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Lloguer de Cotxes a La Bisbal d'Empordà | Garatge Estació",
  description: "Descobreix la nostra flota de vehicles de lloguer a La Bisbal. Cotxes moderns i tarifes competitives per a les teves necessitats.",
  alternates: {
    canonical: '/lloguer-vehicles',
  },
};

export default function LloguerVehiclesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}