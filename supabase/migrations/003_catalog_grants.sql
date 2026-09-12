-- =========================================================
-- CASA DE ARTES
-- Migration: 003_catalog_grants.sql
-- Privilégios necessários para leitura do catálogo
-- =========================================================

begin;

-- Permite que as roles da API acessem o schema public.
grant usage on schema public to anon, authenticated;


-- =========================================================
-- LEITURA DO CATÁLOGO
--
-- O GRANT permite executar SELECT.
-- O RLS continua decidindo quais registros podem ser vistos.
-- =========================================================

grant select on table brands
to anon, authenticated;

grant select on table categories
to anon, authenticated;

grant select on table products
to anon, authenticated;

grant select on table product_categories
to anon, authenticated;

grant select on table product_images
to anon, authenticated;

grant select on table product_options
to anon, authenticated;

grant select on table product_option_values
to anon, authenticated;

grant select on table product_variants
to anon, authenticated;

grant select on table variant_option_values
to anon, authenticated;

commit;