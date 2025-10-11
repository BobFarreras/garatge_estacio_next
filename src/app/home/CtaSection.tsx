"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

// Importacions d'imatges
import TexturaMetalica from "@/../public/images/texturametalica.jpeg";

export function CtaSection() {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={TexturaMetalica}
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
  );
}