import { Suspense } from "react";
import AgendaForm from "@/components/admin/AgendaForm";
import Carregando from "@/components/admin/Carregando";
import ConfirmButton from "@/components/admin/ConfirmButton";
import { excluirDataAgenda } from "@/lib/admin-actions";
import { formatarHorario, hojeNoBrasil, partesDaData } from "@/lib/agenda-data";
import { requireAdmin } from "@/lib/auth";
import type { DataAgenda } from "@/lib/supabase";

function ItemAgenda({ item, passou }: { item: DataAgenda; passou?: boolean }) {
  const { dia, mes, semana, ano } = partesDaData(item.data);
  const horario = formatarHorario(item.horario);

  return (
    <li className={`rounded-xl border border-border bg-surface p-4 ${passou ? "opacity-60" : ""}`}>
      <div className="flex items-start gap-4">
        <div className="w-16 shrink-0 rounded-lg border border-gold-dim py-1.5 text-center">
          <p className="text-[10px] font-semibold tracking-[0.15em] text-gold">{semana}</p>
          <p className="font-display text-3xl leading-none">{dia}</p>
          <p className="text-[10px] font-semibold tracking-[0.15em] text-accent">
            {mes} {ano}
          </p>
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-display text-2xl leading-tight">{item.local}</p>
          <p className="mt-1 text-sm text-muted">{[item.cidade, horario].filter(Boolean).join(" · ") || "—"}</p>
          {item.detalhe && <p className="mt-1 text-sm text-muted">{item.detalhe}</p>}
          {item.link && (
            <a href={item.link} target="_blank" rel="noreferrer" className="mt-1 block truncate text-xs text-gold hover:underline">
              {item.link}
            </a>
          )}
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-start gap-3 border-t border-border pt-3">
        <details className="flex-1">
          <summary className="cursor-pointer text-xs font-semibold uppercase tracking-[0.1em] text-muted hover:text-foreground">
            Editar
          </summary>
          <div className="mt-4 max-w-md">
            <AgendaForm item={item} />
          </div>
        </details>
        <form action={excluirDataAgenda}>
          <input type="hidden" name="id" value={item.id} />
          <ConfirmButton
            mensagem={`Excluir o show de ${dia}/${mes} em ${item.local} da agenda?`}
            className="text-xs font-semibold uppercase tracking-[0.1em] text-muted hover:text-accent"
          >
            Excluir
          </ConfirmButton>
        </form>
      </div>
    </li>
  );
}

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
    <div className="grid gap-10 lg:grid-cols-[1fr_340px]">
      <section>
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
