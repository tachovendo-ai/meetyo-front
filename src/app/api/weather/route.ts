import { NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://meetyo-back.onrender.com";
const PATH     = process.env.NEXT_PUBLIC_WEATHER_PATH ?? "/weather";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const upstream = `${BASE_URL}${PATH}?${url.searchParams.toString()}`;

  try {
    const r = await fetch(upstream, { cache: "no-store" });
    const buf = await r.arrayBuffer();
    const ct  = r.headers.get("content-type") ?? "application/octet-stream";

    return new NextResponse(buf, { status: r.status, headers: { "content-type": ct }});
  } catch (e) {
    return NextResponse.json({ error: "upstream_fetch_failed", detail: String(e) }, { status: 502 });
  }
}
