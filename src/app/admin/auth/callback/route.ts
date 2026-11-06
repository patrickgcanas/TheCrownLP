import { NextResponse, type NextRequest } from "next/server";
import { createSessionClient } from "@/lib/supabase-server";

// Destino do link mágico: troca o código pela sessão e entra no painel
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  if (code) {
    const supabase = await createSessionClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return NextResponse.redirect(new URL("/admin/login?erro=link", request.url));
}
