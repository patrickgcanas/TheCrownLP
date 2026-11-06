"use server";

import { redirect } from "next/navigation";
import { isAdminEmail } from "./auth";
import { createSessionClient } from "./supabase-server";

export type FormState = { status: "idle" | "ok" | "error"; message: string };

export async function entrar(_prev: FormState, formData: FormData): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const senha = String(formData.get("senha") ?? "");

  if (!email || !senha) {
    return { status: "error", message: "Digite o e-mail e a senha da banda." };
  }

  // Mesma mensagem para e-mail errado e senha errada: não revela qual é o e-mail do admin
  const incorreto: FormState = { status: "error", message: "E-mail ou senha incorretos." };

  if (!isAdminEmail(email)) {
    return incorreto;
  }

  const supabase = await createSessionClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password: senha });

  if (error) {
    return error.status === 429
      ? { status: "error", message: "Muitas tentativas seguidas. Espere alguns minutos e tente de novo." }
      : incorreto;
  }

  redirect("/admin");
}

export async function trocarSenha(_prev: FormState, formData: FormData): Promise<FormState> {
  const senha = String(formData.get("senha") ?? "");
  const confirmacao = String(formData.get("confirmacao") ?? "");

  if (senha.length < 8) {
    return { status: "error", message: "A senha precisa ter pelo menos 8 caracteres." };
  }
  if (senha !== confirmacao) {
    return { status: "error", message: "As duas senhas não são iguais." };
  }

  const supabase = await createSessionClient();
  const { data } = await supabase.auth.getUser();
  if (!isAdminEmail(data.user?.email)) {
    redirect("/admin/login");
  }

  const { error } = await supabase.auth.updateUser({ password: senha });
  if (error) {
    return {
      status: "error",
      message:
        error.code === "same_password"
          ? "Essa já é a senha atual. Escolha uma diferente."
          : "Não foi possível trocar a senha agora. Tente novamente em instantes.",
    };
  }

  return { status: "ok", message: "Senha trocada. Use a nova senha no próximo acesso." };
}

export async function sair() {
  const supabase = await createSessionClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
