"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Loader2, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export type Place = {
  id: string;
  label: string;
  lat: number;
  lon: number;
  address?: {
    road?: string;
    suburb?: string;
    city?: string;
    state?: string;
    country?: string;
  };
};

type Props = {
  value?: Place | null;
  onChange?: (place: Place | null) => void;
  placeholder?: string;
  className?: string;
  limit?: number;
};

export function LocationCombobox({
  value,
  onChange,
  placeholder = "Buscar cidade, bairro, endereço...",
  className,
  limit = 8,
}: Props) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [items, setItems] = React.useState<Place[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState<Place | null>(value ?? null);

  // Sincroniza value externo
  React.useEffect(() => {
    setInternalValue(value ?? null);
  }, [value]);

  // Debounce + fetch
  React.useEffect(() => {
    if (!open) return; // só busca quando popover estiver aberto
    const q = query.trim();
    if (q.length < 2) {
      setItems([]);
      return;
    }
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/geo?q=${encodeURIComponent(q)}&limit=${limit}`, {
          cache: "no-store",
        });
        const data = (await res.json()) as Place[];
        setItems(data);
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    }, 300); // debounce 300ms

    return () => clearTimeout(t);
  }, [query, open, limit]);

  function handleSelect(p: Place) {
    setInternalValue(p);
    onChange?.(p);
    setOpen(false);
  }

  function clear() {
    setInternalValue(null);
    onChange?.(null);
  }

  const buttonLabel = internalValue?.label
    ? shortLabel(internalValue.label)
    : "Selecionar local...";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-[320px] h-10 justify-between bg-card text-card-foreground", className)}
        >
          <span className="truncate text-left">{buttonLabel}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="z-[2100] w-[320px] p-0">
        <Command shouldFilter={false}>
          <CommandInput
            value={query}
            onValueChange={setQuery}
            placeholder={placeholder}
            className="h-9"
          />
          <CommandList>
            {loading ? (
              <div className="flex items-center gap-2 px-3 py-2 text-sm">
                <Loader2 className="h-4 w-4 animate-spin" />
                Buscando…
              </div>
            ) : null}

            {!loading && items.length === 0 && query.trim().length >= 2 ? (
              <CommandEmpty>Nenhum local encontrado.</CommandEmpty>
            ) : null}

            <CommandGroup heading="Sugestões">
              {items.map((p) => (
                <CommandItem
                  key={p.id}
                  value={p.label}
                  onSelect={() => handleSelect(p)}
                  className="flex items-center gap-2"
                >
                  <MapPin className="h-4 w-4 text-orange-light shrink-0" />
                  <div className="min-w-0">
                    <div className="truncate">{shortLabel(p.label)}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {secondaryLabel(p)}
                    </div>
                  </div>
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      internalValue?.id === p.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>

          {internalValue ? (
            <div className="flex justify-end p-2">
              <Button variant="ghost" size="sm" onClick={clear}>
                Limpar seleção
              </Button>
            </div>
          ) : null}
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function shortLabel(label: string) {
  const i = label.indexOf(",");
  return i > 0 ? label.slice(0, i) : label;
}
function secondaryLabel(p: Place) {
  const parts = [p.address?.city, p.address?.state, p.address?.country].filter(Boolean);
  return parts.join(" · ");
}
