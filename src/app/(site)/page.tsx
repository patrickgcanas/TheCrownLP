import Link from "next/link";
import HeroVideo from "@/components/HeroVideo";
import IntroVideoSection from "@/components/IntroVideoSection";

const destaques = [
  { titulo: "+SHOWS", texto: "Em bares, casas noturnas e eventos pelo Brasil." },
  { titulo: "SETLIST COMPLETO", texto: "Os maiores clássicos de Hybrid Theory, Meteora e muito mais." },
  { titulo: "PRONTA PRA VIAJAR", texto: "Estrutura própria de som e visual para qualquer palco." },
];

export default function Home() {
  return (
    <div>
      <section className="relative flex min-h-[88vh] items-center overflow-hidden">
        <HeroVideo />
        <div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-20 text-center sm:px-6 md:text-left">
          <p className="eyebrow">Tributo a Linkin Park</p>
          <h1 className="font-display mt-3 text-[4.5rem] leading-[0.88] sm:text-8xl lg:text-[7rem]">
            <span className="text-gradient-crown block">THE CROWN</span>
            <span className="text-gradient-accent block">LP TRIBUTE</span>
          </h1>
          <p className="font-display mt-6 flex items-center justify-center gap-3.5 text-2xl tracking-[0.18em] text-gold sm:text-3xl md:justify-start">
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-gold" />
            HEAVY IS THE CROWN
            <span className="h-px w-12 bg-gradient-to-l from-transparent to-gold" />
          </p>
          <p className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-muted sm:text-lg md:mx-0">
            Trazemos a energia, a raiva e a emoção de Linkin Park para o palco —
            para bares, casas de show, eventos privados e apresentações
            públicas.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3 md:justify-start">
            <Link href="/contato" className="btn-primary">
              Contrate a banda
            </Link>
            <Link href="/midia" className="btn-ghost">
              Assista aos vídeos
            </Link>
          </div>
        </div>
      </section>

      <div className="divider-gold mx-auto max-w-6xl" />

      <IntroVideoSection />

      <section className="border-y border-border bg-surface">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:grid-cols-3 sm:px-6">
          {destaques.map((d) => (
            <div key={d.titulo}>
              <p className="font-display text-4xl text-accent">{d.titulo}</p>
              <p className="mt-2 text-sm text-muted">{d.texto}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <h2 className="font-display text-5xl leading-none">
              SOBRE A <span className="text-accent">BANDA</span>
            </h2>
            <p className="mt-3 max-w-xl text-muted">
              Conheça a história da The Crown LP e o que nos motiva a subir ao
              palco com o som do Linkin Park.
            </p>
          </div>
          <Link href="/historia" className="text-sm font-semibold uppercase tracking-[0.1em] text-gold hover:underline">
            Ler a história completa →
          </Link>
        </div>
      </section>

      <section className="relative overflow-hidden border-t border-border bg-surface">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_120%,rgb(214_63_184/0.22),transparent_60%)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 text-center sm:px-6">
          <h2 className="font-display text-5xl leading-none sm:text-6xl">
            LEVE A ENERGIA DO <span className="text-accent">LINKIN PARK</span> PRO SEU EVENTO
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted">
            Bares, festas privadas, eventos corporativos ou apresentações
            públicas — fale com a gente e monte o show ideal.
          </p>
          <Link href="/contato" className="btn-primary mt-8">
            Fale com a banda
          </Link>
        </div>
      </section>
    </div>
  );
}
