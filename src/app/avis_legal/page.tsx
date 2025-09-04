import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: "Avís Legal - Garatge Estació",
    description: "Condicions d'ús i informació legal del Garatge Estació. Dades del titular, propietat intel·lectual, responsabilitat i jurisdicció.",
};

const AvisLegal = () => {
    return (
        <div className="bg-gray-50 text-gray-900 min-h-screen">
            <main className="container mx-auto px-4 md:px-6 py-12">
                <div className="bg-white p-8 md:p-12 rounded-lg shadow-lg">
                    <h2 className="text-4xl font-bold text-gray-800 mb-6">Avís Legal</h2>
                    <p className="text-sm text-gray-500 mb-8">Última actualització: 23 d'agost de 2025</p>
                    
                    <div className="legal-content text-lg text-gray-700">
                        <h3 className="mt-6 mb-3 text-2xl font-bold border-b border-gray-200 pb-2">1. Dades Identificatives del Titular</h3>
                        <p className="mb-4">En compliment de la Llei 34/2002, de l'11 de juliol, de serveis de la societat de la informació i de comerç electrònic, t'informem de les dades del titular d'aquest lloc web:</p>
                        <ul className="list-inside list-disc pl-4">
                            <li className="mb-2"><strong>Titular:</strong> <span className="bg-amber-100 text-amber-900 px-1 rounded font-mono">[Nom legal complet de l'empresa o autònom]</span></li>
                            <li className="mb-2"><strong>Nom comercial:</strong> Garatge Estació</li>
                            <li className="mb-2"><strong>NIF/CIF:</strong> <span className="bg-amber-100 text-amber-900 px-1 rounded font-mono">[NIF/CIF de l'empresa]</span></li>
                            <li className="mb-2"><strong>Domicili:</strong> <span className="bg-amber-100 text-amber-900 px-1 rounded font-mono">C/ Ramon Serradell, 21, 17100</span></li>
                            <li className="mb-2"><strong>Correu electrònic:</strong> info@garatgeestacio.com</li>
                            <li className="mb-2"><strong>Dades registrals:</strong> <span className="bg-amber-100 text-amber-900 px-1 rounded font-mono">[Si és una societat, incloure dades del Registre Mercantil]</span></li>
                        </ul>

                        <h3 className="mt-6 mb-3 text-2xl font-bold border-b border-gray-200 pb-2">2. Condicions d'Ús</h3>
                        <p className="mb-4">L'accés i ús d'aquest lloc web (<a href="https://www.garatgeestacio.com" className="text-red-600 hover:underline">https://www.garatgeestacio.com</a>) atribueix la condició d'usuari i implica l'acceptació plena i sense reserves de totes i cadascuna de les disposicions incloses en aquest Avís Legal.</p>

                        <h3 className="mt-6 mb-3 text-2xl font-bold border-b border-gray-200 pb-2">3. Propietat Intel·lectual i Industrial</h3>
                        <p className="mb-4">Tots els continguts del lloc web, incloent-hi, a títol enunciatiu, textos, fotografies, gràfics, imatges, icones, tecnologia, programari, així com el seu disseny gràfic i codis font, constitueixen una obra la propietat de la qual pertany a Garatge Estació, sense que es puguin entendre cedits a l'usuari cap dels drets d'explotació sobre aquests més enllà del que sigui estrictament necessari per al correcte ús del web.</p>
                        <p className="mb-4">Les marques, noms comercials o signes distintius són titularitat de Garatge Estació o de tercers, sense que es pugui entendre que l'accés al lloc web atribueixi cap dret sobre aquests.</p>

                        <h3 className="mt-6 mb-3 text-2xl font-bold border-b border-gray-200 pb-2">4. Exclusió de Responsabilitat</h3>
                        <p className="mb-4">El contingut d'aquest lloc web és de caràcter general i té una finalitat merament informativa. Garatge Estació no es responsabilitza de l'ús que cada usuari doni als materials posats a disposició en aquest lloc web ni de les actuacions que realitzi basant-se en aquests.</p>
                        <p className="mb-4">Garatge Estació no garanteix l'absència de virus o altres elements lesius que poguessin causar danys o alteracions en el sistema informàtic, en els documents electrònics o en els fitxers de l'usuari d'aquest lloc web.</p>

                        <h3 className="mt-6 mb-3 text-2xl font-bold border-b border-gray-200 pb-2">5. Legislació Aplicable i Jurisdicció</h3>
                        <p className="mb-4">Aquest Avís Legal es regirà i interpretarà de conformitat amb la legislació espanyola. Per a la resolució de qualsevol controvèrsia que pogués derivar-se de l'accés o ús del lloc web, Garatge Estació i l'usuari se sotmeten als jutjats i tribunals de <span className="bg-amber-100 text-amber-900 px-1 rounded font-mono">La Bisbal d'Empordà</span>, amb renúncia expressa a qualsevol altre fur que els pogués correspondre.</p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AvisLegal;
