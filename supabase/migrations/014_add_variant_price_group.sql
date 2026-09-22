begin;

alter table product_variants
add column if not exists price_group text;

update product_variants
set price_group = 'GR 1'
where barcode in (
  '7896011706238', -- Branco Titânio 102
  '7896011706337', -- Vermelho da China 57
  '7896011706436'  -- Azul Ultramar 68
);

commit;