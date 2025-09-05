
// src/lib/getAllPages.ts

export async function getAllPages(): Promise<string[]> {
    // 1. Pàgines estàtiques principals de la teva aplicació
    const staticPages = [
      '/',
      '/taller',
      '/cites',
      '/lloguer/autocaravanes',
      '/lloguer/vehicles',
      '/contacte',
      '/avis-legal',
      '/politica-privacitat',
    ];
  
    // 2. Pàgines dinàmiques (Exemple per al futur)
    // Si en el futur tinguessis un blog, aquí cridaries a la teva API
    // per obtenir tots els articles i afegir les seves URLs.
    // const articleSlugs = await fetchArticleSlugsFromCMS(); // -> ['el-meu-article-1', 'un-altre-article']
    // const dynamicPages = articleSlugs.map(slug => `/blog/${slug}`);
  
    // 3. Retornem totes les pàgines juntes
    // De moment, només tenim les estàtiques
    return staticPages;
  }
  