import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { supabase, supabaseEnabled, type MidiaItem, type Show } from "./supabase";

export type ShowResumo = Show & { fotos: number; videos: number; capa: string | null };

// Tag única para tudo que a página Mídia mostra; o painel chama updateTag("midia") ao salvar
export const MIDIA_TAG = "midia";

export async function getShows(): Promise<ShowResumo[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(MIDIA_TAG);

  if (!supabaseEnabled || !supabase) return [];

  const { data, error } = await supabase
    .from("shows")
    .select("*, midia(tipo, url)")
    .order("data", { ascending: false });

  if (error || !data) return [];

  return data.map(({ midia, ...show }) => {
    const itens = (midia ?? []) as Pick<MidiaItem, "tipo" | "url">[];
    const primeiraFoto = itens.find((m) => m.tipo === "imagem")?.url ?? null;
    return {
      ...(show as Show),
      fotos: itens.filter((m) => m.tipo === "imagem").length,
      videos: itens.filter((m) => m.tipo !== "imagem").length,
      capa: show.capa_url ?? primeiraFoto,
    };
  });
}

export async function getShow(id: string): Promise<{ show: Show; itens: MidiaItem[] } | null> {
  "use cache";
  cacheLife("hours");
  cacheTag(MIDIA_TAG);

  if (!supabaseEnabled || !supabase) return null;
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;

  const [{ data: show }, { data: itens }] = await Promise.all([
    supabase.from("shows").select("*").eq("id", id).maybeSingle(),
    supabase.from("midia").select("*").eq("show_id", id).order("created_at", { ascending: true }),
  ]);

  if (!show) return null;
  return { show: show as Show, itens: (itens ?? []) as MidiaItem[] };
}

export function formatarData(data: string) {
  const [ano, mes, dia] = data.split("-").map(Number);
  return new Date(ano, mes - 1, dia).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

// Aceita link de post, reel ou IGTV e devolve o endereço do embed oficial
export function instagramEmbedUrl(link: string) {
  const match = link.match(/instagram\.com\/(?:[\w.]+\/)?(p|reel|reels|tv)\/([A-Za-z0-9_-]+)/);
  if (!match) return null;
  const tipo = match[1] === "reels" ? "reel" : match[1];
  return `https://www.instagram.com/${tipo}/${match[2]}/embed`;
}
