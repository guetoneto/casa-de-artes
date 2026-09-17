-- =========================================================
-- CASA DE ARTES
-- Migration: 011_add_first_product_image.sql
-- Imagem principal da Tinta Acrílica Corfix 250ml
-- =========================================================

do $$
declare
  v_product_id uuid;
begin

  -- Localiza o produto pelo slug
  select id
  into v_product_id
  from products
  where slug = 'tinta-acrilica-corfix-250ml';

  if v_product_id is null then
    raise exception 'Produto Tinta Acrílica Corfix 250ml não encontrado.';
  end if;

  -- Cadastra a imagem principal
  insert into product_images (
    product_id,
    image_url,
    alt_text,
    is_primary,
    sort_order
  )
  values (
    v_product_id,
    'https://zvmgcfjtbtmsmipxkbsa.supabase.co/storage/v1/object/public/product-images/tinta-acrilica-corfix-250ml-branco-titanio-102.png',
    'Tinta Acrílica Corfix 250ml Branco Titânio 102',
    true,
    1
  );

end $$;