import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "História — The Crown LP",
  description: "A história da banda The Crown LP, tributo a Linkin Park.",
};

export default function HistoriaPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
      <PageHeader eyebrow="Nossa história" title="QUEM É A" highlight="THE CROWN LP" />

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
          Linkin Park — de <em className="text-foreground">Hybrid Theory</em> a <em className="text-foreground">Meteora</em> e além —
          reproduzindo com fidelidade os arranjos, a pegada e a energia dos
          shows originais, sem deixar de lado a própria identidade no palco.
        </p>
        <p>
          A banda já se apresentou em bares, casas de show e eventos privados,
          e está em expansão para festivais, eventos corporativos e
          apresentações públicas em parceria com prefeituras.
        </p>
      </div>

      <div className="mt-16 rounded-2xl border border-border border-l-4 border-l-gold bg-surface p-8">
        <h2 className="font-display text-3xl">CONTEÚDO EM CONSTRUÇÃO</h2>
        <p className="mt-3 text-muted">
          Este texto é um ponto de partida — a história completa (ano de
          formação, integrantes, bastidores, fotos) entra aqui conforme
          formos definindo os detalhes.
        </p>
      </div>
    </div>
  );
}
