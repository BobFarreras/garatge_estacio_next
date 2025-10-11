// fitxer: app/lloguer-autocaravanes/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Lloguer d'Autocaravanes a La Bisbal d'Empordà | Garatge Estació",
    description: "Viu l'aventura amb les nostres autocaravanes de lloguer. Totalment equipades i llestes per a la teva escapada. Consulta la nostra flota i disponibilitat.",
    alternates: {
        canonical: '/lloguer-autocaravanes',
        languages: {
            'ca-ES': '/lloguer-autocaravanes',
            'es-ES': '/es/lloguer-autocaravanes',
        }
    },
};

// Aquest layout simplement embolcalla el contingut de la pàgina
export default function LloguerAutocaravanesLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}