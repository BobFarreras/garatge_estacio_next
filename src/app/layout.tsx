// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';


// Importa els teus components (els haurem de migrar després)
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Chatbot from '@/components/Chatbot';
import CookieConsent from '@/components/CookieConsent';
import { Toaster } from "@/components/ui/toaster";
// Crearem aquest fitxer al pas 4
import { Providers } from '@/components/Providers'; 

const inter = Inter({ subsets: ['latin'] });

// Aquí va la teva informació SEO de l'index.html
export const metadata: Metadata = {
  title: "Garatge Estació | Taller i Lloguer a La Bisbal d'Empordà",
  description: "El teu taller mecànic multimarca i servei de lloguer de cotxes i autocaravanes a La Bisbal d'Empordà.",
  // Pots afegir aquí les metaetiquetes 'og', 'twitter', etc.
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ca">
      <body className={`${inter.className} flex flex-col min-h-screen bg-gray-50 text-gray-900`}>
        <Providers> {/* Aquest component embolcallarà els contexts */}
          <Header />
          <CookieConsent />
          <main className="flex-grow">
            {children} {/* Aquí es renderitzarà cada pàgina */}
          </main>
          <Footer />
          <Chatbot />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}