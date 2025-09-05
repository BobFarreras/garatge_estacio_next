// src/app/layout.tsx
import './globals.css';
import { Inter } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Chatbot from '@/components/Chatbot';
import CookieConsent from '@/components/CookieConsent';
import { Toaster } from "@/components/ui/toaster";
import { Providers } from '@/components/Providers';

const inter = Inter({ subsets: ['latin'] });

const siteUrl = 'https://garatgeestacio.com';

export const metadata = {
  title: {
    template: '%s | Garatge Estació',
    default: 'Garatge Estació - Taller i Lloguer a La Bisbal d\'Empordà',
  },
  description: 'El teu taller mecànic multimarca i servei de lloguer de cotxes i autocaravanes a La Bisbal d\'Empordà. Professionalitat i confiança des de 1990.',
  metadataBase: new URL(siteUrl),
  manifest: '/site.webmanifest',
  icons: {
    icon: [
      { url: '/favicon.ico', type: 'image/x-icon' },
      { url: '/favicon.png', type: 'image/png' },
    ],
    shortcut: '/favicon.png',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'Garatge Estació - Taller i Lloguer',
    description: 'Servei de taller multimarca i lloguer de cotxes i autocaravanes a La Bisbal d\'Empordà.',
    url: siteUrl,
    siteName: 'Garatge Estació',
    images: [
      {
        url: `${siteUrl}/og-image.jpg`,
        alt: 'Garatge Estació - Taller i Lloguer',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'ca_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Garatge Estació - Taller i Lloguer',
    description: 'Servei de taller multimarca i lloguer de cotxes i autocaravanes.',
    images: [`${siteUrl}/og-image.jpg`],
  },
  alternates: {
    canonical: '/',
    languages: {
      'ca-ES': '/',
      'es-ES': '/es',
      'x-default': '/',
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Garatge Estació",
  "url": siteUrl,
  "logo": `${siteUrl}/favicon.png`,
  "description": "Garatge Estació, taller multimarca i servei de lloguer de vehicles a La Bisbal d'Empordà.",
  "sameAs": [
    "https://www.instagram.com/garatge_estacio_bisbal/",
    "https://www.facebook.com/garatgeestacio"
  ]
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ca">
      <body className={`${inter.className} flex flex-col min-h-screen bg-gray-50 text-gray-900`}>
        <Providers>
          <Header />
          <CookieConsent />
          <main className="flex-grow">{children}</main>
          <Footer />
          {/* <Chatbot />*/}
          <Toaster />
          {/* JSON-LD per a l'organització */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
          />
        </Providers>
      </body>
    </html>
  );
}
