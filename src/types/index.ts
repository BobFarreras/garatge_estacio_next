// Aquest fitxer serà la nostra "font única de la veritat" per als tipus de dades.

export type Pricing = {
    low_season: number;
    high_season: number;
    special_season: number;
  };
  
  export type Motorhome = {
    id: string;
    name: string;
    description: string;
    image_url: string;
    gallery_images: string[];
    features: string[];
    included_items: string[];
    passengers: number;
    length: number; // Aquesta propietat faltava a un dels components
    pricing: Pricing;
  };