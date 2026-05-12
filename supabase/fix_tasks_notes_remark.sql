-- Fix for tasks schema compatibility.
-- Run this in Supabase SQL Editor once, then redeploy Vercel.

alter table public.tasks
add column if not exists module text not null default '';

alter table public.tasks
add column if not exists notes text not null default '';

alter table public.tasks
add column if not exists remark text not null default '';

update public.tasks
set notes = remark
where coalesce(notes, '') = ''
  and coalesce(remark, '') <> '';

update public.tasks
set remark = notes
where coalesce(remark, '') = ''
  and coalesce(notes, '') <> '';

create or replace function public.sync_task_notes_remark()
returns trigger as $$
begin
  if coalesce(new.notes, '') = '' and coalesce(new.remark, '') <> '' then
    new.notes = new.remark;
  end if;

  if coalesce(new.remark, '') = '' and coalesce(new.notes, '') <> '' then
    new.remark = new.notes;
  end if;

  return new;
end;
$$ language plpgsql;

drop trigger if exists sync_task_notes_remark_before_write on public.tasks;
create trigger sync_task_notes_remark_before_write
before insert or update on public.tasks
for each row execute function public.sync_task_notes_remark();

notify pgrst, 'reload schema';
