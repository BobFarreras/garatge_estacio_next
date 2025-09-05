"use client";

import React from "react";
import Link from "next/link";
import Image, { StaticImageData } from "next/image";

import { useTranslation } from "react-i18next";
import { Wrench, Car, Caravan, ArrowRight } from "lucide-react";
// importacions rellevants
import { motion, Variants, Transition } from "framer-motion";

// Importacions d'imatges locals
import Hero from "@/../public/images/hero2.jpg";
import tallerMecanic from "@/../public/images/servies/manteniment.jpeg";
import LloguerCotxes from "@/../public/images/hyundai/ix5.avif";
import ImgLloguerAutocarabanes from "@/../public/images/autocaravanes/perfilAutocaravana.jpg";
import TexturaMetalica from "@/../public/images/texturametalica.jpeg";
import LloguerAutocaravanes from "./lloguer-autocaravanes/page";

/** --- Definicions tipades per a variants / transition --- */
// Si vols una corba cubic-bezier personalitzada, TS pot queixar-se del tipus,
// així que la guardem en un Transition i castejem l'ease.
const baseTransition: Transition = {
  duration: 0.7,
  // cast necessari per evitar error de tipus en algunes versions de framer-motion
  ease: [0.22, 1, 0.36, 1] as unknown as Transition["ease"],
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
// --- Imatges (URLs lliures/representatives) ---
const HERO_BG = Hero;
const TEXTURE_METAL = TexturaMetalica;

const SERVICE_TALLER = tallerMecanic;

const SERVICE_RENT_CAR = LloguerCotxes;

const SERVICE_RENT_MH = ImgLloguerAutocarabanes;



const stagger = {
  animate: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
};

export default function HomePageClient() {
  const { t } = useTranslation();

  return (
    <>
      {/* ================== HERO ================== */}
      <section className="relative min-h-[100svh] w-full overflow-hidden">
        {/* Fons amb imatge + gradient */}
        <div className="absolute inset-0">
          <Image
            src={HERO_BG}
            alt="Taller i carretera a l’alba"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/80" />
          {/* textura subtil al top */}
          <Image
            src={TEXTURE_METAL}
            alt="Textura metàl·lica"
            fill
            sizes="100vw"
            className="mix-blend-overlay opacity-20 object-cover pointer-events-none"
          />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-[100svh] flex-col justify-center py-16">
            {/* bloc superior: headline + sub + CTA */}
            <motion.div
              variants={stagger}
              initial="initial"
              animate="animate"
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

            {/* vídeo col·locat de forma “hero card” a desktop i sota a mòbil */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="mt-10 sm:mt-14"
            >
              <div className="mx-auto w-full max-w-4xl rounded-3xl border border-white/10 bg-black/40 p-3 backdrop-blur-lg shadow-2xl">
                <div className="relative aspect-video w-full overflow-hidden rounded-2xl">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="h-full w-full object-cover"
                >
                  {/* AQUESTA ÉS LA LÍNIA CORRECTA */}
                  <source src="/videos/videologo.mp4" type="video/mp4" />
                  El teu navegador no suporta l'etiqueta de vídeo.
                </video>
                  {/* gradient vora inferior per llegibilitat */}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* “ornaments” flotants subtils */}
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

     {/* ================== SERVEIS (targets amb imatge) ================== */}
<section className="relative bg-white py-16 sm:py-20 lg:py-24">
  {/* franja decorativa superior */}
  <div className="pointer-events-none absolute inset-x-0 -top-6 h-6 bg-gradient-to-b from-gray-100 to-white" />

  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6 }}
      className="mx-auto max-w-3xl text-center"
    >
      {/* --- MODIFICAT: Títol amb cantonades rodones --- */}
      <h2 className="inline-block rounded-lg bg-gray-100 px-5 py-2 text-3xl font-extrabold tracking-tight md:text-4xl text-gray-900">
        {t("homePage.servicesTitle")}
      </h2>
      <p className="mt-4 text-base sm:text-lg text-gray-600">
        {t("homePage.servicesSubtitle")}
      </p>
    </motion.div>

    {/* --- MODIFICAT: Més separació i alçada automàtica --- */}
    <div className="mt-10 grid grid-cols-1 gap-8 sm:mt-12 lg:grid-cols-3">
      {/* Target 1 - Taller */}
      <ServiceTile
        href="/taller"
        title={t("homePage.serviceWorkshopTitle")}
        description={t("homePage.serviceWorkshopDesc")}
        bg={SERVICE_TALLER}
        icon={<Wrench className="h-6 w-6" />}
        cta={t("homePage.serviceWorkshopBtn")}
      />

      {/* Target 2 - Lloguer cotxes */}
      <ServiceTile
        href="/lloguer-vehicles"
        title={t("homePage.serviceCarRentalTitle")}
        description={t("homePage.serviceCarRentalDesc")}
        bg={SERVICE_RENT_CAR}
        icon={<Car className="h-6 w-6" />}
        cta={t("homePage.serviceCarRentalBtn")}
      />

      {/* Target 3 - Lloguer autocaravanes */}
      <ServiceTile
        href="/lloguer-autocaravanes"
        title={t("homePage.serviceMotorhomeRentalTitle")}
        description={t("homePage.serviceMotorhomeRentalDesc")}
        bg={SERVICE_RENT_MH}
        icon={<Caravan className="h-6 w-6" />}
        cta={t("homePage.serviceMotorhomeRentalBtn")}
      />
    </div>
  </div>
</section>

      {/* ================== FRANJA CTA AMB TEXTURA ================== */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={TEXTURE_METAL}
            alt="Textura metàl·lica"
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/70" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center text-white">
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-2xl sm:text-3xl font-bold"
            >
              {t("homePage.interactiveCard.title")}
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-3 max-w-2xl text-white/80"
            >
              {t("homePage.interactiveCard.text")}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 flex flex-col sm:flex-row gap-3"
            >
              <Link
                href="/contacte"
                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 font-semibold text-gray-900 hover:bg-gray-100 transition"
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
          </div>
        </div>
      </section>
    </>
  );
}

function ServiceTile({
  href,
  title,
  description,
  bg,
  icon,
  cta,
}: {
  href: string;
  title: string;
  description: string;
  bg: StaticImageData; // 👈 només imatges importades
  icon: React.ReactNode;
  cta: string;
}) {
  return (
    // --- MODIFICAT: Afegim h-full per ocupar tota l'alçada de la cel·la del grid ---
    <Link href={href} className="w-full h-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6 }}
        // --- MODIFICAT: h-full, rounded-3xl (estàndard) i eliminem min-height ---
        className="group relative flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-lg transition-all duration-500 hover:shadow-2xl cursor-pointer"
      >
        {/* IMATGE A SOBRE */}
        {/* --- MODIFICAT: Alçada fixa per a la imatge per donar més espai al text --- */}
        <div className="relative w-full h-64 overflow-hidden">
          <Image
            src={bg}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-transparent" />
        </div>

        {/* CONTINGUT DE TEXT */}
        {/* --- MODIFICAT: Eliminem el contenidor extra i ajustem padding --- */}
        <div className="p-6 flex flex-col flex-grow">
          <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 leading-relaxed flex-grow">
            {description}
          </p>
          
          {/* CTA (botó) a la part inferior */}
          <span className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-red-600 px-5 py-2.5 font-semibold text-white transition hover:bg-red-700">
             {cta}
             <ArrowRight className="h-5 w-5" />
          </span>
        </div>
      </motion.div>
    </Link>
  );
}