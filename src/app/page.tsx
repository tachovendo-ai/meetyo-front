// src/app/page.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import * as Toast from "@radix-ui/react-toast";
import MapSection from "@/components/MapSection";
import SearchBar from "@/components/SearchBar";
import CardDetails from "@/components/CardDetails";
import type { Place } from "@/components/LocationCombobox";
import { MetricKey } from "@/components/DateSelector";

const TOP_CLASSES = "top-6 sm:top-8 md:top-10";

// ---- Tipos do response (compatíveis com seu exemplo) ----
type HourBlock = {
  temperatura?: {
    muito_quente?: string;
    quente?: string;
    frio?: string;
    desconforto?: string;
  };
  chuva?: string;
  vento?: {
    muito_ventoso?: string;
    ventoso?: string;
    calmo?: string;
  };
  umidade_media?: string;
};

export type WeatherResponse = {
  temperatura?: {
    media?: string;
    probabilidades?: {
      muito_quente?: string;
      quente?: string;
      frio?: string;
    };
    nomenclatura_provavel?: string;
    prob_desconforto?: string;
  };
  chuva?: {
    probabilidade?: string;
  };
  vento?: {
    probabilidades?: {
      muito_ventoso?: string;
      ventoso?: string;
      calmo?: string;
    };
    nomenclatura_provavel?: string;
  };
  umidade?: {
    media?: string;
  };
  probabilidades_por_hora?: Record<string, HourBlock>;
  meta?: {
    confiabilidade?: string;
    anos_analisados?: number;
  };
};

