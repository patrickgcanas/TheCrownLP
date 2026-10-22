import type { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";
import { supabase, supabaseEnabled, type MidiaItem } from "@/lib/supabase";
import { midiaFallback } from "@/lib/fallback-data";

export const metadata: Metadata = {
  title: "Mídia — The Crown LP",
  description: "Vídeos e fotos dos shows da The Crown LP, tributo a Linkin Park.",
};

async function getMidia(): Promise<MidiaItem[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("midia");

  if (!supabaseEnabled || !supabase) {
    return midiaFallback;
  }

  const { data, error } = await supabase
    .from("midia")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data || data.length === 0) {
    return midiaFallback;
  }

  return data as MidiaItem[];
}

function VideoCard({ item }: { item: MidiaItem }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface">
      {item.url ? (
        <div className="aspect-video w-full">
          <iframe
            src={item.url}
            title={item.titulo}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <div className="flex aspect-video w-full items-center justify-center bg-surface-2 text-sm text-muted">
          Em breve
        </div>
      )}
      <div className="p-4">
        <p className="font-semibold">{item.titulo}</p>
        {item.descricao && <p className="mt-1 text-sm text-muted">{item.descricao}</p>}
      </div>
    </div>
  );
}

function ImageCard({ item }: { item: MidiaItem }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface">
      {item.url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={item.url} alt={item.titulo} className="aspect-[4/3] w-full object-cover" />
      ) : (
        <div className="flex aspect-[4/3] w-full items-center justify-center bg-surface-2 text-sm text-muted">
          Em breve
        </div>
      )}
      <div className="p-4">
        <p className="font-semibold">{item.titulo}</p>
      </div>
    </div>
  );
}

async function MidiaGrid() {
  const midia = await getMidia();
  const videos = midia.filter((item) => item.tipo === "video");
  const imagens = midia.filter((item) => item.tipo === "imagem");

  return (
    <div className="space-y-16">
      <div>
        <h2 className="text-xl font-bold">Vídeos</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((item) => (
            <VideoCard key={item.id} item={item} />
          ))}
        </div>
      </div>

      {imagens.length > 0 && (
        <div>
          <h2 className="text-xl font-bold">Fotos</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {imagens.map((item) => (
              <ImageCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function MidiaPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-20">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-accent">Mídia</p>
      <h1 className="mt-4 text-4xl font-extrabold tracking-tight">Vídeos e fotos dos shows</h1>
      <p className="mt-4 max-w-2xl text-muted">
        Um recorte dos nossos shows — em breve, mais vídeos e fotos de apresentações recentes.
      </p>

      <div className="mt-12">
        <MidiaGrid />
      </div>
    </div>
  );
}
