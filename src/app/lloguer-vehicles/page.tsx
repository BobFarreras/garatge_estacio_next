import { getAvailableVehicles } from '@/lib/vehicles'; // ✅ Importem la nova funció
import type { Vehicle } from '@/types/vehicle';
import VehicleClient from './_components/VehicleClient';

// Aquesta pàgina ara pot ser renderitzada estàticament!
export default async function LloguerVehiclesPage() {
    // ✅ Cridem directament a la funció, sense fetch ni headers.
    const initialVehicles = await getAvailableVehicles();

    return (
        <div className="bg-white">
            <section className="relative py-24 bg-gray-800 text-white hero-pattern">
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">Lloguer de Vehicles</h1>
                    <p className="text-lg md:text-xl max-w-3xl mx-auto text-gray-200">Troba el vehicle perfecte per a cada ocasió. Fàcil, ràpid i flexible.</p>
                </div>
            </section>
            
            <VehicleClient initialVehicles={initialVehicles} />
        </div>
    );
};