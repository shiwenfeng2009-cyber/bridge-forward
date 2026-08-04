# Bridge Forward

Bridge Forward supports students who have recently arrived in the United States with practical guidance, companionship, and direction.

## Local development

This Windows workspace uses the bundled pnpm runtime. In PowerShell:

```powershell
$env:PATH='C:\Users\shiwe\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin;C:\Users\shiwe\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin;' + $env:PATH
pnpm.cmd install --ignore-scripts
pnpm.cmd dev
```

Open [http://localhost:3000](http://localhost:3000). The homepage is implemented in `src/app/page.tsx`.

## Checks

```powershell
pnpm.cmd test
pnpm.cmd lint
pnpm.cmd build
```

## Supabase and deployment

Copy `.env.example` to `.env.local`, fill the Supabase URL and anon key, then run the SQL files in `supabase/migrations` in order.

For the full first-launch checklist, see `docs/deployment-checklist.md`.
