create table public.checklist_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  item_id text not null check (char_length(item_id) between 3 and 80),
  completed boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (user_id, item_id)
);

create index checklist_progress_owner_idx
on public.checklist_progress (user_id, updated_at desc);

alter table public.checklist_progress enable row level security;

create policy "owners read own checklist progress"
on public.checklist_progress for select
using (auth.uid() = user_id);

create policy "owners create own checklist progress"
on public.checklist_progress for insert
with check (auth.uid() = user_id);

create policy "owners update own checklist progress"
on public.checklist_progress for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "owners delete own checklist progress"
on public.checklist_progress for delete
using (auth.uid() = user_id);
