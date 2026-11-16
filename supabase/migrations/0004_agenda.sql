-- The Crown LP — agenda de próximos shows (aparece na página inicial e é editada no painel)
-- Rodar no SQL Editor do Supabase depois de 0001, 0002 e 0003.

create table if not exists agenda (
  id uuid primary key default gen_random_uuid(),
  data date not null,
  horario time,
  local text not null,
  cidade text,
  link text,
  detalhe text,
  created_at timestamptz not null default now()
);

create index if not exists agenda_data_idx on agenda (data);

alter table agenda enable row level security;

create policy "Agenda é pública para leitura"
  on agenda for select
  to anon, authenticated
  using (true);

create policy "Admin gerencia agenda"
  on agenda for all
  to authenticated
  using (is_admin())
  with check (is_admin());

-- Permissões de tabela (o projeto não expõe tabelas novas automaticamente)
grant select on agenda to anon;
grant select, insert, update, delete on agenda to authenticated;
