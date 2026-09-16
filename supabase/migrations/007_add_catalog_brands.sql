-- =========================================================
-- CASA DE ARTES
-- Migration: 007_add_catalog_brands.sql
-- Ampliação das marcas do catálogo
-- =========================================================

begin;

insert into brands (
  name,
  slug,
  active,
  sort_order
)
values
  ('Tigre', 'tigre', true, 5),
  ('Giotto', 'giotto', true, 6),
  ('Canson', 'canson', true, 7),
  ('Lyra', 'lyra', true, 8),
  ('Leonora', 'leonora', true, 9),
  ('Koala', 'koala', true, 10),
  ('Compactor', 'compactor', true, 11),
  ('Stabilo', 'stabilo', true, 12),
  ('Uniball', 'uniball', true, 13),
  ('Copic', 'copic', true, 14),
  ('Caderno Inteligente', 'caderno-inteligente', true, 15),
  ('Tilibra', 'tilibra', true, 16),
  ('Keramik', 'keramik', true, 17),
  ('Sinoart', 'sinoart', true, 18),
  ('Hahnemuhle', 'hahnemuhle', true, 19),
  ('Credeal', 'credeal', true, 20),
  ('Crown', 'crown', true, 21),
  ('Artools', 'artools', true, 22),
  ('Polibras', 'polibras', true, 23),
  ('BIC', 'bic', true, 24),
  ('Nexel', 'nexel', true, 25),
  ('Acrimet', 'acrimet', true, 26),
  ('CIS', 'cis', true, 27),
  ('Casio', 'casio', true, 28)
on conflict (slug) do nothing;

commit;