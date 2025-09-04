import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: "Política de Cookies - Garatge Estació",
    description: "Informació detallada sobre les cookies que utilitza el nostre lloc web. Tipus, finalitat i com gestionar-les.",
};

const PoliticaCookies = () => {
    return (
        <div className="bg-gray-50 text-gray-900 min-h-screen">
            <main className="container mx-auto px-4 md:px-6 py-12">
                <div className="bg-white p-8 md:p-12 rounded-lg shadow-lg">
                    <h2 className="text-4xl font-bold text-gray-800 mb-6">Política de Cookies</h2>
                    <p className="text-sm text-gray-500 mb-8">Última actualització: 23 d'agost de 2025</p>
                    
                    <div className="legal-content text-lg text-gray-700">
                        <h3 className="mt-6 mb-3 text-2xl font-bold border-b border-gray-200 pb-2">Què són les cookies?</h3>
                        <p className="mb-4">Una <i>cookie</i> és un petit fitxer de text que s'emmagatzema al teu navegador quan visites gairebé qualsevol pàgina web. La seva utilitat és que el web sigui capaç de recordar la teva visita quan tornis a navegar per aquesta pàgina.</p>

                        <h3 className="mt-6 mb-3 text-2xl font-bold border-b border-gray-200 pb-2">Tipus de Cookies Utilitzades en Aquest Lloc Web</h3>
                        <p className="mb-4">Seguint les directrius de l'Agència Espanyola de Protecció de Dades, procedim a detallar l'ús de <i>cookies</i> que fa aquest web amb la finalitat d'informar-te amb la màxima exactitud possible.</p>
                        <p className="mb-4">Aquest lloc web utilitza les següents <strong>cookies pròpies</strong>:</p>
                        <ul className="list-inside list-disc pl-4">
                            <li className="mb-2"><strong>Cookies tècniques o funcionals:</strong> Són aquelles essencials per al funcionament del lloc web. Per exemple, les que gestionen el consentiment de cookies o les que recorden l'idioma seleccionat per l'usuari.</li>
                        </ul>
                        <p className="mb-4">Aquest lloc web utilitza les següents <strong>cookies de tercers</strong>:</p>
                        <ul className="list-inside list-disc pl-4">
                            <li className="mb-2"><strong>Google Analytics:</strong> Aquest lloc web utilitza Google Analytics per recopilar informació anònima, com el nombre de visitants del lloc o les pàgines més populars. Mantenir aquesta cookie ens ajuda a millorar el nostre web.</li>
                            <li className="mb-2"><strong>Google Maps:</strong> Utilitzem Google Maps per mostrar la nostra ubicació. Aquest servei pot instal·lar cookies per recordar preferències de visualització del mapa.</li>
                        </ul>

                        <h3 className="mt-6 mb-3 text-2xl font-bold border-b border-gray-200 pb-2">Com Desactivar o Eliminar Cookies</h3>
                        <p className="mb-4">En qualsevol moment podràs exercir el teu dret de desactivació o eliminació de cookies d'aquest lloc web. Aquestes accions es realitzen de forma diferent en funció del navegador que estiguis utilitzant. A continuació, et deixem enllaços a les instruccions per als navegadors més populars:</p>
                        <ul className="list-inside list-disc pl-4">
                            <li className="mb-2"><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline">Google Chrome</a></li>
                            <li className="mb-2"><a href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline">Mozilla Firefox</a></li>
                            <li className="mb-2"><a href="https://support.microsoft.com/es-es/microsoft-edge/eliminar-las-cookies-en-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline">Microsoft Edge</a></li>
                            <li className="mb-2"><a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline">Safari (Apple)</a></li>
                        </ul>

                        <h3 className="mt-6 mb-3 text-2xl font-bold border-b border-gray-200 pb-2">Notes Addicionals</h3>
                        <ul className="list-inside list-disc pl-4">
                            <li className="mb-2">Ni aquest web ni els seus representants legals es fan responsables del contingut ni de la veracitat de les polítiques de privacitat que puguin tenir els tercers esmentats en aquesta política de <i>cookies</i>.</li>
                            <li className="mb-2">La desactivació de les cookies tècniques pot impedir el correcte funcionament d'algunes funcionalitats del lloc web.</li>
                        </ul>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PoliticaCookies;
