-- =========================================================
-- CASA DE ARTES
-- Migration: 012_add_vermelho_china_variant.sql
-- Produto: Tinta Acrílica Corfix 250ml
-- Variante: Vermelho da China - 57
-- =========================================================

do $$
declare
  v_product_id uuid;
  v_option_id uuid;
  v_option_value_id uuid;
  v_variant_id uuid;
begin

  -- 1. Localiza o produto
  select id
  into v_product_id
  from products
  where slug = 'tinta-acrilica-corfix-250ml';

  if v_product_id is null then
    raise exception 'Produto Tinta Acrílica Corfix 250ml não encontrado.';
  end if;

  -- 2. Localiza a opção Cor
  select id
  into v_option_id
  from product_options
  where product_id = v_product_id
    and name = 'Cor';

  if v_option_id is null then
    raise exception 'Opção Cor não encontrada para o produto.';
  end if;

  -- 3. Cadastra a nova cor
  select id
  into v_option_value_id
  from product_option_values
  where option_id = v_option_id
    and value = 'Vermelho da China - 57';

  if v_option_value_id is null then
    insert into product_option_values (
      option_id,
      value
    )
    values (
      v_option_id,
      'Vermelho da China - 57'
    )
    returning id into v_option_value_id;
  end if;

  -- 4. Localiza ou cria a variante vendável
  select id
  into v_variant_id
  from product_variants
  where barcode = '7896011706337';

  if v_variant_id is null then
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
      '7896011706337',
      52.00,
      3,
      true,
      false
    )
    returning id into v_variant_id;
  end if;

  -- 5. Relaciona a variante à cor
  if not exists (
    select 1
    from variant_option_values
    where variant_id = v_variant_id
      and option_value_id = v_option_value_id
  ) then
    insert into variant_option_values (
      variant_id,
      option_value_id
    )
    values (
      v_variant_id,
      v_option_value_id
    );
  end if;

end $$;