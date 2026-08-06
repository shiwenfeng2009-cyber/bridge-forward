drop policy if exists "profiles are readable without private account data" on public.profiles;
create policy "users and admins read profiles"
on public.profiles for select
using (auth.uid() = id or public.is_admin());

create table if not exists public.page_views (
  id bigint generated always as identity primary key,
  visitor_id text not null check (char_length(visitor_id) between 8 and 80),
  path text not null check (char_length(path) between 1 and 240),
  language text not null default 'zh' check (char_length(language) between 2 and 12),
  referrer_host text check (char_length(referrer_host) <= 160),
  device_class text not null default 'desktop' check (device_class in ('mobile', 'tablet', 'desktop')),
  created_at timestamptz not null default now()
);

create index if not exists page_views_created_idx on public.page_views (created_at desc);
create index if not exists page_views_path_idx on public.page_views (path, created_at desc);
create index if not exists page_views_language_idx on public.page_views (language, created_at desc);
alter table public.page_views enable row level security;

create policy "any visitor records anonymous page views"
on public.page_views for insert
to anon, authenticated
with check (true);

create policy "admins read page views"
on public.page_views for select
to authenticated
using (public.is_admin());

grant insert on public.page_views to anon, authenticated;
grant usage, select on sequence public.page_views_id_seq to anon, authenticated;
grant select on public.page_views to authenticated;
