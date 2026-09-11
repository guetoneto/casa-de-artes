-- =========================================================
-- CASA DE ARTES
-- Migration: 002_catalog_rls_policies.sql
-- Políticas públicas de leitura do catálogo
-- =========================================================

begin;


-- =========================================================
-- MARCAS
-- Visitantes podem consultar somente marcas ativas.
-- =========================================================

create policy "Public can read active brands"
on brands
for select
to anon, authenticated
using (active = true);


-- =========================================================
-- CATEGORIAS
-- Visitantes podem consultar somente categorias ativas.
-- =========================================================

create policy "Public can read active categories"
on categories
for select
to anon, authenticated
using (active = true);


-- =========================================================
-- PRODUTOS
-- Visitantes podem consultar somente produtos ativos.
-- =========================================================

create policy "Public can read active products"
on products
for select
to anon, authenticated
using (active = true);


-- =========================================================
-- RELACIONAMENTO PRODUTOS X CATEGORIAS
--
-- A tabela não possui coluna "active".
-- A leitura será permitida somente quando o produto e a
-- categoria relacionados estiverem ativos.
-- =========================================================

create policy "Public can read active product categories"
on product_categories
for select
to anon, authenticated
using (
  exists (
    select 1
    from products
    where products.id = product_categories.product_id
      and products.active = true
  )
  and
  exists (
    select 1
    from categories
    where categories.id = product_categories.category_id
      and categories.active = true
  )
);


-- =========================================================
-- IMAGENS DOS PRODUTOS
-- Somente imagens de produtos ativos.
-- =========================================================

create policy "Public can read images from active products"
on product_images
for select
to anon, authenticated
using (
  exists (
    select 1
    from products
    where products.id = product_images.product_id
      and products.active = true
  )
);


-- =========================================================
-- OPÇÕES DOS PRODUTOS
-- Ex.: Cor, Tamanho, Volume...
-- =========================================================

create policy "Public can read options from active products"
on product_options
for select
to anon, authenticated
using (
  exists (
    select 1
    from products
    where products.id = product_options.product_id
      and products.active = true
  )
);


-- =========================================================
-- VALORES DAS OPÇÕES
-- Ex.: Azul, 37 ml, A4...
-- =========================================================

create policy "Public can read option values from active products"
on product_option_values
for select
to anon, authenticated
using (
  exists (
    select 1
    from product_options
    join products
      on products.id = product_options.product_id
    where product_options.id = product_option_values.option_id
      and products.active = true
  )
);


-- =========================================================
-- VARIAÇÕES
-- Apenas variações ativas de produtos ativos.
-- =========================================================

create policy "Public can read active variants"
on product_variants
for select
to anon, authenticated
using (
  active = true
  and
  exists (
    select 1
    from products
    where products.id = product_variants.product_id
      and products.active = true
  )
);


-- =========================================================
-- RELACIONAMENTO VARIAÇÕES X VALORES
--
-- Somente relações pertencentes a variações ativas
-- de produtos ativos.
-- =========================================================

create policy "Public can read values from active variants"
on variant_option_values
for select
to anon, authenticated
using (
  exists (
    select 1
    from product_variants
    join products
      on products.id = product_variants.product_id
    where product_variants.id = variant_option_values.variant_id
      and product_variants.active = true
      and products.active = true
  )
);


commit;