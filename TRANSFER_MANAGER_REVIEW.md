# Transfer Manager — review and rollout

Implementation based on frontend commit `1aedc85fba90cfd17fc76b81a9bfb5a55744d733` and the current adjacent `kingshot169-backend` sources. No commit, push, migration execution, function deployment or production mutation has been performed. The backend folder is not a Git repository; existing backend sources were left intact. The existing modified `tests/preferences-results.json` and user-supplied brief folder were preserved.

## Behavior and ownership

- Admin → Transfers adds **Event & Recruitment**, alongside the mounted Applications view. Filters, loaded records and status handlers remain intact. The editor covers recruitment copy, source language, UTC event/phase starts and event end, group/range/classification, confirmed caps and separate capacity/alliance counts, pass guidance, optional preparedness advice, and up to eight reorderable contact cards. Blank numbers are null; zero is displayed as zero. Text is plain text and the main message has 14 resizable rows and a 10,000-character live count.
- Save Draft does not change published content. Preview uses the same renderer as the public page. Publish is a separate confirmation inside the preview dialog and submits only its saved revision. Save/publish/unpublish return 409 on revision conflicts. Errors retain edits; reload/navigation warns before discarding them. Unpublish removes recruitment information only, without closing applications or in-game transfers.
- The public page displays recruitment → event information → contacts → the existing lookup/application. Source language is identified; custom content is not automatically translated. English copy survives UI language changes. Missing/unavailable settings leave the original form available. A contact/reference reminder is inside the existing success card, which is shown only by the original successful submission flow.
- The existing translator and named parameters handle new UI labels in English, Korean, Spanish, Portuguese, French and Arabic. No preference runtime, observer, theme or header system was replaced. The new scoped `shared/transfer-recruitment.css` loads after preferences and before each existing page stylesheet. The original `site-preferences.js`, foundation CSS and preference CSS are prerequisites, not replacement files.
- No automatic cap/pass eligibility calculation, fixed universal pass cost, seat decrement/reservation, contact gate, Discord login, application-open switch, scraper or game-write integration was added. Existing MightPulse lookup and submission/list/status endpoints are untouched.

## Data contract and security

New table: `public.transfer_recruitment_settings`, singleton `id=1`, integer revision, nullable draft/published JSON and updated timestamp. Initial content is null. No migration seed overwrites existing content, including on rerun.

`transfer-settings`: public GET only; selects only `published`, rebuilds an explicit field allowlist, filters non-public contacts, and omits visibility/internal metadata. No analytics rows are written by GET. There is no public draft endpoint.

`admin-transfer-settings`: GET current draft/revision/publication flag; GET `?suggested=1` for suggested copy; POST `{action, revision, content}` for save and `{action, revision}` for publish/unpublish. Every admin operation verifies the session using Supabase Auth, active status, the existing `can_manage_transfers` permission, and mandatory-password-change status. Possession of an API key grants no admin access.

Writes use the existing salted per-admin rate-limit RPC, 12 attempts/minute, and fail closed if rate limiting is unavailable. JSON is bounded by bytes actually read (128 KiB), not Content-Length alone. Unknown keys, excessive arrays/text, malformed dates, negative/unsafe numbers, invalid IDs and unsafe links are rejected. Source URLs require HTTPS, no credentials/non-default port/fragment/whitespace/backslashes or dot-segment paths. Discord additionally requires `discord.gg/<code>` or `discord.com/invite/<code>`, with no query string. IDs remain decimal strings, including 20-digit IDs. Contact availability must state a timezone. Public contact fields are explicitly chosen by admins, with consent guidance; they are not inferred from admin profiles.

The service-only `manage_transfer_recruitment` RPC locks the existing admin profile while rechecking permission and locks the singleton row for atomic revision comparison. It saves/copies/unpublishes and inserts an audit record in one transaction. Audit contains actor, action, time and revision, not recruitment text/contact IDs. Table access is revoked from PUBLIC/anon/authenticated, RLS is enabled, and service_role receives SELECT only on the new table; mutations go through the restricted RPC with a fixed search_path. No existing application/audit schema or records are replaced.

