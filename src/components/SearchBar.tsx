// src/components/SearchBar.tsx
"use client";

import { useState } from "react";
import { LocationCombobox, Place } from "./LocationCombobox";
import { Button } from "./ui/button";
import DateToolbar from "./DateToolBar";
import DataSelector, { MetricKey } from "./DateSelector";
import { ChevronDown, ChevronUp } from "lucide-react";

type Controlled = {
  place?: Place | null;
  date: Date;
  metrics: MetricKey[];
  setDate: (d: Date) => void;
  setMetrics: (m: MetricKey[]) => void;
};

type Props = {
  onPlaceChange?: (p: Place | null) => void;
  onSubmit?: (payload: { place: Place | null; date: Date; metrics: MetricKey[] }) => void;
  variant?: "full" | "compact";   
  onExpandToggle?: () => void;
  controlled?: Controlled;
};

export default function SearchBar({
  onPlaceChange,
  onSubmit,
  variant = "full",
  onExpandToggle,
  controlled,
}: Props) {
  // estado interno (fallback se não for controlado)
  const [innerPlace, setInnerPlace] = useState<Place | null>(controlled?.place ?? null);
  const [innerDate, setInnerDate] = useState<Date>(controlled?.date ?? new Date());
  const [innerMetrics, setInnerMetrics] = useState<MetricKey[]>(controlled?.metrics ?? ["temperature"]);

  const place   = controlled?.place   ?? innerPlace;
  const date    = controlled?.date    ?? innerDate;
  const metrics = controlled?.metrics ?? innerMetrics;

  const setDate    = controlled?.setDate    ?? setInnerDate;
  const setMetrics = controlled?.setMetrics ?? setInnerMetrics;

  // -------- validações ----------
  const isPlaceValid =
    !!place && Number.isFinite(place.lat) && Number.isFinite(place.lon);
  const isDateValid = date instanceof Date && !Number.isNaN(date.getTime());
  const areMetricsValid = Array.isArray(metrics) && metrics.length > 0;
  const isValid = isPlaceValid && isDateValid && areMetricsValid;

  const handleSubmit = () => {
    if (!isValid) return;
    onSubmit?.({ place, date, metrics });
  };

  return (
    <div className="pointer-events-auto w-full rounded-xl bg-black-gray/90 p-3 sm:p-4 text-white shadow-lg backdrop-blur">
      <div className="flex w-full flex-col gap-3">
        {/* ===== MOBILE (<= sm) ===== */}
        {variant === "full" && (
          <div className="sm:hidden flex flex-col gap-3">
            <LocationCombobox
              value={place ?? null}
              onChange={(p) => {
                if (!controlled) setInnerPlace(p);
                onPlaceChange?.(p);
              }}
              className="w-full"
              placeholder="Buscar cidade, bairro, endereço…"
            />

            <DateToolbar value={date} onChange={setDate} className="w-full" />

            <Button
              type="button"
              className="h-10 w-full bg-orange-light text-white hover:bg-orange-500 disabled:opacity-60 disabled:cursor-not-allowed"
              onClick={handleSubmit}
              disabled={!isValid}
              aria-disabled={!isValid}
              title={!isValid ? "Preencha local, data e selecione ao menos 1 métrica" : "Pesquisar"}
            >
              Pesquisar
            </Button>

            <DataSelector value={metrics} onChange={setMetrics} className="w-full" />
          </div>
        )}

        {variant === "compact" && (
          <div className="sm:hidden flex items-center gap-2">
            <div className="min-w-0 flex-1">
              <LocationCombobox
                value={place ?? null}
                onChange={(p) => {
                  if (!controlled) setInnerPlace(p);
                  onPlaceChange?.(p);
                }}
                className="w-full"
                placeholder="Selecionar local…"
              />
            </div>

            <Button
              type="button"
              className="h-10 bg-orange-light text-white hover:bg-orange-500 disabled:opacity-60 disabled:cursor-not-allowed"
              onClick={handleSubmit}
              disabled={!isValid}
              aria-disabled={!isValid}
              title={!isValid ? "Preencha local, data e selecione ao menos 1 métrica" : "Pesquisar"}
            >
              Pesquisar
            </Button>

            <Button
              type="button"
              variant="outline"
              className="h-10 w-10 p-0 text-white"
              onClick={onExpandToggle}
              title="Mostrar mais opções"
            >
              <ChevronDown className="h-5 w-5" />
            </Button>
          </div>
        )}

        {/* ===== DESKTOP (>= sm) — sempre full ===== */}
        <div className="hidden sm:flex w-full flex-col gap-3">
          <div className="flex w-full flex-wrap items-center gap-3">
            <div className="w-full min-w-0 md:flex-1">
              <LocationCombobox
                value={place ?? null}
                onChange={(p) => {
                  if (!controlled) setInnerPlace(p);
                  onPlaceChange?.(p);
                }}
                className="w-full"
                placeholder="Buscar cidade, bairro, endereço…"
              />
            </div>

            <div className="w-full md:w-auto">
              <DateToolbar value={date} onChange={setDate} className="w-full md:w-auto" />
            </div>

            <div className="w-full md:w-auto">
              <Button
                type="button"
                className="h-9 w-full bg-orange-light text-white hover:bg-orange-500 disabled:opacity-60 disabled:cursor-not-allowed"
                onClick={handleSubmit}
                disabled={!isValid}
                aria-disabled={!isValid}
                title={!isValid ? "Preencha local, data e selecione ao menos 1 métrica" : "Pesquisar"}
              >
                Pesquisar
              </Button>
            </div>
          </div>

          <DataSelector value={metrics} onChange={setMetrics} className="w-full" />
        </div>
      </div>
    </div>
  );
}
