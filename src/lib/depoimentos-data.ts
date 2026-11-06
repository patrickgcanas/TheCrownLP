import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { supabase, supabaseEnabled, type Depoimento } from "./supabase";

// O painel chama updateTag(DEPOIMENTOS_TAG) ao aprovar, ocultar ou excluir
export const DEPOIMENTOS_TAG = "depoimentos";

export async function getDepoimentosAprovados(): Promise<Depoimento[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(DEPOIMENTOS_TAG);

  if (!supabaseEnabled || !supabase) return [];

  const { data, error } = await supabase
    .from("depoimentos")
    .select("*")
    .eq("aprovado", true)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data as Depoimento[];
}
