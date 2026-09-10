# Transfer Manager runtime validation status

Production migration and deployment remain unapproved. No migration, deployment,
commit or push was performed during this validation pass.

## Environment discovery

No `docker`, `podman`, `supabase`, `psql`, `deno` or standalone `node` executable
was found on PATH. No Docker/PostgreSQL service was found. `wsl --list --quiet`
reports that Windows Subsystem for Linux is not installed. The backend contains
function sources, but no local Supabase config or configured CLI connection was
found. There is no connected Supabase tool in this session.

The official quickstart requires Docker or a compatible runtime for local
function execution and demonstrates `export default { fetch: ... }`:
https://supabase.com/docs/guides/functions/quickstart
The function entry points were therefore left intact.

## Production metadata verification

`tests/transfer-production-schema-readonly.sql` is prepared but NOT EXECUTED.
It runs in a read-only transaction and returns columns, types, nullability,
defaults, constraints, triggers, table ACL/RLS metadata and all overloads of the
rate-limit RPC, including its declared returned structure. It reads no user or
application records and does not call the mutating rate limiter.

Historical migration 004 declares:
`check_public_rate_limit(text,text,integer,integer)` returning a table with
`allowed boolean`, `request_count integer`, `limit_value integer`,
`reset_at timestamptz`. This is local source evidence, not production proof.
Production column/default and RPC compatibility remain unverified. In particular,
all omitted audit columns must accept defaults/null or be populated by triggers.

## Required isolated tests — NOT RUN

Use a fresh disposable Supabase project with synthetic users and a reviewed
schema-only reproduction of the production prerequisites. Do not link it to
production or copy production records/secrets. Apply only the new migration.

1. Apply the migration, save a draft, apply it again, and compare the complete
   singleton row and audit records to prove reruns preserve content/revision.
2. With separate database connections, race two saves and then a save against
   a publish at the same revision. Require exactly one mutation and one stale
   result; confirm the public snapshot equals the winning reviewed revision.
3. Install an audit-failure trigger only in the disposable database. Attempt
   a mutation, require an error, and compare draft/published/revision/timestamp
   and audit count before and after. Remove that disposable trigger afterward.
4. Exercise real SQL under anon, authenticated and service_role: table reads,
   direct writes and RPC execution. Verify RLS/ACL metadata as well as actual
   denials. service_role may SELECT settings and execute the RPC, but may not
   directly mutate the table. Reject inactive/non-transfer/password-change actors.
5. Run `supabase functions serve` with local-only environment values and the
   existing own-session-verification gateway settings. Test BOTH real endpoints
   through HTTP with anonymous, invalid-session, ordinary authenticated,
   inactive, non-transfer, password-change-required and authorized users.
   Include private suggestions, draft isolation, stale revision, publish,
   unpublish, rate limits and CORS. Use real local Auth/PostgREST/RPC services.

These tests must not be reported as passed based on the existing mocked suite.

## Human/device evidence still required

Dates, kingdom range, classification, caps and ticket guidance need in-game
confirmation. Physical mobile-device testing and native browser 200% zoom are
still outstanding; responsive emulation and CSS zoom are not substitutes.

The existing release ZIP is unchanged by this pass. This status file and the
read-only metadata query are supplemental validation files, not deployment assets.
