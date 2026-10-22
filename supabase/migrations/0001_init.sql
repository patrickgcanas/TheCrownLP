-- The Crown LP — schema inicial
-- Depoimentos: avaliações públicas enviadas pelo site, exibidas após aprovação
create table if not exists depoimentos (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  papel text,
  mensagem text not null,
  avaliacao smallint not null check (avaliacao between 1 and 5),
  aprovado boolean not null default false,
  created_at timestamptz not null default now()
);

alter table depoimentos enable row level security;

create policy "Qualquer um pode enviar depoimento"
  on depoimentos for insert
  to anon
  with check (true);

create policy "Depoimentos aprovados são públicos"
  on depoimentos for select
  to anon
  using (aprovado = true);

-- Mensagens de contato: recebidas pelo formulário /contato
create table if not exists contato_mensagens (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  email text not null,
  telefone text,
  tipo_evento text not null,
  mensagem text not null,
  created_at timestamptz not null default now()
);

alter table contato_mensagens enable row level security;

create policy "Qualquer um pode enviar mensagem de contato"
  on contato_mensagens for insert
  to anon
  with check (true);

-- Mídia: vídeos e fotos dos shows, gerenciados manualmente pelo dashboard
create table if not exists midia (
  id uuid primary key default gen_random_uuid(),
  tipo text not null check (tipo in ('video', 'imagem')),
  titulo text not null,
  descricao text,
  url text not null,
  thumbnail_url text,
  destaque boolean not null default false,
  created_at timestamptz not null default now()
);

alter table midia enable row level security;

create policy "Mídia é pública para leitura"
  on midia for select
  to anon
  using (true);
