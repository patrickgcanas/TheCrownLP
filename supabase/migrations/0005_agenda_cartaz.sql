-- The Crown LP — cartaz (imagem) opcional em cada show da agenda
-- Rodar no SQL Editor do Supabase depois do 0004. A imagem fica no bucket "midia", pasta agenda/.

alter table agenda add column if not exists cartaz_url text;
alter table agenda add column if not exists cartaz_path text;
