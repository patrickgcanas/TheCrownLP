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
- Vercel: projeto `thecrownlp`, https://thecrownlp.vercel.app. `src/lib/site.ts` usa o domínio de produção da Vercel automaticamente.
- **Domínio `thecrownlp.com.br`** (registrado no registro.br em 16/11/2026, CPF do Patrick, vence 16/11/2027). DNS no próprio registro.br em **modo avançado** (Configurar zona DNS; não aceita "@" — nome em branco = o próprio domínio):
  - `A` (em branco) → `216.198.79.1` e `CNAME www` → `e9da82c4332f355f.vercel-dns-017.com.` (Vercel). Principal é **www.thecrownlp.com.br**; o domínio sem www redireciona (308).
  - `MX 10 mx1.improvmx.com`, `MX 20 mx2.improvmx.com`, `TXT "v=spf1 include:spf.improvmx.com -all"`: **ImprovMX** (grátis, conta com o e-mail da banda) encaminha qualquer `*@thecrownlp.com.br` para `thecrownlptribute@gmail.com`.
  - A banda decidiu **não** verificar o domínio no Resend: os avisos do site continuam saindo de `onboarding@resend.dev` para o Gmail da banda.
  - **No ar desde 16/11/2026**: DNS propagado (delegação em `b/c.sec.dns.br`), certificado emitido, `https://www.thecrownlp.com.br` responde 200 e o domínio sem www redireciona. A Vercel passou a usar o domínio próprio como URL de produção, então `siteUrl` (sitemap, links) já sai com `www.thecrownlp.com.br` sem precisar de `NEXT_PUBLIC_SITE_URL`. O despertador do Supabase continua chamando `thecrownlp.vercel.app` (não depende de DNS).
  - No Windows, `curl` às vezes falha no TLS desse domínio (erro 35, schannel); com Node/navegador funciona. Não é problema do site.
  - E-mail `contato@thecrownlp.com.br` testado em 16/11/2026 (ImprovMX verde, chegou no Gmail da banda) e é o que aparece no site (`EMAIL_BANDA` em `src/lib/contatos.ts`). O login do painel e os avisos continuam no Gmail da banda.
  - Os avisos do site (Resend, `onboarding@resend.dev`) caíam no Spam do Gmail: orientado a marcar "Not spam" e criar filtro "Never send it to Spam" para esse remetente.
- Supabase: projeto `ixdvsdqqecwvoazhmgip`, região São Paulo, plano gratuito.
  - Migrations em `supabase/migrations/`, rodadas **manualmente** no SQL Editor (sem CLI/integração GitHub). Copiar o SQL pelo VS Code; colar via terminal quebra acentos.
  - "Automatically expose new tables" está **desligado**: toda tabela nova precisa de `grant` explícito além das policies RLS.
  - Bucket público `midia` (vídeo de abertura e, com o painel, fotos/vídeos dos shows). Limite de 50 MB por arquivo no plano grátis.
  - **O plano grátis pausa o projeto após ~7 dias sem uso** (aconteceu em nov/2026: o endereço some do DNS, o vídeo de abertura e os formulários param). Para reativar: painel do Supabase → Restore project. Prevenção: Vercel Cron diário (`vercel.json`) e GitHub Actions 2x/dia (`.github/workflows/manter-supabase-ativo.yml`, adicionado em 16/11/2026 depois de pausar de novo) chamam `/api/manter-ativo`, que faz uma consulta leve. Se o Action falhar, o GitHub manda e-mail ao dono do repositório. Se pausar mesmo assim, conferir em Vercel → Settings → Cron Jobs se está rodando.
- Variáveis de ambiente: ver `.env.local.example`. O `.env.local` não vai para o git.

## Identidade visual (aprovada pela banda)

- Cores no `:root` de `src/app/globals.css`: fundo `#120a14`, magenta `#d63fb8` (destaque), dourado `#e3a95c` (detalhes). Tirar sempre desses tokens.
- Títulos em **Inter Tight** (`font-display`: negrito, letras juntas, caixa alta), no estilo da escrita do Linkin Park na fase *From Zero*; texto corrido em Inter. No topo, "THE CROWN" em negrito e "LP TRIBUTE" em peso normal, como "LINKIN PARK / FROM ZERO". Classes prontas: `btn-primary`, `btn-ghost`, `eyebrow`, `field`, `text-gradient-crown`, `text-gradient-accent`.
  - Já testado e **recusado pela banda**: Archivo Black com "pontas" no R e no N imitando o logo antigo do LP (ficou feio). Fontes "Linkin Park" do dafont/fontmeme não servem: licença só para uso pessoal ou cópia da Arial da Monotype, e sem acentos.
  - A banda pediu para **não mudar a estrutura/layout** ao mexer em fonte: comparar antes/depois (desktop e celular) e manter as mesmas quebras de linha.
