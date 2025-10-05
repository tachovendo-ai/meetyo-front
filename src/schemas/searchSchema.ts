import { z } from "zod";

export const MetricKeyEnum = z.enum(["temperature", "rain", "wind", "humidity"]);

export const PlaceSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  lat: z.number().finite(),
  lon: z.number().finite(),
});

export const SearchPayloadSchema = z.object({
  place: PlaceSchema.nullable(),
  date: z.date(),
  metrics: z.array(MetricKeyEnum).min(1),
});

export type SearchPayload = z.infer<typeof SearchPayloadSchema>;

// Flags (para rota/consulta)
export const MetricFlagsSchema = z.object({
  temperature: z.boolean(),
  rain: z.boolean(),
  wind: z.boolean(),
  humidity: z.boolean(),
});
export type MetricFlags = z.infer<typeof MetricFlagsSchema>;
