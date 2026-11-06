# Identidade visual e painel de administração — The Crown LP

Data: 2026-10-23 · Status: implementado (visual em produção; painel no branch `admin`)

## Identidade visual

- **Paleta** extraída do logo: fundo roxo quase preto `#120a14`, cartões `#1d0f22`, magenta das joias `#d63fb8` (destaque), dourado do metal `#e3a95c` (detalhes), texto prata `#f3eef5`.
- **Tipografia**: Bebas Neue nos títulos e menu (maiúsculas, condensada); Inter no texto corrido.
- **Logo**: recorte da coroa no menu, rodapé, favicon e ícone Apple. Nada de logo grande no topo.
- **Topo da home**: vídeo de fundo com o redemoinho de partículas da intro (trecho 1:16–1:33), 2× mais lento, com leve desfoque e brilho estabilizado, em loop de 32 s sem emenda visível (1,4 MB). Escurecido à esquerda para o texto, aberto à direita.
- **Título**: "THE CROWN" em degradê branco → dourado; "LP TRIBUTE" em magenta com brilho; mote **HEAVY IS THE CROWN** em dourado entre traços finos.
- Botões: primário em degradê magenta → roxo; secundário com contorno dourado.

## Painel de administração

### Decisões

| Tema | Decisão | Por quê |
|---|---|---|
| Onde fica | Dentro do site, em `/admin` | Mesmo visual e deploy, custo zero |
| Login | Link mágico por e-mail (Supabase Auth), só o e-mail da banda | Sem senha para decorar; conta única |
| Autorização | Policies RLS no banco com `is_admin()` (tabela `admins`) | Segurança no banco, não só no site; nenhuma chave secreta nova |
| Fotos | Upload direto do navegador para o Storage, reduzidas para 2000 px JPEG | Plano gratuito (1 GB) comporta milhares de fotos |
| Vídeos | Instagram por link (embed oficial); poucos vídeos de destaque hospedados (≤ 50 MB) | A banda não tem YouTube; Storage gratuito é pequeno para vídeo |
| Organização | Por show (álbum) | Pedido da banda |
| Avisos | E-mail via Resend para contato/depoimento novo | Gratuito até 100/dia |

### Dados (`supabase/migrations/0003_admin.sql`)

- `admins(email)` — sem acesso pela API; consultado só por `is_admin()` (security definer, compara sem diferenciar maiúsculas).
- `shows(id, nome, local, data, capa_url)` — leitura pública; escrita só admin.
- `midia` ganha `show_id` (cascade), `storage_path` e o tipo `instagram`; `titulo` vira opcional (legenda).
- `contato_mensagens` ganha `respondida`.
- Policies de admin para ler/alterar/excluir depoimentos e contatos; policies de Storage (select/insert/update/delete) no bucket `midia` só para admin.

### Telas

- `/admin/login` — e-mail → link mágico. Resposta igual para qualquer e-mail (não revela o do admin).
- `/admin/shows` — lista de shows + criar show.
- `/admin/shows/[id]` — arrastar fotos/vídeos (vários, com progresso), colar link do Instagram, legenda, "usar de capa", excluir item, editar/excluir show.
- `/admin/depoimentos` — abas Pendentes/Aprovados; aprovar, ocultar, excluir.
- `/admin/contatos` — lista (não respondidos no topo), detalhes, responder por e-mail, WhatsApp, marcar respondida, excluir.
- Contadores de pendências no menu.

### Site público

- `/midia` — grade de shows (capa, data, contagem de fotos/vídeos). Sem shows: "Em breve".
- `/midia/[id]` — álbum: vídeos (player próprio ou embed do Instagram) e fotos em mosaico com tela cheia (setas e teclado).
- Cache com tag `midia`; o painel chama `updateTag("midia")` ao salvar, então o site atualiza na hora.

### Segurança

- `proxy.ts` renova a sessão e redireciona para o login quem não está logado (checagem rápida).
- `requireAdmin()` em toda página e Server Action do painel confere sessão + `is_admin()`.
- As policies do banco são a barreira final: mesmo com a anon key, ninguém além do admin altera nada.
- `/admin` fora do Google (`robots.txt` e `noindex`).

### Testes feitos

- Build e lint limpos.
- Migrations 0001–0003 aplicadas num Postgres local (PGlite) simulando o Supabase, com 25 checagens de permissão: visitante, usuário logado qualquer e admin (inclui Storage e exclusão em cascata).
- Navegação: redirecionamentos do painel, página de login, Mídia sem shows.
- Pendente: teste ponta a ponta do painel logado, que depende de rodar a migration e configurar o login no Supabase.
