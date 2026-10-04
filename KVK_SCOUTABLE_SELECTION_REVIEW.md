# KVK scoutable selection consumer

Opponent scouting opts into `{"opponent":145,"projection":"scoutable-v1"}` and validates the version-2 response. The backend validates the entire returned power leaderboard, then selects up to ten highest-ranked entries whose public Player IDs are available. This consumer preserves original source positions and power, displays separate source/eligible/skipped counts and explicit partial selections, and never substitutes another identifier.

The report reads “Opponent scouting — up to 10 highest-ranked players with available IDs.” A translated notice counts unavailable-ID entries skipped in the selection prefix. An unavailable ID means only that the public Player ID is unavailable; it does not establish deletion, inactivity or map presence. Kingdom coverage and source freshness remain unknown, and locations remain last known.

Report caches are keyed by projection and kingdom and retain selection metadata. A failed player-detail lookup retains its leaderboard entry and unavailable detail card; other successful cards remain, with no automatic backfill or repeated lookup. Normal comparison, guest checks, active-admin/legacy-superadmin bypass, navigation, gear-slot mapping and red/gold rendering are unchanged. The legacy v1 response validator remains available.

The existing deployed `kingdom-rankings` function supports the explicit opt-in. Consumers omitting projection retain the strict version-1 contract, including safe failure for unavailable-ID boards; no running bot change is required. The upstream request remains bounded at personal_power limit=100. This PR contains frontend code, translations, related tests and this note; no backend source, authentication, secrets, SQL or rate limits are changed.

Validation on the resulting feature branch:

- 31 mocked browser groups: seven retained scouting, four synthetic selection, nine guest access and eleven admin access groups. Includes six languages, both themes, 320/390/1440 layouts, original source ranks, partial/empty reports, failed details, cache behavior, timeouts, rate limits and legacy superadmin without a Player ID.
- Seven mocked actual-backend-entry/website contract groups; all transports replaced with synthetic services.
- Sixteen gear fixtures in 32 input orderings, 16-page static/navigation checks, 622 translation keys and staged whitespace checks.
- One separately authorized live Kingdom 145 application POST passed HTTP 200/version 2: source rows 100, eligible 95, skipped 5, selected 10, original positions 1–10, skipped in selection prefix 0, partial false. The reviewed website validator and CORS checks passed. No live player details, retries, redirects or direct provider requests occurred.

`tests/scoutable-selection-browser.mjs` uses synthetic version-2 responses; it is not a full Kingdom 145 capture. It complements `tests/compare-scouting-browser.mjs` and the unchanged access suites. Browser tests intercept every remote route and use local static servers. Production member data and credentials are not recorded in the tests or this review note. No website merge or deployment has been performed by this change.
