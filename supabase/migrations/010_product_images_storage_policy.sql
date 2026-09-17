-- =========================================================
-- CASA DE ARTES
-- Migration: 010_product_images_storage_policy.sql
-- Leitura pública das imagens dos produtos
-- =========================================================

begin;

create policy "Public can view product images"
on storage.objects
for select
to public
using (
  bucket_id = 'product-images'
);

commit;