do $$
declare
  v_product_id uuid;
  v_option_id uuid;
  v_option_value_id uuid;
  v_variant_id uuid;
  v_color record;
begin
  -- Localiza o produto
  select id
  into v_product_id
  from products
  where slug = 'tinta-acrilica-corfix-250ml';

  if v_product_id is null then
    raise exception 'Produto Tinta Acrílica Corfix 250ml não encontrado.';
  end if;

  -- Localiza a opção "Cor"
  select id
  into v_option_id
  from product_options
  where product_id = v_product_id
    and name = 'Cor';

  if v_option_id is null then
    raise exception 'Opção Cor não encontrada para o produto.';
  end if;

  -- Percorre todas as novas cores
  for v_color in
    select *
    from (
      values
        ('Verde Esmeralda - 73',       '7896011706481', 52.00, 3, 'GR 1'),
        ('Terra Siena Queimada - 63',  '7896011706382', 52.00, 3, 'GR 1'),
        ('Azul Celeste - 67',          '7896011706429', 52.00, 1, 'GR 1'),
        ('Azul Cobalto - 66',          '7896011706412', 52.00, 3, 'GR 1'),
        ('Azul Turquesa - 134',        '7896011700380', 52.00, 3, 'GR 1'),
        ('Azul Hortênsia - 108',       '7896011708737', 52.00, 2, 'GR 1'),
        ('Amarelo Indiano - 52',       '7896011706290', 52.00, 1, 'GR 1'),
        ('Verde Oliva - 111',          '7898518197151', 52.00, 2, 'GR 1'),
        ('Verde Vessie - 78',          '7896011706511', 52.00, 3, 'GR 1'),
        ('Laranja - 55',               '7896011706313', 52.00, 3, 'GR 1'),
        ('Sombra Natural - 84',        '7896011706566', 52.00, 3, 'GR 1'),
        ('Azul Real - 70',             '7896011706450', 52.00, 3, 'GR 1'),
        ('Vermelho Francês - 56',      '7896011706320', 52.00, 1, 'GR 1'),
        ('Sépia - 118',                '7896011708744', 52.00, 1, 'GR 1'),
        ('Preto - 65',                 '7896011706405', 52.00, 8, 'GR 1'),
        ('Vermelho Veneza - 166',      '7898415883126', 52.00, 5, 'GR 1'),
        ('Gris De Payne - 33',         '7896011706856', 52.00, 4, 'GR 1'),
        ('Azul da Prussia - 69',       '7896011706443', 52.00, 5, 'GR 1'),
        ('Amarelo Ocre - 53',          '7896011706306', 52.00, 8, 'GR 1'),
        ('Amarelo Napoles - 47',       '7896011706245', 52.00, 1, 'GR 1'),
        ('Terra Siena Natural - 62',   '7896011706375', 52.00, 3, 'GR 1'),
        ('Marrom Garanca - 95',        '7898415881603', 70.00, 6, 'GR 2')
    ) as colors(
      color_name,
      barcode,
      price,
      stock,
      price_group
    )
  loop

    -- Procura ou cria o valor da cor
    select id
    into v_option_value_id
    from product_option_values
    where option_id = v_option_id
      and value = v_color.color_name;

    if v_option_value_id is null then
      insert into product_option_values (
        option_id,
        value
      )
      values (
        v_option_id,
        v_color.color_name
      )
      returning id into v_option_value_id;
    end if;

    -- Procura a variante pelo código de barras
    select id
    into v_variant_id
    from product_variants
    where barcode = v_color.barcode;

    if v_variant_id is null then
  insert into product_variants (
    product_id,
    barcode,
    price,
    stock,
    active,
    is_default,
    price_group
  )
  values (
    v_product_id,
    v_color.barcode,
    v_color.price,
    v_color.stock,
    true,
    false,
    v_color.price_group
  )
  returning id into v_variant_id;
else
  update product_variants
  set
    product_id = v_product_id,
    price = v_color.price,
    stock = v_color.stock,
    active = true,
    price_group = v_color.price_group
  where id = v_variant_id;
end if;
    -- Liga a variante à respectiva cor
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

  end loop;
end $$;