# Transfer Manager: production release steps

This supersedes the isolated-environment requirement and blanket two-function
JWT-disable instruction in the older review documents. No production actions
have been executed. The reviewed ZIP is retained unchanged.

## Verified locally

Local main and remote main both equal `1aedc85fba90cfd17fc76b81a9bfb5a55744d733`.
All 24 manifest entries match the actual ZIP and current source SHA-256 hashes.
No later committed work needs reconciliation. The adjacent backend is not a
Git repository, so historical backend changes cannot be established through Git.
No application or backend source corrections were needed in this pass.

Passed: 15-page static/assets checks; 590 translation keys and placeholders;
strict TypeScript and mocked handler tests; focused Transfer Manager browser
workflow tests and 16 screenshots; full 15-route browser regression with zero
JavaScript errors and no layout failures; git diff --check.
Electron printed a sandbox crash-reporting warning but all checks exited 0.

Not run: real PostgreSQL migration/rerun/concurrency/audit rollback/role tests,
Supabase functions serve, native Deno execution. Required executables are absent.
These are unavailable checks, not passing tests or observed application failures.
Production schema/defaults, live JWT settings and signing-key compatibility,
in-game values, physical-device behavior and native 200% zoom remain unverified.

## 1. SQL: Dashboard

Open the existing production project in Supabase Dashboard > SQL Editor > New
query. Optionally run `tests/transfer-production-schema-readonly.sql` first to
inspect the actual prerequisites without reading application data.

The ONLY migration to run is the complete existing file:
`C:\Users\User\Documents\KStools\kingshot169-backend\migrations\20260910_transfer_recruitment.sql`.
Read its exact contents with:

```powershell
Get-Content -Raw 'C:\Users\User\Documents\KStools\kingshot169-backend\migrations\20260910_transfer_recruitment.sql'
```

Paste that entire file (including BEGIN and COMMIT) into SQL Editor and Run once.
It creates only the recruitment singleton table and restricted mutation RPC,
starts unpublished, and adds settings audit writes. Do not run migrations 001-007
or use `supabase db push`. If it reports a missing prerequisite, retain the error
and correct the specific schema mismatch; do not replay historical migrations.

## 2. Exact function source paths

Already present beneath `C:\Users\User\Documents\KStools\kingshot169-backend`:

```text
supabase/functions/transfer-settings/index.ts
supabase/functions/admin-transfer-settings/index.ts
supabase/functions/_shared/transfer-settings.ts
supabase/functions/_shared/transfer-recruitment-suggested.ts
```

Keep both shared files server-side and preserve the relative imports. Deploying
the named functions through the CLI bundles these dependencies; do not create
separate deployed functions for the `_shared` files.

## 3. Secrets and JWT settings

Dashboard > Edge Functions > Secrets: retain the existing `RATE_LIMIT_SALT`.
If absent, add that name with a securely generated random value through the
Dashboard secret input. Do not put its value in shell history, source or chat.
`SUPABASE_URL`, `SUPABASE_ANON_KEY` and `SUPABASE_SERVICE_ROLE_KEY` are provided
by the hosted platform; these sources expect the existing legacy keys to remain
available. Do not rotate or copy them into frontend assets. If legacy keys were
disabled, report that actual mismatch before changing the code.

Public `transfer-settings`: disable gateway JWT verification, since the public
page has no user session and sends a publishable key, not a user JWT.
Admin `admin-transfer-settings`: retain gateway JWT verification initially;
the editor sends a real user access token. The handler additionally calls
auth.getUser() and checks active/can_manage_transfers/password-change status.
Its publishable apikey header alone is NOT a reason to disable JWT verification.
The live project configuration is not accessible here, so compatibility is not
yet proven. If a valid session gets a gateway Invalid JWT response, distinguish
it from handler denial and inspect signing-key compatibility. Only then consider
disabling verification for this admin function alone, retaining all handler checks.
No global authentication setting needs changing.

## 4. Deploy only these functions: CLI, no Docker

Use a current standalone Supabase CLI on PATH (not installed on this machine).
Choose the existing project's reference from Dashboard > Project Settings >
General. Commands below require the user's final confirmation first.

