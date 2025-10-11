"use client";

import React from "react";
import { HeroSection } from "./home/HeroSection";
import { ServicesSection } from "./home/ServicesSection";
import { CtaSection } from "./home/CtaSection";

export default function HomePageClient() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <CtaSection />
    </>
  );
}