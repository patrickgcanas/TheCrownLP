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
  aprovado?: boolean;
  created_at: string;
};

export type ContatoMensagem = {
  id?: string;
  respondida?: boolean;
  created_at?: string;
  nome: string;
  email: string;
  telefone: string | null;
  tipo_evento: string;
  mensagem: string;
};

export type Show = {
  id: string;
  nome: string;
  local: string | null;
  data: string;
  capa_url: string | null;
  created_at: string;
};

export type MidiaItem = {
  id: string;
  tipo: "video" | "imagem" | "instagram";
  show_id?: string | null;
  storage_path?: string | null;
  titulo: string | null;
  descricao: string | null;
  url: string;
  thumbnail_url: string | null;
  destaque: boolean;
  created_at: string;
};
