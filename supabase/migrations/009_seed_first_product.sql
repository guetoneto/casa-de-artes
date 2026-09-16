-- =========================================================
-- CASA DE ARTES
-- Migration: 009_seed_first_product.sql
-- Primeiro produto real do catálogo
-- Tinta Acrílica Corfix 250ml
-- =========================================================

do $$
declare
  v_brand_id uuid;
  v_category_id uuid;
  v_product_id uuid;
  v_option_id uuid;
  v_option_value_id uuid;
  v_variant_id uuid;
begin

  -- 1. Localiza a marca Corfix
  select id
  into v_brand_id
  from brands
  where slug = 'corfix';

  if v_brand_id is null then
    raise exception 'Marca Corfix não encontrada.';
  end if;

  -- 2. Localiza a categoria Produtos Artísticos
  select id
  into v_category_id
  from categories
  where slug = 'produtos-artisticos';

  if v_category_id is null then
    raise exception 'Categoria Produtos Artísticos não encontrada.';
  end if;

  -- 3. Cria o produto
  insert into products (
    brand_id,
    name,
    slug,
    active,
    featured
  )
  values (
    v_brand_id,
    'Tinta Acrílica Corfix 250ml',
    'tinta-acrilica-corfix-250ml',
    true,
    false
  )
  returning id into v_product_id;

  -- 4. Relaciona produto e categoria
  insert into product_categories (
    product_id,
    category_id
  )
  values (
    v_product_id,
    v_category_id
  );

  -- 5. Cria a opção Cor
  insert into product_options (
    product_id,
    name,
    display_type
  )
  values (
    v_product_id,
    'Cor',
    'color'
  )
  returning id into v_option_id;

  -- 6. Cadastra Branco Titânio
  insert into product_option_values (
    option_id,
    value
  )
  values (
    v_option_id,
    'Branco Titânio - 102'
  )
  returning id into v_option_value_id;

  -- 7. Cria a variante vendável
  insert into product_variants (
    product_id,
    barcode,
    price,
    stock,
    active,
    is_default
  )
  values (
    v_product_id,
    '7896011706238',
    52.00,
    12,
    true,
    true
  )
  returning id into v_variant_id;

  -- 8. Relaciona a variante à cor
  insert into variant_option_values (
    variant_id,
    option_value_id
  )
  values (
    v_variant_id,
    v_option_value_id
  );

end $$;