// app/cancelar-cita/exit/page.tsx

import Link from 'next/link';

export default function CancellationSuccessPage() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-10 rounded-lg shadow-lg text-center max-w-md w-full">
        <h1 className="text-4xl mb-4">✅</h1>
        <h2 className="text-2xl font-bold mb-2">Cita Cancel·lada</h2>
        <p className="text-gray-700">La teva cita ha estat cancel·lada correctament.</p>
        <Link href="/" className="inline-block mt-6 bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition-colors">
          Tornar a la pàgina principal
        </Link>
      </div>
    </div>
  );
}