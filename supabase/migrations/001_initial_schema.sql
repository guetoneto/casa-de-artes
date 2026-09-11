-- =========================================================
-- CASA DE ARTES
-- Migration: 001_initial_schema.sql
-- Estrutura inicial do catálogo
-- =========================================================


-- =========================================================
-- 1. MARCAS
-- =========================================================

begin;

create table brands (
  id uuid primary key default gen_random_uuid(),

  name varchar(120) not null,
  slug varchar(140) not null unique,
  logo_url text,

  active boolean not null default true,
  sort_order integer not null default 0,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);


-- =========================================================
-- 2. CATEGORIAS E SUBCATEGORIAS
-- =========================================================

create table categories (
  id uuid primary key default gen_random_uuid(),

  parent_id uuid references categories(id) on delete restrict,

  name varchar(120) not null,
  slug varchar(140) not null unique,

  description text,
  image_url text,

  active boolean not null default true,
  sort_order integer not null default 0,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);


-- =========================================================
-- 3. PRODUTOS
-- =========================================================

create table products (
  id uuid primary key default gen_random_uuid(),

  brand_id uuid references brands(id) on delete set null,

  name varchar(180) not null,
  slug varchar(200) not null unique,

  short_description varchar(300),
  description text,

  featured boolean not null default false,
  active boolean not null default true,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);


-- =========================================================
-- 4. RELACIONAMENTO PRODUTOS X CATEGORIAS
-- Um produto pode pertencer a várias categorias.
-- =========================================================

create table product_categories (
  product_id uuid not null
    references products(id) on delete cascade,

  category_id uuid not null
    references categories(id) on delete cascade,

  primary key (product_id, category_id)
);


-- =========================================================
-- 5. IMAGENS DOS PRODUTOS
-- =========================================================

create table product_images (
  id uuid primary key default gen_random_uuid(),

  product_id uuid not null
    references products(id) on delete cascade,

  image_url text not null,
  alt_text varchar(250),

  is_primary boolean not null default false,
  sort_order integer not null default 0,

  created_at timestamptz not null default now()
);


-- Somente uma imagem pode ser marcada como principal por produto.
create unique index product_images_one_primary
on product_images(product_id)
where is_primary = true;


-- =========================================================
-- 6. OPÇÕES DO PRODUTO
--
-- Exemplos:
-- Cor
-- Tamanho
-- Volume
-- Número
-- Quantidade de cores
-- =========================================================

create table product_options (
  id uuid primary key default gen_random_uuid(),

  product_id uuid not null
    references products(id) on delete cascade,

  name varchar(100) not null,

  -- Exemplos futuros:
  -- buttons, color, select
  display_type varchar(30) not null default 'buttons',

  sort_order integer not null default 0,

  created_at timestamptz not null default now(),

  unique (product_id, name)
);


-- =========================================================
-- 7. VALORES DAS OPÇÕES
--
-- Exemplo:
-- Opção: Cor
-- Valores: Branco, Preto, Azul Ultramar...
-- =========================================================

create table product_option_values (
  id uuid primary key default gen_random_uuid(),

  option_id uuid not null
    references product_options(id) on delete cascade,

  value varchar(120) not null,

  -- Usado quando a opção for uma cor visual.
  -- Exemplo: #FFFFFF
  color_hex varchar(9),

  sort_order integer not null default 0,

  created_at timestamptz not null default now(),

  unique (option_id, value)
);


-- =========================================================
-- 8. VARIAÇÕES VENDÁVEIS
--
-- Preço, estoque, SKU e código de barras ficam aqui.
--
-- Mesmo um produto sem opções terá uma variação padrão.
-- =========================================================

create table product_variants (
  id uuid primary key default gen_random_uuid(),

  product_id uuid not null
    references products(id) on delete cascade,

  sku varchar(100) unique,
  barcode varchar(50) unique,

  price numeric(10,2) not null
    check (price >= 0),

  stock integer not null default 0
    check (stock >= 0),

  is_default boolean not null default false,
  active boolean not null default true,

  sort_order integer not null default 0,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);


-- Somente uma variação padrão por produto.
create unique index product_variants_one_default
on product_variants(product_id)
where is_default = true;


-- =========================================================
-- 9. VALORES QUE FORMAM CADA VARIAÇÃO
--
-- Exemplo:
--
-- Produto:
-- Tinta Acrílica
--
-- Variação:
-- SKU CORFIX-AZUL-37
--
-- Valores:
-- Cor -> Azul Ultramar
-- Volume -> 37 ml
-- =========================================================

create table variant_option_values (
  variant_id uuid not null
    references product_variants(id) on delete cascade,

  option_value_id uuid not null
    references product_option_values(id) on delete cascade,

  primary key (variant_id, option_value_id)
);


-- =========================================================
-- 10. ÍNDICES
-- Melhoram buscas e relacionamentos.
-- =========================================================

create index idx_categories_parent_id
on categories(parent_id);

create index idx_products_brand_id
on products(brand_id);

create index idx_products_active
on products(active);

create index idx_products_featured
on products(featured);

create index idx_product_categories_category
on product_categories(category_id);

create index idx_product_images_product
on product_images(product_id);

create index idx_product_options_product
on product_options(product_id);

create index idx_product_option_values_option
on product_option_values(option_id);

create index idx_product_variants_product
on product_variants(product_id);

create index idx_variant_option_values_option_value
on variant_option_values(option_value_id);


-- =========================================================
-- 11. UPDATED_AT AUTOMÁTICO
-- =========================================================

create or replace function update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;


create trigger update_brands_updated_at
before update on brands
for each row
execute function update_updated_at_column();


create trigger update_categories_updated_at
before update on categories
for each row
execute function update_updated_at_column();


create trigger update_products_updated_at
before update on products
for each row
execute function update_updated_at_column();


create trigger update_product_variants_updated_at
before update on product_variants
for each row
execute function update_updated_at_column();


-- =========================================================
-- 12. ROW LEVEL SECURITY
--
-- Ativamos a proteção agora.
-- As políticas de acesso serão criadas separadamente.
-- =========================================================

alter table brands enable row level security;
alter table categories enable row level security;
alter table products enable row level security;
alter table product_categories enable row level security;
alter table product_images enable row level security;
alter table product_options enable row level security;
alter table product_option_values enable row level security;
alter table product_variants enable row level security;
alter table variant_option_values enable row level security;

commit;