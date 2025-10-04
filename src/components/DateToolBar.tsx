// src/components/DateToolbar.tsx
"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

// utils
const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
const isLeap = (y: number) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
const daysInMonth = (y: number, m: number) =>
  [0, 2, 4, 6, 7, 9, 11].includes(m) ? 31 : [3, 5, 8, 10].includes(m) ? 30 : isLeap(y) ? 29 : 28;
const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const addDays = (d: Date, n: number) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return startOfDay(x);
};

export interface DateToolbarProps {
  value?: Date;
  onChange?: (d: Date) => void;
  locale?: string;
  startYear?: number;
  endYear?: number;
  className?: string;
}

export default function DateToolbar({
  value,
  onChange,
  locale = "pt-BR",
  startYear = new Date().getFullYear() - 50,
  endYear = new Date().getFullYear() + 50,
  className,
}: DateToolbarProps) {
  const [inner, setInner] = React.useState<Date>(startOfDay(value ?? new Date()));
  React.useEffect(() => {
    if (value) setInner(startOfDay(value));
  }, [value]);

  const setDate = (d: Date) => (onChange ? onChange(d) : setInner(d));

  const date = value ?? inner;
  const y = date.getFullYear();
  const m = date.getMonth();
  const d = date.getDate();

  const dayMax = daysInMonth(y, m);
  const dayOptions = React.useMemo(() => Array.from({ length: dayMax }, (_, i) => i + 1), [dayMax]);
  const monthOptions = React.useMemo(() => Array.from({ length: 12 }, (_, i) => i), []);
  const yearOptions = React.useMemo(
    () => Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i),
    [startYear, endYear]
  );

  const setDMY = (day: number, month: number, year: number) => {
    const dd = clamp(day, 1, daysInMonth(year, month));
    setDate(startOfDay(new Date(year, month, dd)));
  };

  return (
    <div
      className="inline-flex items-center gap-2 rounded-md bg-card border border-border shadow-sm px-2 py-1 text-sm h-10 min-w-0"
    >
      {/* -1 dia */}
      <Button type="button" size="icon" variant="outline" onClick={() => setDate(addDays(date, -1))} className="rounded-md  text-black">
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {/* Dia */}
      <Select value={String(d)} onValueChange={(v) => setDMY(Number(v), m, y)}>
        <SelectTrigger className="rounded-md text-black ">
          <SelectValue placeholder="Dia" />
        </SelectTrigger>
        {/* z alto para ficar acima do Leaflet/overlay */}
        <SelectContent align="start" className="rounded-md z-[2200]">
          {dayOptions.map((day) => (
            <SelectItem key={day} value={String(day)} className="cursor-pointer">
              {String(day).padStart(2, "0")}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Mês */}
      <Select value={String(m)} onValueChange={(v) => setDMY(d, Number(v), y)}>
        <SelectTrigger className="rounded-md text-black">
          <SelectValue placeholder="Mês" />
        </SelectTrigger>
        <SelectContent align="start" className="rounded-md z-[2200]">
          {monthOptions.map((mm) => {
            const label = new Date(y, mm, 1)
              .toLocaleString(locale, { month: "long" })
              .replace(/^./, (c) => c.toUpperCase());
            return (
              <SelectItem key={mm} value={String(mm)} className="cursor-pointer">
                {label}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>

      {/* Ano */}
      <Select value={String(y)} onValueChange={(v) => setDMY(d, m, Number(v))}>
        <SelectTrigger className="rounded-md text-black">
          <SelectValue placeholder="Ano" />
        </SelectTrigger>
        <SelectContent align="start" className="rounded-md max-h-64 z-[2200]">
          {yearOptions.map((yy) => (
            <SelectItem key={yy} value={String(yy)} className="cursor-pointer">
              {yy}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* +1 dia */}
      <Button type="button" size="icon" variant="outline" onClick={() => setDate(addDays(date, 1))} className="rounded-md text-black">
        <ChevronRight className="h-4 w-4" />
      </Button>

      {/* Só o ícone do calendário */}
      <Popover>
        <PopoverTrigger asChild>
          <Button type="button" size="icon" variant="outline" className="ml-1 rounded-md text-black">
            <CalendarIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0 z-[2200] rounded-2xl"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <Calendar
            mode="single"
            selected={date}
            onSelect={(dsel) => dsel && setDate(startOfDay(dsel))}
            fromYear={startYear}
            toYear={endYear}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
