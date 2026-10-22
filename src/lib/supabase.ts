import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabaseEnabled = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient | null = supabaseEnabled
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;

export type Depoimento = {
  id: string;
  nome: string;
  papel: string | null;
  mensagem: string;
  avaliacao: number;
  created_at: string;
};

export type ContatoMensagem = {
  nome: string;
  email: string;
  telefone: string | null;
  tipo_evento: string;
  mensagem: string;
};

export type MidiaItem = {
  id: string;
  tipo: "video" | "imagem";
  titulo: string;
  descricao: string | null;
  url: string;
  thumbnail_url: string | null;
  destaque: boolean;
  created_at: string;
};
