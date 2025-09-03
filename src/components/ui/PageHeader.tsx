"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

type PageHeaderProps = {
  title: string;
  subtitle: string;
  imageUrl: string;
};

const PageHeader = ({ title, subtitle, imageUrl }: PageHeaderProps) => (
  <section className="relative h-[50vh] md:h-[60vh] flex items-center justify-center text-white overflow-hidden">
    {/* Capa de fons amb next/image per optimització */}
    <Image
      src={imageUrl}
      alt={title}
      fill
      priority // Aquesta imatge és important, que carregui ràpid
      className="object-cover"
      sizes="100vw"
    />
    {/* Capa fosca per sobre */}
    <div className="absolute inset-0 bg-black/60 z-10"></div>

    <div className="relative text-center p-4 z-20">
      <motion.h1
        className="text-4xl md:text-6xl font-extrabold mb-4 text-shadow-md"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {title}
      </motion.h1>
      <motion.p
        className="text-lg md:text-2xl max-w-3xl mx-auto text-shadow-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        {subtitle}
      </motion.p>
    </div>
  </section>
);

export default PageHeader;