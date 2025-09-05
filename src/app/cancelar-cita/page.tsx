// src/app/cancelar-cita/page.tsx
import Link from 'next/link';

export const dynamic = 'force-dynamic';

// Component per mostrar missatge d'error o info
function ErrorMessage({ messageKey }: { messageKey?: string }) {
  const messages: { [key: string]: string } = {
    success: "La teva cita s'ha cancel·lat correctament.",
    error: "Hi ha hagut un error en cancel·lar la cita.",
  };

  const errorMessage = messageKey ? messages[messageKey] : 'Hi ha hagut un problema desconegut.';
  return <p className="text-gray-700">{errorMessage}</p>;
}

// Component principal de la pàgina
export default function CancellationPage({ searchParams }: { searchParams: { status?: string; message?: string } }) {
  const isSuccess = searchParams.status === 'success';
  const messageKey = searchParams.message;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-10 rounded-lg shadow-lg text-center max-w-md w-full">
        {isSuccess ? (
          <>
            <h1 className="text-4xl mb-4">✅</h1>
            <h2 className="text-2xl font-bold mb-2">Cita Cancel·lada</h2>
            <p className="text-gray-700">La teva cita ha estat cancel·lada correctament.</p>
          </>
        ) : (
          <>
            <h1 className="text-4xl mb-4">❌</h1>
            <h2 className="text-2xl font-bold mb-2">Error en la Cancel·lació</h2>
            <ErrorMessage messageKey={messageKey} />
          </>
        )}
        <Link
          href="/"
          className="inline-block mt-6 bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition-colors"
        >
          Tornar a la pàgina principal
        </Link>
      </div>
    </div>
  );
}
