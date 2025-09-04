"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ModelCard from './ModelCard';
// PAS 1: Importa el tipus StaticImageData de Next.js
import { StaticImageData } from 'next/image';

// Definim l'estructura de l'objecte 'Model'
interface Model {
  name: string;
  type: string;
  // PAS 2: Canvia el tipus de 'string' a 'StaticImageData'
  image: StaticImageData; 
  description: string;
  features: string[];
}

// Definim l'estructura de les props que rep el component
interface BrandModelsProps {
  models: Model[];
  brandName: string;
  buttonClass?: string;
}

const BrandModels = ({ models, brandName, buttonClass }: BrandModelsProps) => {
  const modelTypes: string[] = ['Tots', ...Array.from(new Set(models.map((m: Model) => m.type)))];

  const gridColsMap: { [key: number]: string } = {
    2: 'sm:grid-cols-2',
    3: 'sm:grid-cols-3',
    4: 'sm:grid-cols-4',
  };
  const smGridColsClass = gridColsMap[modelTypes.length] || 'sm:grid-cols-4';

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Explora la Gamma {brandName}
        </h2>
        <Tabs defaultValue="Tots" className="w-full">
          <TabsList className={`grid w-full ${modelTypes.length > 2 ? 'grid-cols-3' : 'grid-cols-2'} ${smGridColsClass} max-w-xl mx-auto mb-10`}>
            {modelTypes.map(type => <TabsTrigger key={type} value={type}>{type}</TabsTrigger>)}
          </TabsList>
          
          {modelTypes.map(type => (
            <TabsContent key={type} value={type}>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {models
                  .filter((m: Model) => type === 'Tots' || m.type === type)
                  .map((model: Model) => (
                    <ModelCard key={model.name} model={model} buttonClass={buttonClass} />
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export default BrandModels;