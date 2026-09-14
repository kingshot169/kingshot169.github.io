# Kingdom Compare access check

This is a lightweight frontend barrier for State 169 visitors, not verification of account ownership or backend authentication. It is scoped to Compare; Transfer and its published community design are unchanged.

## Behaviour and contract

The visitor supplies a trimmed 4–20 digit player ID, preserved as a string. The existing public configuration and basic player-lookup endpoint are reused with the same apikey and Bearer headers used by Transfer. Only {player_id} is sent; there is no detailed lookup or backend change.

A successful response must have ok === true, a player object, a matching string player_id, a nonempty string name, and kingdom equal to numeric 169 or exact string "169". Other states, absent values and coercible but malformed values do not unlock access. Returned names are rendered as text. Inline messages distinguish rate limits, 10-second timeouts, lookup failure and unconfirmed information. There are no automatic retries or per-keystroke requests.

A successful lookup shows name, ID and state. Continue to Compare grants access; Different Player resets it. Button, Enter and direct comparison calls all require a current approval. URL presets only populate the opponent input. Existing comparison payloads, formatting, tables and calculations remain intact, and other opponent kingdoms are permitted.

The approval stores only the checked ID, name, state and fixed timestamps in sessionStorage, for at most 30 minutes from lookup. Reloads do not extend expiry. Unavailable storage falls back to page memory. Expiry, player changes, focus and restored-page checks invalidate stale approvals; previous results are cleared. Lookup submissions are deduplicated. Input changes cancel requests and invalidate stale responses. Comparison responses are also discarded after approval changes.

## Files and tests

- compare/index.html, compare/access.js and compare/compare.css: gate, request guard and scoped presentation.
- shared/translations.js: additive labels in English, Korean, Spanish, Portuguese, French and Arabic.
- tests/compare-access-browser.mjs: nine focused mocked groups covering strict response types, 20-digit IDs, failures/rate limits/timeouts, stale responses, duplicate requests, expiry/storage fallback, guarded comparison, keyboard access and 320/390/1440 layouts in both themes.
- tests/preferences-browser.cjs: existing comparison test now completes the mocked access step and requires populated results before testing translation.

Run from the website root with Deno and Chrome installed:

    deno run -A tests/preferences-static.cjs
    deno run -A tests/compare-access-browser.mjs
    deno run -A tests/transfer-design-browser.mjs
    deno run -A tests/preferences-browser.cjs

Browser suites intercept remote API requests. The Compare suite writes screenshots/results to a temporary directory and prints its path; no generated captures are released. Release validation uses an exported staged snapshot, independent of unrelated pending files. No real lookup or transfer submission is needed for automated production verification.

The existing main-branch/root GitHub Pages publishing process and configured Ubersden identity are retained. Supabase, the Discord bot, unrelated pending files and Transfer production files are outside this change. Native-speaker translation review, physical devices and Safari/Firefox are not claimed by the local Chrome checks.

Release validation passed from the isolated staged snapshot: nine Compare groups, ten Transfer groups, the 15-page static check and 15-route preferences browser suite (zero browser errors/layout failures). Whitespace, explicit seven-file scope and credential-pattern checks passed. Published Transfer files have no diff.
