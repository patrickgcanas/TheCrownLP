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
  - **O plano grátis pausa o projeto após ~7 dias sem uso** (aconteceu em nov/2026: o endereço some do DNS, o vídeo de abertura e os formulários param). Para reativar: painel do Supabase → Restore project. Prevenção: Vercel Cron diário (`vercel.json`) chama `/api/manter-ativo`, que faz uma consulta leve. Se pausar mesmo assim, conferir em Vercel → Settings → Cron Jobs se está rodando.
- Variáveis de ambiente: ver `.env.local.example`. O `.env.local` não vai para o git.

## Identidade visual (aprovada pela banda)

- Cores no `:root` de `src/app/globals.css`: fundo `#120a14`, magenta `#d63fb8` (destaque), dourado `#e3a95c` (detalhes). Tirar sempre desses tokens.
- Títulos em **Inter Tight** (`font-display`: negrito, letras juntas, caixa alta), no estilo da escrita do Linkin Park na fase *From Zero*; texto corrido em Inter. No topo, "THE CROWN" em negrito e "LP TRIBUTE" em peso normal, como "LINKIN PARK / FROM ZERO". Classes prontas: `btn-primary`, `btn-ghost`, `eyebrow`, `field`, `text-gradient-crown`, `text-gradient-accent`.
  - Já testado e **recusado pela banda**: Archivo Black com "pontas" no R e no N imitando o logo antigo do LP (ficou feio). Fontes "Linkin Park" do dafont/fontmeme não servem: licença só para uso pessoal ou cópia da Arial da Monotype, e sem acentos.
  - A banda pediu para **não mudar a estrutura/layout** ao mexer em fonte: comparar antes/depois (desktop e celular) e manter as mesmas quebras de linha.
- Logo só no canto (menu/rodapé), nunca grande no topo — a banda não gostou.
- Fundo do topo: `public/videos/hero-loop.mp4`, trecho do redemoinho da intro 2× mais lento, com desfoque leve. A banda achou rápido demais a 1× e lento demais a 4×.
- Mote **HEAVY IS THE CROWN** em dourado abaixo do título.

## Estado atual (atualizar quando mudar)

- **Em produção (`main`, publicado em nov/2026)**: visual novo com fonte Inter Tight, páginas Início, História (com integrantes), Mídia (álbuns por show + Instagram), Depoimentos, Contato; formulários gravando no Supabase; painel em `/admin`.
  - Painel: login por **e-mail e senha** (Supabase `signInWithPassword`) só para `thecrownlptribute@gmail.com` (e-mail da banda; um acesso compartilhado pela banda). Trocou do link mágico em nov/2026 porque os links falhavam/esbarravam no limite de e-mails. Senha se troca em `/admin/senha`; se esquecerem, apagar o usuário em Supabase → Authentication → Users e criar de novo (Add user → Create new user, Auto Confirm). Painel com shows/álbuns com upload de fotos e vídeos e links do Instagram, aprovação de depoimentos, caixa de contatos, aviso por e-mail (Resend).
  - E-mails do Supabase Auth saem pelo Resend via SMTP próprio no Supabase (Auth → Emails → SMTP: `smtp.resend.com:465`, usuário `resend`, remetente `onboarding@resend.dev`), porque o e-mail padrão do Supabase grátis só manda 2 por hora. Limite em Auth → Rate Limits: 30 e-mails/h. Sem domínio próprio, o Resend só entrega para o e-mail da conta (o da banda), o que basta.
  - Ativação feita em nov/2026: SQL `0003_admin.sql` rodado, URLs de redirect no Supabase Auth, conta no Resend com o e-mail da banda, `ADMIN_EMAIL` e `RESEND_API_KEY` na Vercel (Production e Preview). Testado de ponta a ponta (login, criar show, upload de 15 fotos, capa).
- Instagram: feed do Behold (behold.so, conta com o e-mail da banda, plano grátis: 6 posts, atualiza 1x/dia, 1.200 views/mês). Link em `src/lib/instagram.ts`; aparece na Início e na Mídia. A conta @thecrown.lp é Profissional (exigência do Behold).
- Vídeos: a banda não tem YouTube; usa Instagram. Vídeos ficam no Instagram (embed por link); só poucos destaques hospedados no Storage.

## Pendências

- Link do WhatsApp do rodapé (`src/components/Footer.tsx`) está `#` — falta o número.
- Fotos dos integrantes para a seção "Quem sobe ao palco" da página História (hoje só texto).
- Trocar a senha do banco do Supabase (foi exposta numa conversa).
- Logo em alta resolução / PNG sem fundo, se a banda tiver.

## Como trabalhar

- Mudança grande ou arriscada: branch próprio → push → prévia da Vercel → merge. Texto pequeno pode ir direto no `main`.
- Antes de dizer que terminou: `npm run build` e `npm run lint` limpos e, para mudanças visuais, conferir no navegador.
- Commits em português, no estilo `feat: ...`, `fix: ...`, `chore: ...`.