- Logo só no canto (menu/rodapé), nunca grande no topo — a banda não gostou.
- Fundo do topo: `public/videos/hero-loop.mp4`, trecho do redemoinho da intro 2× mais lento, com desfoque leve. A banda achou rápido demais a 1× e lento demais a 4×.
- Mote **HEAVY IS THE CROWN** em dourado abaixo do título.
- A seção "Abertura do show" (vídeo da intro com play) foi **retirada da página inicial** a pedido da banda (nov/2026). O vídeo continua no Storage e a variável `NEXT_PUBLIC_INTRO_VIDEO_URL` ficou sem uso.
- Efeitos ao rolar (aprovados em nov/2026): `src/components/Reveal.tsx` (surgir subindo, com `delay` para cascata) e `src/components/HeroParallax.tsx` (topo com profundidade). Desligados com "reduzir movimento" — o PC de casa do Patrick está assim, então para conferir use o celular ou emule no puppeteer.
- "use server" (`src/lib/actions.ts`) só pode exportar funções async: exportar um objeto quebrou os formulários em produção (erro 500).

## Estado atual (atualizar quando mudar)

- **Em produção (`main`, publicado em nov/2026)**: visual novo com fonte Inter Tight, páginas Início, História (com integrantes), Mídia (álbuns por show + Instagram), Depoimentos (só o formulário; os aprovados aparecem em carrossel na Início, depois de "Sobre a banda" — `DepoimentosSection`/`DepoimentosCarrossel`, cache com tag `depoimentos`), Contato (só botões: Instagram, WhatsApp (11) 93359-7888, e-mail — dados em `src/lib/contatos.ts`; WhatsApp também no rodapé), Contrate a banda (`/contrate`, formulário); formulários gravando no Supabase; painel em `/admin`.
  - Painel: login por **e-mail e senha** (Supabase `signInWithPassword`) só para `thecrownlptribute@gmail.com` (e-mail da banda; um acesso compartilhado pela banda). Trocou do link mágico em nov/2026 porque os links falhavam/esbarravam no limite de e-mails. Senha se troca em `/admin/senha`; se esquecerem, apagar o usuário em Supabase → Authentication → Users e criar de novo (Add user → Create new user, Auto Confirm). Painel com shows/álbuns com upload de fotos e vídeos e links do Instagram, aprovação de depoimentos, caixa de contatos, aviso por e-mail (Resend).
  - E-mails do Supabase Auth saem pelo Resend via SMTP próprio no Supabase (Auth → Emails → SMTP: `smtp.resend.com:465`, usuário `resend`, remetente `onboarding@resend.dev`), porque o e-mail padrão do Supabase grátis só manda 2 por hora. Limite em Auth → Rate Limits: 30 e-mails/h. Sem domínio próprio, o Resend só entrega para o e-mail da conta (o da banda), o que basta.
  - Ativação feita em nov/2026: SQL `0003_admin.sql` rodado, URLs de redirect no Supabase Auth, conta no Resend com o e-mail da banda, `ADMIN_EMAIL` e `RESEND_API_KEY` na Vercel (Production e Preview). Testado de ponta a ponta (login, criar show, upload de 15 fotos, capa).
- Instagram: feed do Behold (behold.so, conta com o e-mail da banda, plano grátis: 6 posts, atualiza 1x/dia, 1.200 views/mês). Link em `src/lib/instagram.ts`; aparece na Início e na Mídia. A conta @thecrown.lp é Profissional (exigência do Behold).
- Posts do Instagram nos álbuns (`InstagramCard`): cartão no visual do site (capa + play); o embed oficial (branco, sem tema escuro) só abre numa janela `<dialog>` ao clicar. Capa: `thumbnail_url` (cópia guardada no Storage pelo painel ao adicionar o link) > feed do Behold > `/api/capa-instagram/[codigo]` (o servidor busca `instagram.com/p/<código>/media/?size=l`; o navegador não pode carregar direto por causa do `Cross-Origin-Resource-Policy`).
- Prévia ao compartilhar o link (WhatsApp/Instagram): `src/app/opengraph-image.jpg` (1200×630, foto da banda no palco + nome + mote, montada em HTML e fotografada com o Chrome) e `opengraph-image.alt.txt`; `metadataBase` no `src/app/layout.tsx`. Cada página usa o próprio título. O WhatsApp guarda a prévia antiga em cache por um tempo.
- Contador de visitas: Vercel Web Analytics (`<Analytics />` no layout de `(site)`, dentro de Suspense). Precisa estar ligado no painel da Vercel (Analytics → Enable).
- Vídeos: a banda não tem YouTube; usa Instagram. Vídeos ficam no Instagram (embed por link); só poucos destaques hospedados no Storage.

## Pendências

- Supabase pausou de novo em ~16/11/2026 mesmo com o Vercel Cron (dados intactos, restaurado). Adicionado o GitHub Actions como segundo despertador; conferir em GitHub → Actions se está rodando verde.
- Próximos passos sugeridos (nov/2026), em ordem: agenda de próximos shows na Início (editável no painel), repertório, material para contratantes (PDF), Google Search Console + Vercel Analytics.
- Fotos dos integrantes para a seção "Quem sobe ao palco" da página História (hoje só texto).
- Trocar a senha do banco do Supabase (foi exposta numa conversa).
- Logo em alta resolução / PNG sem fundo, se a banda tiver.

## Como trabalhar

- Mudança grande ou arriscada: branch próprio → push → prévia da Vercel → merge. Texto pequeno pode ir direto no `main`.
- Antes de dizer que terminou: `npm run build` e `npm run lint` limpos e, para mudanças visuais, conferir no navegador.
- Commits em português, no estilo `feat: ...`, `fix: ...`, `chore: ...`.
