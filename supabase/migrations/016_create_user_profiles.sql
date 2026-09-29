begin;

create table if not exists public.user_profiles (
  user_id uuid primary key
    references auth.users(id)
    on delete cascade,

  role text not null default 'customer'
    check (role in ('admin', 'employee', 'customer')),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.user_profiles
enable row level security;

grant select
on table public.user_profiles
to authenticated;

create policy "Users can view own profile"
on public.user_profiles
for select
to authenticated
using (auth.uid() = user_id);

commit;