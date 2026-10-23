import { Suspense } from "react";
import Carregando from "@/components/admin/Carregando";
import ConfirmButton from "@/components/admin/ConfirmButton";
import { excluirContato, marcarRespondida } from "@/lib/admin-actions";
import { requireAdmin } from "@/lib/auth";
import type { ContatoMensagem } from "@/lib/supabase";

function whatsappLink(telefone: string) {
  const digitos = telefone.replace(/\D/g, "");
  if (digitos.length < 10) return null;
  return `https://wa.me/${digitos.length <= 11 ? `55${digitos}` : digitos}`;
}

async function Lista() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase
    .from("contato_mensagens")
    .select("*")
    .order("respondida", { ascending: true })
    .order("created_at", { ascending: false });
  const mensagens = (data ?? []) as Required<ContatoMensagem>[];

  if (mensagens.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border p-8 text-center text-muted">
        Nenhuma mensagem ainda. Os pedidos enviados pelo formulário de contato aparecem aqui.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {mensagens.map((m) => {
        const whatsapp = m.telefone ? whatsappLink(m.telefone) : null;
        const assunto = encodeURIComponent(`The Crown LP — ${m.tipo_evento}`);
        return (
          <li key={m.id}>
            <details className={`group rounded-xl border bg-surface ${m.respondida ? "border-border opacity-70" : "border-accent/50"}`}>
              <summary className="flex cursor-pointer list-none items-center gap-4 p-4">
                <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${m.respondida ? "bg-border" : "bg-accent"}`} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{m.nome}</p>
                  <p className="truncate text-xs text-muted">
                    {m.tipo_evento} ·{" "}
                    {new Date(m.created_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
                  </p>
                </div>
                <span className="text-xs uppercase tracking-[0.1em] text-muted group-open:hidden">abrir</span>
              </summary>
              <div className="border-t border-border p-4 text-sm">
                <p className="whitespace-pre-line leading-relaxed">{m.mensagem}</p>
                <dl className="mt-4 grid gap-2 text-xs sm:grid-cols-2">
                  <div>
                    <dt className="text-muted">E-mail</dt>
                    <dd>{m.email}</dd>
                  </div>
                  {m.telefone && (
                    <div>
                      <dt className="text-muted">Telefone</dt>
                      <dd>{m.telefone}</dd>
                    </div>
                  )}
                </dl>
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <a href={`mailto:${m.email}?subject=${assunto}`} className="btn-primary !px-4 !py-2">
                    Responder por e-mail
                  </a>
                  {whatsapp && (
                    <a href={whatsapp} target="_blank" rel="noreferrer" className="btn-ghost !px-4 !py-2">
                      WhatsApp
                    </a>
                  )}
                  <form action={marcarRespondida}>
                    <input type="hidden" name="id" value={m.id} />
                    <input type="hidden" name="respondida" value={String(!m.respondida)} />
                    <button type="submit" className="text-xs font-semibold uppercase tracking-[0.1em] text-gold hover:underline">
                      {m.respondida ? "Marcar como pendente" : "Marcar como respondida"}
                    </button>
                  </form>
                  <form action={excluirContato} className="ml-auto">
                    <input type="hidden" name="id" value={m.id} />
                    <ConfirmButton
                      mensagem="Excluir esta mensagem?"
                      className="text-xs font-semibold uppercase tracking-[0.1em] text-muted hover:text-accent"
                    >
                      Excluir
                    </ConfirmButton>
                  </form>
                </div>
              </div>
            </details>
          </li>
        );
      })}
    </ul>
  );
}

export default function ContatosAdminPage() {
  return (
    <div>
      <h1 className="font-display text-5xl leading-none">
        CONTA<span className="text-accent">TOS</span>
      </h1>
      <p className="mt-2 text-sm text-muted">Pedidos de show enviados pelo site. Os não respondidos ficam no topo.</p>
      <div className="mt-8">
        <Suspense fallback={<Carregando />}>
          <Lista />
        </Suspense>
      </div>
    </div>
  );
}
