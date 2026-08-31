# Community data visibility audit

## Public content inventory

| Content | Table | Insert path | Default/current publication | Public query | INSERT RLS | SELECT RLS | Login required | Anonymous publishing |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Questions and public chat root posts | `questions` | `submitQuestionAction` from `/ask/questions` | `approved`, immediately public | `getPublicCommunityFeed` and `getApprovedQuestionCards`; approved rows, newest-first for cards | `visitors publish approved questions`: anon/authenticated; null author or own `auth.uid()` | `public reads approved questions` | No | Yes, nullable `author_id`, stored `display_name` |
| Stories | `stories` | `submitStoryAction` from `/ask/stories` | `approved`, immediately public | `getApprovedStoryCards`; approved rows newest-first | `visitors publish approved stories`: anon/authenticated; null author or own `auth.uid()` | `public reads approved stories` | No | Yes, nullable `author_id`, anonymous label by default |
| Replies/comments/chat replies | `replies` | `submitReplyAction` from `/ask/questions` | `approved`, immediately public | `getPublicCommunityFeed`; approved rows | `visitors publish approved replies`: anon/authenticated; null author or own `auth.uid()` | `public reads approved replies` | No | Yes, nullable `author_id`, stored `display_name` |
| Reports | `reports` | No public UI currently | `pending`; moderation-only workflow | No public query | Existing authenticated reporter policy | Reporter or moderator only | Existing feature requires login | No; intentionally not public content |
| Private reflections | No shared public table; browser-local reflection experience | Reflection feature only | Private | No public query | None added | None added | Not made public | Not published |

No separate forum/chat/message table exists. The current product models a community thread as a `questions` root row plus `replies`; the fix reuses those tables instead of duplicating them.

## Root cause and pipeline trace

The production Questions/Chat interface previously wrote questions to `localStorage` and replies only to React component state. It displayed a “published” success message without any Supabase insert. Consequently, the row did not exist outside that browser.

The older unused Server Actions had a second incompatible pipeline: they required an authenticated user, inserted `status = 'pending'`, and public loaders selected only `status = 'approved'`. The database also required non-null `author_id`, and INSERT policies required `auth.uid() = author_id`, so anonymous publishing could not work.

The repaired path is:

`/ask/questions` or `/ask/stories` form → Server Action → Supabase INSERT with nullable/owned author → `approved` row → anon/authenticated RLS SELECT → dynamic public loader → rendered public feed. Successful inserts call `revalidatePath()` for only the affected route.

## Privacy and ownership

- Anonymous writers receive `author_id = null`; no user ID is fabricated.
- Authenticated writers receive `author_id = auth.uid()` and may use their own profile nickname.
- Anonymous roles receive only `SELECT, INSERT` on public community tables.
- Authenticated update/delete policies require `auth.uid() = author_id`.
- Profiles, reports, moderation actions, supporter applications, and private reflections were not opened publicly.
- Rejected and removed content stays hidden. No rejected/private rows are bulk-published.
