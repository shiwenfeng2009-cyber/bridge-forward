# Bridge Forward Deployment Checklist

This checklist turns the local MVP into a real first version that students can use.

## 1. Create the Supabase project

1. Go to Supabase and create a new project.
2. In Supabase, open **Project Settings → API**.
3. Copy:
   - Project URL
   - `anon` public key
4. Do **not** put the `service_role` key into the website or Vercel frontend settings.

## 2. Add local environment variables

Create `.env.local` from `.env.example`:

```powershell
Copy-Item .env.example .env.local
```

Then fill:

```text
NEXT_PUBLIC_SUPABASE_URL="https://your-project-ref.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

## 3. Run database migrations

Apply the SQL files in this order from `supabase/migrations`:

1. `202606220001_core_auth.sql`
2. `202606230002_community.sql`
3. `202606250003_reflection_journal.sql`
4. `202606270004_checklist.sql`

You can paste them into the Supabase SQL Editor in order for the first MVP.

## 4. Configure Supabase Auth redirects

In Supabase, open **Authentication → URL Configuration**.

For local testing:

```text
Site URL: http://localhost:3000
Redirect URL: http://localhost:3000/auth/confirm
```

For Vercel production:

```text
Site URL: https://your-vercel-project.vercel.app
Redirect URL: https://your-vercel-project.vercel.app/auth/confirm
```

## 5. Create the first admin account

1. Register normally through the website.
2. Confirm the email if email confirmation is enabled.
3. In Supabase SQL Editor, promote that account to admin:

```sql
update public.profiles
set role = 'admin'
where id = (
  select id
  from auth.users
  where email = 'your-email@example.com'
);
```

Only do this for your own trusted project owner account.

## 6. Local smoke test

Run:

```powershell
pnpm.cmd dev
```

Then test:

- Register with email/password.
- Sign in.
- Submit one question.
- Confirm it appears in the admin queue.
- Approve it as admin.
- Confirm it appears publicly.
- Submit one story.
- Test the Reflection Corner and confirm it is not public.
- Complete one checklist item and refresh the page.

## 7. Deploy on Vercel

1. Import the project into Vercel.
2. Add these environment variables in Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL`
3. Set `NEXT_PUBLIC_SITE_URL` to the production Vercel URL.
4. Deploy.
5. Add the production `/auth/confirm` URL to Supabase Auth redirects.

## 8. First public launch safety pass

Before sharing with students:

- Make sure the admin account works.
- Keep questions and stories moderated.
- Keep Reflection Corner private.
- Do not collect real names, student IDs, private school records, or medical information.
- Keep the Resources page visible.
- If someone may be in immediate danger, direct them to a trusted adult, 988, or emergency services.
