import { ShieldCheck, Zap, Car } from 'lucide-react';

// ✅ CORRECTION: Add 'export' before 'const'
export const hyundaiData = {
  brand: "Hyundai",
  hero: {
    title: "Hyundai a La Bisbal d'Empordà",
    subtitle: "Descobreix la innovació, el disseny i la fiabilitat de la gamma Hyundai.",
    imageUrl: "https://res.cloudinary.com/dvqhfapep/image/upload/v1753165270/rrrr_ix5gmd.avif"
  },
  models: [
    { name: 'i20', type: 'Turisme', image: 'https://res.cloudinary.com/dvqhfapep/image/upload/v1753163915/i20_w2dhil.jpg', description: 'El cotxe urbà que ho té tot: estil, tecnologia i seguretat.', features: ['Assistent de carril', 'Pantalla tàctil 10.25"', 'Connectivitat Bluelink®'] },
    { name: 'TUCSON', type: 'SUV', image: 'https://res.cloudinary.com/dvqhfapep/image/upload/v1753163915/tucson_cezo0t.jpg', description: 'El SUV revolucionari amb un disseny que no deixa indiferent a ningú.', features: ['Híbrid, dièsel o gasolina', 'Sistemes de seguretat avançats', 'Sostre solar panoràmic'] },
    { name: 'IONIQ 5', type: 'Elèctric', image: 'https://res.cloudinary.com/dvqhfapep/image/upload/v1753163915/ioniq5_joaqjc.jpg', description: 'El futur de la mobilitat elèctrica. Càrrega ultra-ràpida i un interior innovador.', features: ['Fins a 507 km d\'autonomia', 'Càrrega del 10 al 80% en 18 min', 'Disseny retro-futurista'] },
    { name: 'KONA', type: 'SUV', image: 'https://res.cloudinary.com/dvqhfapep/image/upload/v1753163915/kona_pipidg.jpg', description: 'Atrevit, versàtil i disponible en versions híbrides i elèctriques.', features: ['Disponible en HEV i EV', 'Pantalles panoràmiques duals', 'Espai interior optimitzat'] },
    { name: 'IONIQ 6', type: 'Elèctric', image: 'https://res.cloudinary.com/dvqhfapep/image/upload/v1753163915/ionic6_utmryt.jpg', description: 'La berlina elèctrica amb un disseny aerodinàmic i una autonomia sorprenent.', features: ['Fins a 614 km d\'autonomia', 'Coeficient aerodinàmic de 0.21', 'Interior espaiós i minimalista'] }
  ],
  features: [
    { icon: ShieldCheck, title: "5 Anys de Garantia", description: "Sense límit de quilòmetres per a la teva total tranquil·litat." },
    { icon: Zap, title: "Tecnologia d'Avantguarda", description: "Models híbrids i elèctrics líders en eficiència i rendiment." },
    { icon: Car, title: "Assessorament Personalitzat", description: "T'ajudem a trobar el Hyundai perfecte per a les teves necessitats." }
  ]
};