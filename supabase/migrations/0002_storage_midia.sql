-- Bucket público para vídeos e fotos do site (intro do show, hero, galeria)
-- Upload é feito manualmente pelo dashboard; leitura é pública via URL
insert into storage.buckets (id, name, public)
values ('midia', 'midia', true)
on conflict (id) do nothing;
