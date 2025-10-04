"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvent } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { LeafletMouseEvent } from "leaflet";
import { useEffect } from "react";

// Corrige os ícones no Next (aponta para /public/leaflet)
L.Icon.Default.mergeOptions({
  iconUrl: "/leaflet/marker-icon.png",
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  shadowUrl: "/leaflet/marker-shadow.png",
});

function ClickLogger() {
  useMapEvent("click", (e: LeafletMouseEvent) => {
    console.log("Clique no mapa:", e.latlng);
  });
  return null;
}

// Componente auxiliar que movimenta o mapa quando "position" muda
function FlyTo({ position, zoom = 12 }: { position: L.LatLngExpression | null; zoom?: number }) {
  const map = useMap();
  useEffect(() => {
    if (!position) return;
    map.flyTo(position, zoom, { duration: 0.8 });
  }, [position, zoom, map]);
  return null;
}

type Props = {
  focus: L.LatLngExpression | null;
};

export default function ClientMap({ focus }: Props) {
  const defaultCenter: L.LatLngExpression = [-12.7439, -60.1469]; // Vilhena-RO
  const center = focus ?? defaultCenter;

  return (
    <div className="w-full h-full">
      <MapContainer center={defaultCenter} zoom={12} className="w-full h-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Move a câmera quando "focus" mudar */}
        <FlyTo position={focus} zoom={13} />

        {/* Marker no centro atual (default ou focado) */}
        <Marker position={center}>
          <Popup>
            {Array.isArray(center)
              ? `Lat: ${center[0].toFixed(4)}, Lon: ${center[1].toFixed(4)}`
              : "Local"}
          </Popup>
        </Marker>

        <ClickLogger />
      </MapContainer>
    </div>
  );
}