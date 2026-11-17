import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import PhotoGallery from "@/components/PhotoGallery";
import InstagramCard from "@/components/InstagramCard";
import { capasDoFeed, codigoInstagram } from "@/lib/instagram";
import { formatarData, getShow, instagramPermalink } from "@/lib/midia-data";
import type { MidiaItem } from "@/lib/supabase";

function VideoItem({ item, capas }: { item: MidiaItem; capas: Map<string, string> }) {
  if (item.tipo === "instagram") {
    const permalink = instagramPermalink(item.url);
    if (!permalink) return null;
    const codigo = codigoInstagram(item.url);
    // Capa: cópia guardada pelo painel > feed do Behold > capa buscada no Instagram pelo servidor do site
    const capa =
      item.thumbnail_url ?? (codigo ? (capas.get(codigo) ?? `/api/capa-instagram/${codigo}`) : null);
    return <InstagramCard permalink={permalink} capa={capa} legenda={item.titulo} />;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      {/* Sem proporção fixa: vídeo de celular (em pé) e deitado aparecem no próprio formato. #t=0.1 mostra o primeiro quadro antes do play */}
      <video src={`${item.url}#t=0.1`} controls preload="metadata" playsInline className="block max-h-[80vh] w-full bg-black" />
      {item.titulo && <p className="p-4 text-sm text-muted">{item.titulo}</p>}
    </div>
  );
}

async function Album({ id }: { id: string }) {
  const album = await getShow(id);
  if (!album) notFound();

  const { show, itens } = album;
  const capas = await capasDoFeed();
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
          <div className="mt-6 grid items-start gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map((item) => (
              <VideoItem key={item.id} item={item} capas={capas} />
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

// Título e endereço oficial de cada álbum (para o Google e para a prévia ao compartilhar)
export async function generateMetadata({ params }: PageProps<"/midia/[id]">): Promise<Metadata> {
  const { id } = await params;
  const dados = await getShow(id);
  if (!dados) return {};

  const { show } = dados;
  return {
    title: `${show.nome} | Fotos e vídeos | The Crown LP`,
    description: `Fotos e vídeos do show da The Crown LP, tributo a Linkin Park, em ${show.nome}${
      show.local ? ` (${show.local})` : ""
    }.`,
    alternates: { canonical: `/midia/${id}` },
  };
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
