'use client';

import { useState } from 'react';
import ClientMap from '@/components/ClientMap';

type Coords = { lat: number; lng: number };

export default function PrevisaoClient() {
  const [coords, setCoords] = useState<Coords | null>(null);

  return (
    <main className="min-h-[80vh] p-4">
      <h1 className="mb-3 text-2xl font-semibold text-[#FFA216]">
        Previsão por localização
      </h1>

      <ClientMap onSelect={(c) => setCoords(c)} />

      {coords && (
        <p className="mt-3 text-sm">
          Selecionado: {coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}
        </p>
      )}
    </main>
  );
}
