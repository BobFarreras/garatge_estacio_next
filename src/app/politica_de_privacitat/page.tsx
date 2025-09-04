import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: "Política de Privacitat - Garatge Estació",
    description: "Coneix la política de privacitat del Garatge Estació. Informació sobre el tractament de dades, finalitat, legitimació i drets dels usuaris.",
};

const PoliticaPrivacitat = () => {
    return (
        <div className="bg-gray-50 text-gray-900 min-h-screen">
            <main className="container mx-auto px-4 md:px-6 py-12">
                <div className="bg-white p-8 md:p-12 rounded-lg shadow-lg">
                    <h2 className="text-4xl font-bold text-gray-800 mb-6">Política de Privacitat</h2>
                    <p className="text-sm text-gray-500 mb-8">Última actualització: 23 d'agost de 2025</p>
                    
                    <div className="legal-content">
                        <h3 className="mt-6 mb-3 text-2xl font-bold border-b border-gray-200 pb-2">1. Responsable del Tractament</h3>
                        <ul className="list-inside list-disc pl-4 text-lg text-gray-700">
                            <li><strong>Titular:</strong> <span className="bg-amber-100 text-amber-900 px-1 rounded font-mono">[Nom legal complet de l'empresa o autònom]</span></li>
                            <li><strong>Nom comercial:</strong> Garatge Estació</li>
                            <li><strong>NIF/CIF:</strong> <span className="bg-amber-100 text-amber-900 px-1 rounded font-mono">[NIF/CIF de l'empresa]</span></li>
                            <li><strong>Domicili:</strong> <span className="bg-amber-100 text-amber-900 px-1 rounded font-mono">C/ Ramon Serradell, 21, 17100</span></li>
                            <li><strong>Correu electrònic:</strong> info@garatgeestacio.com</li>
                            <li><strong>Telèfon:</strong> <span className="bg-amber-100 text-amber-900 px-1 rounded font-mono">972 640 204</span></li>
                        </ul>

                        <h3 className="mt-6 mb-3 text-2xl font-bold border-b border-gray-200 pb-2">2. Finalitat del Tractament de Dades</h3>
                        <p className="mb-4 text-lg text-gray-700">Garatge Estació tractarà les dades personals recollides a través d'aquest lloc web amb les següents finalitats:</p>
                        <ul className="list-inside list-disc pl-4 text-lg text-gray-700">
                            <li className="mb-2"><strong>Formularis de contacte i reserves (taller i autocaravanes):</strong> Gestionar les consultes, sol·licituds d'informació i reserves realitzades pels usuaris. Això inclou la comunicació necessària per a la prestació del servei, l'enviament de confirmacions i recordatoris.</li>
                            <li className="mb-2"><strong>Gestió administrativa i comercial:</strong> Mantenir la relació comercial, facturació i compliment d'obligacions legals.</li>
                        </ul>
                        <p className="mb-4 text-lg text-gray-700">Les dades recollides (nom, email, telèfon) són les mínimes indispensables per a aquestes finalitats.</p>

                        <h3 className="mt-6 mb-3 text-2xl font-bold border-b border-gray-200 pb-2">3. Legitimació</h3>
                        <p className="mb-4 text-lg text-gray-700">La base legal per al tractament de les teves dades és el <strong>consentiment explícit</strong> que ens atorgues en acceptar aquesta política de privacitat abans d'enviar les teves dades a través dels nostres formularis.</p>

                        <h3 className="mt-6 mb-3 text-2xl font-bold border-b border-gray-200 pb-2">4. Conservació de les Dades</h3>
                        <p className="mb-4 text-lg text-gray-700">Les dades personals proporcionades es conservaran mentre es mantingui la relació comercial o durant els anys necessaris per complir amb les obligacions legals.</p>

                        <h3 className="mt-6 mb-3 text-2xl font-bold border-b border-gray-200 pb-2">5. Destinataris</h3>
                        <p className="mb-4 text-lg text-gray-700">Les teves dades no se cediran a tercers, excepte per obligació legal. Per a la gestió de les reserves, les teves dades es desen en les següents plataformes, que actuen com a encarregats del tractament i compleixen amb la normativa de protecció de dades:</p>
                        <ul className="list-inside list-disc pl-4 text-lg text-gray-700">
                            <li className="mb-2"><strong>Airtable:</strong> Per a la gestió interna de les reserves.</li>
                            <li className="mb-2"><strong>Google Calendar (Google LLC):</strong> Per a l'organització de l'agenda de cites i reserves.</li>
                        </ul>

                        <h3 className="mt-6 mb-3 text-2xl font-bold border-b border-gray-200 pb-2">6. Drets dels Usuaris</h3>
                        <p className="mb-4 text-lg text-gray-700">En qualsevol moment, pots exercir els teus drets d'<strong>accés, rectificació, supressió, oposició, limitació del tractament i portabilitat</strong> de les teves dades.</p>
                        <p className="mb-4 text-lg text-gray-700">Per fer-ho, pots enviar un correu electrònic a <strong>info@garatgeestacio.com</strong> o una sol·licitud per escrit a la nostra adreça postal, adjuntant una còpia del teu DNI per acreditar la teva identitat.</p>
                        <p className="mb-4 text-lg text-gray-700">Així mateix, si consideres que els teus drets no han estat atesos, tens dret a presentar una reclamació davant l'Agència Espanyola de Protecció de Dades (AEPD).</p>

                        <h3 className="mt-6 mb-3 text-2xl font-bold border-b border-gray-200 pb-2">7. Mesures de Seguretat</h3>
                        <p className="mb-4 text-lg text-gray-700">Garatge Estació ha adoptat les mesures tècniques i organitzatives necessàries per garantir la seguretat i integritat de les dades personals i evitar-ne la pèrdua, alteració o accés no autoritzat.</p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PoliticaPrivacitat;
