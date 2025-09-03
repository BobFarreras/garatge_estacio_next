import Link from 'next/link';

export default function CancellationPage({ searchParams }: { searchParams: { status: string, message?: string } }) {
  const isSuccess = searchParams.status === 'success';

  const messages: { [key: string]: string } = {
    'Cita_no_trobada': 'La cita no s\'ha trobat o ja ha estat cancel·lada.',
    'Token_no_valid': 'L\'enllaç de cancel·lació no és vàlid.',
    'Error_intern': 'Hi ha hagut un error intern. Si us plau, contacta amb nosaltres.'
  };

  const errorMessage = searchParams.message ? messages[searchParams.message] : 'Hi ha hagut un problema.';

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-10 rounded-lg shadow-lg text-center max-w-md">
        {isSuccess ? (
          <>
            <h1 className="text-3xl font-bold text-green-600 mb-4">✅ Cita Cancel·lada</h1>
            <p className="text-gray-700">La teva cita ha estat cancel·lada correctament.</p>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-red-600 mb-4">❌ Error</h1>
            <p className="text-gray-700">{errorMessage}</p>
          </>
        )}
        <Link href="/" className="inline-block mt-6 bg-red-600 text-white font-bold py-2 px-4 rounded hover:bg-red-700 transition-colors">
          Tornar a la pàgina principal
        </Link>
      </div>
    </div>
  );
}