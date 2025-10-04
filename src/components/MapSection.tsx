"use client";

import dynamic from "next/dynamic";
import type L from "leaflet";

const ClientMap = dynamic(() => import("@/components/ClientMap"), { ssr: false });

type Props = {
  focus: L.LatLngExpression | null;
};

export default function MapSection({ focus }: Props) {
  return <ClientMap focus={focus} />;
}