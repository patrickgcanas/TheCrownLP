import type { Metadata } from "next";
import { Suspense } from "react";
import { supabase, supabaseEnabled, type Depoimento } from "@/lib/supabase";
import DepoimentoForm from "@/components/DepoimentoForm";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Depoimentos — The Crown LP",
  description: "Veja o que dizem sobre os shows da The Crown LP e deixe seu depoimento.",
};

async function getDepoimentos(): Promise<Depoimento[]> {
  if (!supabaseEnabled || !supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("depoimentos")
    .select("*")
    .eq("aprovado", true)
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return data as Depoimento[];
}

async function DepoimentosList() {
  const depoimentos = await getDepoimentos();

  if (depoimentos.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-8 text-center text-muted">
        Ainda não temos depoimentos publicados — seja o primeiro a deixar o seu!
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {depoimentos.map((d) => (
        <div key={d.id} className="rounded-2xl border border-border border-l-4 border-l-gold bg-surface p-6">
          <div className="tracking-[0.2em] text-gold">{"★".repeat(d.avaliacao)}</div>
          <p className="mt-3 leading-relaxed text-foreground">“{d.mensagem}”</p>
          <p className="mt-4 text-sm font-semibold">{d.nome}</p>
          {d.papel && <p className="text-xs text-muted">{d.papel}</p>}
        </div>
      ))}
    </div>
  );
}

function DepoimentosFallback() {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {[1, 2].map((n) => (
        <div key={n} className="h-40 animate-pulse rounded-2xl border border-border bg-surface" />
      ))}
    </div>
  );
}

export default function DepoimentosPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
      <PageHeader eyebrow="Depoimentos" title="QUEM JÁ" highlight="VIU O SHOW" />

      <div className="mt-12">
        <Suspense fallback={<DepoimentosFallback />}>
          <DepoimentosList />
        </Suspense>
      </div>

      <div className="mt-16">
        <DepoimentoForm />
      </div>
    </div>
  );
}
