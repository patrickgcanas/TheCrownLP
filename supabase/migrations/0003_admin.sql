-- The Crown LP — painel de administração
-- Rodar depois de 0001 e 0002. No final, troque o e-mail em "insert into admins".

-- Quem pode entrar no painel. A checagem fica no banco (RLS), não só no site.
create table if not exists admins (
  email text primary key
);

alter table admins enable row level security;
-- Sem policies: ninguém lê/escreve pela API. Só is_admin() (security definer) consulta.

create or replace function is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from admins
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

revoke all on function is_admin() from public;
grant execute on function is_admin() to anon, authenticated;

-- Shows: cada show é um álbum na página Mídia
create table if not exists shows (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  local text,
  data date not null,
  capa_url text,
  created_at timestamptz not null default now()
);

alter table shows enable row level security;

create policy "Shows são públicos para leitura"
  on shows for select
  to anon, authenticated
  using (true);

create policy "Admin gerencia shows"
  on shows for all
  to authenticated
  using (is_admin())
  with check (is_admin());

-- Mídia: cada item pertence a um show e pode ser foto, vídeo hospedado ou post do Instagram
alter table midia add column if not exists show_id uuid references shows (id) on delete cascade;
alter table midia add column if not exists storage_path text;
alter table midia drop constraint if exists midia_tipo_check;
alter table midia add constraint midia_tipo_check check (tipo in ('video', 'imagem', 'instagram'));
alter table midia alter column titulo drop not null;

create index if not exists midia_show_id_idx on midia (show_id);

create policy "Mídia é pública para leitura (logado)"
  on midia for select
  to authenticated
  using (true);

create policy "Admin gerencia mídia"
  on midia for all
  to authenticated
  using (is_admin())
  with check (is_admin());

-- Depoimentos: admin vê todos (inclusive pendentes), aprova e exclui
create policy "Admin lê todos os depoimentos"
  on depoimentos for select
  to authenticated
  using (is_admin());

create policy "Admin atualiza depoimentos"
  on depoimentos for update
  to authenticated
  using (is_admin())
  with check (is_admin());

create policy "Admin exclui depoimentos"
  on depoimentos for delete
  to authenticated
  using (is_admin());

-- Contatos: admin lê, marca como respondido e exclui
alter table contato_mensagens add column if not exists respondida boolean not null default false;

create policy "Admin lê contatos"
  on contato_mensagens for select
  to authenticated
  using (is_admin());

create policy "Admin atualiza contatos"
  on contato_mensagens for update
  to authenticated
  using (is_admin())
  with check (is_admin());

create policy "Admin exclui contatos"
  on contato_mensagens for delete
  to authenticated
  using (is_admin());

-- Permissões de tabela (o projeto não expõe tabelas novas automaticamente)
grant select on shows to anon;
grant select, insert, update, delete on shows to authenticated;
grant select, insert, update, delete on midia to authenticated;
grant select, update, delete on depoimentos to authenticated;
grant select, update, delete on contato_mensagens to authenticated;
grant usage on schema public to authenticated;

-- Storage: só o admin envia, troca e apaga arquivos do bucket midia (leitura pela URL já é pública)
-- O select é necessário para o admin conseguir apagar: delete só enxerga linhas visíveis no select
create policy "Admin lista arquivos de mídia"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'midia' and public.is_admin());

create policy "Admin envia arquivos de mídia"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'midia' and public.is_admin());

create policy "Admin atualiza arquivos de mídia"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'midia' and public.is_admin());

create policy "Admin apaga arquivos de mídia"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'midia' and public.is_admin());

-- >>> TROQUE PELO E-MAIL DA BANDA <<<
insert into admins (email) values ('EMAIL_DA_BANDA@exemplo.com')
on conflict do nothing;
