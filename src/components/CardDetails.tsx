// src/components/CardDetails.tsx
"use client";

import { useState, useMemo, JSX } from "react";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sun, Droplets, Wind, SunMedium, ChevronLeft } from "lucide-react";
import Image from "next/image";
import type { WeatherResponse } from "@/app/page";

type Props = {
  fixedTopClass?: string;
  data?: WeatherResponse;
  city?: string;
  dateLabel?: string;
};

export default function CardDetails({
  fixedTopClass = "top-6 sm:top-8 md:top-10",
  data,
  city,
  dateLabel,
}: Props) {
  const [expanded, setExpanded] = useState(false);

  // -------- Helpers --------
  const fmtTemp = (n: number, locale = "pt-BR") =>
    new Intl.NumberFormat(locale, {
      style: "unit",
      unit: "celsius",
      unitDisplay: "narrow",
      maximumFractionDigits: 0,
    }).format(n);

  const tempInt = useMemo(() => {
    const t = data?.temperatura?.media ?? "";
    const n = Number((t.match(/-?\d+(\.\d+)?/) ?? [])[0]);
    return Number.isFinite(n) ? Math.round(n) : undefined;
  }, [data]);

  const rainProb = data?.chuva?.probabilidade;
  const humidAvg = data?.umidade?.media;
  const windName = data?.vento?.nomenclatura_provavel;
  const conf = data?.meta?.confiabilidade;

  // Cards superiores (só cria os que têm dados)
  const summaryCards = useMemo(() => {
    const cards: {
      key: string;
      icon: JSX.Element;
      title: string;
      value: string;
      subtitle?: string;
    }[] = [];

    if (data?.temperatura?.media) {
      cards.push({
        key: "temp",
        icon: <Sun className="h-5 w-5" />,
        title: "Temperatura",
        value: data.temperatura.media,
        subtitle: data.temperatura.nomenclatura_provavel ?? undefined,
      });
    }
    if (rainProb) {
      cards.push({
        key: "rain",
        icon: <Droplets className="h-5 w-5" />,
        title: "Chuva",
        value: rainProb,
      });
    }
    if (windName) {
      cards.push({
        key: "wind",
        icon: <Wind className="h-5 w-5" />,
        title: "Clima",
        value: windName,
      });
    }
    if (humidAvg) {
      cards.push({
        key: "humid",
        icon: <Droplets className="h-5 w-5" />,
        title: "Umidade",
        value: humidAvg,
      });
    }

    return cards;
  }, [data, rainProb, windName, humidAvg]);

  // -------- Horas a partir de agora (e só se existir dado) --------
  function hourKeyToIndex(k: string): number {
    const m = k.match(/^(\d{2})/);
    if (!m) return -1;
    const hh = Number(m[1]);
    return Number.isFinite(hh) ? hh : -1;
  }

  const hourlySlice = useMemo(() => {
    const blocks = data?.probabilidades_por_hora ?? {};
    const keys = Object.keys(blocks)
      .filter((k) => hourKeyToIndex(k) >= 0)
      .sort((a, b) => hourKeyToIndex(a) - hourKeyToIndex(b));

    if (keys.length === 0) return [];

    const nowIdx = new Date().getHours();
    let start = keys.findIndex((k) => hourKeyToIndex(k) >= nowIdx);
    if (start === -1) start = 0;

    const out: Array<{ hh: string; block: NonNullable<WeatherResponse["probabilidades_por_hora"]>[string] }> = [];
    let count = 0;
    let i = 0;

    // pega até 5 horários que tenham valor de chuva
    while (count < 5 && i < keys.length) {
      const idx = (start + i) % keys.length;
      const key = keys[idx];
      const block = blocks[key]!;
      if (block?.chuva) {
        out.push({ hh: key, block });
        count++;
      }
      i++;
    }

    return out;
  }, [data]);

  // -------- Detalhes (colapsável) — monta apenas o que existe --------
  const detailItems = useMemo(() => {
    const items: { key: string; icon: JSX.Element; label: string; value?: string }[] = [];

    if (data?.temperatura?.prob_desconforto) {
      items.push({
        key: "desconforto",
        icon: <SunMedium className="mx-auto mb-2 h-5 w-5 md:h-6 md:w-6 text-white/90" />,
        label: "Desconforto",
        value: data.temperatura.prob_desconforto,
      });
    }
    if (humidAvg) {
      items.push({
        key: "humid-avg",
        icon: <Droplets className="mx-auto mb-2 h-5 w-5 md:h-6 md:w-6 text-white/90" />,
        label: "Umidade média",
        value: humidAvg,
      });
    }
    if (windName) {
      items.push({
        key: "wind-name",
        icon: <Wind className="mx-auto mb-2 h-5 w-5 md:h-6 md:w-6 text-white/90" />,
        label: "Vento",
        value: windName,
      });
    }

    return items;
  }, [data, humidAvg, windName]);

  return (
    <div
      className={cn(
        "w-full transition-all duration-500 ease-out",
        expanded
          ? cn(
              "md:fixed md:right-0 md:z-[3000] md:w-[100dvw]",
              fixedTopClass,
              "md:h-[600px] lg:h-[640px] xl:h-[680px]"
            )
          : cn("md:relative md:w-full md:h-[600px] lg:h-[640px] xl:h-[680px]")
      )}
    >
      <Card className="relative flex h-auto w-full flex-col rounded-3xl bg-black-gray text-white shadow-2xl md:h-full">
        {/* Recolher */}
        {expanded && (
          <Button
            type="button"
            variant="secondary"
            size="icon"
            onClick={() => setExpanded(false)}
            aria-label="Recolher card"
            title="Recolher"
            className={cn(
              "absolute right-3 top-3 z-[3100] rounded-full bg-white/20 text-white hover:bg-white/30 backdrop-blur",
              "md:right-6 md:top-6"
            )}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        )}

        {/* Cabeçalho */}
        <CardHeader className="space-y-5 px-6 pt-6">
          <div className="flex items-center justify-between">
            <Image src="/icons/logo_meetyo.svg" width={100} height={28} alt="Logo" />
            {conf ? <span className="text-xs text-white/70">Confiabilidade: {conf}</span> : null}
          </div>

          <div className="flex items-end justify-between gap-4">
            {/* Temperatura principal: só renderiza se existir */}
            {typeof tempInt === "number" ? (
              <div className="inline-flex items-start leading-none whitespace-nowrap">
                <span className="tabular-nums font-semibold text-[clamp(40px,10vw,72px)] md:text-[68px] lg:text-[72px]">
                  {fmtTemp(tempInt)}
                </span>
              </div>
            ) : (
              <div />
            )}

            <div className="text-right min-w-0">
              {city ? (
                <div className="truncate text-xl font-semibold md:text-2xl">{city}</div>
              ) : null}
              {dateLabel ? <div className="text-sm text-white/80">{dateLabel}</div> : null}
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-6 pb-4 space-y-4">
          {/* ——— Cards superiores (apenas os existentes) ——— */}
          {summaryCards.length > 0 && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {summaryCards.map((c) => (
                <div
                  key={c.key}
                  className="rounded-2xl border border-white/10 bg-white/10 p-4 text-center"
                >
                  <div className="mb-2 flex items-center justify-center gap-2 text-sm text-white/80">
                    {c.icon}
                    <span>{c.title}</span>
                  </div>
                  <div className="text-lg font-semibold">{c.value}</div>
                  {c.subtitle ? (
                    <div className="mt-1 text-xs text-white/70">{c.subtitle}</div>
                  ) : null}
                </div>
              ))}
            </div>
          )}

          {/* ——— Horários (chuva) ——— */}
          {hourlySlice.length > 0 && (
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
              <div className="mb-3 text-sm font-medium text-white/80">
                Probabilidade de chuva por hora
              </div>

              <div className="grid grid-cols-3 gap-4 text-center sm:grid-cols-4 lg:grid-cols-5">
                {hourlySlice.map(({ hh, block }) => (
                  <div key={hh} className="space-y-1.5">
                    <div className="text-xs text-white/70">{hh}</div>
                    <Droplets className="mx-auto h-5 w-5 md:h-6 md:w-6 text-orange-light" />
                    <div className="text-xs text-white/80">Chuva</div>
                    <div className="text-sm font-semibold">{block.chuva}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>

        {/* Detalhes colapsáveis (só se existir algo) */}
        {detailItems.length > 0 && (
          <div
            aria-hidden={!expanded}
            aria-expanded={expanded}
            className={cn(
              "px-6",
              "grid transition-[grid-template-rows] duration-500 ease-out",
              expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              "md:flex-1 md:min-h-0"
            )}
          >
            <div className={cn("min-h-0 overflow-hidden", expanded && "overflow-y-auto")}>
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                <div
                  className={cn(
                    "grid divide-x divide-white/15 text-center",
                    // colunas dinâmicas baseadas na qtde.
                    detailItems.length === 1 && "grid-cols-1",
                    detailItems.length === 2 && "grid-cols-2",
                    detailItems.length >= 3 && "grid-cols-3"
                  )}
                >
                  {detailItems.map((it) => (
                    <div key={it.key} className="px-3">
                      {it.icon}
                      <div className="text-white/80 text-sm">{it.label}</div>
                      {it.value ? (
                        <div className="text-sm font-semibold md:text-base">{it.value}</div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>

              {expanded && <div className="h-4" />}
            </div>
          </div>
        )}

        {/* Footer */}
        <CardFooter className="flex flex-col items-stretch gap-4 px-6 pb-6">
          {!expanded && (
            <>
              <Button
                variant="secondary"
                className="w-full rounded-2xl bg-white/15 text-white hover:bg-white/25"
                onClick={() => setExpanded(true)}
              >
                Mais detalhes
              </Button>
              <Separator className="bg-white/10" />
              <div className="text-center text-sm text-white/70">Me conta sobre seu evento</div>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
