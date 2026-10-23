begin;

create or replace function public.delete_admin_product_variant(
    p_variant_id uuid
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
    v_product_id uuid;
    v_variant_count integer;
    v_is_default boolean;
    v_option_value_ids uuid[];
begin
    -- Somente administradores
    if not public.is_admin() then
        raise exception 'Acesso negado. Administrador necessário.';
    end if;

    if p_variant_id is null then
        raise exception 'Informe a variante que será removida.';
    end if;

    -- Identifica o produto da variante.
select pv.product_id
into v_product_id
from public.product_variants pv
where pv.id = p_variant_id;

if v_product_id is null then
    raise exception 'Variante não encontrada.';
end if;

-- Bloqueia o produto para coordenar
-- criação e exclusão de variantes.
perform 1
from public.products
where id = v_product_id
for update;

if not found then
    raise exception 'Produto não encontrado.';
end if;

-- Reconsulta a variante após obter o bloqueio.
select pv.is_default
into v_is_default
from public.product_variants pv
where pv.id = p_variant_id
  and pv.product_id = v_product_id
for update;

if not found then
    raise exception 'Variante não encontrada.';
end if;

-- Impede remover a variante padrão.
if v_is_default then
    raise exception
        'Não é permitido excluir a variante padrão do produto.';
end if;

    select count(*)
    into v_variant_count
    from public.product_variants
    where product_id = v_product_id;

    if v_variant_count <= 1 then
        raise exception
            'Não é permitido excluir a última variante do produto.';
    end if;

    -- Guarda somente os valores vinculados à variante excluída.
   select coalesce(array_agg(option_value_id), array[]::uuid[])
   into v_option_value_ids
   from public.variant_option_values
   where variant_id = p_variant_id;

   -- Bloqueia os valores de opção envolvidos na exclusão.
   perform 1
   from public.product_option_values
   where id = any(v_option_value_ids)
   order by id
   for update;

    -- Exclui a variante.
    -- Suas associações são removidas por ON DELETE CASCADE.
    delete from public.product_variants
    where id = p_variant_id
      and product_id = v_product_id;

    if not found then
        raise exception 'Não foi possível remover a variante.';
    end if;

    -- Remove apenas os valores da variante excluída
-- que não são mais utilizados por outras variantes.
delete from public.product_option_values pov
where pov.id = any(v_option_value_ids)
  and exists (
      select 1
      from public.product_options po
      where po.id = pov.option_id
        and po.product_id = v_product_id
  )
  and not exists (
      select 1
      from public.variant_option_values vov
      where vov.option_value_id = pov.id
  );

    return true;
end;
$$;

-- Restringe a execução da função
revoke all
on function public.delete_admin_product_variant(uuid)
from public;

revoke all
on function public.delete_admin_product_variant(uuid)
from anon;

grant execute
on function public.delete_admin_product_variant(uuid)
to authenticated;

commit;