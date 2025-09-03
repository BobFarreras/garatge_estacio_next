import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { kiaData } from '@/data/kia';
import BrandModels from '@/components/BrandModels';

export const metadata: Metadata = {
  title: `${kiaData.brand} a La Bisbal - Garatge Estació`,
  description: `Punt de venda oficial de ${kiaData.brand} a La Bisbal d'Empordà. Descobreix la gamma de turismes, SUV i elèctrics.`,
};

export default function VendaKiaPage() {
  return (
    <>
      <section className="relative py-24 bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <Image 
            fill
            className="object-cover" 
            alt={kiaData.hero.title}
            src={kiaData.hero.imageUrl} 
            priority
            sizes="100vw"
          />
        </div>
        <div className="relative z-10 container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4 text-shadow-md">
              {kiaData.hero.title}
            </h1>
            <p className="text-lg md:text-2xl max-w-3xl mx-auto text-gray-200 text-shadow-md">
              {kiaData.hero.subtitle}
            </p>
        </div>
      </section>
      
      <main>
        <BrandModels models={kiaData.models} brandName={kiaData.brand} />

        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Per què escollir {kiaData.brand}?</h2>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              {kiaData.features.map((feature) => (
                <div key={feature.title}>
                  <div className="inline-block bg-red-100 text-red-800 rounded-full p-4 mb-4">
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
                <h2 className="text-3xl font-bold mb-4">Interessat en un {kiaData.brand}?</h2>
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