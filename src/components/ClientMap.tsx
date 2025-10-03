
import { useState, useRef, useCallback } from 'react';
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  useMapEvents,
} from 'react-leaflet';
import type { LatLngExpression, Map as LeafletMap } from 'leaflet';

type Coords = { lat: number; lng: number };

function ClickCapture({ onClick }: { onClick: (c: Coords) => void }) {
  useMapEvents({
    click(e) {
      onClick({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

export default function ClientMap({
  center = [-12.7406, -60.1458] as LatLngExpression,
  zoom = 12,
  onSelect,
}: {
  center?: LatLngExpression;
  zoom?: number;
  onSelect?: (c: Coords) => void;
}) {
  const [pos, setPos] = useState<Coords | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);

  const setMapRef = useCallback((m: LeafletMap | null) => {
    mapRef.current = m;
  }, []);

  const locateMe = () => {
    if (!mapRef.current || !navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((geo) => {
      const c = { lat: geo.coords.latitude, lng: geo.coords.longitude };
      mapRef.current!.setView(c as any, 14);
      setPos(c);
      onSelect?.(c);
    });
  };

  return (
    <div className="relative h-full w-full overflow-hidden rounded-none">
      <MapContainer
        center={center}
        zoom={zoom}
        className="h-full w-full"
        ref={setMapRef}  // ✅ ok no v4
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <ClickCapture
          onClick={(c) => {
            setPos(c);
            onSelect?.(c);
          }}
        />

        {pos && (
          <CircleMarker center={[pos.lat, pos.lng]} radius={8}>
            <Popup>
              {pos.lat.toFixed(6)}, {pos.lng.toFixed(6)}
            </Popup>
          </CircleMarker>
        )}
      </MapContainer>

      {/* Controles */}
      <div className="pointer-events-none absolute right-3 top-3 z-10 flex gap-2">
        <button
          onClick={locateMe}
          className="pointer-events-auto rounded-full bg-white/90 px-3 py-1 text-sm shadow"
          title="Minha localização"
        >
          📍 Localizar
        </button>
        {pos && (
          <button
            onClick={() => {
              const url = new URL(window.location.href);
              url.searchParams.set('lat', String(pos.lat));
              url.searchParams.set('lng', String(pos.lng));
              window.history.replaceState({}, '', url.toString());
            }}
            className="pointer-events-auto rounded-full bg-[#FFA216] px-3 py-1 text-sm text-white shadow"
            title="Usar esta localização"
          >
            Usar esta localização
          </button>
        )}
      </div>
    </div>
  );
}
