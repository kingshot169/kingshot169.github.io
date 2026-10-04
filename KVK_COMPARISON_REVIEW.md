# KVK comparison review

The Compare result now leads with the kingdom comparison, followed by the
opponent's returned top ten and expandable hero equipment cards. Mystic Trial
and last-known location use the existing detailed player lookup. Missing or
identity-mismatched values remain unavailable and do not change ranking order.

## Reviewed scope

Integration starts from fetched `origin/main` at
`f00badd98a614a69dcf2f74eb62d749861a75277`. Only the 22 reviewed differences from
the corrected durable candidate were copied:

- `compare/index.html`, `compare/compare.css`, `compare/access.js`, and the new
  `compare/scouting.js`.
- Twelve equipment cutouts in `compare/scouting-assets/cutouts/`.
- Additive KVK strings in `shared/translations.js` for the existing six languages.
- Gear-slot fixtures/test and the scouting browser test, plus narrow existing
  admin/preferences browser harness corrections.

This review document is the additional integration record. Existing admin,
Alliance, Transfer, navigation/session code, shared assets, historical notes,
retained artwork and screenshot galleries were preserved. The dirty original
checkout was not used as an integration target. No backend source, settings,
secrets, SQL, Discord bot or services were changed.

The corrected scouting source has SHA-256
`8425464971ddd90a305ba93b386f2cfba741d5b804b6050ff274822516d347a2`.
All equipment records are considered, including fifth and later entries.
Recognized slots are canonicalized; identical public records count once;
conflicting or ambiguous slots remain unavailable. Unknown records cannot fill
missing slots. Enhancement and mastery remain separate, with explicit red/gold
styling and artwork bound to recognized slot/troop metadata.

Existing guest checks and validated active-admin bypass, including the legacy
superadmin without a Player ID, remain unchanged. Scouting requires the current
Compare access ticket, stops on access revocation, and rejects late responses.
External data uses bounded text rendering and allowlisted portrait origins.

## Supabase evidence

The user confirmed that `kingdom-rankings.zip` was downloaded directly from the
existing `kingdom-rankings` function in the **169 Tools** Supabase project. ZIP
SHA-256:
`49ac29d4dbccf7405d3b362424d4a738b191cbcb5f2d37e3ed305eb53095750e`.
All four downloaded runtime files are byte-identical to the reviewed backend
release. This confirms deployed source correspondence at download time and
supersedes the earlier "undeployed" description. A download timestamp and
deployment revision were not supplied.

One authorized application POST to the website's configured `kingdom-rankings`
endpoint for `{"opponent":203}` completed at `2026-10-04T04:58:22.402Z`:

- HTTP 200 and `ok: true`; all 16 aggregate compatibility checks passed.
- Version 1, kingdom 203, `personal_power`, and 100 returned players with unique
  governor-ID strings, contiguous positions and nonincreasing power.
- Expected website CORS origin, POST/OPTIONS methods and allowed headers.
- `coverage: "unknown"`, `source_timestamp: null`, and `cached: false`.
  `retrieved_at` is retrieval time, not evidence of source-data freshness.

The request used the existing website public `apikey`, a 22-second deadline,
and no retries, redirects, direct upstream calls or per-player follow-ups.
No unchanged function was recreated, repackaged or redeployed. The durable backend
release has an additive latest-verification record; original offline manifests
and their historical evidence remain unchanged.

## Feature-worktree validation

| Check | Result |
| --- | --- |
| Gear-slot fixtures | 16 cases / 32 input orderings passed |
| Static site checks | 16 pages passed |
| Actual backend-entry / website contract | 5 mocked groups passed |
| Compare guest access | 9 browser groups passed |
| Compare admin access | 11 browser groups passed |
| KVK scouting | 7 browser groups passed |
| Transfer | 10 browser groups passed |
| Preferences / navigation | 15 routes, zero browser errors or layout failures |

Browser services were mocked. Browser scouting covered all six languages, dark/light
themes, 320/390/1440 widths, missing values, unsafe external data, duplicate gear
slots, serial detail requests, cache expiry, rate limiting, timeouts and access
cancellation. The mocked backend-entry/website contract separately covered short
results. New logs/screenshots were kept outside the
feature worktree; earlier galleries were retained. Staged whitespace and scope
checks passed before committing this integration.

The existing publishable-key wrapper establishes project request access, not
player/admin identity; this integration does not widen its existing policy.
The single live request verifies rankings compatibility for kingdom 203 at that
time. Detailed player/location/Mystic Trial/gear data and other targets were not
checked live. Short rankings remain incomplete in the website; unknown kingdom
coverage and source freshness are not represented as complete/live data.
The missing historical backend `deno.lock` remains a reproducibility limitation.
