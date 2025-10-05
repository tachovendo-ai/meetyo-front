"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvent } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { LeafletMouseEvent } from "leaflet";
import { useEffect } from "react";

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

function FlyTo({ position, zoom = 12 }: { position: L.LatLngExpression | null; zoom?: number }) {
  const map = useMap();
  useEffect(() => {
    if (!position) return;
    map.flyTo(position, zoom, { duration: 0.8 });
  }, [position, zoom, map]);
  return null;
}

type Props = { focus: L.LatLngExpression | null };

export default function ClientMap({ focus }: Props) {
  const defaultCenter: L.LatLngExpression = [-12.7439, -60.1469];
  const center = focus ?? defaultCenter;

  return (
    // Garante que esta DIV esteja clicável (caso algum ancestor tenha pointer-events none)
    <div className="w-full h-full pointer-events-auto">
      <MapContainer
        center={defaultCenter}
        zoom={12}
        className="w-full h-full"
        // Interações válidas no react-leaflet/Leaflet atual:
        dragging={true}
        scrollWheelZoom={true}
        doubleClickZoom={true}
        boxZoom={true}
        keyboard={true}
        touchZoom={true}
        inertia={true}
        wheelDebounceTime={40}
      >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <FlyTo position={focus} zoom={13} />

      <Marker position={center}>
        <Popup>
          {Array.isArray(center)
            ? `Lat: ${center[0].toFixed(4)}, Lon: ${center[1].toFixed(4)}`
            : "Local"}
        </Popup>
      </Marker>

      <ClickLogger />
    </MapContainer>
    </div >
  );
}