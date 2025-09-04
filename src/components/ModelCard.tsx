// /components/ModelCard.tsx

"use client";

// PAS 1: Importa Link i StaticImageData
import Link from 'next/link';
import Image, { StaticImageData } from 'next/image';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

// PAS 2: Actualitza el tipus de 'image' a StaticImageData
type Model = {
  name: string;
  image: StaticImageData;
  description: string;
  features: string[];
};

type ModelCardProps = {
  model: Model;
  buttonClass?: string;
};

const ModelCard = ({ model, buttonClass = 'bg-gray-900 hover:bg-gray-800' }: ModelCardProps) => (
  <motion.div
    className="bg-white rounded-lg shadow-lg overflow-hidden group border flex flex-col"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    viewport={{ once: true }}
  >
    <div className="relative overflow-hidden h-56">
      <Image
        src={model.image} // Ara això funciona perfectament
        alt={model.name}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover group-hover:scale-105 transition-transform duration-300"
        placeholder="blur" // Afegeix l'efecte de càrrega per consistència
      />
    </div>
    <div className="p-6 flex flex-col flex-grow">
      <h3 className="text-2xl font-bold mb-2">{model.name}</h3>
      <p className="text-gray-600 mb-4 flex-grow">{model.description}</p>
      <ul className="space-y-2 mb-6">
        {model.features.map(feature => (
          <li key={feature} className="flex items-center text-sm">
            <Check className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
            {feature}
          </li>
        ))}
      </ul>
      {/* PAS 3: Embolcalla el botó amb Link i fes servir 'asChild' */}
      <Button asChild className={`w-full mt-auto ${buttonClass}`}>
        {/* Opcionalment, passem el nom del model a la URL de contacte */}
        <Link href={`/contacte?model=${encodeURIComponent(model.name)}`}>
          Demanar més informació
        </Link>
      </Button>
    </div>
  </motion.div>
);

export default ModelCard;