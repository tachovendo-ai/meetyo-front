// src/app/api/reverse/route.ts
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");
  if (!lat || !lon) {
    return NextResponse.json({ error: "lat/lon obrigatórios" }, { status: 400 });
  }

  const url =
    `https://nominatim.openstreetmap.org/reverse` +
    `?format=jsonv2&addressdetails=1&zoom=14&accept-language=pt-BR` +
    `&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`;

  const res = await fetch(url, {
    headers: {
      "User-Agent": "meetyo/1.0 (contato@seu-dominio.com)",
      "Accept": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    return NextResponse.json({ error: "reverse provider error" }, { status: 500 });
  }

  const d = await res.json();

  const place = {
    id: String(d.place_id ?? `${lat},${lon}`),
    label: (d.display_name as string) ?? `${lat}, ${lon}`,
    lat: Number(d.lat),
    lon: Number(d.lon),
    address: {
      road: d.address?.road,
      suburb: d.address?.suburb,
      city: d.address?.city || d.address?.town || d.address?.village,
      state: d.address?.state,
      country: d.address?.country,
    },
  };

  return NextResponse.json(place);
}
