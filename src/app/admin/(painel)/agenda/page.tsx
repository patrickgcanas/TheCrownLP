import { Suspense } from "react";
import AgendaForm from "@/components/admin/AgendaForm";
import Carregando from "@/components/admin/Carregando";
import ItemAgenda from "@/components/admin/ItemAgenda";
import { hojeNoBrasil } from "@/lib/agenda-data";
import { requireAdmin } from "@/lib/auth";
import type { DataAgenda } from "@/lib/supabase";

async function ListaAgenda() {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase.from("agenda").select("*").order("data", { ascending: true });

  if (error) {
    return (
      <p className="rounded-xl border border-dashed border-accent p-8 text-center text-muted">
        A agenda ainda não foi ativada no banco de dados. Rode o arquivo <code>supabase/migrations/0004_agenda.sql</code> no
        SQL Editor do Supabase.
      </p>
    );
  }

  const hoje = hojeNoBrasil();
  const itens = (data ?? []) as DataAgenda[];
  const proximos = itens.filter((i) => i.data >= hoje);
  const passados = itens.filter((i) => i.data < hoje).reverse().slice(0, 10);

  return (
    <div className="space-y-10">
      {proximos.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border p-8 text-center text-muted">
          Nenhum show marcado. Adicione a próxima data ao lado. Enquanto a agenda estiver vazia, a seção não aparece no site.
        </p>
      ) : (
        <ul className="space-y-3">
          {proximos.map((item) => (
            <ItemAgenda key={item.id} item={item} />
          ))}
        </ul>
      )}

      {passados.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-muted">
            Já passaram (não aparecem mais no site)
          </h2>
          <ul className="mt-3 space-y-3">
            {passados.map((item) => (
              <ItemAgenda key={item.id} item={item} passou />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function AgendaAdminPage() {
  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
      <section className="min-w-0">
        <h1 className="font-display text-5xl leading-none">
          AGENDA <span className="text-accent">DE SHOWS</span>
        </h1>
        <p className="mt-2 text-sm text-muted">
          Os próximos shows aparecem na página inicial do site. Depois da data, saem sozinhos.
        </p>
        <div className="mt-8">
          <Suspense fallback={<Carregando />}>
            <ListaAgenda />
          </Suspense>
        </div>
      </section>
      <aside className="h-fit rounded-2xl border border-border bg-surface p-6">
        <h2 className="font-display text-3xl">NOVA DATA</h2>
        <div className="mt-4">
          <AgendaForm />
        </div>
      </aside>
    </div>
  );
}
