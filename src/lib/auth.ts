import "server-only";
import { redirect } from "next/navigation";
import { createSessionClient } from "./supabase-server";

export function isAdminEmail(email: string | null | undefined) {
  const admin = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  return Boolean(admin && email && email.trim().toLowerCase() === admin);
}

// Garante que quem está na página/ação é o admin. Sem sessão válida, volta para o login.
export async function requireAdmin() {
  const supabase = await createSessionClient();
  const { data } = await supabase.auth.getUser();
  const email = data.user?.email;

  if (!email) {
    redirect("/admin/login");
  }

  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (!isAdmin) {
    await supabase.auth.signOut();
    redirect("/admin/login?erro=acesso");
  }

  return { supabase, email };
}
