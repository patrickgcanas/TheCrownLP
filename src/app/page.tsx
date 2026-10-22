import Link from "next/link";
import HeroVideo from "@/components/HeroVideo";
import IntroVideoSection from "@/components/IntroVideoSection";

export default function Home() {
  return (
    <div>
      <section className="relative flex min-h-[85vh] items-center overflow-hidden">
        <HeroVideo />
        <div className="relative z-10 mx-auto w-full max-w-6xl px-6 py-24">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-accent">
            Tributo a Linkin Park
          </p>
          <h1 className="max-w-2xl text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl">
            <span className="text-gradient-accent">THE CROWN LP</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted">
            Trazemos a energia, a raiva e a emoção de Linkin Park para o palco —
            para bares, casas de show, eventos privados e apresentações
            públicas.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/contato"
              className="rounded-full bg-accent px-7 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-accent-dim"
            >
              Contrate a banda
            </Link>
            <Link
              href="/midia"
              className="rounded-full border border-border px-7 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-surface"
            >
              Assista aos vídeos
            </Link>
          </div>
        </div>
      </section>

      <IntroVideoSection />

      <section className="border-t border-border bg-surface">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid gap-10 sm:grid-cols-3">
            <div>
              <p className="text-3xl font-bold text-accent">+shows</p>
              <p className="mt-2 text-sm text-muted">
                Em bares, casas noturnas e eventos pelo Brasil.
              </p>
            </div>
            <div>
              <p className="text-3xl font-bold text-accent">setlist completo</p>
              <p className="mt-2 text-sm text-muted">
                Os maiores clássicos de Hybrid Theory, Meteora e muito mais.
              </p>
            </div>
            <div>
              <p className="text-3xl font-bold text-accent">pronta pra viajar</p>
              <p className="mt-2 text-sm text-muted">
                Estrutura própria de som e visual para qualquer palco.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-2xl font-bold">Sobre a banda</h2>
            <p className="mt-3 max-w-xl text-muted">
              Conheça a história da The Crown LP e o que nos motiva a subir ao
              palco com o som do Linkin Park.
            </p>
          </div>
          <Link href="/historia" className="text-sm font-semibold text-accent hover:underline">
            Ler a história completa →
          </Link>
        </div>
      </section>

      <section className="border-t border-border bg-surface">
        <div className="mx-auto max-w-6xl px-6 py-20 text-center">
          <h2 className="text-3xl font-bold">
            Leve a energia do Linkin Park pro seu evento
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted">
            Bares, festas privadas, eventos corporativos ou apresentações
            públicas — fale com a gente e monte o show ideal.
          </p>
          <Link
            href="/contato"
            className="mt-8 inline-block rounded-full bg-accent px-8 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-accent-dim"
          >
            Fale com a banda
          </Link>
        </div>
      </section>
    </div>
  );
}