```powershell
Set-Location 'C:\Users\User\Documents\KStools\kingshot169-backend'
supabase login
if ($LASTEXITCODE -ne 0) { throw 'Supabase login failed' }
$transferProjectRef = Read-Host 'Existing production project reference'
supabase functions deploy transfer-settings --project-ref $transferProjectRef --use-api --no-verify-jwt
if ($LASTEXITCODE -ne 0) { throw 'Public settings deployment failed' }
supabase functions deploy admin-transfer-settings --project-ref $transferProjectRef --use-api
if ($LASTEXITCODE -ne 0) { throw 'Admin settings deployment failed' }
```

No link, local stack, global config changes or deploy-all command is required.
In Dashboard > Edge Functions, check the two resulting functions and their
per-function JWT settings: public off, admin on. Smoke-test the APIs before
publishing the frontend. Shared imports and export-default fetch remain intact.

## 5. Focused frontend commit and push: PowerShell

The explicit file list excludes tests/preferences-results.json, .release/,
the user brief folder and all backend sources. It includes related tests,
translation coverage metadata and review instructions. No server secrets or
suggested-copy source are staged. Do not run until final confirmation.

```powershell
Set-Location 'C:\Users\User\Documents\KStools\kingshot169.github.io'
git fetch origin
if ($LASTEXITCODE -ne 0) { throw 'Fetch failed' }
if ((git branch --show-current) -ne 'main') { throw 'Expected main' }
if ((git rev-parse HEAD) -ne (git rev-parse origin/main)) { throw 'Review remote changes before continuing' }
if (git diff --cached --name-only) { throw 'Review existing staged changes first' }
$transferFiles = @(
  'admin/transfers/index.html'
  'admin/transfers/transfers.css'
  'admin/transfers/settings.js'
  'transfer/index.html'
  'transfer/recruitment.js'
  'shared/translations.js'
  'shared/transfer-recruitment.js'
  'shared/transfer-recruitment.css'
  'shared/translation-coverage.json'
  'tests/preferences-static.cjs'
  'tests/preferences-coverage.cjs'
  'tests/preferences-browser.cjs'
  'tests/transfer-settings-fixture.cjs'
  'tests/transfer-settings-unit.cjs'
  'tests/transfer-settings-browser.cjs'
  'tests/package-transfer-manager.cjs'
  'tests/transfer-production-schema-readonly.sql'
  'TRANSFER_MANAGER_REVIEW.md'
  'TRANSFER_RUNTIME_VALIDATION.md'
  'TRANSFER_PRODUCTION_STEPS.md'
)
git diff --check
if ($LASTEXITCODE -ne 0) { throw 'Working diff whitespace check failed' }
git add -- $transferFiles
if ($LASTEXITCODE -ne 0) { throw 'Staging failed' }
git diff --cached --check
if ($LASTEXITCODE -ne 0) { throw 'Staged whitespace check failed' }
git diff --cached --stat
git diff --cached
```

Read the complete staged diff before running this separate final block:

```powershell
git commit -m 'Add Transfer Manager recruitment settings'
if ($LASTEXITCODE -ne 0) { throw 'Commit failed' }
git push origin main
if ($LASTEXITCODE -ne 0) { throw 'Push failed; do not force push' }
git status --short
```

The existing modified regression-results file and untracked brief/release folder
should remain afterward. Confirm the corresponding GitHub Pages deployment
finishes before checking the live pages.

## 6. Short live smoke test

1. Restore a valid transfer-admin session; verify anonymous, inactive,
   non-transfer and mandatory-password-change accounts cannot access settings.
2. Open Admin > Transfers > Event & Recruitment; load without losing Applications.
3. Save Draft with harmless review text; public content must stay unchanged.
4. Preview the saved draft; check original-language copy, paragraphs and contacts.
5. Publish from preview; reload public /transfer/ and confirm visible contacts only.
6. Open two admin tabs at the same revision; save in one, then save/publish from
   the stale tab. Expect 409 and preserved edits. Reload to recover.
7. Unpublish; public recruitment disappears while lookup/application remains usable.
8. Submit one clearly identified live test application from an eligible non-169
   player; require a real reference, with contact reminder only after success.
9. Find that application in admin review; change its status and verify persistence.
10. Check both themes on a phone and native browser 200% zoom. Confirm dates,
    kingdom range, classification, caps and ticket guidance in-game before
    publishing real recruitment copy; leave unknown numbers blank.

If a live issue appears, capture only its error/status and fix the specific cause.
Unpublish is the immediate content rollback; it does not delete applications.

References: https://supabase.com/docs/guides/functions/auth
https://supabase.com/docs/guides/functions/secrets
https://supabase.com/docs/reference/cli/supabase-functions-deploy