Both APIs return explicit CORS for `https://kingshot169.github.io` and reject other supplied origins. Local browser tests intercept requests and adapt the test Origin to exercise the handlers, then fulfill local CORS responses; this does not change production CORS. The public API still relies on ordinary platform/ingress protections for GET traffic; it performs one bounded row read and no public rate/analytics writes.

## Suggested content

The supplied recruitment/contact copy and suggested event fields are compiled into the backend-only `_shared/transfer-recruitment-suggested.ts`. **Load suggested wording** requires authorization and confirmation, changes inputs only, and neither saves nor publishes automatically. The original draft files are included separately in the package for leadership review and must not be copied into the public site.

The duplicate headline/strapline at the start of the supplied body was removed from the body because the editor renders those separate fields once. No real contact or Discord invite was supplied, so suggestions leave those empty. Unknown classification/cap/capacity values stay unconfirmed/null.

The September dates/group range came from the supplied brief. Its announcement URL could not be independently retrieved in this environment. The event notice explicitly says to review those values in-game; `details_confirmed_at` remains null. Suggested starts are September 13/16/18 at 00:00 UTC; the supplied inclusive event end is September 19 at 23:59:59 UTC. No future event URLs or image-table values are inferred by an importer.

## Source manifest

Full replacement frontend files:

- `admin/transfers/index.html`
- `admin/transfers/transfers.css`
- `transfer/index.html`
- `shared/translations.js`

New frontend files:

- `admin/transfers/settings.js`
- `transfer/recruitment.js`
- `shared/transfer-recruitment.js`
- `shared/transfer-recruitment.css`

New backend sources (no existing function is replaced):

- `supabase/functions/transfer-settings/index.ts`
- `supabase/functions/admin-transfer-settings/index.ts`
- `supabase/functions/_shared/transfer-settings.ts`
- `supabase/functions/_shared/transfer-recruitment-suggested.ts`
- `migrations/20260910_transfer_recruitment.sql`

Related frontend test/documentation changes:

- `tests/preferences-static.cjs`, `tests/preferences-coverage.cjs`, `tests/preferences-browser.cjs`
- `tests/transfer-settings-fixture.cjs`, `tests/transfer-settings-unit.cjs`, `tests/transfer-settings-browser.cjs`
- `tests/package-transfer-manager.cjs`, `TRANSFER_MANAGER_REVIEW.md`
- `shared/translation-coverage.json` is regenerated test output, excluded from deployment packaging.

The package's `manifest.json` lists exact source paths, destination paths, replacement/new status and SHA-256 hashes. `changes.patch` shows tracked changes plus new source files, including the new backend files. No temporary screenshots, browser profiles, generated regression results, credentials or production data are included. The `validation/` test sources are for the existing workspace and are not website deployment assets.

## Ordered rollout — perform only after review

