// src/components/CardDetails.tsx
"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sun, Droplets, Wind, SunMedium, ChevronLeft } from "lucide-react";
import Image from "next/image";

type Props = {
  /** use o mesmo top da sua faixa na Page (ex.: "top-6 sm:top-8 md:top-10") */
  fixedTopClass?: string;
};

export default function CardDetails({ fixedTopClass = "top-6 sm:top-8 md:top-10" }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={cn(
        // Wrapper externo NUNCA esconde overflow no mobile; no desktop controla largura/posição
        "w-full transition-all duration-500 ease-out",
        expanded
          ? cn(
              // Desktop expandido: fixa na direita e ocupa a largura da viewport
              "md:fixed md:right-0 md:z-[3000] md:w-[100dvw]",
              fixedTopClass,
              "md:h-[600px] lg:h-[640px] xl:h-[680px]"
            )
          : cn(
              // Desktop compacto: largura vem do wrapper da Page, altura fixa confortável
              "md:relative md:w-full md:h-[600px] lg:h-[640px] xl:h-[680px]"
            )
      )}
    >
      <Card className="relative flex w-full flex-col rounded-3xl bg-black-gray text-white shadow-2xl md:h-full">
        {/* Botão de recolher (quando expandido) */}
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
              // no desktop continua ok porque o Card está visível/fixo
              "md:right-6 md:top-6"
            )}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        )}

        <CardHeader className="space-y-5 px-6 pt-6">
          <div className="flex items-center gap-3">
            <div className="text-3xl font-extrabold tracking-tight">
              <Image src="/icons/logo_meetyo.svg" width={100} height={100} alt="Logo" />
            </div>
          </div>

          <div className="flex items-end justify-between gap-4">
            <div className="flex items-baseline gap-3">
              <span className="text-[60px] leading-none font-semibold md:text-[68px] lg:text-[72px]">
                23
              </span>
              <span className="-translate-y-1.5 text-3xl md:text-4xl">°</span>
            </div>
            <div className="text-right">
              <div className="text-xl font-semibold md:text-2xl">Vilhena</div>
              <div className="text-sm text-white/80">
                <span className="font-bold">32° Máx.</span> / <span className="font-bold">21° Mín.</span>
                <br />
                quarta-feira, <span className="font-bold">17:00</span>
              </div>
            </div>
          </div>
        </CardHeader>

        {/* RESUMO (sempre visível) */}
        <CardContent className="px-6 pb-4">
          <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
            <div className="grid grid-cols-5 gap-4 text-center">
              {["18:00", "19:00", "20:00", "21:00", "22:00"].map((h) => (
                <div key={h} className="space-y-2">
                  <div className="text-white/80 text-sm">{h}</div>
                  <Sun className="mx-auto h-5 w-5 md:h-6 md:w-6 text-orange-light" />
                  <div className="text-white/90 text-sm">26°</div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>

        {/* DETALHES (colapsável no mobile; no desktop aparece junto quando expandido) */}
        <div
          aria-hidden={!expanded}
          aria-expanded={expanded}
          className={cn(
            // anima abrir/fechar no mobile pelo max-height
            "transition-[max-height] duration-500 ease-out",
            "overflow-y-auto", // permite rolar quando conteúdo é maior
            expanded ? "max-h-[70dvh]" : "max-h-0",
            // no desktop temos altura do card definida; aqui só preenche o restante
            "md:flex-1"
          )}
        >
          <div className="px-6 pb-6">
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
              <div className="grid grid-cols-3 divide-x divide-white/15 text-center">
                <div className="px-3">
                  <SunMedium className="mx-auto mb-2 h-5 w-5 md:h-6 md:w-6 text-white/90" />
                  <div className="text-white/80 text-sm">Índice UV</div>
                  <div className="text-sm font-semibold md:text-base">Extremo</div>
                </div>
                <div className="px-3">
                  <Droplets className="mx-auto mb-2 h-5 w-5 md:h-6 md:w-6 text-white/90" />
                  <div className="text-white/80 text-sm">Umidade</div>
                  <div className="text-sm font-semibold md:text-base">51%</div>
                </div>
                <div className="px-3">
                  <Wind className="mx-auto mb-2 h-5 w-5 md:h-6 md:w-6 text-white/90" />
                  <div className="text-white/80 text-sm">Vento</div>
                  <div className="text-sm font-semibold md:text-base">13 km/h</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <CardFooter className="flex flex-col items-stretch gap-4 px-6 pb-6">
          {!expanded ? (
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
          ) : null}
        </CardFooter>
      </Card>
    </div>
  );
}
