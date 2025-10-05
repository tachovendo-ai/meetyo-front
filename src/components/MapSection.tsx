"use client";
import dynamic from "next/dynamic";

type Props = {
  focus?: [number, number] | null;
  picked?: [number, number] | null;
  onPick?: (lat: number, lon: number) => void;
};

const ClientMap = dynamic(() => import("@/components/ClientMap"), { ssr: false });

export default function MapSection({ focus = null, picked = null, onPick }: Props) {
  return <ClientMap focus={focus} picked={picked} onPick={onPick} />;
}