1. Back up the current frontend files and deployed function sources/configuration. Take an authorized database backup/snapshot using the existing secure process. Record the current admin schema/ACLs and any existing recruitment singleton/revision. Keep backup data outside Git and the public site.
2. Verify the actual target database schema. Historical migrations are not a live schema export. Required objects are `public.admin_profiles` (user_id, is_active, can_manage_transfers, must_change_password), the existing `admin_audit_log` (including its defaults for id/created_at and actor/action/target/details fields), and `check_public_rate_limit(text,text,integer,integer)`. Confirm service-role SELECT on admin profiles and RPC execution for the existing limiter. Original admin/application creation SQL is absent locally.
3. In an isolated PostgreSQL test database with those prerequisites, run the new migration, rerun it and verify content/revision survive. Exercise simultaneous saves/publishes from two sessions, stale revision → 409 through the API, and audit failure → complete rollback. Verify anon/authenticated table/RPC access is denied. These native database tests have not been executed here.
4. Apply **only** `migrations/20260910_transfer_recruitment.sql` in its transaction after backup and prerequisite review. Its dated unique name avoids assuming migration 008 is unused. Do not rerun migrations 001–007. Confirm the existing application tables/statuses are untouched and the new row has null draft/published content on first install.
5. Add the two new functions and both `_shared` dependencies to the current Supabase function source tree. Confirm existing server-only `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` and `RATE_LIMIT_SALT` availability. Do not place a service key/salt in frontend assets or examples. No new secret values are supplied by this package.
6. Deploy only `transfer-settings` and `admin-transfer-settings` using the existing project's reviewed deployment procedure. If using the Supabase CLI with this publishable-key/session architecture, disable gateway legacy JWT verification **for these two functions only** (`supabase functions deploy <function-name> --project-ref <reviewed-project-ref> --no-verify-jwt`). The admin function performs its own `auth.getUser()` and profile checks; do not remove them or change global gateway/auth settings. Function names and shared imports must stay as supplied. No deployment config is bundled or modified.
7. Verify anonymous GET returns `{ok:true,settings:null}`, anonymous/disabled/non-transfer/forced-password users cannot read drafts/suggestions or write, and an authorized transfer admin can read a draft. Use disposable/staging data for write tests; do not change live applications/bookings/permissions for testing.
8. Copy the eight files under `frontend/` to their exact matching paths in the current frontend. These are full replacement files/new files, not standalone old page copies. Retain current shared foundation/preferences/runtime assets and page CSS prerequisites. Deploy the frontend through its normal reviewed process only after backend verification.
9. Leadership may load suggested wording, review dates/caps/contacts/consent in-game, Save Draft, inspect Preview, and explicitly Publish. Leaving everything unpublished keeps the application workflow usable. Publication is website information only.

## Rollback without deleting application data

- While the new admin UI/API is available, an authorized transfer admin can Unpublish using the current revision. If a conflict occurs, reload and review rather than bypass concurrency.
- Restore the backed-up frontend files; remove the four newly introduced frontend assets only after confirming restored HTML no longer references them. Do not overwrite unrelated later changes.
- The two new APIs may be disabled independently after frontend rollback if needed. Retain the new table, saved draft, revision history in audit and RPC until a separately reviewed cleanup. Do not drop/truncate application, settings or audit tables, rerun old migrations, or reset application records.
- For a migration error, its transaction rolls back the new changes. An audit failure during mutation also rolls back the settings mutation. A frontend/API outage does not close applications or game transfers.

## Validation and limits

Commands from the frontend root, with the backend beside it:

```text
node tests/preferences-static.cjs
node tests/preferences-coverage.cjs
node tests/transfer-settings-unit.cjs
```

For the browser runner set `TRANSFER_SETTINGS_TEST=1` to run the focused fixtures. Unset it for the full existing regression suite. Set `PREFERENCES_RESULTS` to an absolute temporary path to avoid overwriting unrelated local generated results. Existing Windows Chrome and Node-with-WebSocket prerequisites remain unchanged. This workspace uses VS Code's Electron executable with `ELECTRON_RUN_AS_NODE=1`; `TYPESCRIPT_PATH` can override the bundled TypeScript discovery.

Passed locally: strict TypeScript checking of the shared handler; real handler/validator execution with mocked Supabase RPCs; streamed body limits; permission/password/CORS/method checks; public allowlist and unknown-vs-zero values; unsafe text/URLs/IDs/dates; draft/published isolation and 409 propagation; authenticated suggestions; rate limits; all 590 marked/called translation keys and placeholder parity; focused browser save/preview/publish/conflict/unpublish and edit preservation; contact limits/reordering/removal; clipboard success/failure and selectable fallback; keyboard focus; 16 French/Arabic × light/dark × desktop/mobile screenshots with no horizontal overflow; and the existing full 15-route regression suite with 240 header layout combinations and zero JavaScript exceptions, including login restoration, form/booking state and Rally timers.

Not executed: native Deno import/runtime checks, actual PostgreSQL migration/RLS/locking/transaction tests, production schema/ACL verification, physical-device tests, native browser UI zoom, or live clipboard/device permissions. Existing 200% tests use CSS zoom simulation. Mocked RPC tests verify API behavior but do not establish PostgreSQL concurrency or audit rollback correctness. Fluent-speaker review remains advisable for new translations. Screenshots are local temporary review artifacts under `C:\Users\User\AppData\Local\Temp\ks-transfer-manager-review`.
