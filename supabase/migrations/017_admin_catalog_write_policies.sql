begin;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_profiles
    where user_id = auth.uid()
      and role = 'admin'
  );
$$;

revoke all
on function public.is_admin()
from public;

grant execute
on function public.is_admin()
to authenticated;

grant insert, update, delete
on table
  public.brands,
  public.categories,
  public.products,
  public.product_categories,
  public.product_images,
  public.product_options,
  public.product_option_values,
  public.product_variants,
  public.variant_option_values
to authenticated;

-- =========================================================
-- ADMIN WRITE POLICIES
-- Somente usuários com role = 'admin'
-- =========================================================

create policy "Admins can insert brands"
on public.brands
for insert
to authenticated
with check (public.is_admin());

create policy "Admins can update brands"
on public.brands
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can delete brands"
on public.brands
for delete
to authenticated
using (public.is_admin());


create policy "Admins can insert categories"
on public.categories
for insert
to authenticated
with check (public.is_admin());

create policy "Admins can update categories"
on public.categories
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can delete categories"
on public.categories
for delete
to authenticated
using (public.is_admin());


create policy "Admins can insert products"
on public.products
for insert
to authenticated
with check (public.is_admin());

create policy "Admins can update products"
on public.products
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can delete products"
on public.products
for delete
to authenticated
using (public.is_admin());


create policy "Admins can insert product categories"
on public.product_categories
for insert
to authenticated
with check (public.is_admin());

create policy "Admins can update product categories"
on public.product_categories
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can delete product categories"
on public.product_categories
for delete
to authenticated
using (public.is_admin());


create policy "Admins can insert product images"
on public.product_images
for insert
to authenticated
with check (public.is_admin());

create policy "Admins can update product images"
on public.product_images
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can delete product images"
on public.product_images
for delete
to authenticated
using (public.is_admin());


create policy "Admins can insert product options"
on public.product_options
for insert
to authenticated
with check (public.is_admin());

create policy "Admins can update product options"
on public.product_options
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can delete product options"
on public.product_options
for delete
to authenticated
using (public.is_admin());


create policy "Admins can insert product option values"
on public.product_option_values
for insert
to authenticated
with check (public.is_admin());

create policy "Admins can update product option values"
on public.product_option_values
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can delete product option values"
on public.product_option_values
for delete
to authenticated
using (public.is_admin());


create policy "Admins can insert product variants"
on public.product_variants
for insert
to authenticated
with check (public.is_admin());

create policy "Admins can update product variants"
on public.product_variants
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can delete product variants"
on public.product_variants
for delete
to authenticated
using (public.is_admin());


create policy "Admins can insert variant option values"
on public.variant_option_values
for insert
to authenticated
with check (public.is_admin());

create policy "Admins can update variant option values"
on public.variant_option_values
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can delete variant option values"
on public.variant_option_values
for delete
to authenticated
using (public.is_admin());

commit;