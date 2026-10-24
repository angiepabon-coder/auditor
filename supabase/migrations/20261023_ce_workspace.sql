-- Private workspace per authenticated auditor. No anonymous data access.
create table public.ce_workspaces (
  owner_id uuid primary key references auth.users(id) on delete cascade,
  revision integer not null default 1 check (revision > 0),
  payload jsonb not null check (jsonb_typeof(payload) = 'object'),
  updated_at timestamptz not null default now()
);
alter table public.ce_workspaces enable row level security;
revoke all on public.ce_workspaces from anon, authenticated;
grant select, insert, update on public.ce_workspaces to authenticated;
create policy ce_owner_read on public.ce_workspaces for select to authenticated using ((select auth.uid()) = owner_id);
create policy ce_owner_insert on public.ce_workspaces for insert to authenticated with check ((select auth.uid()) = owner_id);
create policy ce_owner_update on public.ce_workspaces for update to authenticated using ((select auth.uid()) = owner_id) with check ((select auth.uid()) = owner_id);
