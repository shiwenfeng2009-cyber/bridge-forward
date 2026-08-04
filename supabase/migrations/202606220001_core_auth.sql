create type public.app_role as enum (
  'student',
  'verified_supporter',
  'moderator',
  'admin'
);

create type public.supporter_role as enum (
  'teacher',
  'counselor',
  'club_advisor',
  'school_staff'
);

create type public.application_status as enum (
  'pending',
  'approved',
  'rejected'
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nickname text not null check (char_length(nickname) between 2 and 30),
  native_language text not null check (char_length(native_language) between 2 and 40),
  grade smallint check (grade between 9 and 12),
  interests text[] not null default '{}',
  role public.app_role not null default 'student',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.supporter_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  supporter_role public.supporter_role not null,
  school_email text not null check (position('@' in school_email) > 1),
  note text check (char_length(note) <= 500),
  status public.application_status not null default 'pending',
  reviewed_by uuid references auth.users(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.supporter_applications enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

create or replace function public.prevent_role_self_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role <> old.role and not public.is_admin() then
    raise exception 'role changes require an administrator';
  end if;

  new.updated_at = now();
  return new;
end;
$$;

create trigger protect_profile_role
before update on public.profiles
for each row execute function public.prevent_role_self_change();

create policy "profiles are readable without private account data"
on public.profiles for select
using (true);

create policy "users create own student profile"
on public.profiles for insert
with check (auth.uid() = id and role = 'student');

create policy "users update own safe profile"
on public.profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "admins manage profiles"
on public.profiles for all
using (public.is_admin())
with check (public.is_admin());

create policy "users read own supporter applications"
on public.supporter_applications for select
using (auth.uid() = user_id or public.is_admin());

create policy "users create own supporter applications"
on public.supporter_applications for insert
with check (auth.uid() = user_id and status = 'pending');

create policy "admins review supporter applications"
on public.supporter_applications for update
using (public.is_admin())
with check (public.is_admin());
