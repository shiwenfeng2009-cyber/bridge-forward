revoke execute on function public.prevent_role_self_change() from public, anon, authenticated;
revoke execute on function public.set_reply_initial_status() from public, anon, authenticated;
revoke execute on function public.approved_reply_count(uuid) from public, anon, authenticated;

create index if not exists moderation_actions_moderator_idx on public.moderation_actions (moderator_id);
create index if not exists questions_reviewed_by_idx on public.questions (reviewed_by);
create index if not exists stories_reviewed_by_idx on public.stories (reviewed_by);
create index if not exists replies_reviewed_by_idx on public.replies (reviewed_by);
create index if not exists reports_reporter_idx on public.reports (reporter_id);
create index if not exists reports_question_idx on public.reports (question_id);
create index if not exists reports_story_idx on public.reports (story_id);
create index if not exists reports_reply_idx on public.reports (reply_id);
create index if not exists supporter_applications_user_idx on public.supporter_applications (user_id);
create index if not exists supporter_applications_reviewer_idx on public.supporter_applications (reviewed_by);
