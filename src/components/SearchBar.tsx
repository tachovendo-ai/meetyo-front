// src/components/SearchBar.tsx
"use client";

import { useState } from "react";
import { LocationCombobox, Place } from "./LocationCombobox";
import { Button } from "./ui/button";
import DateToolbar from "./DateToolBar";
import DataSelector, { MetricKey } from "./DateSelector";
import { ChevronDown, ChevronUp, Loader2 } from "lucide-react";

type Controlled = {
  place?: Place | null;
  date: Date;
  metrics: MetricKey[];
  setDate: (d: Date) => void;
  setMetrics: (m: MetricKey[]) => void;
};

type Props = {
  onPlaceChange?: (p: Place | null) => void;
  onSubmit?: (payload: { place: Place | null; date: Date; metrics: MetricKey[] }) => void | Promise<void>;
  controlled?: Controlled;
};

const isPromise = (v: any): v is Promise<any> => !!v && typeof v.then === "function";

export default function SearchBar({
  onPlaceChange,
  onSubmit,
  controlled,
}: Props) {
  const [innerPlace, setInnerPlace] = useState<Place | null>(controlled?.place ?? null);
  const [innerDate, setInnerDate] = useState<Date>(controlled?.date ?? new Date());
  const [innerMetrics, setInnerMetrics] = useState<MetricKey[]>(controlled?.metrics ?? ["temperature"]);
  const [showOptions, setShowOptions] = useState(false);
  const [submitting, setSubmitting] = useState(false); // <- loading

  const place   = controlled?.place   ?? innerPlace;
  const date    = controlled?.date    ?? innerDate;
  const metrics = controlled?.metrics ?? innerMetrics;

  const setDate    = controlled?.setDate    ?? setInnerDate;
  const setMetrics = controlled?.setMetrics ?? setInnerMetrics;

  const isPlaceValid = !!place && Number.isFinite(place.lat) && Number.isFinite(place.lon);
  const isDateValid  = date instanceof Date && !Number.isNaN(date.getTime());
  const areMetricsValid = Array.isArray(metrics) && metrics.length > 0;
  const isValid = isPlaceValid && isDateValid && areMetricsValid;

  const handleSubmit = async () => {
    if (!isValid || submitting) return;
    try {
      setSubmitting(true);
      const ret = onSubmit?.({ place, date, metrics });
      if (isPromise(ret)) {
        await ret; // espera o término se for async
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pointer-events-auto w-full rounded-xl bg-black-gray/90 p-3 sm:p-4 text-white shadow-lg backdrop-blur">
      <div className="flex w-full flex-col gap-3">
        {/* Mobile */}
        <div className="sm:hidden flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="min-w-0 flex-1">
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
            <DateToolbar value={date} onChange={setDate} className="w-auto" />
          </div>

          <Button
            type="button"
            className="h-10 w-full bg-orange-light text-white hover:bg-orange-500 disabled:opacity-60 disabled:cursor-not-allowed"
            onClick={handleSubmit}
            disabled={!isValid || submitting}
            aria-disabled={!isValid || submitting}
            aria-busy={submitting}
            title={!isValid ? "Preencha local, data e selecione ao menos 1 métrica" : "Pesquisar"}
          >
            {submitting ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Buscando…
              </span>
            ) : (
              "Pesquisar"
            )}
          </Button>

          <div className="flex justify-end">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-white/90 hover:text-white"
              onClick={() => setShowOptions((v) => !v)}
              disabled={submitting}
            >
              {showOptions ? (
                <>
                  Ocultar opções <ChevronUp className="ml-1 h-4 w-4" />
                </>
              ) : (
                <>
                  Mais opções <ChevronDown className="ml-1 h-4 w-4" />
                </>
              )}
            </Button>
          </div>

          {showOptions && (
            <DataSelector value={metrics} onChange={setMetrics} className="w-full" />
          )}
        </div>

        {/* Desktop */}
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

            <div className="flex items-center gap-2 w-full md:w-auto">
              <Button
                type="button"
                className="h-9 w-full md:w-auto bg-orange-light text-white hover:bg-orange-500 disabled:opacity-60 disabled:cursor-not-allowed"
                onClick={handleSubmit}
                disabled={!isValid || submitting}
                aria-disabled={!isValid || submitting}
                aria-busy={submitting}
              >
                {submitting ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Buscando…
                  </span>
                ) : (
                  "Pesquisar"
                )}
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-9 px-2 text-white/90 hover:text-white"
                onClick={() => setShowOptions((v) => !v)}
                disabled={submitting}
              >
                {showOptions ? (
                  <>
                    Ocultar opções <ChevronUp className="ml-1 h-4 w-4" />
                  </>
                ) : (
                  <>
                    Mais opções <ChevronDown className="ml-1 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>

          {showOptions && (
            <DataSelector value={metrics} onChange={setMetrics} className="w-full" />
          )}
        </div>
      </div>
    </div>
  );
}
