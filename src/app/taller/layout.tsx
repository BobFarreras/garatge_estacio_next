import type { Metadata } from 'next';

const businessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Garatge Estació",
    "image": "https://images.gestionaweb.cat/2611/img-960-412/banner8-1963893.jpg?v=1",
    "url": "https://www.garatgeestacio.com/taller",
    "telephone": "972 640 204",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Ramon Serradell, 21",
      "addressLocality": "Girona",
      "postalCode": "17100",
      "addressCountry": "ES"
    },
    "priceRange": "€€"
};

export const metadata: Metadata = {
  title: "Taller Mecànic a La Bisbal d'Empordà - Garatge Estació",
  description: "Servei de taller multimarca a La Bisbal. Demana cita per a revisions, pneumàtics, frens, ITV i més. Confiança i professionalitat.",
  alternates: {
    canonical: '/taller',
    languages: {
      'ca-ES': '/taller',
      'es-ES': '/es/taller',
    },
  },
};

export default function TallerLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema) }}
      />
      {children}
    </>
  );
}