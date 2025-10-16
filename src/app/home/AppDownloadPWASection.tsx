// src/app/home/AppDownloadPWASection.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
// ✅ Utilitzem les icones corregides
import { Apple, Smartphone, Monitor, Share, SquarePlus, Loader2 } from 'lucide-react';
import { toast } from "sonner";
import { Button } from '@/components/ui/button';
import Image from 'next/image';// Extensió de tipus per a l'esdeveniment PWA

interface BeforeInstallPromptEvent extends Event {
    prompt(): Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}
declare global {
    interface Window {
        addEventListener(type: 'beforeinstallprompt', listener: (e: BeforeInstallPromptEvent) => void): void;
        removeEventListener(type: 'beforeinstallprompt', listener: (e: BeforeInstallPromptEvent) => void): void;
    }
}
const APP_ICON_SRC = '/android-chrome-192x192.png';

export function AppDownloadPWASection() {
    const { t } = useTranslation();
    const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [isIOS, setIsIOS] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);
    const [isCompatible, setIsCompatible] = useState(false);

    // El disseny de 3 columnes es manté, però només el botó actiu funciona com a prompt.
    // Llista de plataformes per mantenir l'estructura de disseny.
    const platforms = [
        { id: 'android', name: t('app.platformAndroid'), icon: Smartphone, color: 'text-green-600', bgClass: 'bg-green-50 hover:bg-green-100' },
        { id: 'ios', name: t('app.platformiOS'), icon: Apple, color: 'text-gray-900', bgClass: 'bg-gray-100 hover:bg-gray-200' },
        { id: 'desktop', name: t('app.platformDesktop'), icon: Monitor, color: 'text-blue-600', bgClass: 'bg-blue-50 hover:bg-blue-100' },
    ];

    useEffect(() => {
        // Detecció de dispositiu
        const isIOSDevice =
            /iPad|iPhone|iPod/.test(navigator.platform) ||
            (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
        setIsIOS(isIOSDevice);

        // Detecció mode standalone (ja instal·lada)
        const isAppInstalled = window.matchMedia("(display-mode: standalone)").matches;
        setIsStandalone(isAppInstalled);

        // ------------------------------------------------
        // Captura de l'event 'beforeinstallprompt'
        // ------------------------------------------------
        const handleBeforeInstallPrompt = (event: Event) => {
            console.log("✅ [GaratgePWA] Event 'beforeinstallprompt' detectat!");
            event.preventDefault();
            setInstallPrompt(event as BeforeInstallPromptEvent);
            setIsCompatible(true);
        };

        window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

        // ------------------------------------------------
        // Registre del Service Worker (Crida aquí)
        // ------------------------------------------------
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker
                // ✅ Assumint que el fitxer sw.js està a la carpeta public
                .register("/sw.js")
                .then(() => console.log("✅ [GaratgePWA] Service Worker registrat."))
                // NOTA: Si l'error 404 persisteix, s'ha de comprovar la ruta física.
                .catch((error) => console.error("❌ [GaratgePWA] Error registrant SW:", error));
        }

        return () => {
            window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        };
    }, []);

    // ------------------------------------------------
    // Funció per disparar la instal·lació (Android/Desktop)
    // ------------------------------------------------
    const handleInstallClick = async (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.preventDefault();

        if (isIOS) {
            // No hi ha prompt a iOS, mostrem instruccions manuals (tot i que el component ja les mostra)
            toast.info(t('app.iosInstructionTitle'), {
                description: t('app.iosStep1') + ' / ' + t('app.iosStep2'),
            });
            return;
        }

        if (installPrompt) {
            console.log("📲 [GaratgePWA] Mostrant prompt d'instal·lació...");
            await installPrompt.prompt();
            const { outcome } = await installPrompt.userChoice;

            if (outcome === 'accepted') {
                toast.success(t('app.installAccepted'));
            }
            // L'esdeveniment s'ha consumit, no es tornarà a mostrar
            setInstallPrompt(null);
            setIsCompatible(false);
        } else if (isCompatible && !isIOS) {
            // Si el prompt no es dispara (Desktop sense PWA activa)
            toast.warning(t('app.pwaManualTitle'), {
                description: t('app.pwaManualDescription'),
                duration: 5000,
            });
        }
    };

    // Si ja està instal·lada, no mostrem res
    if (isStandalone) return null;


    // ------------------------------------------------
    // Lògica per a les instruccions d'instal·lació iOS
    // ------------------------------------------------
    if (isIOS) {
        // Si és iOS, mostrem només les instruccions de forma destacada, sense botons
        return (
            <section id="install-app" className="container py-12 md:py-24">
                <div className="max-w-xl mx-auto text-center">
                    <h3 className="text-3xl font-bold text-red-600 mb-6">{t('app.iosInstructionTitle')}</h3>
                    <div className="text-left bg-gray-50 p-6 rounded-xl shadow-lg border border-red-100">
                        <ol className="list-decimal list-inside space-y-3 text-gray-700">
                            <li>
                                {t('app.iosStep1')}{" "}
                                <strong>{t('app.iosShare')}</strong>{" "}
                                <Share className="inline h-4 w-4 mx-1" />.
                            </li>
                            <li>
                                {t('app.iosStep2')}{" "}
                                <strong>{t('app.iosAddToHome')}</strong>{" "}
                                <SquarePlus className="inline h-4 w-4 mx-1" />.
                            </li>
                        </ol>
                    </div>
                </div>
            </section>
        );
    }


    // ------------------------------------------------
    // Renderitzat de 3 columnes (Android/Desktop)
    // ------------------------------------------------
    return (
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-12"
                >
                    <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
                        {t('app.downloadTitle')}
                    </h2>
                    <p className="max-w-3xl mx-auto text-lg text-gray-600">
                        {t('app.downloadSubtitle')}
                    </p>
                </motion.div>

                <div className="flex justify-center flex-wrap gap-8">
                    {platforms.map((app, index) => {
                        // Deshabilitem la targeta iOS i els enllaços genèrics.
                        const isDisabled = app.id === 'ios';

                        return (
                            <motion.div
                                key={app.name}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <div
                                    className={`flex flex-col items-center p-6 w-56 rounded-xl shadow-lg transition-all duration-300 transform 
                                                ${isDisabled ? 'opacity-50 cursor-not-allowed bg-gray-100' : app.bgClass + ' cursor-pointer hover:scale-105'}`}
                                    onClick={!isDisabled ? handleInstallClick : undefined}
                                >
                                    <app.icon className={`w-16 h-16 mb-3 ${app.color}`} />
                                    <span className="text-xm font-bold py-4 text-gray-800 mb-1">
                                        {app.name}
                                    </span>
                                     
                                    <Image
                                        src={APP_ICON_SRC}
                                        alt={app.name + ' Icon'}
                                        width={54}
                                        height={54}
                                        className="mb-3 rounded-xl shadow-md"
                                    />
                                </div>
                                {/* ✅ CORRECCIÓ 3: Icona amb Image per simular el Favicon */}

                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}