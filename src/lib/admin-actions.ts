"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "./auth";
import { DEPOIMENTOS_TAG } from "./depoimentos-data";
import { capasDoFeed, codigoInstagram } from "./instagram";
import { MIDIA_TAG, instagramPermalink } from "./midia-data";

export type FormState = { status: "idle" | "success" | "error"; message: string };

const texto = (formData: FormData, campo: string) => String(formData.get(campo) ?? "").trim();

function atualizarMidia(showId?: string) {
  updateTag(MIDIA_TAG);
  revalidatePath("/admin/shows");
  if (showId) revalidatePath(`/admin/shows/${showId}`);
}

// ---------- Shows ----------

export async function criarShow(_prev: FormState, formData: FormData): Promise<FormState> {
  const { supabase } = await requireAdmin();
  const nome = texto(formData, "nome");
  const local = texto(formData, "local");
  const data = texto(formData, "data");

  if (!nome || !data) return { status: "error", message: "Preencha o nome e a data do show." };

  const { data: show, error } = await supabase
    .from("shows")
    .insert({ nome, local: local || null, data })
    .select("id")
    .single();

  if (error || !show) return { status: "error", message: "Não foi possível criar o show." };

  atualizarMidia();
  redirect(`/admin/shows/${show.id}`);
}

export async function editarShow(_prev: FormState, formData: FormData): Promise<FormState> {
  const { supabase } = await requireAdmin();
  const id = texto(formData, "id");
  const nome = texto(formData, "nome");
  const local = texto(formData, "local");
  const data = texto(formData, "data");

  if (!nome || !data) return { status: "error", message: "Preencha o nome e a data do show." };

  const { error } = await supabase.from("shows").update({ nome, local: local || null, data }).eq("id", id);
  if (error) return { status: "error", message: "Não foi possível salvar." };

  atualizarMidia(id);
  return { status: "success", message: "Show atualizado." };
}

export async function excluirShow(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = texto(formData, "id");

  // Apaga os arquivos do Storage antes; os registros de mídia somem junto com o show (cascade)
  const { data: itens } = await supabase.from("midia").select("storage_path").eq("show_id", id);
  const caminhos = (itens ?? []).map((i) => i.storage_path).filter(Boolean) as string[];
  if (caminhos.length > 0) await supabase.storage.from("midia").remove(caminhos);

  await supabase.from("shows").delete().eq("id", id);
  atualizarMidia();
  redirect("/admin/shows");
}

// ---------- Itens de mídia ----------

// Chamado pelo navegador depois que o arquivo já subiu para o Storage
export async function registrarArquivo(input: {
  showId: string;
  tipo: "imagem" | "video";
  url: string;
  storagePath: string;
  titulo?: string;
}) {
  const { supabase } = await requireAdmin();

  const { error } = await supabase.from("midia").insert({
    show_id: input.showId,
    tipo: input.tipo,
    url: input.url,
    storage_path: input.storagePath,
    titulo: input.titulo?.trim() || null,
  });

  if (error) {
    await supabase.storage.from("midia").remove([input.storagePath]);
    return { ok: false };
  }

  atualizarMidia(input.showId);
  return { ok: true };
}

