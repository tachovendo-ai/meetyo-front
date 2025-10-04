// src/app/api/geo/route.ts
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").trim();
  const limit = Number(searchParams.get("limit") || 8);

  if (!q) return NextResponse.json([]);

  const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=${limit}&q=${encodeURIComponent(
    q
  )}`;

  const res = await fetch(url, {
    // Identifique seu app conforme as políticas do Nominatim
    headers: {
      "User-Agent": "meetyo/1.0 (contato@seu-dominio.com)",
      "Accept-Language": "pt-BR,pt;q=0.9",
    },
    // Evita cache agressivo do edge:
    cache: "no-store",
  });

  if (!res.ok) {
    return NextResponse.json({ error: "geo provider error" }, { status: 500 });
  }

  const data: any[] = await res.json();

  const items = data.map((d) => ({
    id: String(d.place_id),
    label: d.display_name as string,
    lat: Number(d.lat),
    lon: Number(d.lon),
    address: {
      road: d.address?.road,
      suburb: d.address?.suburb,
      city: d.address?.city || d.address?.town || d.address?.village,
      state: d.address?.state,
      country: d.address?.country,
    },
  }));

  return NextResponse.json(items);
}
