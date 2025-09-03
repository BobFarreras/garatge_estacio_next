"use client";

import React, { createContext, useState, useContext, ReactNode } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n'; // Assumirem que la configuració d'i18n està a src/i18n.ts

// Definim el tipus de dades que contindrà el context
interface LanguageContextType {
  language: string;
  changeLanguage: (lang: string) => void;
}

// Creem el context amb un valor per defecte
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Creem el Provider, que és el component que embolcallarà la nostra aplicació
export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState(i18n.language);

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    setLanguage(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      <I18nextProvider i18n={i18n}>
        {children}
      </I18nextProvider>
    </LanguageContext.Provider>
  );
};

// Creem un hook personalitzat per utilitzar el context fàcilment
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};