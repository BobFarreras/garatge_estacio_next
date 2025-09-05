// src/lib/getAllPages.ts

export async function getAllPages(): Promise<string[]> {
  // 1. Pàgines estàtiques principals de la teva aplicació
  const staticPages = [
    '/',
    '/taller',
    '/cites',
    '/venda-hyundai',
    '/venda-kia',
    '/lloguer/autocaravanes',
    '/lloguer/vehicles',
    '/contacte',
    '/avis-legal',
    '/politica-privacitat',
    '/politica_de_cookies',
  ];

  // 2. Pàgines dinàmiques (Exemple per al futur)
  // Si en el futur tinguessis un blog o una secció de notícies,
  // aquí es podria afegir la lògica per obtenir les seves URLs
  // automàticament des d'un CMS o base de dades.
  // const dynamicPages = await fetchBlogArticles();

  // 3. Retornem totes les pàgines juntes
  return staticPages;
}

