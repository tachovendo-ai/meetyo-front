"use client";

import * as React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export type MetricKey = "temperature" | "rain" | "wind" | "humidity";

type Props = {
  value: MetricKey[];
  onChange: (next: MetricKey[]) => void;
  className?: string;
};

const OPTIONS: { key: MetricKey; label: string }[] = [
  { key: "temperature", label: "Temperatura" },
  { key: "rain",        label: "Chuva" },
  { key: "wind",        label: "Vento" },
  { key: "humidity",    label: "Umidade" },
];

export default function DataSelector({ value, onChange, className }: Props) {
  const set = React.useMemo(() => new Set(value), [value]);

  const toggle = (k: MetricKey, checked: boolean | "indeterminate") => {
    const next = new Set(set);
    if (checked) next.add(k);
    else next.delete(k);
    onChange(Array.from(next));
  };

  return (
    <div className={["rounded-xl bg-black-gray/90 p-4 text-white shadow", className].join(" ")}>
      <p className="mb-3 text-sm text-white/70">Selecione os dados</p>

      <div className="flex flex-wrap items-center gap-6">
        {OPTIONS.map(({ key, label }) => (
          <label key={key} className="inline-flex select-none items-center gap-3">
            <Checkbox
              checked={set.has(key)}
              onCheckedChange={(c) => toggle(key, c)}
              className="
                h-6 w-6 rounded-lg border-white/30 bg-transparent
                data-[state=checked]:bg-orange-light
                data-[state=checked]:border-orange-light
                focus-visible:ring-2 focus-visible:ring-orange-light
              "
            />
            <span className="text-base">{label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
