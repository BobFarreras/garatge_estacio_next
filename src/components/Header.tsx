"use client";

import React, { useState, useEffect } from 'react'; // NOU: Importem useState i useEffect
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import { cn } from "@/lib/utils";

import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";

import logoImage from '@/../public/images/descarga-removebg-preview.png';
import ImgHyundai from "@/../public/images/hyundai.jpeg";
import ImgKia from "@/../public/images/kia.jpeg";

interface NavLinkItem {
  name: string;
  path: string;
  description?: string;
}

const ListItem = React.forwardRef<React.ElementRef<typeof Link>, React.ComponentPropsWithoutRef<typeof Link>>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <Link ref={ref} className={cn("block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground", className)} {...props}>
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
          </Link>
        </NavigationMenuLink>
      </li>
    )
  }
)
ListItem.displayName = 'ListItem'

const Header = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { t, i18n } = useTranslation();
  const pathname = usePathname();

  // NOU: Estats per controlar l'scroll i el canvi de logo
  const [isScrolled, setIsScrolled] = useState(false);
  const [logoSrc, setLogoSrc] = useState(logoImage);
  
  const logoNormal = logoImage;
  // IMPORTANT: Canvia aquesta URL per la del teu logo en versió blanca
  const logoBlanc = logoImage;

  // NOU: Hook useEffect per detectar l'event d'scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) { // Canvia a blanc després de 10px de scroll
        setIsScrolled(true);
        setLogoSrc(logoNormal);
      } else {
        setIsScrolled(false);
        setLogoSrc(logoBlanc);
      }
    };
    
    // Afegeix l'event listener quan el component es munta
    window.addEventListener('scroll', handleScroll);
    
    // Neteja l'event listener quan el component es desmunta
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [logoNormal, logoBlanc]); // Es torna a executar si les URLs dels logos canvien

  const changeLanguage = (lng: string) => i18n.changeLanguage(lng);
  
  const navLinks: NavLinkItem[] = [ { name: t('home'), path: '/' }, { name: t('workshop'), path: '/taller' } ];
  const brandLinks: NavLinkItem[] = [ { name: 'Hyundai', path: '/venda-hyundai', description: t('hyundaiDescription') }, { name: 'Kia', path: '/venda-kia', description: t('kiaDescription') } ];
  const serviceLinks: NavLinkItem[] = [ { name: t('carRental'), path: '/lloguer-vehicles' }, { name: t('motorhomeRental'), path: '/lloguer-autocaravanes' } ];
  const contactLink: NavLinkItem = { name: t('contact'), path: '/contacte' };
  
  const isActive = (path: string) => pathname === path;

  return (
    // MODIFICAT: Classes dinàmiques al header
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      {
        'bg-white shadow-md text-gray-800': isScrolled,
        'bg-transparent text-white': !isScrolled
      }
    )}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-1 flex justify-start">
            <Link href="/" className="flex-shrink-0 flex items-center">
              {/* MODIFICAT: La font del logo ara és dinàmica */}
              <Image src={logoSrc} alt="Logo de Garatge Estació" width={140} height={46} className="h-14 w-auto" priority />
            </Link>
          </div>
          <nav className="hidden lg:flex justify-center absolute left-1/2 -translate-x-1/2">
            <NavigationMenu>
              <NavigationMenuList>
                
                {navLinks.map((link) => (
                  <NavigationMenuItem key={link.name}>
                    <NavigationMenuLink asChild active={isActive(link.path)}>
                      <Link href={link.path} className={navigationMenuTriggerStyle()}>
                        {link.name}
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
                
                <NavigationMenuItem>
  <NavigationMenuTrigger>{t('brands')}</NavigationMenuTrigger>
  <NavigationMenuContent className="bg-white shadow-md text-gray-800">
    <ul className="grid w-[400px] gap-4 p-4 md:w-[500px] md:grid-cols-2">
      {/* Hyundai */}
      <li>
        <NavigationMenuLink asChild>
          <Link
            href="/venda-hyundai"
            className="relative block h-40 w-full rounded-xl overflow-hidden group"
          >
            <Image
              src={ImgHyundai}
              alt="Hyundai"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/50 group-hover:bg-black/50 transition-colors"></div>
            <div className="absolute bottom-4 left-4 text-white">
              <h3 className="text-lg font-semibold">Hyundai</h3>
              <p className="text-sm text-white">
                {t('hyundaiDescription')}
              </p>
            </div>
          </Link>
        </NavigationMenuLink>
      </li>

      {/* Kia */}
      <li>
        <NavigationMenuLink asChild>
          <Link
            href="/venda-kia"
            className="relative block h-40 w-full rounded-xl overflow-hidden group"
          >
            <Image
              src={ImgKia}
              alt="Kia"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/50 group-hover:bg-black/50 transition-colors"></div>
            <div className="absolute bottom-4 left-4 text-white">
              <h3 className="text-lg font-semibold">Kia</h3>
              <p className="text-sm text-white">
                {t('kiaDescription')}
              </p>
            </div>
          </Link>
        </NavigationMenuLink>
      </li>
    </ul>
  </NavigationMenuContent>
</NavigationMenuItem>


                {serviceLinks.map((link) => (
                  <NavigationMenuItem key={link.name}>
                    <NavigationMenuLink asChild active={isActive(link.path)}>
                      <Link href={link.path} className={navigationMenuTriggerStyle()}>
                        {link.name}
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}

                <NavigationMenuItem>
                  <NavigationMenuLink asChild active={isActive(contactLink.path)}>
                    <Link href={contactLink.path} className={navigationMenuTriggerStyle()}>
                      {contactLink.name}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

              </NavigationMenuList>
            </NavigationMenu>
          </nav>
          <div className="hidden lg:flex flex-1 justify-end items-center space-x-1">
            {/* MODIFICAT: Canvis de color dinàmics als botons d'idioma */}
            <Button onClick={() => changeLanguage('ca')} variant="ghost" size="sm" className={cn("font-semibold", i18n.language.startsWith('ca') ? (isScrolled ? "bg-red-600 text-white hover:bg-red-700" : "bg-white text-red-600 hover:bg-gray-200") : "hover:bg-white/20")}>
                CA
            </Button>
            <span className={cn("transition-colors", isScrolled ? "text-gray-300" : "text-white/50")}>/</span>
            <Button onClick={() => changeLanguage('es')} variant="ghost" size="sm" className={cn("font-semibold", i18n.language.startsWith('es') ? (isScrolled ? "bg-red-600 text-white hover:bg-red-700" : "bg-white text-red-600 hover:bg-gray-200") : "hover:bg-white/20")}>
                ES
            </Button>
          </div>
          <div className="lg:hidden flex-1 flex justify-end">
            <Button onClick={() => setIsOpen(!isOpen)} variant="ghost" size="icon"><Menu className="h-6 w-6" /></Button>
          </div>
        </div>
      </div>
      {/* El menú mòbil es manté igual, ja que té el seu propi fons blanc */}
      {isOpen && ( 
        <div className="lg:hidden bg-white border-t border-gray-200 text-gray-800">
          <div className="flex flex-col space-y-1 p-4">
              {[...navLinks, ...serviceLinks, contactLink].map((link) => (<Link key={link.name} href={link.path} onClick={() => setIsOpen(false)} className={`py-3 text-center text-lg ${isActive(link.path) ? 'text-red-600 font-semibold' : ''}`}>{link.name}</Link>))}
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1" className="border-b-0">
                    <AccordionTrigger className="py-3 justify-center text-lg font-medium hover:no-underline">{t('brands')}</AccordionTrigger>
                    <AccordionContent>
                        <div className="flex flex-col items-center space-y-1 pt-2">
                            {brandLinks.map((brand) => (
                                <Link key={brand.name} href={brand.path} onClick={() => setIsOpen(false)} className={`py-3 text-muted-foreground text-md ${isActive(brand.path) ? 'text-red-600 font-semibold' : ''}`}>{brand.name}</Link>
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
        )}
    </header>
  );
};
export default Header;