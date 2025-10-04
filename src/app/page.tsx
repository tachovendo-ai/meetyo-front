

"use client";

import { useState } from "react";
import MapSection from "@/components/MapSection";
import SearchBar from "@/components/SearchBar";
import type { Place } from "@/components/LocaltionCombobox";

export default function Page() {
  const [place, setPlace] = useState<Place | null>(null);

  return (
    <main className="relative w-screen h-[100dvh] overflow-hidden">
      {/* Mapa recebe o ponto para focar */}
      <MapSection focus={place ? [place.lat, place.lon] : null} />

      {/* Overlay com a barra */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[2000] flex justify-center p-4">
        <div className="pointer-events-auto">
          {/* SearchBar reporta o local selecionado */}
          <SearchBar onPlaceChange={setPlace} />
        </div>
      </div>
    </main>
  );
}
      {/* <CardWeather
        location="Vilhena - RO"
        datetime="2025-10-04T15:00:00-04:00"
        tempNowC={29}
        tempMaxC={33}
        tempMinC={22}
        feelsLikeC={31}
        rainProbPct={70}
        wind={{ speedKmh: 14, gustKmh: 28, deg: 90 }}
        heatIndexC={34}
        condition="Chuva fraca"
      // kind="rain" // opcional
      /> */}