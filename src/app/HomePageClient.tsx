"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Wrench, Car, Caravan } from 'lucide-react';
import ServiceCard from '@/components/ServiceCard';

const textContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.3, delayChildren: 1.0 },
  },
};

const textItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const HomePageClient = () => {
  const { t } = useTranslation();

  return (
    <>
      {/* SECCIÓ HERO PRINCIPAL */}
      <main className="animated-gradient relative h-screen w-full flex items-center justify-center p-4 md:p-8 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-7xl h-auto md:h-[80vh] min-h-[600px] bg-black/10 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden"
        >
          {/* COLUMNA ESQUERRA: EL VÍDEO */}
          <motion.div 
            initial={{ x: '-100%', y: '-20%' }}
            animate={{ x: '0%', y: '0%' }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="w-full md:w-3/5 h-1/2 md:h-full bg-black flex items-center justify-center"
          >
            <video 
              autoPlay
              loop
              muted
              playsInline
              className="w-auto h-auto max-w-full max-h-full" 
            >
              <source src="https://res.cloudinary.com/dvqhfapep/video/upload/v1753873758/Logo_garatge_estacio_uqduhs.mp4" type="video/mp4" />
            </video>
          </motion.div>

          {/* COLUMNA DRETA: EL TEXT */}
          <motion.div 
            initial={{ x: '100%', y: '20%' }}
            animate={{ x: '0%', y: '0%' }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="w-full md:w-2/5 h-1/2 md:h-full flex flex-col justify-center p-8 lg:p-16 text-white"
          >
            <motion.div
              variants={textContainerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.h2 
                variants={textItemVariants}
                className="text-4xl lg:text-5xl xl:text-6xl font-bold text-shadow-md leading-tight"
              >
                {t('homePage.interactiveCard.title')}
              </motion.h2>
              <motion.p 
                variants={textItemVariants}
                className="text-lg text-white/80 mt-6"
              >
                {t('homePage.interactiveCard.text')}
              </motion.p>
            </motion.div>
          </motion.div>
        </motion.div>
      </main>
      
      {/* SECCIÓ DE SERVEIS PRINCIPALS */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('homePage.servicesTitle')}</h2>
            <p className="max-w-2xl mx-auto text-gray-600 mb-12">{t('homePage.servicesSubtitle')}</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ServiceCard 
              icon={<Wrench className="h-10 w-10 text-red-600" />}
              title={t('homePage.serviceWorkshopTitle')}
              description={t('homePage.serviceWorkshopDesc')}
              link="/taller"
              linkText={t('homePage.serviceWorkshopBtn')}
            />
            <ServiceCard 
              icon={<Car className="h-10 w-10 text-red-600" />}
              title={t('homePage.serviceCarRentalTitle')}
              description={t('homePage.serviceCarRentalDesc')}
              link="/lloguer-vehicles"
              linkText={t('homePage.serviceCarRentalBtn')}
            />
            <ServiceCard 
              icon={<Caravan className="h-10 w-10 text-red-600" />}
              title={t('homePage.serviceMotorhomeRentalTitle')}
              description={t('homePage.serviceMotorhomeRentalDesc')}
              link="/lloguer-autocaravanes"
              linkText={t('homePage.serviceMotorhomeRentalBtn')}
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePageClient;