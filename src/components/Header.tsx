"use client";

import React from 'react';
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

  const changeLanguage = (lng: string) => i18n.changeLanguage(lng);
  
  const navLinks: NavLinkItem[] = [ { name: t('home'), path: '/' }, { name: t('workshop'), path: '/taller' } ];
  const brandLinks: NavLinkItem[] = [ { name: 'Hyundai', path: '/venda-hyundai', description: t('hyundaiDescription') }, { name: 'Kia', path: '/venda-kia', description: t('kiaDescription') } ];
  const serviceLinks: NavLinkItem[] = [ { name: t('carRental'), path: '/lloguer-vehicles' }, { name: t('motorhomeRental'), path: '/lloguer-autocaravanes' } ];
  const contactLink: NavLinkItem = { name: t('contact'), path: '/contacte' };
  
  const isActive = (path: string) => pathname === path;

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-1 flex justify-start">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <Image src="https://res.cloudinary.com/dvqhfapep/image/upload/v1753165725/descarga-removebg-preview_oplcv0.png" alt="Logo de Garatge Estació" width={160} height={56} className="h-14 w-auto" priority />
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
                  <NavigationMenuContent className="bg-white shadow-md"> {/* ✅ ADDED */}
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[450px] md:grid-cols-2">
                      {brandLinks.map((brand) => (
                        <ListItem key={brand.name} href={brand.path} title={brand.name}>
                          {brand.description}
                        </ListItem>
                      ))}
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
            <Button onClick={() => changeLanguage('ca')} variant="ghost" size="sm" className={cn("font-semibold", i18n.language.startsWith('ca') && "bg-red-600 text-white hover:bg-red-700")}> {/* ✅ UPDATED */}
                CA
            </Button>
            <span className="text-gray-300">/</span>
            <Button onClick={() => changeLanguage('es')} variant="ghost" size="sm" className={cn("font-semibold", i18n.language.startsWith('es') && "bg-red-600 text-white hover:bg-red-700")}> {/* ✅ UPDATED */}
                ES
            </Button>
          </div>
          <div className="lg:hidden flex-1 flex justify-end">
            <Button onClick={() => setIsOpen(!isOpen)} variant="ghost" size="icon"><Menu className="h-6 w-6" /></Button>
          </div>
        </div>
      </div>
      {/* Mobile menu remains the same as its Links are direct */}
      {isOpen && ( 
        <div className="lg:hidden bg-white border-t border-gray-200">
          <div className="flex flex-col space-y-1 p-4">
              {[...navLinks, ...serviceLinks, contactLink].map((link) => (<Link key={link.name} href={link.path} onClick={() => setIsOpen(false)} className={`py-3 text-center text-lg ${isActive(link.path) ? 'text-red-600 font-semibold' : ''}`}>{link.name}</Link>))}
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1" className="border-b-0">
                    <AccordionTrigger className="py-3 justify-center text-lg font-medium">{t('brands')}</AccordionTrigger>
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
