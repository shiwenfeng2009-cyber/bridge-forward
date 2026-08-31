-- Public community publishing is intentionally available to anonymous visitors.
-- Private profiles, reflections, reports, and moderation data remain protected by
-- their existing RLS policies.

alter table public.questions alter column author_id drop not null;
alter table public.questions add column if not exists display_name text
  check (display_name is null or char_length(display_name) between 2 and 40);
alter table public.questions alter column status set default 'approved';

alter table public.stories alter column author_id drop not null;
alter table public.stories add column if not exists display_name text
  check (display_name is null or char_length(display_name) between 2 and 40);
alter table public.stories alter column status set default 'approved';

alter table public.replies alter column author_id drop not null;
alter table public.replies add column if not exists display_name text
  check (display_name is null or char_length(display_name) between 2 and 40);
alter table public.replies alter column status set default 'approved';

drop trigger if exists replies_initial_review on public.replies;

drop policy if exists "approved questions are public" on public.questions;
drop policy if exists "logged in users create own pending questions" on public.questions;
drop policy if exists "authors update own pending questions" on public.questions;
drop policy if exists "approved stories are public" on public.stories;
drop policy if exists "logged in users create own pending stories" on public.stories;
drop policy if exists "authors update own pending stories" on public.stories;
drop policy if exists "approved replies are public" on public.replies;
drop policy if exists "logged in users create own replies" on public.replies;

create policy "public reads approved questions"
on public.questions for select
to anon, authenticated
using (
  status = 'approved'
  or (select auth.uid()) = author_id
  or public.is_moderator_or_admin()
);

create policy "visitors publish approved questions"
on public.questions for insert
to anon, authenticated
with check (
  status = 'approved'
  and (author_id is null or author_id = (select auth.uid()))
);

create policy "authors manage own questions"
on public.questions for update
to authenticated
using ((select auth.uid()) = author_id)
with check ((select auth.uid()) = author_id);

create policy "authors delete own questions"
on public.questions for delete
to authenticated
using ((select auth.uid()) = author_id);

create policy "public reads approved stories"
on public.stories for select
to anon, authenticated
using (
  status = 'approved'
  or (select auth.uid()) = author_id
  or public.is_moderator_or_admin()
);

create policy "visitors publish approved stories"
on public.stories for insert
to anon, authenticated
with check (
  status = 'approved'
  and (author_id is null or author_id = (select auth.uid()))
);

create policy "authors manage own stories"
on public.stories for update
to authenticated
using ((select auth.uid()) = author_id)
with check ((select auth.uid()) = author_id);

create policy "authors delete own stories"
on public.stories for delete
to authenticated
using ((select auth.uid()) = author_id);

create policy "public reads approved replies"
on public.replies for select
to anon, authenticated
using (
  status = 'approved'
  or (select auth.uid()) = author_id
  or public.is_moderator_or_admin()
);

create policy "visitors publish approved replies"
on public.replies for insert
to anon, authenticated
with check (
  status = 'approved'
  and (author_id is null or author_id = (select auth.uid()))
);

create policy "authors manage own replies"
on public.replies for update
to authenticated
using ((select auth.uid()) = author_id)
with check ((select auth.uid()) = author_id);

create policy "authors delete own replies"
on public.replies for delete
to authenticated
using ((select auth.uid()) = author_id);

revoke all on public.questions, public.stories, public.replies from anon, authenticated;
grant select, insert on public.questions, public.stories, public.replies to anon;
grant select, insert, update, delete on public.questions, public.stories, public.replies to authenticated;
