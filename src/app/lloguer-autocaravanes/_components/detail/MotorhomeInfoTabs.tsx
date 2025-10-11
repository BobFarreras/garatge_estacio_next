// Fitxer: MotorhomeInfoTabs.tsx
"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check } from 'lucide-react';
import type { Motorhome } from '@/types';

type MotorhomeInfoTabsProps = {
  motorhome: Motorhome;
};

const MotorhomeInfoTabs = ({ motorhome }: MotorhomeInfoTabsProps) => {
  return (
    <Tabs defaultValue="equipment" className="w-full">
      <TabsList className="grid w-full grid-cols-2 bg-gray-100 rounded-lg">
        <TabsTrigger value="equipment">Equipament</TabsTrigger>
        <TabsTrigger value="rates">Tarifes</TabsTrigger>
      </TabsList>
      <TabsContent value="equipment" className="pt-3 sm:pt-4 text-sm bg-white p-3 sm:p-4 rounded-lg shadow-sm">
        <h4 className="font-bold mb-2 text-base sm:text-lg">Inclòs:</h4>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5">
          {(motorhome.included_items || []).map(item => (
            <li key={item} className="flex items-start text-gray-700">
              <Check className="h-4 w-4 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
              {item}
            </li>
          ))}
        </ul>
      </TabsContent>
      <TabsContent value="rates" className="pt-4 text-sm space-y-4">
          <div className="border-b pb-2">
              <div className="flex justify-between font-semibold"><p>Temporada Baixa</p><p>{motorhome.pricing.low_season}€/dia</p></div>
              <p className="text-xs text-gray-500">Resta de l'any.</p>
          </div>
          <div className="border-b pb-2">
              <div className="flex justify-between font-semibold"><p>Temporada Alta</p><p>{motorhome.pricing.high_season}€/dia</p></div>
              <p className="text-xs text-gray-500">Del 23/06 al 11/09, Nadal, Març i Abril.</p>
          </div>
          <div>
              <div className="flex justify-between font-semibold"><p>Temporada Especial</p><p>{motorhome.pricing.special_season}€/dia</p></div>
              <p className="text-xs text-gray-500">Agost.</p>
          </div>
      </TabsContent>
    </Tabs>
  );
};

export default MotorhomeInfoTabs;