create type public.moderation_status as enum (
  'pending',
  'approved',
  'rejected',
  'removed'
);

create type public.content_language as enum (
  'zh',
  'en',
  'bilingual',
  'other'
);

create type public.question_category as enum (
  'school_rules',
  'making_friends',
  'english_confidence',
  'culture_shock',
  'sat_ap_college',
  'feeling_lost',
  'share_what_helped'
);

create type public.report_reason as enum (
  'privacy',
  'bullying',
  'unsafe',
  'spam',
  'other'
);

create table public.questions (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references auth.users(id) on delete cascade,
  category public.question_category not null,
  title text not null check (char_length(title) between 8 and 120),
  body text not null check (char_length(body) between 10 and 1800),
  language public.content_language not null default 'bilingual',
  status public.moderation_status not null default 'pending',
  moderation_note text check (char_length(moderation_note) <= 500),
  reviewed_by uuid references auth.users(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.stories (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 5 and 120),
  body text not null check (char_length(body) between 10 and 3000),
  language public.content_language not null default 'bilingual',
  publish_as_anonymous boolean not null default true,
  status public.moderation_status not null default 'pending',
  moderation_note text check (char_length(moderation_note) <= 500),
  reviewed_by uuid references auth.users(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.replies (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references auth.users(id) on delete cascade,
  question_id uuid references public.questions(id) on delete cascade,
  story_id uuid references public.stories(id) on delete cascade,
  body text not null check (char_length(body) between 10 and 1500),
  language public.content_language not null default 'bilingual',
  status public.moderation_status not null default 'pending',
  moderation_note text check (char_length(moderation_note) <= 500),
  reviewed_by uuid references auth.users(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint replies_target_check check (
    (question_id is not null and story_id is null)
    or (question_id is null and story_id is not null)
  )
);

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid references auth.users(id) on delete set null,
  question_id uuid references public.questions(id) on delete cascade,
  story_id uuid references public.stories(id) on delete cascade,
  reply_id uuid references public.replies(id) on delete cascade,
  reason public.report_reason not null,
  note text check (char_length(note) <= 500),
  status public.moderation_status not null default 'pending',
  created_at timestamptz not null default now(),
  constraint reports_target_check check (
    num_nonnulls(question_id, story_id, reply_id) = 1
  )
);

create table public.moderation_actions (
  id uuid primary key default gen_random_uuid(),
  moderator_id uuid not null references auth.users(id) on delete restrict,
  action text not null check (char_length(action) between 3 and 60),
  target_table text not null check (target_table in ('questions', 'stories', 'replies', 'reports', 'supporter_applications')),
  target_id uuid not null,
  note text check (char_length(note) <= 800),
  created_at timestamptz not null default now()
);

create index questions_public_idx on public.questions (created_at desc) where status = 'approved';
create index questions_author_idx on public.questions (author_id, created_at desc);
create index questions_moderation_idx on public.questions (status, created_at asc);

create index stories_public_idx on public.stories (created_at desc) where status = 'approved';
create index stories_author_idx on public.stories (author_id, created_at desc);
create index stories_moderation_idx on public.stories (status, created_at asc);

create index replies_question_public_idx on public.replies (question_id, created_at asc) where status = 'approved';
create index replies_story_public_idx on public.replies (story_id, created_at asc) where status = 'approved';
create index replies_author_status_idx on public.replies (author_id, status);
create index replies_moderation_idx on public.replies (status, created_at asc);

create index reports_moderation_idx on public.reports (status, created_at asc);
create index moderation_actions_target_idx on public.moderation_actions (target_table, target_id);

alter table public.questions enable row level security;
alter table public.stories enable row level security;
alter table public.replies enable row level security;
alter table public.reports enable row level security;
alter table public.moderation_actions enable row level security;

create or replace function public.is_moderator_or_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role in ('moderator', 'admin')
  );
$$;

create or replace function public.approved_reply_count(user_uuid uuid)
returns integer
language sql
stable
security definer
set search_path = public
as $$
  select count(*)::integer
  from public.replies
  where author_id = user_uuid
    and status = 'approved';
$$;

create or replace function public.set_reply_initial_status()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if public.approved_reply_count(new.author_id) >= 3 then
    new.status = 'approved';
  else
    new.status = 'pending';
  end if;

  return new;
end;
$$;

create trigger replies_initial_review
before insert on public.replies
for each row execute function public.set_reply_initial_status();

create policy "approved questions are public"
on public.questions for select
using (status = 'approved' or auth.uid() = author_id or public.is_moderator_or_admin());

create policy "logged in users create own pending questions"
on public.questions for insert
with check (auth.uid() = author_id and status = 'pending');

create policy "authors update own pending questions"
on public.questions for update
using (auth.uid() = author_id and status = 'pending')
with check (auth.uid() = author_id and status = 'pending');

create policy "moderators manage questions"
on public.questions for all
using (public.is_moderator_or_admin())
with check (public.is_moderator_or_admin());

create policy "approved stories are public"
on public.stories for select
using (status = 'approved' or auth.uid() = author_id or public.is_moderator_or_admin());

create policy "logged in users create own pending stories"
on public.stories for insert
with check (auth.uid() = author_id and status = 'pending');

create policy "authors update own pending stories"
on public.stories for update
using (auth.uid() = author_id and status = 'pending')
with check (auth.uid() = author_id and status = 'pending');

create policy "moderators manage stories"
on public.stories for all
using (public.is_moderator_or_admin())
with check (public.is_moderator_or_admin());

create policy "approved replies are public"
on public.replies for select
using (status = 'approved' or auth.uid() = author_id or public.is_moderator_or_admin());

create policy "logged in users create own replies"
on public.replies for insert
with check (auth.uid() = author_id);

create policy "moderators manage replies"
on public.replies for all
using (public.is_moderator_or_admin())
with check (public.is_moderator_or_admin());

create policy "logged in users create reports"
on public.reports for insert
with check (auth.uid() = reporter_id);

create policy "moderators read reports"
on public.reports for select
using (public.is_moderator_or_admin() or auth.uid() = reporter_id);

create policy "moderators manage reports"
on public.reports for update
using (public.is_moderator_or_admin())
with check (public.is_moderator_or_admin());

create policy "moderators read moderation actions"
on public.moderation_actions for select
using (public.is_moderator_or_admin());

create policy "moderators create moderation actions"
on public.moderation_actions for insert
with check (public.is_moderator_or_admin() and auth.uid() = moderator_id);
