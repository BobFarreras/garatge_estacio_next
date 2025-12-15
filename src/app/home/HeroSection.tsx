"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";
import { motion, Variants, Transition } from "framer-motion";

// Importacions d'imatges
import Hero from "@/../public/images/hero2.jpg";
import TexturaMetalica from "@/../public/images/texturametalica.jpeg";

// ✅ CORRECCIÓ: Eliminem el càsting 'as Transition["ease"]' que causava l'error.
// Framer Motion accepta arrays de 4 números (Cubic Bezier) directament.
const baseTransition: Transition = {
  duration: 0.7,
  ease: [0.22, 1, 0.36, 1], 
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: baseTransition },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

export function HeroSection() {
  const { t } = useTranslation();

  return (
    <section className="relative min-h-[100svh] w-full overflow-hidden">
      {/* Fons amb imatge + gradient */}
      <div className="absolute inset-0">
        <Image
          src={Hero}
          alt="Taller i carretera a l’alba"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/80" />
        <Image
          src={TexturaMetalica}
          alt="Textura metàl·lica"
          fill
          sizes="100vw"
          className="mix-blend-overlay opacity-20 object-cover pointer-events-none"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-[100svh] flex-col justify-center py-16">
          {/* Bloc superior: headline + sub + CTA */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="max-w-3xl"
          >
            <motion.h1
              variants={fadeUp}
              className="text-4xl leading-tight font-extrabold text-white py-4 sm:text-5xl lg:text-6xl"
            >
              {t("homePage.interactiveCard.title")}
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-5 max-w-2xl text-base sm:text-lg text-white/80"
            >
              {t("homePage.interactiveCard.text")}
            </motion.p>

            <motion.div variants={fadeUp} className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                href="/taller"
                className="inline-flex items-center justify-center rounded-full bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700 transition"
              >
                {t("homePage.serviceWorkshopBtn")}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/lloguer-autocaravanes"
                className="inline-flex items-center justify-center rounded-full bg-white/10 px-6 py-3 font-semibold text-white hover:bg-white/20 backdrop-blur transition"
              >
                {t("homePage.serviceMotorhomeRentalBtn")}
              </Link>
            </motion.div>
          </motion.div>

          {/* Vídeo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 sm:mt-14"
          >
            <div className="mx-auto w-full max-w-4xl rounded-3xl border border-white/10 bg-black/40 p-3 backdrop-blur-lg shadow-2xl">
              <div className="relative aspect-video w-full overflow-hidden rounded-2xl">
                <video autoPlay loop muted playsInline className="h-full w-full object-cover">
                  <source src="/videos/videologo.mp4" type="video/mp4" />
                  El teu navegador no suporta l'etiqueta de vídeo.
                </video>
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* “Ornaments” flotants subtils */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.25 }}
        transition={{ delay: 0.6, duration: 1.2 }}
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-red-600 blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.25 }}
        transition={{ delay: 0.8, duration: 1.2 }}
        className="pointer-events-none absolute -left-16 bottom-10 h-64 w-64 rounded-full bg-white blur-3xl"
      />
    </section>
  );
}