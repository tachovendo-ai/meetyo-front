"use client";

import { useState } from "react";
import { LocationCombobox, Place } from "./LocaltionCombobox";
import { Button } from "./ui/button";
import DateToolbar from "./DateToolBar";
import DataSelector, { MetricKey } from "./DateSelector";

type Props = {
  onPlaceChange?: (p: Place | null) => void;
};

export default function SearchBar({ onPlaceChange }: Props) {
  const [place, setPlace] = useState<Place | null>(null);
  const [date, setDate] = useState(new Date());
  const [metrics, setMetrics] = useState<MetricKey[]>(["temperature"]);

  return (
    <div className="pointer-events-auto flex w-full items-start gap-5 rounded-xl bg-black-gray p-4 text-white shadow-lg backdrop-blur">
      <div className="flex w-full flex-col">
        <div className="flex w-full flex-wrap items-center gap-3">
          <LocationCombobox
            value={place}
            onChange={(p) => {
              setPlace(p);
              onPlaceChange?.(p);
            }}
            className="flex-1 min-w-[260px]"
            placeholder="Buscar cidade, bairro, endereço…"
          />
          <DateToolbar value={date} onChange={setDate} className="shrink-0" />
          <Button type="button" className="bg-orange-light text-white hover:bg-orange-500 cursor-pointer">
            Pesquisar
          </Button>
        </div>
        <DataSelector value={metrics} onChange={setMetrics} />
      </div>
    </div>
  );
}