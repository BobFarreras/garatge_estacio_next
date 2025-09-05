// src/app/sitemap.ts
import { getAllPages } from '@/lib/getAllPages'; // Crearem una funció que reculli totes les URLs del site

export default async function sitemap() {
  const pages = await getAllPages(); // ['/', '/taller', '/lloguer', '/contacte']

  const baseUrl = 'https://garatgeestacio.com';

  return pages.map((page) => ({
    url: `${baseUrl}${page}`,
    lastModified: new Date().toISOString(),
  }));
}
