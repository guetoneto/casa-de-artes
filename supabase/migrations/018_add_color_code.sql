begin;

alter table public.product_option_values
add column if not exists color_code varchar(50);

comment on column public.product_option_values.color_code
is 'Código comercial da opção, como o número da cor informado pelo fabricante.';

commit;