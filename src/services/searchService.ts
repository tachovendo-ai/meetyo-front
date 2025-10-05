import { SearchPayloadSchema, MetricFlagsSchema, MetricKeyEnum } from "@/schemas/searchSchema";

const ALL = MetricKeyEnum.options as readonly string[];

export function toISODate(d: Date) {
  return d.toISOString().slice(0, 10);
}

export function toFlags(selected: string[]) {
  const flags = Object.fromEntries(ALL.map(k => [k, selected.includes(k)]));
  const parsed = MetricFlagsSchema.parse(flags);
  return parsed;
}

export function buildSearchQuery(payload: unknown) {
  // valida o payload (vindo do componente) e normaliza
  const parsed = SearchPayloadSchema.parse(payload);

  const flags = toFlags(parsed.metrics);
  const params = new URLSearchParams({
    ...(parsed.place ? { lat: String(parsed.place.lat), lon: String(parsed.place.lon) } : {}),
    date: toISODate(parsed.date),
    temperature: String(flags.temperature),
    rain: String(flags.rain),
    wind: String(flags.wind),
    humidity: String(flags.humidity),
  });

  return { parsed, flags, params };
}
