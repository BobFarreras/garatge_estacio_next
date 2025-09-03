"use client"; // Aquest component s'executarà només al client


import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet'; // ✅ CORRECCIÓ: Importem l'objecte L
import 'leaflet/dist/leaflet.css';

// Ara TypeScript ja sap què és 'L' i no donarà error
// ✅ CORRECCIÓ: Convertim a 'any' temporalment per poder esborrar la propietat.
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Component intern per evitar problemes de renderitzat inicial
function MapResizer() {
  const map = useMap();
  useEffect(() => {
    // Aquesta funció s'assegura que el mapa agafi la mida correcta un cop carregat
    setTimeout(() => {
      map.invalidateSize();
    }, 0);
  }, [map]);
  return null;
}

const MapaContacte = () => {
  const position: L.LatLngExpression = [41.96739971974001, 3.030798063518469];

  return (
    <MapContainer
      center={position}
      zoom={17}
      scrollWheelZoom={false}
      className="w-full h-full rounded-lg shadow" // Fem que ocupi tot l'espai del seu contenidor
    >
      <MapResizer />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position}>
        <Popup>
          <b>Garatge Estació</b><br />
          Carrer Ramon Serradell, 21<br/>
          17100 La Bisbal d'Empordà
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapaContacte;