import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "História — The Crown LP",
  description: "A história da banda The Crown LP, tributo a Linkin Park.",
};

export default function HistoriaPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-accent">
        Nossa história
      </p>
      <h1 className="mt-4 text-4xl font-extrabold tracking-tight">
        Quem é a The Crown LP
      </h1>

      <div className="mt-10 space-y-6 text-lg leading-relaxed text-muted">
        <p>
          A The Crown LP nasceu da paixão de um grupo de músicos pela obra de
          Linkin Park — uma banda que marcou gerações misturando rock, rap e
          eletrônico com uma intensidade emocional rara. O que começou como
          encontros para tocar as músicas favoritas virou um projeto sério de
          tributo, pensado para levar essa experiência ao vivo para o público
          brasileiro.
        </p>
        <p>
          Hoje a banda apresenta um setlist que percorre os grandes álbuns de
          Linkin Park — de <em>Hybrid Theory</em> a <em>Meteora</em> e além —
          reproduzindo com fidelidade os arranjos, a pegada e a energia dos
          shows originais, sem deixar de lado a própria identidade no palco.
        </p>
        <p>
          A banda já se apresentou em bares, casas de show e eventos privados,
          e está em expansão para festivais, eventos corporativos e
          apresentações públicas em parceria com prefeituras.
        </p>
      </div>

      <div className="mt-16 rounded-2xl border border-border bg-surface p-8">
        <h2 className="text-xl font-bold">Conteúdo em construção</h2>
        <p className="mt-3 text-muted">
          Este texto é um ponto de partida — a história completa (ano de
          formação, integrantes, bastidores, fotos) entra aqui conforme
          formos definindo os detalhes.
        </p>
      </div>
    </div>
  );
}
