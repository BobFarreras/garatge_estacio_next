"use client";

import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin } from 'lucide-react';
import dynamic from 'next/dynamic';

const MapaContacte = dynamic(() => import('@/components/MapaContacte'), {
    ssr: false,
    loading: () => <div className="flex justify-center items-center h-full bg-gray-200">Carregant mapa...</div>
});

export const ContactInfo = () => {
    const { t } = useTranslation();

    return (
        <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }} viewport={{ once: true }} className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold mb-6">{t('contactPage.contactInfo')}</h2>
                <div className="space-y-4">
                    <div className="flex items-start"><MapPin className="h-6 w-6 mr-4 text-red-600 mt-1 flex-shrink-0" /><div><p className="font-semibold">{t('contactPage.address')}</p><p className="text-gray-600">Carrer Ramon Serradell, 21<br/>17100 La Bisbal d'Empordà, Girona</p></div></div>
                    <div className="flex items-start"><Phone className="h-6 w-6 mr-4 text-red-600 mt-1 flex-shrink-0" /><div><p className="font-semibold">{t('contactPage.phone')}</p><a href="tel:+34972640204" className="text-gray-600 hover:text-red-600">972 640 204</a></div></div>
                    <div className="flex items-start"><Mail className="h-6 w-6 mr-4 text-red-600 mt-1 flex-shrink-0" /><div><p className="font-semibold">{t('contactPage.email')}</p><a href="mailto:info@garatgeestacio.com" className="text-gray-600 hover:text-red-600">info@garatgeestacio.com</a></div></div>
                </div>
            </div>
            <div>
                <h3 className="text-2xl font-bold mb-4">{t('contactPage.schedule')}</h3>
                <p className="text-gray-600"><strong>{t('contactPage.weekdays')}</strong> 8:00 - 18:00</p>
                <p className="text-gray-600"><strong>{t('contactPage.saturday')}</strong> {t('contactPage.closed')}</p>
                <p className="text-gray-600"><strong>{t('contactPage.sunday')}</strong> {t('contactPage.closed')}</p>
            </div>
            <div className="h-96 md:h-[500px] rounded-lg overflow-hidden shadow-lg">
                <MapaContacte />
            </div>
        </motion.div>
    );
};