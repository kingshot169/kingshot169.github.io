# Alliance Activity — admin-only tool

The updated alliance-search Edge Function was deployed before this frontend release. The operator confirmed live access checks: anonymous requests returned 403, an admin without can_search_players returned 403, and an authorised admin returned 200. Timestamp-derived activity remains disabled pending provider format and semantics validation.

## Access and navigation

The homepage Alliance Search card is removed. The Admin Dashboard shows Alliance Activity only when can_search_players is exactly true. Direct navigation to /alliance-search/ initially displays a session check, not a login form or alliance data. It restores the existing Supabase SDK session, verifies admin-profile, and requires matching user ID, active profile, can_search_players=true and must_change_password=false. Missing or denied sessions go through the existing /admin/ route; forced password changes go through /admin/account/?required=1. Failed session checks remain closed and offer retry without global sign-out.

The Edge Function enforces the same permission on every POST before reading an alliance or cache entry and again after retrieval. Anonymous/invalid sessions, inactive profiles and missing permission receive sanitized 403 responses. The old caller-controlled details switch is removed. Cache hits cannot bypass authorization. Existing permissions and other tools are unchanged.

## Compact presentation

Summary: alliance identity, kingdom, leader, reported/returned membership and coverage, provider age, stale warning, conditional recorded-activity windows and snapshot-reported online count. Online coverage explicitly shows the number of known boolean observations. Needs attention and View full roster are collapsed by default; member DOM is rendered only when a section opens. Unknown records are not labelled inactive. Roster search and Copy Player ID remain.

Only names, public governor IDs, alliance rank and authorized activity observations remain in the member contract. Power, kills, town-centre levels, images, internal provider IDs and unnecessary profile fields are absent from the response and page. No activity/contribution scores or history storage are added.

## Activity evidence and limitation

The earlier live 169/KRZ check established 98/98 public roster compatibility and fresh provider data, but it did not retain raw or authorized last_active_at values. The retained sanitised summary says its actual type/format is unavailable. The existing leadership normalizer converts every timestamp to null in unverified mode, so that projection cannot establish the upstream type.

Official MightPulse documentation rechecked at https://api.mightpulse.com/ lists last_active_at and online, but does not define last_active_at type, epoch units, timezone or event semantics. No actual timestamp format was established in this revision. No live admin/member data request or credential-store inspection was performed.

Time-based calculations remain disabled by default; the UI explains that timing is unverified. No secret/configuration was changed. The existing confirmed-format mechanism is retained, with synthetic boundary tests for inclusive 24h, 3-day and 7-day windows. It must not be enabled merely because timestamps look parseable. When disabled, last_active_at remains null, buckets unknown and time-window counts null; strict boolean online snapshot counts remain useful.

## Backend and validation

Local backend: ../kingshot169-backend/supabase/functions/alliance-search/. It is not Git-backed. This revision changes only this feature's index.ts, model.ts and service.ts, its tests and documentation. No SQL, secrets or other Edge Functions change.

Response contract is version 2 with access=admin. Backend authorization must precede frontend publication; the new page rejects the old public response. No rollback to a public contract should be automatic.

Tests cover the 98-member fixture, null/invalid activity, schema minimisation, auth revocation/cache access, timeout/rate behavior, conditional boundaries, direct navigation, dashboard permissions, six languages, themes, RTL and compact collapsed mobile results. Compare and Transfer regression suites are run separately. Real last_active_at semantics remain a provider-verification follow-up, not something mocked tests can prove.
