import Link from "next/link";
import { Suspense } from "react";
import Carregando from "@/components/admin/Carregando";
import { requireAdmin } from "@/lib/auth";
import { formatarData } from "@/lib/midia-data";
import ShowForm from "@/components/admin/ShowForm";

async function ListaShows() {
  const { supabase } = await requireAdmin();
  const { data: shows } = await supabase
    .from("shows")
    .select("id, nome, local, data, capa_url, midia(tipo, url)")
    .order("data", { ascending: false });

  if (!shows || shows.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border p-8 text-center text-muted">
        Nenhum show ainda. Crie o primeiro ao lado e depois suba as fotos e vídeos nele.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {shows.map((show) => {
        const itens = (show.midia ?? []) as { tipo: string; url: string }[];
        const fotos = itens.filter((i) => i.tipo === "imagem");
        const capa = show.capa_url ?? fotos[0]?.url;
        return (
          <li key={show.id}>
            <Link
              href={`/admin/shows/${show.id}`}
              className="flex items-center gap-4 rounded-xl border border-border bg-surface p-3 transition-colors hover:border-accent"
            >
              <div className="h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-[linear-gradient(135deg,#4a1748,#1a0c1f)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {capa && <img src={capa} alt="" className="h-full w-full object-cover" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-display truncate text-2xl leading-none">{show.nome}</p>
                <p className="mt-1 truncate text-xs text-muted">
                  {formatarData(show.data)}
                  {show.local && ` · ${show.local}`}
                </p>
              </div>
              <p className="hidden shrink-0 text-xs uppercase tracking-[0.1em] text-muted sm:block">
                {fotos.length} fotos · {itens.length - fotos.length} vídeos
              </p>
              <span className="text-gold">→</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export default function ShowsAdminPage() {
  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_340px]">
      <section>
        <h1 className="font-display text-5xl leading-none">
          SHOWS <span className="text-accent">&amp; ÁLBUNS</span>
        </h1>
        <p className="mt-2 text-sm text-muted">Cada show vira um álbum na página Mídia do site.</p>
        <div className="mt-8">
          <Suspense fallback={<Carregando />}>
            <ListaShows />
          </Suspense>
        </div>
      </section>
      <aside className="h-fit rounded-2xl border border-border bg-surface p-6">
        <h2 className="font-display text-3xl">NOVO SHOW</h2>
        <div className="mt-4">
          <ShowForm />
        </div>
      </aside>
    </div>
  );
}
