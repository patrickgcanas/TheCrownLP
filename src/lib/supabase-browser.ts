import { createBrowserClient } from "@supabase/ssr";

// Usado só no painel, para enviar arquivos direto do navegador para o Storage
export function createBrowserSupabase() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
