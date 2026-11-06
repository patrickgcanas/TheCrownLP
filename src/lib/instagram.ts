import "server-only";
import { cacheLife, cacheTag } from "next/cache";

export const INSTAGRAM_URL = "https://www.instagram.com/thecrown.lp/";
export const INSTAGRAM_USUARIO = "thecrown.lp";

// Feed do Behold (behold.so) conectado ao Instagram da banda. Não é segredo: é um link público de leitura.
// Vazio = a seção de Instagram não aparece no site.
const BEHOLD_FEED_URL = "https://feeds.behold.so/NsqH4QsvMjjpKrEg56m3";

type Tamanho = { mediaUrl: string; width: number; height: number };

export type PostInstagram = {
  id: string;
  permalink: string;
  tipo: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  video: boolean;
  imagem: string;
  legenda: string;
};

type RespostaBehold = {
  posts?: {
    id: string;
    permalink: string;
    mediaType: PostInstagram["tipo"];
    thumbnailUrl?: string;
    mediaUrl?: string;
    prunedCaption?: string;
    caption?: string;
    sizes?: Partial<Record<"small" | "medium" | "large" | "full", Tamanho>>;
  }[];
};

// O plano grátis do Behold atualiza 1x por dia e limita as consultas por mês,
// então o site guarda o feed por algumas horas em vez de buscar a cada visita.
export async function getPostsInstagram(): Promise<PostInstagram[]> {
  "use cache";
  cacheLife({ stale: 3600, revalidate: 6 * 3600, expire: 7 * 86400 });
  cacheTag("instagram");

  if (!BEHOLD_FEED_URL) return [];

  try {
    const res = await fetch(BEHOLD_FEED_URL);
    if (!res.ok) return [];
    const dados = (await res.json()) as RespostaBehold;

    return (dados.posts ?? []).flatMap((p) => {
      const imagem = p.sizes?.medium?.mediaUrl ?? p.sizes?.large?.mediaUrl ?? p.thumbnailUrl ?? p.mediaUrl;
      if (!imagem) return [];
      return [
        {
          id: p.id,
          permalink: p.permalink,
          tipo: p.mediaType,
          video: p.mediaType === "VIDEO",
          imagem,
          legenda: (p.prunedCaption ?? p.caption ?? "").trim(),
        },
      ];
    });
  } catch {
    return [];
  }
}
