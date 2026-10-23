begin;

create or replace function public.create_admin_product_variant(
  p_product_id uuid,
  p_option_name text,
  p_option_value text,
  p_option_code text,
  p_barcode text,
  p_price_group text,
  p_price numeric,
  p_stock integer
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_option_id uuid;
  v_option_value_id uuid;
  v_variant_id uuid;
begin
  -- Somente administradores podem executar o cadastro.
  if not public.is_admin() then
    raise exception 'Acesso não autorizado.';
  end if;

  -- Verifica a existência do produto e obtém
-- um bloqueio durante a transação.
  perform 1
  from public.products
  where id = p_product_id
  for update;

  if not found then
    raise exception 'Produto não encontrado.';
  end if;

  -- Validações básicas.
  if nullif(trim(p_option_name), '') is null then
    raise exception 'Informe o nome da opção.';
  end if;

  if nullif(trim(p_option_value), '') is null then
    raise exception 'Informe o valor da opção.';
  end if;

  if nullif(trim(p_barcode), '') is null then
    raise exception 'Informe o código de barras.';
  end if;

  if p_barcode !~ '^[0-9]+$' then
    raise exception 'O código de barras deve conter apenas números.';
  end if;

  if p_price is null or p_price < 0 then
    raise exception 'Informe um preço válido.';
  end if;

  if p_stock is null or p_stock < 0 then
    raise exception 'Informe um estoque válido.';
  end if;

  -- Impede código de barras duplicado.
  if exists (
    select 1
    from public.product_variants
    where barcode = trim(p_barcode)
  ) then
    raise exception 'Este código de barras já está cadastrado.';
  end if;

  -- Procura a opção dentro deste produto.
  select id
  into v_option_id
  from public.product_options
  where product_id = p_product_id
    and lower(trim(name)) = lower(trim(p_option_name))
  limit 1;

  -- Se ainda não existir, cria a opção.
  if v_option_id is null then
    insert into public.product_options (
      product_id,
      name,
      display_type
    )
    values (
      p_product_id,
      trim(p_option_name),
      'buttons'
    )
    returning id into v_option_id;
  end if;

  -- Não permite o mesmo valor duas vezes na mesma opção.
  if exists (
    select 1
    from public.product_option_values
    where option_id = v_option_id
      and lower(trim(value)) = lower(trim(p_option_value))
  ) then
    raise exception 'Esta opção já está cadastrada neste produto.';
  end if;

  -- Cria o valor da opção.
  insert into public.product_option_values (
    option_id,
    value,
    color_code
  )
  values (
    v_option_id,
    trim(p_option_value),
    nullif(trim(p_option_code), '')
  )
  returning id into v_option_value_id;

  -- Cria a variante comercial.
  insert into public.product_variants (
    product_id,
    barcode,
    price,
    stock,
    is_default,
    active,
    sort_order,
    price_group
  )
  values (
    p_product_id,
    trim(p_barcode),
    p_price,
    p_stock,
    false,
    true,
    (
      select coalesce(max(sort_order), 0) + 1
      from public.product_variants
      where product_id = p_product_id
    ),
    nullif(trim(p_price_group), '')
  )
  returning id into v_variant_id;

  -- Liga a variante ao valor da opção.
  insert into public.variant_option_values (
    variant_id,
    option_value_id
  )
  values (
    v_variant_id,
    v_option_value_id
  );

  return v_variant_id;
end;
$$;

revoke all on function public.create_admin_product_variant(
  uuid, text, text, text, text, text, numeric, integer
) from public;

grant execute on function public.create_admin_product_variant(
  uuid, text, text, text, text, text, numeric, integer
) to authenticated;

commit;