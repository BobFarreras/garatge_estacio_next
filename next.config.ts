import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 1. Solució per a l'error de Prettier i React Email
  // Això evita que Next.js intenti empaquetar aquestes llibreries i les busqui directament a node_modules
  serverExternalPackages: ['@react-email/render', 'prettier'],

  images: {
    // 2. Solució per a l'avís d'AVIF (juntament amb haver instal·lat 'sharp')
    formats: ['image/avif', 'image/webp'],

    // La teva configuració existent de dominis externs
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.gestionaweb.cat',
        // Nota: És bona pràctica afegir pathname '/**' si vols permetre qualsevol ruta
        pathname: '/**', 
      }
    ],
  },
};

export default nextConfig;