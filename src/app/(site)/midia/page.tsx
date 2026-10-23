import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { formatarData, getShows } from "@/lib/midia-data";

export const metadata: Metadata = {
  title: "Mídia — The Crown LP",
  description: "Vídeos e fotos dos shows da The Crown LP, tributo a Linkin Park.",
};

async function ShowsGrid() {
  const shows = await getShows();

  if (shows.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-10 text-center">
        <p className="font-display text-3xl">EM BREVE</p>
        <p className="mt-2 text-muted">As fotos e vídeos dos nossos shows aparecem aqui assim que publicarmos.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {shows.map((show) => (
        <Link
          key={show.id}
          href={`/midia/${show.id}`}
          className="group overflow-hidden rounded-2xl border border-border bg-surface transition duration-200 hover:-translate-y-1 hover:border-accent"
        >
          <div className="relative aspect-[16/10] overflow-hidden bg-[linear-gradient(135deg,#4a1748,#1a0c1f)]">
            {show.capa && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={show.capa}
                alt=""
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
            )}
            <span className="absolute left-3 top-3 rounded-md bg-background/80 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-gold">
              {formatarData(show.data)}
            </span>
          </div>
          <div className="p-5">
            <h2 className="font-display text-3xl leading-none">{show.nome}</h2>
            {show.local && <p className="mt-1 text-sm text-muted">{show.local}</p>}
            <p className="mt-3 text-xs uppercase tracking-[0.1em] text-muted">
              {show.fotos} {show.fotos === 1 ? "foto" : "fotos"} · {show.videos} {show.videos === 1 ? "vídeo" : "vídeos"}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default function MidiaPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <PageHeader eyebrow="Mídia" title="NOSSOS" highlight="SHOWS">
        Fotos e vídeos de cada apresentação. Escolha um show para ver o álbum.
      </PageHeader>

      <div className="mt-12">
        <ShowsGrid />
      </div>
    </div>
  );
}
