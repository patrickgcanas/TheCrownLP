import Reveal from "@/components/Reveal";
import { formatarHorario, getProximosShows, limparLink, partesDaData } from "@/lib/agenda-data";

// Próximos shows cadastrados no painel (Agenda). Sem nenhum marcado, a seção não aparece.
export default async function AgendaSection() {
  const { hoje, shows } = await getProximosShows();
  if (shows.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <Reveal>
        <p className="eyebrow">Agenda</p>
        <h2 className="font-display mt-3 text-4xl leading-none sm:text-5xl">
          PRÓXIMOS <span className="text-accent">SHOWS</span>
        </h2>
        <p className="mt-3 max-w-xl text-muted">Vem cantar junto com a gente.</p>
      </Reveal>

      <ul className="mt-10 border-t border-border">
        {shows.map((show, i) => {
          const { dia, mes, semana } = partesDaData(show.data);
          const ehHoje = show.data === hoje;
          const linha = [show.cidade, formatarHorario(show.horario)].filter(Boolean).join(" · ");

          return (
            <li key={show.id} className="border-b border-border">
              <Reveal delay={i * 90} className="flex items-start gap-5 py-6 sm:items-center sm:gap-8">
                <div
                  className={`w-[4.5rem] shrink-0 rounded-xl border py-2 text-center sm:w-20 ${
                    ehHoje ? "border-accent bg-accent/10" : "border-gold-dim bg-surface"
                  }`}
                >
                  <p className="text-[11px] font-semibold tracking-[0.2em] text-gold">{ehHoje ? "HOJE" : semana}</p>
                  <p className="font-display text-4xl leading-none">{dia}</p>
                  <p className="text-[11px] font-semibold tracking-[0.2em] text-accent">{mes}</p>
                </div>

                <div className="flex min-w-0 flex-1 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="font-display text-2xl leading-tight sm:text-3xl">{show.local}</p>
                    {linha && <p className="mt-1 text-sm text-muted">{linha}</p>}
                    {show.detalhe && <p className="mt-1 text-sm text-gold">{show.detalhe}</p>}
                  </div>
                  {show.link && (
                    <a
                      href={limparLink(show.link)}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-ghost shrink-0 self-start !px-5 !py-2.5 sm:self-auto"
                    >
                      Ver evento ↗
                    </a>
                  )}
                </div>
              </Reveal>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