export default function Page() {
  const [place, setPlace] = useState<Place | null>(null);
  const [date, setDate] = useState<Date>(new Date());
  const [metrics, setMetrics] = useState<MetricKey[]>([
    "temperature",
    "rain",
    "wind",
    "humidity",
  ]);
  const [showCard, setShowCard] = useState(false);
  const [apiData, setApiData] = useState<WeatherResponse | null>(null);

  // 🔹 NOVO: marcador/coord. clicada no mapa
  const [picked, setPicked] = useState<[number, number] | null>(null);

  // --- Radix Toast state ---
  const [toastOpen, setToastOpen] = useState(false);
  const [toastTitle, setToastTitle] = useState("");
  const [toastDesc, setToastDesc] = useState("");

  const showToast = (title: string, description?: string) => {
    setToastTitle(title);
    setToastDesc(description ?? "");
    setToastOpen(false);
    requestAnimationFrame(() => setToastOpen(true));
  };

  const toYYYYMMDD = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}${m}${day}`;
  };

  const BASE_URL = "/api/weather";
  const RANGE_YEARS = 24;

  async function reverseGeocode(lat: number, lon: number): Promise<Place> {
    const r = await fetch(`/api/reverse?lat=${lat}&lon=${lon}`, { cache: "no-store" });
    if (!r.ok) throw new Error(`Reverse error ${r.status}`);
    const j = await r.json();

    // ⬇️ MANTÉM as coords do CLIQUE, usa só o label do reverse
    return {
      id: String(j.id ?? `${lat},${lon}`),
      label: j.label ?? `${lat.toFixed(4)}, ${lon.toFixed(4)}`,
      lat,  // do clique
      lon,  // do clique
    };
  }

  const handleSubmit = async (payload: {
    place: Place | null;
    date: Date;
    metrics: MetricKey[];
  }) => {
    // Validações com Radix Toast
    if (!payload.place || !Number.isFinite(payload.place.lat) || !Number.isFinite(payload.place.lon)) {
      showToast("Selecione um local válido", "Use a busca ou clique no mapa.");
      return;
    }
    if (!(payload.date instanceof Date) || Number.isNaN(payload.date.getTime())) {
      showToast("Data inválida", "Escolha uma data no seletor.");
      return;
    }
    if (!payload.metrics?.length) {
      showToast("Selecione pelo menos 1 métrica", "Temperatura, chuva, vento ou umidade.");
      return;
    }

    try {
      const temperature = payload.metrics.includes("temperature");
      const rain = payload.metrics.includes("rain");
      const wind = payload.metrics.includes("wind");
      const humidity = payload.metrics.includes("humidity");

      const params = new URLSearchParams({
        latitude: String(payload.place?.lat ?? ""),
        longitude: String(payload.place?.lon ?? ""),
        date: toYYYYMMDD(payload.date),
        rangeYears: String(RANGE_YEARS),
        temperature: String(temperature),
        rain: String(rain),
        wind: String(wind),
        humidity: String(humidity),
      });

      const url = `${BASE_URL}?${params.toString()}`;
      console.log("[GET]", url);

      const res = await fetch(url, { method: "GET", cache: "no-store" });
      if (!res.ok) {
        const errText = await res.text().catch(() => "");
        showToast(`Erro ${res.status}`, errText || "Falha ao consultar o endpoint.");
        return;
      }

      const ct = res.headers.get("content-type") ?? "";
      const raw = await res.text();
      let data: WeatherResponse | string = raw;

      if (ct.includes("application/json") && raw) {
        try {
          data = JSON.parse(raw);
        } catch {
          showToast("Resposta inválida", "O servidor não retornou um JSON válido.");
          return;
        }
      } else if (!raw) {
        showToast("Resposta vazia", "O servidor não retornou conteúdo.");
        return;
      }

      console.log("[Response]", { ok: res.ok, status: res.status, data });

      // Atualiza UI
      setApiData(typeof data === "string" ? null : data);
      setPlace(payload.place);
      setDate(payload.date);
      setMetrics(payload.metrics);
      setShowCard(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Erro na busca:", err);
      showToast("Erro de rede", err?.message || "Não foi possível conectar ao servidor.");
    }
  };

  const cityLabel = place?.label?.split(",")[0] ?? undefined;
  const dateLabel = new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);

  return (
    <main className="relative min-h-dvh w-dvw overflow-x-clip">
      {/* Mapa de fundo (clicável) */}
      <div className="absolute inset-0 z-0">
        <MapSection
          focus={place ? [place.lat, place.lon] : null}
          picked={picked}
          onPick={async (lat, lon) => {
            try {
              const pickedPlace = await reverseGeocode(lat, lon); // label bonitinho
              setPlace(pickedPlace);            // place com label, mas coords do clique
              setPicked([lat, lon]);            // marcador SEMPRE no ponto clicado
            } catch {
              const fallbackLabel = `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
              setPlace({ id: fallbackLabel, label: fallbackLabel, lat, lon });
              setPicked([lat, lon]);
            }
          }}
        />
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
        {/* LOGO centralizado */}
        <div className="mb-3 flex w-full justify-center">
          <Image src="/icons/meetyo_logo.svg" width={100} height={100} alt="meetyo" priority />
        </div>

        <div className="
          mx-auto flex w-full max-w-full flex-col items-stretch gap-3
          md:flex-row md:items-start md:justify-end md:gap-6 lg:gap-8
        ">
          {/* SearchBar */}
          <div className="
            pointer-events-auto w-full min-w-0
            mx-auto md:mx-0
            max-w-[calc(100vw-24px)] sm:max-w-[640px]
            md:max-w-none md:w-[680px] lg:w-[780px]
            max-[1366px]:w-[760px]
            xl:w-[900px] 2xl:w-[1040px]
          ">
            <SearchBar
              onPlaceChange={(p) => {
                setPlace(p);
                // opcional: sincronizar marcador quando escolher pelo input
                setPicked(p ? [p.lat, p.lon] : null);
              }}
              onSubmit={handleSubmit}
              controlled={{ place, date, metrics, setDate, setMetrics }}
            />
          </div>

          {/* Desktop: Card ao lado */}
          {showCard && (
            <div className="
              pointer-events-auto w-full min-w-0
              hidden md:block
              md:w-[400px] lg:w-[440px] max-[1366px]:w-[420px] xl:w-[480px] 2xl:w-[520px]
              md:shrink-0
            ">
              <CardDetails
                fixedTopClass={TOP_CLASSES}
                data={apiData ?? undefined}
                city={cityLabel}
                dateLabel={dateLabel}
              />
            </div>
          )}
        </div>

        {/* Mobile: Card abaixo da SearchBar */}
        {showCard && (
          <div className="pointer-events-auto mt-3 block md:hidden">
            <CardDetails
              fixedTopClass={TOP_CLASSES}
              data={apiData ?? undefined}
              city={cityLabel}
              dateLabel={dateLabel}
            />
          </div>
        )}
      </div>

      {/* ===== Radix Toast ===== */}
      <Toast.Provider swipeDirection="right">
        <Toast.Root
          open={toastOpen}
          onOpenChange={setToastOpen}
          duration={4000}
          className="
            data-[state=open]:animate-in data-[state=closed]:animate-out
            data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)]
            data-[swipe=cancel]:translate-x-0 data-[swipe=end]:animate-out
            rounded-xl border border-white/10 bg-black/80 backdrop-blur
            text-white shadow-xl p-4 pr-10 w-[360px] max-w-[calc(100vw-32px)]
          "
        >
          <Toast.Title className="text-sm font-semibold">{toastTitle}</Toast.Title>
          {toastDesc ? (
            <Toast.Description className="mt-1 text-sm text-white/80">
              {toastDesc}
            </Toast.Description>
          ) : null}
          <Toast.Close
            aria-label="Fechar"
            className="absolute right-3 top-3 text-white/70 hover:text-white"
          >
            ✕
          </Toast.Close>
        </Toast.Root>

        <Toast.Viewport
          className="
            fixed bottom-4 right-4 z-[5000] m-0 flex w-[420px] max-w-[calc(100vw-32px)] list-none
            flex-col gap-2 outline-none
          "
        />
      </Toast.Provider>
    </main>
  );
}
