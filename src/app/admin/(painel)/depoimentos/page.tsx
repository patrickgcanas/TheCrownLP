import Link from "next/link";
import { Suspense } from "react";
import Carregando from "@/components/admin/Carregando";
import ConfirmButton from "@/components/admin/ConfirmButton";
import { aprovarDepoimento, excluirDepoimento, ocultarDepoimento } from "@/lib/admin-actions";
import { requireAdmin } from "@/lib/auth";
import type { Depoimento } from "@/lib/supabase";

async function Lista({ searchParams }: { searchParams: PageProps<"/admin/depoimentos">["searchParams"] }) {
  const { aba } = await searchParams;
  const aprovados = aba === "aprovados";
  const { supabase } = await requireAdmin();
  const { data } = await supabase
    .from("depoimentos")
    .select("*")
    .eq("aprovado", aprovados)
    .order("created_at", { ascending: false });
  const depoimentos = (data ?? []) as Depoimento[];

  return (
    <>
      <div className="flex gap-2">
        {[
          { href: "/admin/depoimentos", label: "Pendentes", ativo: !aprovados },
          { href: "/admin/depoimentos?aba=aprovados", label: "Aprovados", ativo: aprovados },
        ].map((t) => (
          <Link
            key={t.label}
            href={t.href}
            className={`rounded-lg px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em] ${
              t.ativo ? "bg-accent text-white" : "border border-border text-muted hover:text-foreground"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {depoimentos.length === 0 ? (
        <p className="mt-6 rounded-xl border border-dashed border-border p-8 text-center text-muted">
          {aprovados ? "Nenhum depoimento aprovado ainda." : "Nada pendente. Quando alguém enviar um depoimento pelo site, ele aparece aqui."}
        </p>
      ) : (
        <ul className="mt-6 grid gap-4 md:grid-cols-2">
          {depoimentos.map((d) => (
            <li key={d.id} className="flex flex-col rounded-xl border border-border border-l-4 border-l-gold bg-surface p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{d.nome}</p>
                  {d.papel && <p className="text-xs text-muted">{d.papel}</p>}
                </div>
                <span className="shrink-0 tracking-[0.15em] text-gold">{"★".repeat(d.avaliacao)}</span>
              </div>
              <p className="mt-3 flex-1 text-sm leading-relaxed">“{d.mensagem}”</p>
              <p className="mt-3 text-xs text-muted">
                {new Date(d.created_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })}
              </p>
              <div className="mt-4 flex items-center gap-3">
                <form action={aprovados ? ocultarDepoimento : aprovarDepoimento}>
                  <input type="hidden" name="id" value={d.id} />
                  <button type="submit" className={aprovados ? "btn-ghost !px-4 !py-2" : "btn-primary !px-4 !py-2"}>
                    {aprovados ? "Ocultar do site" : "Aprovar"}
                  </button>
                </form>
                <form action={excluirDepoimento}>
                  <input type="hidden" name="id" value={d.id} />
                  <ConfirmButton
                    mensagem="Excluir este depoimento?"
                    className="text-xs font-semibold uppercase tracking-[0.1em] text-muted hover:text-accent"
                  >
                    Excluir
                  </ConfirmButton>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export default function DepoimentosAdminPage({ searchParams }: PageProps<"/admin/depoimentos">) {
  return (
    <div>
      <h1 className="font-display text-5xl leading-none">
        DEPOI<span className="text-accent">MENTOS</span>
      </h1>
      <p className="mt-2 text-sm text-muted">Só os aprovados aparecem na página Depoimentos do site.</p>
      <div className="mt-8">
        <Suspense fallback={<Carregando />}>
          <Lista searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}
