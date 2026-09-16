-- =========================================================
-- CASA DE ARTES
-- Migration: 008_seed_main_categories.sql
-- Categorias principais do catálogo
-- =========================================================

begin;

insert into categories (
  name,
  slug,
  description,
  active,
  sort_order
)
values
  (
    'Produtos Artísticos',
    'produtos-artisticos',
    'Materiais para desenho, pintura e criação artística.',
    true,
    1
  ),
  (
    'Papelaria',
    'papelaria',
    'Materiais para estudo, escrita e organização.',
    true,
    2
  ),
  (
    'Escritório',
    'escritorio',
    'Materiais para organização e rotina profissional.',
    true,
    3
  )
on conflict (slug) do nothing;

commit;