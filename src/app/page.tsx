import type { Metadata } from 'next';
import HomePageClient from './HomePageClient'; // Importem la part interactiva

// SEO i metadades gestionades al servidor
export const metadata: Metadata = {
  title: "Garatge Estació | Taller Mecànic i Lloguer a La Bisbal d'Empordà",
  description: "El teu taller mecànic multimarca i servei de lloguer de cotxes i autocaravanes a La Bisbal d'Empordà. Confiança i professionalitat des de 1990.",
  alternates: {
    canonical: 'https://garatgeestacio.com/',
  },
  openGraph: {
    title: "Garatge Estació | Taller Mecànic i Lloguer a La Bisbal d'Empordà",
    description: "El teu taller mecànic multimarca i servei de lloguer de cotxes i autocaravanes.",
    url: 'https://garatgeestacio.com/',
    siteName: 'Garatge Estació',
    images: [
      {
        url: 'https://res.cloudinary.com/dvqhfapep/image/upload/v1753124394/1-358f0b08_djkf2j.jpg',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'ca_ES',
    type: 'website',
  },
};

const homeSchema = {
  "@context": "https://schema.org",
  "@type": "AutoRepair",
  "name": "Garatge Estació",
  "image": "https://res.cloudinary.com/dvqhfapep/image/upload/v1753124394/1-358f0b08_djkf2j.jpg",
  "@id": "https://garatgeestacio.com/",
  "url": "https://garatgeestacio.com/",
  "telephone": "+34972640204", // Telèfon correcte
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Carrer Ramon Serradell, 21",
    "addressLocality": "La Bisbal d'Empordà",
    "postalCode": "17100",
    "addressRegion": "Girona",
    "addressCountry": "ES"
  },
  "openingHours": "Mo-Fr 08:00-18:00",
  "sameAs": [
    "https://www.instagram.com/garatge_estacio_bisbal/" // URL Correcta
  ]
};

export default function Home() {
  return (
    <>
      {/* Script per a les dades estructurades (JSON-LD) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeSchema) }}
      />
      <HomePageClient />
    </>
  );
}