// fitxer: config/navigation.ts

import type { TFunction } from 'i18next';

// Definim un tipus per als nostres enllaços per tenir autocompletat
export interface NavLink {
  key: string; // Una clau única per a la traducció i el 'key' de React
  path: string;
  description?: string;
}

// Funció per obtenir els enllaços principals
export const getNavLinks = (t: TFunction): NavLink[] => [
  { key: 'home', path: '/' },
  { key: 'workshop', path: '/taller' },
];

// Funció per obtenir els enllaços de marques
export const getBrandLinks = (t: TFunction): NavLink[] => [
  { key: 'hyundai', path: '/venda-hyundai', description: t('hyundaiDescription') },
  { key: 'kia', path: '/venda-kia', description: t('kiaDescription') },
];

// Funció per obtenir els enllaços de serveis de lloguer
export const getServiceLinks = (t: TFunction): NavLink[] => [
  { key: 'carRental', path: '/lloguer-vehicles' },
  { key: 'motorhomeRental', path: '/lloguer-autocaravanes' },
];

// Funció per obtenir l'enllaç de contacte
export const getContactLink = (t: TFunction): NavLink => ({
  key: 'contact',
  path: '/contacte',
});