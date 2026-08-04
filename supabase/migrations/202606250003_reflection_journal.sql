create type public.reflection_mood as enum (
  'calm',
  'lonely',
  'anxious',
  'confused',
  'need_help'
);

create table public.reflection_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  mood public.reflection_mood not null,
  note text check (char_length(note) <= 500),
  created_at timestamptz not null default now()
);

create index reflection_entries_owner_idx
on public.reflection_entries (user_id, created_at desc);

alter table public.reflection_entries enable row level security;

create policy "owners read own reflection entries"
on public.reflection_entries for select
using (auth.uid() = user_id);

create policy "owners create own reflection entries"
on public.reflection_entries for insert
with check (auth.uid() = user_id);

create policy "owners delete own reflection entries"
on public.reflection_entries for delete
using (auth.uid() = user_id);
