-- =========================================================
-- CASA DE ARTES
-- Migration: 006_brand_logos_storage_policies.sql
-- Leitura pública das logos das marcas
-- =========================================================

begin;

create policy "Public can view brand logos"
on storage.objects
for select
to public
using (
  bucket_id = 'brand-logos'
);

commit;