"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Users, Ruler, Info } from 'lucide-react';

import type { Motorhome } from '@/types';

// ✅ Exemple d’imatge local (pots afegir més i fer un mapping segons l’`id` o `name`)
import perfilAutocaravana from '@/../public/images/autocaravanes/perfilAutocaravana.jpg';

type MotorhomeCardProps = {
  motorhome: Motorhome;
  onShowDetails: (motorhome: Motorhome) => void;
};

const MotorhomeCard = ({ motorhome, onShowDetails }: MotorhomeCardProps) => {
  // 🔑 Aquí pots decidir quina imatge local mostrar depenent del model
  const imageMap: Record<string, any> = {
    default: perfilAutocaravana,
    // "Camper X": camperXImage,
    // "Integral Y": integralYImage,
  };

  const imgSrc = imageMap[motorhome.name] || imageMap.default;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      whileInView={{ opacity: 1, y: 0 }} 
      viewport={{ once: true }} 
      className="bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col overflow-hidden"
    >
      <div className="relative w-full h-56 md:h-64 lg:h-72">
        <Image 
          className="object-cover" 
          src={imgSrc} 
          alt={motorhome.name} 
          fill 
          sizes="(max-width: 768px) 100vw, 50vw" 
        />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{motorhome.name}</h3>
        <div className="flex items-center text-sm text-gray-600 mb-4 space-x-4">
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-2 text-red-600" /> 
            <span>{motorhome.passengers} Places</span>
          </div>
          <div className="flex items-center">
            <Ruler className="h-4 w-4 mr-2 text-red-600" /> 
            <span>{motorhome.length}m</span>
          </div>
        </div>
        <p className="text-gray-700 mb-6 text-base flex-grow line-clamp-3 leading-relaxed">
          {motorhome.description}
        </p>
        <div className="mt-auto text-left flex items-baseline">
          <span className="text-lg text-gray-500">des de </span>
          <span className="font-extrabold text-4xl text-red-600 ml-2">
            {motorhome.pricing?.low_season}€
          </span>
          <span className="text-lg text-gray-500">/dia</span>
        </div>
        <Button 
          onClick={() => onShowDetails(motorhome)} 
          className="w-full mt-6 h-12 rounded-full text-lg font-semibold bg-red-600 hover:bg-red-700 transition-colors shadow-lg hover:shadow-xl"
        >
          <Info className="mr-2 h-5 w-5" />
          Veure detalls i calendari
        </Button>
      </div>
    </motion.div>
  );
};

export default MotorhomeCard;
