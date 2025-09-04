"use client";

import React from 'react';
import Link from 'next/link'; // ✅ Import de Next.js
import { Instagram } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import logoImage from '@/../public/images/descarga-removebg-preview.png';

const Footer = () => {
    const { t } = useTranslation();
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-800 text-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <Link href="/" className="inline-block mb-4">
                            <Image src={logoImage} alt="Logo de Garatge Estació" width={160} height={56} className="h-14 w-auto" />
                        </Link>
                        <p className="text-gray-400">{t('footer.description')}</p>
                    </div>
                    <div>
                        <p className="font-bold text-lg mb-4">{t('footer.servicesTitle')}</p>
                        <ul className="space-y-2">
                            <li><Link href="/taller" className="text-gray-400 hover:text-white">{t('footer.service1')}</Link></li>
                            <li><Link href="/lloguer-vehicles" className="text-gray-400 hover:text-white">{t('footer.service2')}</Link></li>
                            <li><Link href="/lloguer-autocaravanes" className="text-gray-400 hover:text-white">{t('footer.service3')}</Link></li>
                        </ul>
                    </div>
                    <div>
                        <p className="font-bold text-lg mb-4">{t('footer.contactTitle')}</p>
                        <ul className="space-y-2 text-gray-400">
                            <li>C/ Ramon Serradell, 21, 17100</li>
                            <li>La Bisbal d'Empordà, Girona</li>
                            <li><a href="tel:+34972640204" className="hover:text-white">Tel: 972 640 204</a></li>
                            <li><a href="mailto:info@garatgeestacio.com" className="hover:text-white">info@garatgeestacio.com</a></li>
                        </ul>
                    </div>
                    <div>
                        <p className="font-bold text-lg mb-4">{t('footer.followUsTitle')}</p>
                        <div className="flex space-x-4">
                            <a href="https://www.instagram.com/garatge_estacio_bisbal/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white"><Instagram /></a>
                        </div>
                    </div>
                </div>
                
                <div className="mt-8 pt-8 border-t border-gray-700 flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 text-gray-400 text-sm">
                    <Link href="/avis_legal" className="hover:text-white">Avís Legal</Link>
                    <span className="hidden sm:inline">|</span>
                    <Link href="/politica_de_privacitat" className="hover:text-white">Política de Privacitat</Link>
                    <span className="hidden sm:inline">|</span>
                    <Link href="/politica_de_cookies" className="hover:text-white">Política de Cookies</Link>
                </div>

                <div className="mt-8 pt-4 border-t border-gray-700 text-center text-gray-500">
                    <p>{t('footer.copyright', { year: currentYear })}</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
