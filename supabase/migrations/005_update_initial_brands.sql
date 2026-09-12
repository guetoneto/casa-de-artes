-- =========================================================
-- CASA DE ARTES
-- Migration: 005_update_initial_brands.sql
-- Atualização das marcas iniciais do catálogo
-- =========================================================

begin;

update brands
set
  name = 'Pentel',
  slug = 'pentel',
  updated_at = now()
where slug = 'acrilex';

update brands
set
  name = 'Staedtler',
  slug = 'staedtler',
  updated_at = now()
where slug = 'faber-castell';

commit;