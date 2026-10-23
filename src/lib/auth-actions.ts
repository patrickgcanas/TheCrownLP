"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { isAdminEmail } from "./auth";
import { createSessionClient } from "./supabase-server";

export type LoginState = { status: "idle" | "sent" | "error"; message: string };

export async function enviarLinkDeAcesso(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  if (!email) {
    return { status: "error", message: "Digite o e-mail da banda." };
  }

  // Resposta igual para qualquer e-mail: não revela qual é o e-mail do admin
  const sent: LoginState = {
    status: "sent",
    message: "Se esse for o e-mail da banda, o link de acesso chega em instantes. Confira também o spam.",
  };

  if (!isAdminEmail(email)) {
    return sent;
  }

  const origin = (await headers()).get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL ?? "";
  const supabase = await createSessionClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${origin}/admin/auth/callback` },
  });

  if (error) {
    return {
      status: "error",
      message:
        error.status === 429
          ? "Muitos pedidos de link seguidos. Espere alguns minutos e tente de novo."
          : "Não foi possível enviar o link agora. Tente novamente em instantes.",
    };
  }

  return sent;
}

export async function sair() {
  const supabase = await createSessionClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
