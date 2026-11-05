import { connection, type NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";

// Chamada 1x por dia pelo Vercel Cron (vercel.json). O Supabase gratuito pausa o projeto
// depois de ~7 dias sem uso, o que derruba o vídeo de abertura e os formulários.
export async function GET(request: NextRequest) {
  await connection();

  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) {
    return new Response("Não autorizado", { status: 401 });
  }

  if (!supabase) {
    return Response.json({ ok: false, erro: "Supabase não configurado" }, { status: 500 });
  }

  const { error } = await supabase.from("depoimentos").select("id", { count: "exact", head: true });
  if (error) {
    return Response.json({ ok: false, erro: error.message }, { status: 502 });
  }

  return Response.json({ ok: true, em: new Date().toISOString() });
}
