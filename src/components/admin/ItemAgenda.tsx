import AgendaForm from "@/components/admin/AgendaForm";
import CartazAmpliavel from "@/components/CartazAmpliavel";
import ConfirmButton from "@/components/admin/ConfirmButton";
import { excluirDataAgenda } from "@/lib/admin-actions";
import { formatarHorario, limparLink, partesDaData } from "@/lib/agenda-data";
import type { DataAgenda } from "@/lib/supabase";

// "https://www.clubedoingresso.com/evento/...?_gl=..." → "clubedoingresso.com"
function nomeDoSite(link: string) {
  try {
    return new URL(link).hostname.replace(/^www\./, "");
  } catch {
    return link;
  }
}

// Um show da agenda no painel, com "Editar" (abre o formulário ali mesmo) e "Excluir"
export default function ItemAgenda({ item, passou }: { item: DataAgenda; passou?: boolean }) {
  const { dia, mes, semana, ano } = partesDaData(item.data);
  const horario = formatarHorario(item.horario);

  return (
    <li className={`min-w-0 overflow-hidden rounded-xl border border-border bg-surface p-4 ${passou ? "opacity-60" : ""}`}>
      <div className="flex items-start gap-4">
        <div className="w-16 shrink-0 rounded-lg border border-gold-dim py-1.5 text-center">
          <p className="text-[10px] font-semibold tracking-[0.15em] text-gold">{semana}</p>
          <p className="font-display text-3xl leading-none">{dia}</p>
          <p className="text-[10px] font-semibold tracking-[0.15em] text-accent">
            {mes} {ano}
          </p>
        </div>
        <div className="min-w-0 flex-1 break-words">
          <p className="font-display text-2xl leading-tight">{item.local}</p>
          <p className="mt-1 text-sm text-muted">{[item.cidade, horario].filter(Boolean).join(" · ") || "—"}</p>
          {item.detalhe && <p className="mt-1 text-sm text-muted">{item.detalhe}</p>}
          {item.link && (
            <a
              href={limparLink(item.link)}
              target="_blank"
              rel="noreferrer"
              title={item.link}
              className="mt-1 inline-block max-w-full truncate text-xs text-gold hover:underline"
            >
              Link do evento: {nomeDoSite(item.link)} ↗
            </a>
          )}
        </div>
        {item.cartaz_url && (
          <CartazAmpliavel src={item.cartaz_url} titulo={item.local} className="w-14 shrink-0 sm:w-16" />
        )}
      </div>
      <div className="mt-3 flex flex-wrap items-start gap-3 border-t border-border pt-3">
        <details className="min-w-0 flex-1">
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