export async function adicionarInstagram(_prev: FormState, formData: FormData): Promise<FormState> {
  const { supabase } = await requireAdmin();
  const showId = texto(formData, "show_id");
  const link = texto(formData, "link");
  const titulo = texto(formData, "titulo");

  if (!instagramPermalink(link)) {
    return {
      status: "error",
      message: "Esse link não parece de um post do Instagram. Copie pelo botão “Compartilhar → Copiar link” do post.",
    };
  }

  // Guarda uma cópia da capa no Storage: do feed do Behold, se o post estiver entre os últimos,
  // ou do endereço público de capa do Instagram. Os links originais expiram depois de alguns dias.
  let capa: { url: string; caminho: string } | null = null;
  try {
    const codigo = codigoInstagram(link);
    const origem = codigo
      ? ((await capasDoFeed()).get(codigo) ?? `https://www.instagram.com/p/${codigo}/media/?size=l`)
      : undefined;
    if (codigo && origem) {
      const res = await fetch(origem, { headers: { "User-Agent": "Mozilla/5.0" } });
      const tipo = res.headers.get("content-type") ?? "";
      if (res.ok && tipo.startsWith("image/")) {
        const caminho = `shows/${showId}/instagram-${codigo}.${tipo.includes("webp") ? "webp" : "jpg"}`;
        const { error: erroUpload } = await supabase.storage
          .from("midia")
          .upload(caminho, await res.arrayBuffer(), { contentType: tipo, upsert: true });
        if (!erroUpload) {
          capa = { caminho, url: supabase.storage.from("midia").getPublicUrl(caminho).data.publicUrl };
        }
      }
    }
  } catch {
    capa = null;
  }

  const { error } = await supabase.from("midia").insert({
    show_id: showId,
    tipo: "instagram",
    url: link,
    titulo: titulo || null,
    thumbnail_url: capa?.url ?? null,
    storage_path: capa?.caminho ?? null,
  });

  if (error) return { status: "error", message: "Não foi possível adicionar o post." };

  atualizarMidia(showId);
  return { status: "success", message: "Post adicionado!" };
}

export async function editarLegenda(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = texto(formData, "id");
  const showId = texto(formData, "show_id");
  const titulo = texto(formData, "titulo");

  await supabase.from("midia").update({ titulo: titulo || null }).eq("id", id);
  atualizarMidia(showId);
}

export async function definirCapa(formData: FormData) {
  const { supabase } = await requireAdmin();
  const showId = texto(formData, "show_id");
  const url = texto(formData, "url");

  await supabase.from("shows").update({ capa_url: url }).eq("id", showId);
  atualizarMidia(showId);
}

export async function excluirItem(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = texto(formData, "id");
  const showId = texto(formData, "show_id");

  const { data: item } = await supabase.from("midia").select("url, storage_path").eq("id", id).maybeSingle();
  if (!item) return;

  await supabase.from("midia").delete().eq("id", id);
  if (item.storage_path) await supabase.storage.from("midia").remove([item.storage_path]);

  // Se era a capa, o show volta a usar a primeira foto
  await supabase.from("shows").update({ capa_url: null }).eq("id", showId).eq("capa_url", item.url);

  atualizarMidia(showId);
}

// ---------- Depoimentos ----------

async function atualizarDepoimento(formData: FormData, aprovado: boolean) {
  const { supabase } = await requireAdmin();
  await supabase.from("depoimentos").update({ aprovado }).eq("id", texto(formData, "id"));
  updateTag(DEPOIMENTOS_TAG);
  revalidatePath("/admin", "layout");
}

export async function aprovarDepoimento(formData: FormData) {
  await atualizarDepoimento(formData, true);
}

export async function ocultarDepoimento(formData: FormData) {
  await atualizarDepoimento(formData, false);
}

export async function excluirDepoimento(formData: FormData) {
  const { supabase } = await requireAdmin();
  await supabase.from("depoimentos").delete().eq("id", texto(formData, "id"));
  updateTag(DEPOIMENTOS_TAG);
  revalidatePath("/admin", "layout");
}

// ---------- Contatos ----------

export async function marcarRespondida(formData: FormData) {
  const { supabase } = await requireAdmin();
  const respondida = texto(formData, "respondida") === "true";
  await supabase.from("contato_mensagens").update({ respondida }).eq("id", texto(formData, "id"));
  revalidatePath("/admin", "layout");
}

export async function excluirContato(formData: FormData) {
  const { supabase } = await requireAdmin();
  await supabase.from("contato_mensagens").delete().eq("id", texto(formData, "id"));
  revalidatePath("/admin", "layout");
}
