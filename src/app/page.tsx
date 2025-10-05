"use client";

import { useState } from "react";
import MapSection from "@/components/MapSection";
import SearchBar from "@/components/SearchBar";
import CardDetails from "@/components/CardDetails";
import type { Place } from "@/components/LocationCombobox";
import { MetricKey } from "@/components/DateSelector";


const TOP_CLASSES = "top-6 sm:top-8 md:top-10";

type MetricFlags = Record<MetricKey, boolean>;
const ALL_METRICS: MetricKey[] = ["temperature", "rain", "wind", "humidity"] as const;

const toFlags = (selected: MetricKey[]): MetricFlags =>
  Object.fromEntries(ALL_METRICS.map((k) => [k, selected.includes(k)])) as MetricFlags;

const toISODate = (d: Date) => d.toISOString().slice(0, 10);

export default function Page() {
  const [place, setPlace] = useState<Place | null>(null);
  const [date, setDate] = useState<Date>(new Date());
  const [metrics, setMetrics] = useState<MetricKey[]>(["temperature"]);
  const [mobileCondensed, setMobileCondensed] = useState(false); // <- controla compactação no mobile

const handleSubmit = (payload: { place: Place | null; date: Date; metrics: MetricKey[] }) => {
  const flags = toFlags(payload.metrics);

  console.log("[Search Submit] parsed:", {
    place: payload.place
      ? { id: payload.place.id, label: payload.place.label, lat: payload.place.lat, lon: payload.place.lon }
      : null,
    date: toISODate(payload.date),
    metrics: flags,
  });

  const params = new URLSearchParams({
    ...(payload.place
      ? { lat: String(payload.place.lat), lon: String(payload.place.lon) }
      : {}),
    date: toISODate(payload.date),
    temperature: String(flags.temperature),
    rain: String(flags.rain),
    wind: String(flags.wind),
    humidity: String(flags.humidity),
  });

  setPlace(payload.place);
  setDate(payload.date);
  setMetrics(payload.metrics);
  setMobileCondensed(true);
};

  return (
    <main className="relative min-h-dvh w-dvw overflow-x-clip">
      {/* Mapa de fundo */}
      <div className="absolute inset-0 z-0">
        <MapSection focus={place ? [place.lat, place.lon] : null} />
      </div>

      {/* Overlay com padding e safe-area */}
      <div
        className={`
          pointer-events-none absolute inset-x-0 ${TOP_CLASSES} z-[2000]
          px-[max(12px,env(safe-area-inset-left))]
          pr-[max(12px,env(safe-area-inset-right))]
          sm:px-6 md:px-8 lg:px-12
        `}
      >
        <div
          className="
            mx-auto flex w-full max-w-full flex-col items-stretch gap-3
            justify-center
            md:flex-row md:items-start md:justify-end md:gap-6 lg:gap-8
          "
        >
          {/* SearchBar — mobile: usa variant; desktop: sempre completa */}
          <div
            className="
              pointer-events-auto w-full min-w-0
              mx-auto md:mx-0
              max-w-[calc(100vw-24px)] sm:max-w-[640px]
              md:max-w-none md:w-[680px] lg:w-[780px]
              max-[1366px]:w-[760px]
              xl:w-[900px] 2xl:w-[1040px]
            "
          >
            <SearchBar
              onPlaceChange={setPlace}
              onSubmit={handleSubmit}
              // mobile: alterna entre 'full' e 'compact'
              variant={mobileCondensed ? "compact" : "full"}
              onExpandToggle={() => setMobileCondensed((v) => !v)}
              // mantém controlado no desktop também
              controlled={{ place, date, metrics, setDate, setMetrics }}
            />
          </div>

          {/* Desktop: card ao lado. Mobile: card fica abaixo da SearchBar (logo depois) */}
          <div
            className="
              pointer-events-auto w-full min-w-0
              hidden md:block
              md:w-[400px] lg:w-[440px] max-[1366px]:w-[420px] xl:w-[480px] 2xl:w-[520px]
              md:shrink-0
            "
          >
            <CardDetails fixedTopClass={TOP_CLASSES} />
          </div>
        </div>

        {/* Mobile: depois de pesquisar, mostra o Card abaixo da barra */}
        {mobileCondensed && (
          <div className="pointer-events-auto mt-3 block md:hidden">
            <CardDetails fixedTopClass={TOP_CLASSES} />
          </div>
        )}
      </div>
    </main>
  );
}