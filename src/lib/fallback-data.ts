import type { MidiaItem } from "./supabase";

// Usado apenas enquanto o Supabase não está configurado (sem NEXT_PUBLIC_SUPABASE_URL/ANON_KEY).
export const midiaFallback: MidiaItem[] = [
  {
    id: "placeholder-video-1",
    tipo: "video",
    titulo: "Vídeo em breve",
    descricao: "Assim que publicarmos o primeiro vídeo, ele aparece aqui.",
    url: "",
    thumbnail_url: null,
    destaque: true,
    created_at: new Date(0).toISOString(),
  },
];
