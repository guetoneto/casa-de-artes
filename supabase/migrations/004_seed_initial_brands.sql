-- =========================================================
-- CASA DE ARTES
-- Migration: 004_seed_initial_brands.sql
-- Marcas iniciais para desenvolvimento do catálogo
-- =========================================================

begin;

insert into brands (
  name,
  slug,
  active,
  sort_order
)
values
  ('Corfix', 'corfix', true, 1),
  ('Condor', 'condor', true, 2),
  ('Acrilex', 'acrilex', true, 3),
  ('Faber-Castell', 'faber-castell', true, 4);

commit;