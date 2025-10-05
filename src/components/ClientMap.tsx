// src/components/ClientMap.tsx
"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvent } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";

// corrige ícones
L.Icon.Default.mergeOptions({
  iconUrl: "/leaflet/marker-icon.png",
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  shadowUrl: "/leaflet/marker-shadow.png",
});

type Props = {
  focus?: [number, number] | null;
  picked?: [number, number] | null;
  onPick?: (lat: number, lon: number) => void;
};

function FlyTo({ position, zoom = 13 }: { position: L.LatLngExpression | null; zoom?: number }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.flyTo(position, zoom, { duration: 0.8 });
  }, [position, zoom, map]);
  return null;
}

function PickHandler({ onPick }: { onPick?: (lat: number, lon: number) => void }) {
  useMapEvent("click", (e) => onPick?.(e.latlng.lat, e.latlng.lng));
  return null;
}

export default function ClientMap({ focus = null, picked = null, onPick }: Props) {
  const defaultCenter: [number, number] = [-12.7439, -60.1469];
  const center = (focus ?? defaultCenter) as L.LatLngExpression;
  const markerPos = (picked ?? (Array.isArray(center) ? (center as [number, number]) : null)) as
    | L.LatLngExpression
    | null;

  return (
    <div className="h-full w-full">
      <MapContainer
        center={center}
        zoom={12}
        className="h-full w-full"
        scrollWheelZoom
        dragging
        doubleClickZoom
        boxZoom
        keyboard
        touchZoom
        inertia
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FlyTo position={focus} zoom={13} />
        <PickHandler onPick={onPick} />

        {markerPos && (
          <Marker position={markerPos}>
            <Popup>
              {Array.isArray(markerPos)
                ? `Lat: ${(markerPos as [number, number])[0].toFixed(5)}, Lon: ${
                    (markerPos as [number, number])[1].toFixed(5)
                  }`
                : "Local"}
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
