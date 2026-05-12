alter table public.weekly_reviews
add column if not exists period text not null default '';

alter table public.weekly_reviews
add column if not exists meeting_time text not null default '';

alter table public.weekly_reviews
add column if not exists sales_to_date text not null default '';

alter table public.weekly_reviews
add column if not exists focus text not null default '';

alter table public.weekly_reviews
add column if not exists actions text not null default '';

alter table public.weekly_reviews
add column if not exists deliverables text not null default '';

alter table public.weekly_reviews
add column if not exists result text not null default '';

alter table public.weekly_reviews
add column if not exists next_plan text not null default '';

alter table public.weekly_reviews
add column if not exists risk text not null default '';

notify pgrst, 'reload schema';
