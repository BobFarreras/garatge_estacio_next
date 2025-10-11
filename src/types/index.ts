// Aquest fitxer serà la nostra "font única de la veritat" per als tipus de dades.

export type Pricing = {
  low_season: number;
  high_season: number;
  special_season: number;
};

export type Motorhome = {
  id: string;
  id_numeric: number;
  name: string;
  description: string;
  image_url: string;
  gallery_images: string[];
  features: string[];
  included_items: string[];
  passengers: number;
  length: number;
  width: number;          // <-- Faltava aquesta
  height: number;         // <-- Faltava aquesta
  is_available: boolean;  // <-- Faltava aquesta
  pricing: Pricing;
};

// El tipus FormState ja està correcte
export type FormState = {
  success: boolean;
  message?: string | null;
  error?: string | null;
  errors?: {
    [key: string]: string[] | undefined;
  } | null;
};