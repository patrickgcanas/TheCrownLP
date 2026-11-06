import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import PhotoGallery from "@/components/PhotoGallery";
import { formatarData, getShow, instagramEmbedUrl } from "@/lib/midia-data";
import type { MidiaItem } from "@/lib/supabase";

function VideoItem({ item }: { item: MidiaItem }) {
  if (item.tipo === "instagram") {
    const embed = instagramEmbedUrl(item.url);
    if (!embed) return null;
    return (
      <div className="overflow-hidden rounded-2xl border border-border bg-surface">
        <iframe
          src={embed}
          title={item.titulo ?? "Post do Instagram"}
          className="h-[640px] w-full bg-white"
          loading="lazy"
          allowFullScreen
        />
        {item.titulo && <p className="p-4 text-sm text-muted">{item.titulo}</p>}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <video src={item.url} controls preload="metadata" playsInline className="aspect-video w-full bg-black" />
      {item.titulo && <p className="p-4 text-sm text-muted">{item.titulo}</p>}
    </div>
  );
}

async function Album({ id }: { id: string }) {
  const album = await getShow(id);
  if (!album) notFound();

  const { show, itens } = album;
  const videos = itens.filter((i) => i.tipo !== "imagem");
  const fotos = itens.filter((i) => i.tipo === "imagem");

  return (
    <>
      <header>
        <p className="eyebrow">{formatarData(show.data)}</p>
        <h1 className="font-display mt-3 text-5xl leading-none sm:text-6xl">{show.nome}</h1>
        {show.local && <p className="mt-3 text-muted">{show.local}</p>}
      </header>

      {itens.length === 0 && (
        <p className="mt-12 rounded-2xl border border-border bg-surface p-8 text-center text-muted">
          O material deste show está chegando. Volte em breve!
        </p>
      )}

      {videos.length > 0 && (
        <section className="mt-14">
          <h2 className="font-display text-4xl">
            VÍDEOS <span className="text-accent">{videos.length}</span>
          </h2>
          <div className="mt-6 grid items-start gap-6 md:grid-cols-2">
            {videos.map((item) => (
              <VideoItem key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}

      {fotos.length > 0 && (
        <section className="mt-14">
          <h2 className="font-display text-4xl">
            FOTOS <span className="text-accent">{fotos.length}</span>
          </h2>
          <div className="mt-6">
            <PhotoGallery fotos={fotos.map((f) => ({ id: f.id, url: f.url, legenda: f.titulo }))} />
          </div>
        </section>
      )}
    </>
  );
}

function AlbumFallback() {
  return (
    <div className="space-y-4">
      <div className="h-4 w-32 animate-pulse rounded bg-surface" />
      <div className="h-14 w-2/3 animate-pulse rounded bg-surface" />
      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((n) => (
          <div key={n} className="aspect-square animate-pulse rounded-xl bg-surface" />
        ))}
      </div>
    </div>
  );
}

export default function AlbumPage({ params }: PageProps<"/midia/[id]">) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <Link href="/midia" className="text-xs font-semibold uppercase tracking-[0.12em] text-gold hover:underline">
        ← Todos os shows
      </Link>
      <div className="mt-8">
        <Suspense fallback={<AlbumFallback />}>
          {params.then(({ id }) => (
            <Album id={id} />
          ))}
        </Suspense>
      </div>
    </div>
  );
}
