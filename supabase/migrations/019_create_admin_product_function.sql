begin;

create or replace function public.create_admin_product(
  p_name text,
  p_brand_id uuid,
  p_category_id uuid,
  p_color_name text,
  p_color_code text,
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
  v_product_id uuid;
  v_option_id uuid;
  v_option_value_id uuid;
  v_variant_id uuid;
  v_slug text;
begin

  -- Somente administradores podem cadastrar produtos.
  if not public.is_admin() then
    raise exception 'Acesso negado: usuário não é administrador.';
  end if;

  -- Validações dos dados recebidos.
  if nullif(trim(p_name), '') is null then
    raise exception 'Informe o nome do produto.';
  end if;

  if p_brand_id is null then
    raise exception 'Informe a marca do produto.';
  end if;

  if p_category_id is null then
    raise exception 'Informe a categoria do produto.';
  end if;

  if nullif(trim(p_color_name), '') is null then
    raise exception 'Informe a cor da variante.';
  end if;

  if nullif(trim(p_barcode), '') is null then
    raise exception 'Informe o código de barras.';
  end if;

  if trim(p_barcode) !~ '^[0-9]+$' then
    raise exception 'O código de barras deve conter apenas números.';
  end if;

  if p_price is null or p_price < 0 then
    raise exception 'Informe um preço válido.';
  end if;

  if p_stock is null or p_stock < 0 then
    raise exception 'Informe um estoque válido.';
  end if;

  -- Gera o slug a partir do nome do produto.
  v_slug := lower(trim(p_name));

  v_slug := translate(
    v_slug,
    'áàâãäéèêëíìîïóòôõöúùûüç',
    'aaaaaeeeeiiiiooooouuuuc'
  );

  v_slug := regexp_replace(
    v_slug,
    '[^a-z0-9]+',
    '-',
    'g'
  );

  v_slug := trim(both '-' from v_slug);

  if v_slug = '' then
    raise exception 'Não foi possível gerar um identificador para o produto.';
  end if;

  -- Impede produto com o mesmo slug.
  if exists (
    select 1
    from public.products
    where slug = v_slug
  ) then
    raise exception 'Já existe um produto com este nome.';
  end if;

  -- Impede código de barras duplicado.
  if exists (
    select 1
    from public.product_variants
    where barcode = trim(p_barcode)
  ) then
    raise exception 'Este código de barras já está cadastrado.';
  end if;

  -- Cria o produto principal.
  insert into public.products (
    brand_id,
    name,
    slug,
    active
  )
  values (
    p_brand_id,
    trim(p_name),
    v_slug,
    true
  )
  returning id into v_product_id;

  -- Relaciona o produto com a categoria.
  insert into public.product_categories (
    product_id,
    category_id
  )
  values (
    v_product_id,
    p_category_id
  );

  -- Cria a opção "Cor" do produto.
  insert into public.product_options (
    product_id,
    name,
    display_type,
    sort_order
  )
  values (
    v_product_id,
    'Cor',
    'buttons',
    0
  )
  returning id into v_option_id;

  -- Cria o valor da cor e guarda seu código comercial.
  insert into public.product_option_values (
    option_id,
    value,
    color_code,
    sort_order
  )
  values (
    v_option_id,
    trim(p_color_name),
    nullif(trim(p_color_code), ''),
    0
  )
  returning id into v_option_value_id;

  -- Cria a primeira variante comercial do produto.
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
    v_product_id,
    trim(p_barcode),
    p_price,
    p_stock,
    true,
    true,
    0,
    nullif(trim(p_price_group), '')
  )
  returning id into v_variant_id;

  -- Liga a variante ao valor da opção "Cor".
  insert into public.variant_option_values (
    variant_id,
    option_value_id
  )
  values (
    v_variant_id,
    v_option_value_id
  );

  return v_product_id;

end;
$$;

revoke all on function public.create_admin_product(
  text,
  uuid,
  uuid,
  text,
  text,
  text,
  text,
  numeric,
  integer
) from public;

grant execute on function public.create_admin_product(
  text,
  uuid,
  uuid,
  text,
  text,
  text,
  text,
  numeric,
  integer
) to authenticated;

commit;