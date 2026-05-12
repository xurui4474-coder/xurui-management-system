create table if not exists public.task_boards (
  id uuid primary key default gen_random_uuid(),
  module text not null,
  description text not null default '',
  created_at timestamptz not null default now()
);

alter table public.task_boards enable row level security;

drop policy if exists "authenticated users can manage task boards" on public.task_boards;
create policy "authenticated users can manage task boards"
on public.task_boards for all
to authenticated
using (true)
with check (true);

grant select, insert, update, delete on public.task_boards to authenticated;

do $$
begin
  alter publication supabase_realtime add table public.task_boards;
exception when duplicate_object then null;
end $$;

notify pgrst, 'reload schema';
