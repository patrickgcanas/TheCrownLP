"use server";

import { revalidatePath } from "next/cache";
import { supabase, supabaseEnabled } from "./supabase";

export type ActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

const idleState: ActionState = { status: "idle", message: "" };

export async function enviarDepoimento(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const nome = String(formData.get("nome") ?? "").trim();
  const papel = String(formData.get("papel") ?? "").trim();
  const mensagem = String(formData.get("mensagem") ?? "").trim();
  const avaliacao = Number(formData.get("avaliacao") ?? 0);

  if (!nome || !mensagem) {
    return { status: "error", message: "Preencha seu nome e o depoimento." };
  }
  if (!avaliacao || avaliacao < 1 || avaliacao > 5) {
    return { status: "error", message: "Escolha uma avaliação de 1 a 5 estrelas." };
  }

  if (!supabaseEnabled || !supabase) {
    return {
      status: "error",
      message:
        "O envio de depoimentos ainda está sendo configurado. Volte em breve ou fale com a gente direto pelo WhatsApp/Instagram.",
    };
  }

  const { error } = await supabase.from("depoimentos").insert({
    nome,
    papel: papel || null,
    mensagem,
    avaliacao,
  });

  if (error) {
    return { status: "error", message: "Não foi possível enviar agora. Tente novamente em alguns minutos." };
  }

  revalidatePath("/depoimentos");
  return {
    status: "success",
    message: "Obrigado! Seu depoimento foi enviado e vai aparecer aqui depois de uma revisão rápida.",
  };
}

export async function enviarContato(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const nome = String(formData.get("nome") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const telefone = String(formData.get("telefone") ?? "").trim();
  const tipoEvento = String(formData.get("tipo_evento") ?? "").trim();
  const mensagem = String(formData.get("mensagem") ?? "").trim();

  if (!nome || !email || !tipoEvento || !mensagem) {
    return { status: "error", message: "Preencha nome, e-mail, tipo de evento e mensagem." };
  }

  if (!supabaseEnabled || !supabase) {
    return {
      status: "error",
      message:
        "Nosso formulário ainda está sendo configurado. Por enquanto, fale com a gente direto pelo WhatsApp ou Instagram (links no rodapé).",
    };
  }

  const { error } = await supabase.from("contato_mensagens").insert({
    nome,
    email,
    telefone: telefone || null,
    tipo_evento: tipoEvento,
    mensagem,
  });

  if (error) {
    return { status: "error", message: "Não foi possível enviar agora. Tente novamente em alguns minutos." };
  }

  return {
    status: "success",
    message: "Mensagem enviada! Vamos responder o mais rápido possível.",
  };
}

export { idleState };
