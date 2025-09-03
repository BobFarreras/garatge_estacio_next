import { ShieldCheck, Award, BatteryCharging } from 'lucide-react';

export const kiaData = {
  brand: "Kia",
  logo: "https://res.cloudinary.com/dvqhfapep/image/upload/v1753164157/ev9_dro4nr.jpg",
  hero: {
    title: "Kia a La Bisbal d'Empordà",
    subtitle: "Experimenta el poder de sorprendre amb la nova generació de vehicles Kia.",
    imageUrl: "https://res.cloudinary.com/dvqhfapep/image/upload/v1753164157/ev9_dro4nr.jpg"
  },
  models: [
    { name: 'Picanto', type: 'Turisme', image: 'https://res.cloudinary.com/dvqhfapep/image/upload/v1753164158/picanto_hmauiu.jpg', description: 'L\'urbà àgil i ple d\'estil, ideal per moure\'t per la ciutat amb personalitat.', features: ['Disseny modern i compacte', 'Pantalla tàctil de 8"', 'Baix consum'] },
    { name: 'Ceed', type: 'Turisme', image: 'https://res.cloudinary.com/dvqhfapep/image/upload/v1753164159/ceed_i1ysw1.jpg', description: 'Equilibri perfecte entre disseny dinàmic, tecnologia i confort per al dia a dia.', features: ['Disponible en MHEV', 'Assistent de conducció en autopista', 'Quadre d\'instruments digital de 12,3"'] },
    { name: 'Niro', type: 'SUV', image: 'https://res.cloudinary.com/dvqhfapep/image/upload/v1753164158/niro_rjh6sm.jpg', description: 'El crossover híbrid, híbrid endollable i 100% elèctric que s\'adapta a tu.', features: ['Etiqueta ECO o 0', 'Fins a 460 km autonomia (e-Niro)', 'Tecnologia DriveWise'] },
    { name: 'Sportage', type: 'SUV', image: 'https://res.cloudinary.com/dvqhfapep/image/upload/v1753164158/sportage_arwipk.jpg', description: 'Inspirat en la natura, dissenyat per al futur. Un SUV que redefineix l\'estil.', features: ['Disponible en HEV i PHEV', 'Interior espaiós i premium', 'Pantalles corbes panoràmiques'] },
    { name: 'EV6', type: 'Elèctric', image: 'https://res.cloudinary.com/dvqhfapep/image/upload/v1753164159/ev6_fbk5hl.jpg', description: 'El crossover 100% elèctric que marca una nova era. Cotxe de l\'Any a Europa 2022.', features: ['Fins a 528 km d\'autonomia', 'Plataforma E-GMP', 'Càrrega ultra-ràpida 800V'] },
    { name: 'EV9', type: 'Elèctric', image: 'https://res.cloudinary.com/dvqhfapep/image/upload/v1753164157/ev9_dro4nr.jpg', description: 'El nostre SUV elèctric més gran, amb 3 files de seients i tecnologia de demà.', features: ['Fins a 7 places', 'Autonomia de més de 541 km', 'Highway Driving Pilot'] },
  ],
  features: [
    { icon: ShieldCheck, title: "7 Anys de Garantia", description: "La nostra famosa garantia, transferible a nous propietaris, per a la teva tranquil·litat total." },
    { icon: Award, title: "Disseny Guardonat", description: "Un estil atrevit i reconegut mundialment que combina elegància i modernitat." },
    { icon: BatteryCharging, title: "Líders en Electrificació", description: "Una gamma completa de vehicles híbrids i elèctrics amb la tecnologia més avançada." },
  ]
};