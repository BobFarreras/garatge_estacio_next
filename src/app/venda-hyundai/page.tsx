// /app/venda/hyundai/page.tsx

import type { Metadata } from 'next';
import Image, { StaticImageData } from 'next/image'; // Assegura't d'importar StaticImageData
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { hyundaiData } from '@/data/hyundai';
import BrandModels from '@/components/BrandModels';

// PAS 1: Importa totes les imatges que necessitaràs
import i20Image from '@/../public/images/hyundai/i20_w2dhil.jpg';
import tucsonImage from '@/../public/images/hyundai/tucson_cezo0t.jpg';
import ioniq5Image from '@/../public/images/hyundai/ioniq5_joaqjc.jpg';
import konaImage from '@/../public/images/hyundai/kona_pipidg.jpg';
import ioniq6Image from '@/../public/images/hyundai/ionic6_utmryt.jpg';
// Aquesta imatge sembla que no s'usa, però la importo per si de cas.
import ix5Image from '@/../public/images/hyundai/ix5.avif';


export const metadata: Metadata = {
  title: `${hyundaiData.brand} a La Bisbal - Garatge Estació`,
  description: `Punt de venda oficial de ${hyundaiData.brand} a La Bisbal d'Empordà. Descobreix la gamma de turismes, SUV i elèctrics.`,
};

// PAS 2: Crea un mapa per relacionar l'ID del model amb la seva imatge importada
const imageMap: Record<string, StaticImageData> = {
  i20: i20Image,
  tucson: tucsonImage,
  ioniq5: ioniq5Image,
  kona: konaImage,
  ioniq6: ioniq6Image,
  ix5:ix5Image
};

export default function VendaHyundaiPage() {

  // PAS 3: Combina les dades de text amb les imatges locals
  const modelsWithLocalImages = hyundaiData.models.map(model => ({
    ...model,
    image: imageMap[model.id], // Assigna la imatge correcta usant el mapa
  }));

  return (
    <>
      <section className="relative py-24 bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <Image
            fill
            className="object-cover"
            alt={hyundaiData.hero.title}
            src={ix5Image} // Fes servir la imatge de capçalera importada
            priority
            sizes="100vw"
            placeholder='blur' // Opcional: Afegeix un efecte de càrrega
          />
        </div>
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 text-shadow-md">
            {hyundaiData.hero.title}
          </h1>
          <p className="text-lg md:text-2xl max-w-3xl mx-auto text-gray-200 text-shadow-md">
            {hyundaiData.hero.subtitle}
          </p>
        </div>
      </section>

      <main>
        {/* Passa les dades combinades al component fill */}
        <BrandModels models={modelsWithLocalImages} brandName={hyundaiData.brand} buttonClass="bg-blue-900 hover:bg-blue-800 text-white" />

        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Per què escollir {hyundaiData.brand}?</h2>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              {hyundaiData.features.map((feature) => (
                <div key={feature.title}>
                  <div className="inline-block bg-blue-100 text-blue-800 rounded-full p-4 mb-4">
                    <feature.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-gray-800 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Interessat en un {hyundaiData.brand}?</h2>
            <p className="text-gray-300 max-w-2xl mx-auto mb-8">Vine a veure'ls en persona a la nostra exposició o contacta amb nosaltres per a una prova de conducció.</p>
            <Button size="lg" asChild className="bg-white text-gray-900 hover:bg-gray-200">
              <Link href="/contacte">Contacta'ns</Link>
            </Button>
          </div>
        </section>
      </main>
    </>
  );
}