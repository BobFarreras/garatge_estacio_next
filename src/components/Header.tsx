"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import { cn } from "@/lib/utils";

// Components UI
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// Hook i dades que hem creat
import { useScrollPosition } from '@/hooks/useScrollPosition';
import { getNavLinks, getBrandLinks, getServiceLinks, getContactLink, type NavLink } from '@/config/navigation';

// Imatges
import logoImage from '@/../public/images/descarga-removebg-preview.png';
import ImgHyundai from "@/../public/images/hyundai.jpeg";
import ImgKia from "@/../public/images/kia.jpeg";

// --- SUB-COMPONENTS ESPECIALITZATS ---

// 1. Canviador d'idioma
const LanguageSwitcher = ({ isScrolled }: { isScrolled: boolean }) => {
  const { i18n } = useTranslation();
  const changeLanguage = (lng: string) => i18n.changeLanguage(lng);

  const getButtonClass = (lang: 'ca' | 'es') => {
    const isActive = i18n.language.startsWith(lang);
    if (isActive) {
      return isScrolled
        ? "bg-red-600 text-white hover:bg-red-700"
        : "bg-white text-red-600 hover:bg-gray-200";
    }
    return "hover:bg-white/20";
  };

  return (
    <div className="hidden lg:flex flex-1 justify-end items-center space-x-1">
      <Button onClick={() => changeLanguage('ca')} variant="ghost" size="sm" className={cn("font-semibold", getButtonClass('ca'))}>
        CA
      </Button>
      <span className={cn("transition-colors", isScrolled ? "text-gray-300" : "text-white/50")}>/</span>
      <Button onClick={() => changeLanguage('es')} variant="ghost" size="sm" className={cn("font-semibold", getButtonClass('es'))}>
        ES
      </Button>
    </div>
  );
};

// 2. Navegació per a Escriptori
const DesktopNavigation = () => {
  const { t } = useTranslation();
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  // Obtenim les dades dels enllaços cridant a les funcions
  const navLinks = getNavLinks(t);
  const serviceLinks = getServiceLinks(t);
  const contactLink = getContactLink(t);

  return (
    <nav className="hidden lg:flex justify-center absolute left-1/2 -translate-x-1/2">
      <NavigationMenu>
        <NavigationMenuList>
          {navLinks.map((link) => (
            <NavigationMenuItem key={link.key}>
              <NavigationMenuLink asChild>
                <Link href={link.path} className={navigationMenuTriggerStyle()}>
                  <span suppressHydrationWarning>{t(link.key)}</span>
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}

          <NavigationMenuItem>
            <NavigationMenuTrigger><span suppressHydrationWarning>{t('brands')}</span></NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-4 p-4 md:w-[500px] md:grid-cols-2 bg-white text-gray-800">
                <BrandCard href="/venda-hyundai" image={ImgHyundai} title="Hyundai" description={t('hyundaiDescription')} />
                <BrandCard href="/venda-kia" image={ImgKia} title="Kia" description={t('kiaDescription')} />
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          {serviceLinks.map((link) => (
            <NavigationMenuItem key={link.key}>
              <NavigationMenuLink asChild>
                <Link href={link.path} className={navigationMenuTriggerStyle()}>
                  <span suppressHydrationWarning>{t(link.key)}</span>
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}

          <NavigationMenuItem>
            {/* 1. NavigationMenuLink ara té la propietat "asChild" */}
            <NavigationMenuLink asChild active={isActive(contactLink.path)}>

              {/* 2. El component Link de Next.js va a dins */}
              <Link href={contactLink.path}>
                {/* El contingut es manté igual */}
                <span suppressHydrationWarning>{t(contactLink.key)}</span>
              </Link>

            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </nav>
  );
};

// Component per a les targetes de marca dins del menú
const BrandCard = ({ href, image, title, description }: { href: string, image: any, title: string, description: string }) => (
  <li>
    <NavigationMenuLink asChild>
      <Link href={href} className="relative block h-40 w-full rounded-xl overflow-hidden group">
        <Image src={image} alt={title} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
        <div className="absolute inset-0 bg-black/50 transition-colors"></div>
        <div className="absolute bottom-4 left-4 text-white">
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm"><span suppressHydrationWarning>{description}</span></p>
        </div>
      </Link>
    </NavigationMenuLink>
  </li>
);


// 3. Navegació per a Mòbil
const MobileNavigation = ({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (isOpen: boolean) => void; }) => {
  const { t, i18n } = useTranslation();
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;
  const changeLanguage = (lng: string) => i18n.changeLanguage(lng);

  const allLinks = [...getNavLinks(t), ...getServiceLinks(t), getContactLink(t)];
  const brandLinks = getBrandLinks(t);

  if (!isOpen) return null;

  return (
    <div className="lg:hidden bg-white border-t border-gray-200 text-gray-800">
      <div className="flex flex-col space-y-1 p-4">
        {allLinks.map((link) => (
          <Link key={link.key} href={link.path} onClick={() => setIsOpen(false)} className={`py-3 text-center text-lg ${isActive(link.path) ? 'text-red-600 font-semibold' : ''}`}>
            <span suppressHydrationWarning>{t(link.key)}</span>
          </Link>
        ))}
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="brands" className="border-b-0">
            <AccordionTrigger className="py-3 justify-center text-lg font-medium hover:no-underline">
              <span suppressHydrationWarning>{t('brands')}</span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col items-center space-y-1 pt-2">
                {brandLinks.map((brand) => (
                  <Link key={brand.key} href={brand.path} onClick={() => setIsOpen(false)} className={`py-3 text-muted-foreground text-md ${isActive(brand.path) ? 'text-red-600 font-semibold' : ''}`}>
                    <span suppressHydrationWarning>{t(brand.key)}</span>
                  </Link>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <div className="mt-4 pt-4 border-t flex items-center justify-center space-x-2">
          <Button onClick={() => { changeLanguage('ca'); setIsOpen(false); }} variant={i18n.language.startsWith('ca') ? 'default' : 'outline'} className="flex-1">Català</Button>
          <Button onClick={() => { changeLanguage('es'); setIsOpen(false); }} variant={i18n.language.startsWith('es') ? 'default' : 'outline'} className="flex-1">Español</Button>
        </div>
      </div>
    </div>
  );
};


// --- COMPONENT PRINCIPAL ORQUESTRADOR ---

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Utilitzem el nostre custom hook! Molt més net.
  const isScrolled = useScrollPosition(10);

  // La lògica del logo es queda aquí perquè afecta a tot el header.
  // Assumim que logoBlanc és diferent de logoImage. Si són iguals, aquesta lògica es pot simplificar.
  const logoBlanc = logoImage; // Canvia per la teva imatge de logo blanc
  const logoSrc = isScrolled ? logoImage : logoBlanc;

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      { 'bg-white shadow-md text-gray-800': isScrolled, 'bg-transparent text-white': !isScrolled }
    )}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-1 flex justify-start">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <Image src={logoSrc} alt="Logo de Garatge Estació" width={140} height={46} className="h-14 w-auto" priority />
            </Link>
          </div>

          <DesktopNavigation />

          <LanguageSwitcher isScrolled={isScrolled} />

          <div className="lg:hidden flex-1 flex justify-end">
            <Button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>

      <MobileNavigation isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen} />
    </header>
  );
};

export default Header;