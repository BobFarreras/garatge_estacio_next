// src/app/page.tsx
import HomePageClient from './HomePageClient';
import imatgeFaçana from "@/../public/images/façana.jpeg";

const homeSchema = {
  "@context": "https://schema.org",
  "@type": "AutoRepair",
  "name": "Garatge Estació",
  "image": {imatgeFaçana},
  "@id": "https://garatgeestacio.com/",
  "url": "https://garatgeestacio.com/",
  "telephone": "+34972640204",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Carrer Ramon Serradell, 21",
    "addressLocality": "La Bisbal d'Empordà",
    "postalCode": "17100",
    "addressRegion": "Girona",
    "addressCountry": "ES"
  },
  "openingHours": "Mo-Fr 08:00-18:00",
  "sameAs": ["https://www.instagram.com/garatge_estacio_bisbal/"]
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeSchema) }}
      />
      <HomePageClient />
    </>
  );
}
