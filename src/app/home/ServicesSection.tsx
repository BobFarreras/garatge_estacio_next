"use client";

import React from "react";
import Link from "next/link";
import Image, { StaticImageData } from "next/image";
import { useTranslation } from "react-i18next";
import { Wrench, Car, Caravan, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

// Importacions d'imatges
import tallerMecanic from "@/../public/images/servies/manteniment.jpeg";
import LloguerCotxes from "@/../public/images/hyundai/ix5.jpg";
// 🚫 COMENTAT TEMPORALMENT
// import ImgLloguerAutocarabanes from "@/../public/images/autocaravanes/perfilAutocaravana.jpg";

export function ServicesSection() {
  const { t } = useTranslation();

  return (
    <section className="relative bg-white py-16 sm:py-20 lg:py-24">
      <div className="pointer-events-none absolute inset-x-0 -top-6 h-6 bg-gradient-to-b from-gray-100 to-white" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <h2 className="inline-block rounded-lg bg-gray-100 px-5 py-2 text-3xl font-extrabold tracking-tight md:text-4xl text-gray-900">
            {t("homePage.servicesTitle")}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600">
            {t("homePage.servicesSubtitle")}
          </p>
        </motion.div>

        <div className="mt-10 grid grid-cols-1 gap-8 sm:mt-12 lg:grid-cols-3">
          <ServiceTile
            href="/taller"
            title={t("homePage.serviceWorkshopTitle")}
            description={t("homePage.serviceWorkshopDesc")}
            bg={tallerMecanic}
            icon={<Wrench className="h-6 w-6" />}
            cta={t("homePage.serviceWorkshopBtn")}
          />
          <ServiceTile
            href="/lloguer-vehicles"
            title={t("homePage.serviceCarRentalTitle")}
            description={t("homePage.serviceCarRentalDesc")}
            bg={LloguerCotxes}
            icon={<Car className="h-6 w-6" />}
            cta={t("homePage.serviceCarRentalBtn")}
          />
          {/* 🚫 COMENTAT TEMPORALMENT PER PETICIÓ DEL CLIENT
          <ServiceTile
            href="/lloguer-autocaravanes"
            title={t("homePage.serviceMotorhomeRentalTitle")}
            description={t("homePage.serviceMotorhomeRentalDesc")}
            bg={ImgLloguerAutocarabanes}
            icon={<Caravan className="h-6 w-6" />}
            cta={t("homePage.serviceMotorhomeRentalBtn")}
          />
          */}
        </div>
      </div>
    </section>
  );
}

// Sub-component per a les targetes de servei
function ServiceTile({ href, title, description, bg, icon, cta }: {
  href: string;
  title: string;
  description: string;
  bg: StaticImageData;
  icon: React.ReactNode;
  cta: string;
}) {
  return (
    <Link href={href} className="w-full h-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6 }}
        className="group relative flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-lg transition-all duration-500 hover:shadow-2xl cursor-pointer"
      >
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
        <div className="p-6 flex flex-col flex-grow">
          <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 leading-relaxed flex-grow">{description}</p>
          <span className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-red-600 px-5 py-2.5 font-semibold text-white transition hover:bg-red-700">
            {cta}
            <ArrowRight className="h-5 w-5" />
          </span>
        </div>
      </motion.div>
    </Link>
  );
}