// src/types/vehicle.ts

export type Pricing = {
  day_1_6: number;
  week: number;
  day_8_14: number;
  day_15_plus: number;
} | null;

export type Vehicle = {
  id: string;
  name: string;
  description: string;
  image_url: string;
  passengers: number;
  transmission: string;
  fuel_type: string;
  category: string;
  pricing: Pricing;
};