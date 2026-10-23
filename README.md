# The Crown LP

Site da banda The Crown LP, tributo a Linkin Park. Next.js 16 (App Router, Cache Components) + Tailwind v4 + Supabase.

## Rodando localmente

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

Vai trabalhar em outro computador (ex.: escritório)? Siga [docs/TRABALHANDO-EM-OUTRO-PC.md](docs/TRABALHANDO-EM-OUTRO-PC.md).

## Configuração do Supabase

1. Crie um projeto em [supabase.com](https://supabase.com).
2. Rode, em ordem, os arquivos de `supabase/migrations/` (`0001_init.sql`, `0002_storage_midia.sql`) no SQL Editor do projeto.
3. Em Storage > `midia`, envie o `intro-video.mp4` e use a URL pública dele em `NEXT_PUBLIC_INTRO_VIDEO_URL`.
4. Copie `.env.local.example` para `.env.local` e preencha com a URL e a anon key do projeto.

Sem essas variáveis configuradas, o site funciona normalmente com conteúdo de exemplo/estado vazio nas páginas de Mídia e Depoimentos.

## Estrutura

- `src/app` — páginas (Início, História, Mídia, Depoimentos, Contato)
- `src/components` — componentes de UI (Navbar, Footer, formulários, hero)
- `src/lib/actions.ts` — Server Actions (envio de depoimento e de contato)
- `src/lib/supabase.ts` — cliente Supabase e tipos
- `supabase/migrations` — schema do banco

## Deploy

Projeto pensado para deploy na Vercel. Configure as mesmas variáveis de ambiente do `.env.local` nas Environment Variables do projeto na Vercel.
