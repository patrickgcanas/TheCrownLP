import Link from "next/link";
import DepoimentosCarrossel from "@/components/DepoimentosCarrossel";
import Reveal from "@/components/Reveal";
import { getDepoimentosAprovados } from "@/lib/depoimentos-data";

// Depoimentos aprovados no painel. Sem nenhum aprovado, a seção não aparece.
export default async function DepoimentosSection() {
  const depoimentos = await getDepoimentosAprovados();
  if (depoimentos.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
      <Reveal className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow">Depoimentos</p>
          <h2 className="font-display mt-3 text-4xl leading-none sm:text-5xl">
            QUEM JÁ <span className="text-accent">VIU O SHOW</span>
          </h2>
        </div>
        <Link href="/depoimentos" className="text-sm font-semibold uppercase tracking-[0.1em] text-gold hover:underline">
          Deixe o seu depoimento →
        </Link>
      </Reveal>
      <Reveal delay={120} className="mt-10">
        <DepoimentosCarrossel depoimentos={depoimentos} />
      </Reveal>
    </section>
  );
}
