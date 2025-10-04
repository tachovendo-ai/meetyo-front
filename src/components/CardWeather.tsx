// src/components/CardWeather.tsx
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export type WeatherKind =
    | "clear"            // céu limpo
    | "partly-cloudy"    // poucas nuvens
    | "cloudy"           // nublado
    | "rain"             // chuva
    | "drizzle"          // garoa
    | "thunderstorm"     // temporal
    | "snow"             // neve
    | "fog"              // neblina
    | "wind"             // ventania
    | "extreme-heat";    // calor extremo

export type CardWeatherProps = {
    /** Ex.: "Vilhena - RO" */
    location: string;

    /** Data/hora da previsão ou observação (Date ou ISO string) */
    datetime: Date | string;

    /** Temperaturas em °C */
    tempNowC: number;
    tempMaxC: number;
    tempMinC: number;
    feelsLikeC: number;

    /** Probabilidade de chuva (0–100 %) */
    rainProbPct: number;

    /** Vento em km/h (opcional rajada e direção em graus meteorológicos) */
    wind: {
        speedKmh: number;
        gustKmh?: number;
        deg?: number;
    };

    /** “Calor”: índice de calor em °C (opcional) */
    heatIndexC?: number;

    /** Texto amigável do clima: "Céu limpo", "Temporal", etc. */
    condition: string;

    /** Classificação/ícone opcional para usar em UI */
    kind?: WeatherKind;
};

export default function CardWeather({
    location,
    datetime,
    tempNowC,
    tempMaxC,
    tempMinC,
    feelsLikeC,
    rainProbPct,
    wind,
    heatIndexC,
    condition,
}: CardWeatherProps) {

    const dateObj = typeof datetime === "string" ? new Date(datetime) : datetime;

    const weekday = new Intl.DateTimeFormat("pt-BR", { weekday: "long" })
        .format(dateObj)
        .replace(/^\w/, (c) => c.toUpperCase());

    const dateStr = new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(dateObj);

    const t = (v: number) => `${Math.round(v)}°C`;
    const pct = (v: number) => `${Math.round(v)}%`;

    return (
        <>
            <Card className="bg-black-gray w-1/4 h-1/2">
                <CardHeader className="text-center">
                    <CardTitle className="text-base md:text-lg text-white">
                        <div className="flex flex-col items-center gap-2">
                            <div>
                                {weekday} {dateStr}
                            </div>

                            {/* Ícone centralizado, maior e com cor orange-light */}
                            <Image
                            src={"/icons/sun.svg"}
                            width={100}
                            height={100}
                            alt="Icone"
                            />
                        <p className="text-orange-light">
                            {condition}
                        </p>
                        </div>
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <div className="flex-row">

                        <div className="flex-col">
                            <h1>{tempNowC}° C</h1>
                            <p>{location}</p>
                        </div>

                    </div>
                </CardContent>
            </Card>
        </>
    )
}