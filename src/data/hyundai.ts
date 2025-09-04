// /data/hyundai.ts

import { ShieldCheck, Zap, Car } from 'lucide-react';

export const hyundaiData = {
  brand: "Hyundai",
  hero: {
    title: "Hyundai a La Bisbal d'Empordà",
    subtitle: "Descobreix la innovació, el disseny i la fiabilitat de la gamma Hyundai.",
    // Eliminem imageUrl
  },
  models: [
    // Afegim un 'id' per identificar cada model fàcilment
    { id: 'i20', name: 'i20', type: 'Turisme', description: 'El cotxe urbà que ho té tot: estil, tecnologia i seguretat.', features: ['Assistent de carril', 'Pantalla tàctil 10.25"', 'Connectivitat Bluelink®'] },
    { id: 'tucson', name: 'TUCSON', type: 'SUV', description: 'El SUV revolucionari amb un disseny que no deixa indiferent a ningú.', features: ['Híbrid, dièsel o gasolina', 'Sistemes de seguretat avançats', 'Sostre solar panoràmic'] },
    { id: 'ioniq5', name: 'IONIQ 5', type: 'Elèctric', description: 'El futur de la mobilitat elèctrica. Càrrega ultra-ràpida i un interior innovador.', features: ['Fins a 507 km d\'autonomia', 'Càrrega del 10 al 80% en 18 min', 'Disseny retro-futurista'] },
    { id: 'kona', name: 'KONA', type: 'SUV', description: 'Atrevit, versàtil i disponible en versions híbrides i elèctriques.', features: ['Disponible en HEV i EV', 'Pantalles panoràmiques duals', 'Espai interior optimitzat'] },
    { id: 'ioniq6', name: 'IONIQ 6', type: 'Elèctric', description: 'La berlina elèctrica amb un disseny aerodinàmic i una autonomia sorprenent.', features: ['Fins a 614 km d\'autonomia', 'Coeficient aerodinàmic de 0.21', 'Interior espaiós i minimalista'] }
  ],
  features: [
    { icon: ShieldCheck, title: "5 Anys de Garantia", description: "Sense límit de quilòmetres per a la teva total tranquil·litat." },
    { icon: Zap, title: "Tecnologia d'Avantguarda", description: "Models híbrids i elèctrics líders en eficiència i rendiment." },
    { icon: Car, title: "Assessorament Personalitzat", description: "T'ajudem a trobar el Hyundai perfecte per a les teves necessitats." }
  ]
};