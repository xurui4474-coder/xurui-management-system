alter table public.products
add column if not exists platform text not null default 'Amazon';

alter table public.products
add column if not exists unified text not null default '是';

alter table public.products
add column if not exists supplier text not null default '';

alter table public.products
add column if not exists cost numeric not null default 0;

alter table public.products
add column if not exists price numeric not null default 0;

alter table public.products
add column if not exists margin numeric not null default 0;

alter table public.products
add column if not exists listing_status text not null default '调研中';

alter table public.products
add column if not exists owner text not null default '徐瑞';

alter table public.products
add column if not exists remark text not null default '';

notify pgrst, 'reload schema';
