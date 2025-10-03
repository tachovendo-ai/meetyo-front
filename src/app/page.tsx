import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-white">
      {/* Overlay da chuva (GIF) */}
      <img
        src="/images/rain.gif"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-20 h-full w-full object-cover opacity-20 mix-blend-multiply"
      />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-4 pt-5">
        <Image
          src="/images/meetyo.svg"
          width={84}
          height={84}
          alt="meetyo"
          priority
        />
        <div
          aria-hidden="true"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-[#FFA216] text-[#FFA216]"
          title="Avisos"
        />
      </header>

      {/* Conteúdo principal */}
      <main className="relative z-10 px-4 pb-10">
        <div className="mx-auto w-full max-w-6xl">
          {/* Mobile: coluna | Desktop: linha com space-between */}
          <div className="flex flex-col gap-8 pt-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Planeta (esquerda no desktop) */}
            <div className="mx-auto lg:mx-0 lg:shrink-0">
              <Image
                src="/images/earth.png"
                width={420}
                height={420}
                alt="Planeta Terra com ícones de clima"
                priority
              />
            </div>

            {/* Texto + CTA (direita no desktop) */}
            <section className="lg:max-w-xl">
              <h1 className="max-w-[18ch] text-3xl font-semibold leading-tight text-[#FFA216] md:text-4xl">
                Qual a previsão de hoje?
              </h1>

              <div className="mt-4 flex items-center gap-4">
                <Link
                  href="/previsao"
                  aria-label="Ir para a previsão de hoje"
                  className="grid h-14 w-14 place-items-center rounded-full bg-[#FFA216] shadow-lg transition hover:brightness-110 md:h-16 md:w-16"
                >
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M5 12h12M13 6l6 6-6 6"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
