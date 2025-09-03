import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Importem els fitxers de traducció que acabem de crear
import translationCA from './locales/ca/translation.json';
import translationES from './locales/es/translation.json';

const resources = {
  ca: {
    translation: translationCA,
  },
  es: {
    translation: translationES,
  },
};

i18n
  // Detecta l'idioma de l'usuari
  .use(LanguageDetector)
  // Passa la instància d'i18n a react-i18next
  .use(initReactI18next)
  // Inicialitza i18next
  .init({
    resources,
    fallbackLng: 'ca', // Idioma per defecte si el de l'usuari no està disponible
    interpolation: {
      escapeValue: false, // React ja protegeix contra XSS
    },
  });

export default i18n;