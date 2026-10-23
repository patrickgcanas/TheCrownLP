import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Carregando from "@/components/admin/Carregando";
import ConfirmButton from "@/components/admin/ConfirmButton";
import InstagramForm from "@/components/admin/InstagramForm";
import ShowForm from "@/components/admin/ShowForm";
import Uploader from "@/components/admin/Uploader";
import { definirCapa, editarLegenda, excluirItem, excluirShow } from "@/lib/admin-actions";
import { requireAdmin } from "@/lib/auth";
import type { MidiaItem, Show } from "@/lib/supabase";

const rotuloTipo: Record<MidiaItem["tipo"], string> = {
  imagem: "Foto",
  video: "Vídeo",
  instagram: "Instagram",
};

function ItemCard({ item, show }: { item: MidiaItem; show: Show }) {
  const ehCapa = show.capa_url === item.url;

  return (
    <div className={`overflow-hidden rounded-xl border bg-surface ${ehCapa ? "border-gold" : "border-border"}`}>
      <div className="relative aspect-square bg-background">
        {item.tipo === "imagem" && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.url} alt="" loading="lazy" className="h-full w-full object-cover" />
        )}
        {item.tipo === "video" && <video src={item.url} preload="metadata" muted className="h-full w-full object-cover" />}
        {item.tipo === "instagram" && (
          <a
            href={item.url}
            target="_blank"
            rel="noreferrer"
            className="flex h-full flex-col items-center justify-center gap-1 bg-[linear-gradient(135deg,#4a1748,#1a0c1f)] p-3 text-center"
          >
            <span className="font-display text-2xl">INSTAGRAM</span>
            <span className="text-xs text-muted">abrir post ↗</span>
          </a>
        )}
        <span className="absolute left-2 top-2 rounded bg-background/85 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-gold">
          {ehCapa ? "Capa" : rotuloTipo[item.tipo]}
        </span>
      </div>

      <div className="space-y-2 p-2.5">
        <form action={editarLegenda} className="flex gap-1.5">
          <input type="hidden" name="id" value={item.id} />
          <input type="hidden" name="show_id" value={show.id} />
          <input
            name="titulo"
            defaultValue={item.titulo ?? ""}
            placeholder="Legenda"
            aria-label="Legenda"
            className="field !px-2 !py-1.5 text-xs"
          />
          <button type="submit" className="rounded-md border border-border px-2 text-xs text-muted hover:text-foreground">
            ok
          </button>
        </form>
        <div className="flex items-center justify-between gap-2 text-[11px] font-semibold uppercase tracking-[0.08em]">
          {item.tipo === "imagem" && !ehCapa ? (
            <form action={definirCapa}>
              <input type="hidden" name="show_id" value={show.id} />
              <input type="hidden" name="url" value={item.url} />
              <button type="submit" className="text-gold hover:underline">
                Usar de capa
              </button>
            </form>
          ) : (
            <span />
          )}
          <form action={excluirItem}>
            <input type="hidden" name="id" value={item.id} />
            <input type="hidden" name="show_id" value={show.id} />
            <ConfirmButton mensagem="Excluir este item do álbum?" className="text-muted hover:text-accent">
              Excluir
            </ConfirmButton>
          </form>
        </div>
      </div>
    </div>
  );
}

async function Editor({ id }: { id: string }) {
  const { supabase } = await requireAdmin();
  const [{ data: show }, { data: itens }] = await Promise.all([
    supabase.from("shows").select("*").eq("id", id).maybeSingle(),
    supabase.from("midia").select("*").eq("show_id", id).order("created_at", { ascending: false }),
  ]);

  if (!show) notFound();
  const lista = (itens ?? []) as MidiaItem[];

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
      <section>
        <h1 className="font-display text-5xl leading-none">{show.nome}</h1>
        <p className="mt-2 text-sm text-muted">
          {lista.length} {lista.length === 1 ? "item" : "itens"} no álbum ·{" "}
          <Link href={`/midia/${show.id}`} target="_blank" className="text-gold hover:underline">
            ver no site ↗
          </Link>
        </p>

        <div className="mt-8">
          <Uploader showId={show.id} />
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
          {lista.map((item) => (
            <ItemCard key={item.id} item={item} show={show as Show} />
          ))}
        </div>
      </section>

      <aside className="space-y-6">
        <div className="rounded-2xl border border-border bg-surface p-5">
          <h2 className="font-display text-2xl">
            POST DO <span className="text-accent">INSTAGRAM</span>
          </h2>
          <p className="mt-1 mb-4 text-xs text-muted">
            No app: no post, toque em ⋯ ou no avião de papel → Copiar link. Cole aqui.
          </p>
          <InstagramForm showId={show.id} />
        </div>

        <div className="rounded-2xl border border-border bg-surface p-5">
          <h2 className="font-display text-2xl">DADOS DO SHOW</h2>
          <div className="mt-4">
            <ShowForm show={show as Show} />
          </div>
        </div>

        <form action={excluirShow} className="text-center">
          <input type="hidden" name="id" value={show.id} />
          <ConfirmButton
            mensagem={`Excluir o show "${show.nome}" e TODAS as fotos e vídeos dele? Não dá para desfazer.`}
            className="text-xs font-semibold uppercase tracking-[0.1em] text-muted hover:text-accent"
          >
            Excluir show
          </ConfirmButton>
        </form>
      </aside>
    </div>
  );
}

export default function ShowAdminPage({ params }: PageProps<"/admin/shows/[id]">) {
  return (
    <div>
      <Link href="/admin/shows" className="text-xs font-semibold uppercase tracking-[0.12em] text-gold hover:underline">
        ← Todos os shows
      </Link>
      <div className="mt-6">
        <Suspense fallback={<Carregando linhas={4} />}>
          {params.then(({ id }) => (
            <Editor id={id} />
          ))}
        </Suspense>
      </div>
    </div>
  );
}
