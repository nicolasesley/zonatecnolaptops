-- Pegá este SQL en Supabase: SQL Editor → New query → Run

create table if not exists public.laptops (
  id uuid primary key default gen_random_uuid(),
  code text not null,
  brand text not null,
  model text not null,
  cpu text not null,
  family text not null,
  gpu text not null,
  ram integer not null,
  expand text not null default 'unknown' check (expand in ('yes', 'no', 'unknown')),
  storage integer not null,
  furmark numeric not null default 0,
  price numeric not null default 0,
  gaming numeric not null,
  design numeric not null,
  office numeric not null,
  link text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists laptops_brand_idx on public.laptops (brand);
create index if not exists laptops_family_idx on public.laptops (family);
create index if not exists laptops_code_idx on public.laptops (code);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists laptops_updated_at on public.laptops;
create trigger laptops_updated_at
before update on public.laptops
for each row
execute function public.set_updated_at();

alter table public.laptops enable row level security;

drop policy if exists "laptops_select_anon" on public.laptops;
drop policy if exists "laptops_insert_anon" on public.laptops;
drop policy if exists "laptops_update_anon" on public.laptops;
drop policy if exists "laptops_delete_anon" on public.laptops;

-- Catálogo interno: lectura y escritura con la anon key.
-- Si más adelante agregás login, restringí estas policies.
create policy "laptops_select_anon" on public.laptops for select to anon, authenticated using (true);
create policy "laptops_insert_anon" on public.laptops for insert to anon, authenticated with check (true);
create policy "laptops_update_anon" on public.laptops for update to anon, authenticated using (true) with check (true);
create policy "laptops_delete_anon" on public.laptops for delete to anon, authenticated using (true);

do $$
begin
  alter publication supabase_realtime add table public.laptops;
exception
  when duplicate_object then null;
end $$;
