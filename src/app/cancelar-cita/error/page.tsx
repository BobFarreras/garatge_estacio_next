export const dynamic = 'force-dynamic';
import Link from 'next/link';

// ✅ SOLUCIÓ TROBADA A LA COMUNITAT:
// Eliminem completament la definició de tipus de les props { searchParams }.
// Next.js ja sap quin tipus tenen en un arxiu page.tsx i l'infereix correctament
// sense entrar en conflicte amb el seu sistema de 'build'.
export default function CancellationErrorPage({ searchParams }: any) {
  const messages: { [key: string]: string } = {
    'Cita_no_encontrada': 'La cita no s\'ha trobat o ja ha estat cancel·lada.',
    'Token_no_valid': 'L\'enllaç de cancel·lació no és vàlid.',
    'Error_intern': 'Hi ha hagut un error intern. Si us plau, contacta amb nosaltres.'
  };

  const motiu = searchParams.motiu;

  const errorMessage = motiu && messages[motiu] ? messages[motiu] : 'Hi ha hagut un problema desconegut.';

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-10 rounded-lg shadow-lg text-center max-w-md w-full">
        <h1 className="text-4xl mb-4">❌</h1>
        <h2 className="text-2xl font-bold mb-2">Error en la Cancel·lació</h2>
        <p className="text-gray-700">{errorMessage}</p>
        <Link href="/" className="inline-block mt-6 bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition-colors">
          Tornar a la pàgina principal
        </Link>
      </div>
    </div>
  );
}

