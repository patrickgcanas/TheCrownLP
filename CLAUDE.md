@AGENTS.md

# The Crown LP — contexto do projeto

Site da banda **The Crown LP**, tributo a Linkin Park. Dono: Patrick Canas (não é desenvolvedor de profissão; explique em português simples, passo a passo, e prefira fazer em vez de pedir que ele faça). Todo texto do site e das conversas é em **português do Brasil**.

O projeto é editado em mais de um computador (casa e escritório). Este arquivo é a memória compartilhada: atualize-o quando uma decisão importante mudar ou uma pendência for resolvida.

## Stack

- Next.js 16 (App Router, `cacheComponents` e `partialPrefetching` ligados) + React 19 + Tailwind v4 + TypeScript.
- Supabase (Postgres, Auth, Storage) via `@supabase/supabase-js` e `@supabase/ssr`.
- Deploy na Vercel; push no `main` publica em produção.

### Pegadinhas do Next 16 neste projeto

- Leia `node_modules/next/dist/docs/` antes de usar APIs que você não conferiu (ver AGENTS.md).
- Middleware agora é **`src/proxy.ts`** (função `proxy`).
- Com Cache Components, tudo que lê dado de requisição (`cookies()`, `params`, `searchParams`, `usePathname()` em rota dinâmica) precisa ficar dentro de `<Suspense>`. Por isso existe `src/components/NavLink.tsx`.
- Dados públicos usam `"use cache"` + `cacheTag`; depois de alterar no painel, `updateTag(...)`.
- Depois de mover/renomear rotas, apague `.next/` se o TypeScript reclamar de tipos antigos.

## Infra

- GitHub: `patrickgcanas/TheCrownLP` (branch principal `main`).
- Vercel: projeto `thecrownlp`, https://thecrownlp.vercel.app. Sem domínio próprio ainda; `src/lib/site.ts` usa o domínio de produção da Vercel automaticamente.
- Supabase: projeto `ixdvsdqqecwvoazhmgip`, região São Paulo, plano gratuito.
  - Migrations em `supabase/migrations/`, rodadas **manualmente** no SQL Editor (sem CLI/integração GitHub). Copiar o SQL pelo VS Code; colar via terminal quebra acentos.
  - "Automatically expose new tables" está **desligado**: toda tabela nova precisa de `grant` explícito além das policies RLS.
  - Bucket público `midia` (vídeo de abertura e, com o painel, fotos/vídeos dos shows). Limite de 50 MB por arquivo no plano grátis.
- Variáveis de ambiente: ver `.env.local.example`. O `.env.local` não vai para o git.

## Identidade visual (aprovada pela banda)

- Cores no `:root` de `src/app/globals.css`: fundo `#120a14`, magenta `#d63fb8` (destaque), dourado `#e3a95c` (detalhes). Tirar sempre desses tokens.
- Títulos em Bebas Neue (`font-display`), texto em Inter. Classes prontas: `btn-primary`, `btn-ghost`, `eyebrow`, `field`, `text-gradient-crown`, `text-gradient-accent`.
- Logo só no canto (menu/rodapé), nunca grande no topo — a banda não gostou.
- Fundo do topo: `public/videos/hero-loop.mp4`, trecho do redemoinho da intro 2× mais lento, com desfoque leve. A banda achou rápido demais a 1× e lento demais a 4×.
- Mote **HEAVY IS THE CROWN** em dourado abaixo do título.

## Estado atual (atualizar quando mudar)

- **Em produção (`main`)**: visual novo, páginas Início, História, Mídia, Depoimentos, Contato; formulários gravando no Supabase.
- **Painel de administração no branch `admin` (não publicado)**: login por link mágico só para o e-mail da banda, shows/álbuns com upload de fotos e vídeos e links do Instagram, aprovação de depoimentos, caixa de contatos, aviso por e-mail (Resend). Permissões por RLS, testadas num Postgres local. Para ativar: `docs/ATIVAR-PAINEL.md` (está no branch `admin`). Ainda não foi testado com login de verdade — testar ponta a ponta antes de mergear no `main`.
- Vídeos: a banda não tem YouTube; usa Instagram. Vídeos ficam no Instagram (embed por link); só poucos destaques hospedados no Storage.

## Pendências

- Ativar o painel (passos no `docs/ATIVAR-PAINEL.md`) e mergear `admin` → `main`.
- Links de Instagram e WhatsApp do rodapé (`src/components/Footer.tsx`) estão `#` — falta o @ e o número.
- Texto da página História é provisório.
- Trocar a senha do banco do Supabase (foi exposta numa conversa).
- Logo em alta resolução / PNG sem fundo, se a banda tiver.

## Como trabalhar

- Mudança grande ou arriscada: branch próprio → push → prévia da Vercel → merge. Texto pequeno pode ir direto no `main`.
- Antes de dizer que terminou: `npm run build` e `npm run lint` limpos e, para mudanças visuais, conferir no navegador.
- Commits em português, no estilo `feat: ...`, `fix: ...`, `chore: ...`.
