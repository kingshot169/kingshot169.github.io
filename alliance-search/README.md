# Alliance Search publication

This release is public-only. It sends one search to the deployed Supabase `alliance-search` function; the browser never requests the MightPulse alliance API directly. No activity buckets, exact timestamps, per-member online indicators or contribution scores are displayed. Activity-detail controls remain disabled while timestamp semantics are unverified.

The confirmed live compatibility result for 169/KRZ was HTTP 200, 98 reported members, 98 returned members, 100% roster coverage, provider age 96 seconds, and provider fresh=true. Public JSON excluded uid, fid, exact last_active_at and raw online. This was a single snapshot, not a guarantee of future membership or provider freshness.

Null kills display the translated Unavailable label. Null, disallowed and failed avatar images use a decorative placeholder. Coverage and freshness remain visible above the roster. Public responses containing private member activity fields are rejected before entering page result state.

Backend source is preserved in the sibling `kingshot169-backend/supabase/functions/alliance-search/` directory. That backend is deployed but is not Git-backed; this website commit does not deploy or alter it. Backend contract documentation and mocked tests remain there. No SQL, secrets, other Edge Functions or game integrations are changed by this release.

Validation: Alliance backend tests; mocked browser tests for six languages, both themes, mobile layout, safe null rendering, public-only activity behavior and roster interaction; translation coverage; Git whitespace checks. The browser tests store synthetic screenshots in a fresh temporary directory, preserving retained artifacts.

Any future activity release requires explicit semantic verification and a separate access review. Roster coverage describes returned rows versus reported count; it does not prove historical joins or departures.
