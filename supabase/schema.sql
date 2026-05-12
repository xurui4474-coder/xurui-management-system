create extension if not exists pgcrypto;

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  board_id text not null,
  title text not null default '',
  status text not null default '未开始',
  owner text not null default '徐瑞',
  due_date date,
  progress integer not null default 0 check (progress >= 0 and progress <= 100),
  remark text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null default '',
  platform text not null default 'Amazon',
  unified text not null default '是',
  supplier text not null default '',
  cost numeric not null default 0,
  price numeric not null default 0,
  margin numeric not null default 0,
  listing_status text not null default '调研中',
  owner text not null default '徐瑞',
  remark text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.weekly_reviews (
  id uuid primary key default gen_random_uuid(),
  week text not null default '',
  stage text not null default '',
  period text not null default '',
  meeting_time text not null default '',
  sales_to_date text not null default '',
  focus text not null default '',
  actions text not null default '',
  deliverables text not null default '',
  result text not null default '',
  next_plan text not null default '',
  risk text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.metrics (
  id uuid primary key default gen_random_uuid(),
  channel text not null default '',
  sales numeric not null default 0,
  orders integer not null default 0,
  acos numeric not null default 0,
  tacos numeric not null default 0,
  progress integer not null default 0 check (progress >= 0 and progress <= 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_tasks_updated_at on public.tasks;
create trigger set_tasks_updated_at
before update on public.tasks
for each row execute function public.set_updated_at();

drop trigger if exists set_products_updated_at on public.products;
create trigger set_products_updated_at
before update on public.products
for each row execute function public.set_updated_at();

drop trigger if exists set_weekly_reviews_updated_at on public.weekly_reviews;
create trigger set_weekly_reviews_updated_at
before update on public.weekly_reviews
for each row execute function public.set_updated_at();

drop trigger if exists set_metrics_updated_at on public.metrics;
create trigger set_metrics_updated_at
before update on public.metrics
for each row execute function public.set_updated_at();

alter table public.tasks enable row level security;
alter table public.products enable row level security;
alter table public.weekly_reviews enable row level security;
alter table public.metrics enable row level security;

drop policy if exists "authenticated users can manage tasks" on public.tasks;
create policy "authenticated users can manage tasks"
on public.tasks for all
to authenticated
using (true)
with check (true);

drop policy if exists "authenticated users can manage products" on public.products;
create policy "authenticated users can manage products"
on public.products for all
to authenticated
using (true)
with check (true);

drop policy if exists "authenticated users can manage weekly reviews" on public.weekly_reviews;
create policy "authenticated users can manage weekly reviews"
on public.weekly_reviews for all
to authenticated
using (true)
with check (true);

drop policy if exists "authenticated users can manage metrics" on public.metrics;
create policy "authenticated users can manage metrics"
on public.metrics for all
to authenticated
using (true)
with check (true);

grant select, insert, update, delete on public.tasks to authenticated;
grant select, insert, update, delete on public.products to authenticated;
grant select, insert, update, delete on public.weekly_reviews to authenticated;
grant select, insert, update, delete on public.metrics to authenticated;

do $$
begin
  alter publication supabase_realtime add table public.tasks;
exception when duplicate_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.products;
exception when duplicate_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.weekly_reviews;
exception when duplicate_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.metrics;
exception when duplicate_object then null;
end $$;

insert into public.metrics (channel, sales, orders, acos, tacos, progress)
select *
from (
  values
    ('自运营亚马逊', 128000, 980, 22.5, 10.8, 72),
    ('代运营亚马逊', 86500, 620, 28.7, 14.2, 58),
    ('TikTok 美区', 41200, 390, 0, 0, 46),
    ('独立站', 18600, 88, 0, 0, 35)
) as seed(channel, sales, orders, acos, tacos, progress)
where not exists (select 1 from public.metrics);

insert into public.tasks (board_id, title, status, owner, due_date, progress, remark)
select *
from (
  values
    ('selfAmazon', 'Minirain 核心词广告 ACOS 复盘', '进行中', '徐瑞', '2026-05-15'::date, 60, '重点看 Sales、CTR、CPC、ACOS 与自然单占比'),
    ('selfAmazon', '库存风险 SKU 周检查', '风险', '供应链', '2026-05-13'::date, 30, '低于 21 天库存需同步补货节奏'),
    ('agencyAmazon', 'Softrain 代运营交付物确认', '延期', '代运营', '2026-05-10'::date, 45, '需补充关键词动作和下周预算建议'),
    ('agencyAmazon', '周度复盘会议纪要', '进行中', '徐瑞', '2026-05-14'::date, 70, '按销售额、广告、Review、库存输出结论'),
    ('tiktok', '达人视频转化数据整理', '进行中', '运营A', '2026-05-16'::date, 55, '关注 ROI、CPM、CTR、完播率、GMV'),
    ('site', '独立站首页视觉与产品页结构确认', '未开始', '设计', '2026-05-20'::date, 15, '先完成首屏、类目页、产品详情页'),
    ('todos', '整理本周老板汇报数据', '进行中', '徐瑞', '2026-05-17'::date, 50, '输出结果、问题、卡点、计划、支持需求'),
    ('risks', '代运营广告动作不够具体', '风险', '徐瑞', '2026-05-14'::date, 20, '需要求按广告组和关键词层级给调整记录')
) as seed(board_id, title, status, owner, due_date, progress, remark)
where not exists (select 1 from public.tasks);

insert into public.products (name, platform, unified, supplier, cost, price, margin, listing_status, owner, remark)
select *
from (
  values
    ('Rain cover organizer', 'Amazon', '是', '供应商A', 35, 89, 60.7, '待上架', '徐瑞', '适合 Minirain 关联测试'),
    ('Travel soft storage bag', 'TikTok', '否', '供应商B', 18, 49, 63.3, '调研中', '运营A', '需验证达人视频卖点')
) as seed(name, platform, unified, supplier, cost, price, margin, listing_status, owner, remark)
where not exists (select 1 from public.products);

insert into public.weekly_reviews (week, stage, period, meeting_time, sales_to_date, focus, actions, deliverables, result, next_plan, risk)
select *
from (
  values
    ('2026-W20', '增长优化', '2026/05/11-2026/05/17', '周四 16:00', '¥86,500', '广告 ACOS、自然单占比、库存风险', '压低高 CPC 词，补充核心词排名，检查 Review 增长', '广告调整表、关键词报表、下周预算计划', '待复盘', '聚焦高转化词，清理低效预算', '部分广告组未提供具体调整依据')
) as seed(week, stage, period, meeting_time, sales_to_date, focus, actions, deliverables, result, next_plan, risk)
where not exists (select 1 from public.weekly_reviews);
