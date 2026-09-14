# Website refresh — local review

Design review completed locally on 14 September 2026. The owner approved publication on 15 September 2026. The results and status below record the original design handoff.

Open [the before/after gallery](tests/site-refresh-artifacts/gallery.html) directly in a browser. It groups mobile and desktop captures by route, with additional language, theme, loading, failure, preview and long-name states. The live website is unchanged.

## Baseline and preservation

Checkout: `C:\Users\User\Documents\KStools\kingshot169.github.io`.
Starting and final commit: `5d621de9dec9af635ae3bba8c26b1162ccb04f3f`, branch `main`, upstream `origin/main`. The latest Compare administrator correction was already present.

The [inventory and starting status](tests/site-refresh-artifacts/baseline.json) record 15 HTML URLs: 14 active interfaces and `/transfer/admin/`, a compatibility redirect to `/admin/`. No applicable repository/parent `AGENTS.md` was found.

The [preservation audit](tests/site-refresh-artifacts/preservation.json) compares every tracked file with the starting snapshot. It found no unexpected changes. Transfer's HTML, CSS, application/overview/recruitment scripts, shared recruitment renderer and both WebP files are unchanged. Its 390px and 1440px screenshots are also byte-identical before/after. Its public notice and unconfirmed event schedule remain intact.

Compare's `access.js` and `admin-access.js` are unchanged. The administrator bypass, including active legacy accounts without player IDs, passed the existing mocked authentication suite. This task did not repeat the owner's real authenticated test.

All existing inline application scripts remain identical except the two booking accessibility edits described below. Existing translation rows are unchanged; one scrolling instruction was added in all six languages. Unrelated pending files, including `tests/preferences-results.json`, were preserved. Its SHA-256 remains `09227ac9570aa8f0cc4b537484106686c6eb0a92380e4f0cd4c2ba084856d3b1`.

Original tracked-source backup, outside the checkout:
`C:\Users\User\AppData\Local\Temp\ks169-refresh-before-source-20260914`.
Baseline screenshots were captured before editing. Rally's populated before capture was subsequently regenerated from that saved original source using the same two-rally fixture as the after capture.

## What changed

`shared/modern.css` provides opt-in navy/slate and gold styling under `body.ks-modern`: shared widths, spacing, typography, cards, controls, focus indicators, semantic status colors, tabs, local table scrolling and reduced-motion rules. Page-specific styles retain their layouts and states under route-specific selectors. Transfer does not opt in. No framework, icon package, remote font or runtime dependency was added.

| Route | Improvement |
| --- | --- |
| `/` | Compact community introduction, existing approved responsive artwork, original welcome message and five consistent SVG tool icons/cards. |
| `/rally/` | Clearer inputs, calculated order and timer controls; keyboard-focusable local table scrolling. |
| `/kings-buffs/` | Readable profile without an avatar, stronger slot selection, consistent progress and booking actions. Time slots are native buttons with synchronized `aria-pressed`, enabling Enter/Space through the existing click handler. Booking calculations, selected sets and requests are unchanged. |
| `/compare/` | Clearer access panel and comparison hierarchy; labelled, keyboard-scrollable table regions and translated mobile scrolling guidance. |
| `/gift-codes/` | Consistent verification, code cards, redemption actions and feedback. |
| `/admin/` | Practical sign-in, account status and permission-filtered dashboard cards. |
| `/admin/account/` | Focused password form with consistent fields and primary action. |
| `/admin/audit/` | Readable filters, timestamps and event details. |
| `/admin/kings-buffs/` | Clear status summaries, appointment/request controls and distinct destructive actions; duplicate dashboard link removed. |
| `/admin/player-search/` | Readable long names without avatars, consistent statistics and gear/ranking cards, corrected light-theme gear surfaces. |
| `/admin/transfers/` | Compact mobile application facts, clearer status/actions and consistent draft editor/preview styling. |
| `/admin/usage/` | Responsive summary grid and contained tables. |
| `/admin/users/` | Clearer account, permissions, presets and destructive controls. |

The existing community WebP files are reused by the homepage with reserved dimensions and the mobile variant. Tool names, descriptions, navigation and welcome text remain HTML and readable when images fail. No recruitment claims or event facts were invented.

## Validation actually completed

All browser requests to external services were intercepted. No real application, booking, redemption or administrative mutation was created.

| Check | Result |
| --- | --- |
| `tests/preferences-static.cjs` | PASS: 15 pages, script syntax, nested asset paths, navigation and exact stylesheet order. The order check now explicitly accounts for the opt-in modern stylesheet. |
| `tests/preferences-coverage.cjs` | PASS: 600 marked/called keys across five translated dictionaries plus English; placeholders preserved. |
| `tests/preferences-browser.cjs` | PASS: 15 URLs, zero browser exceptions or header-layout failures; preferences/history, timer continuity, booking submission/edit, mock redemption, admin values/handlers and password redirect. |
| `tests/compare-access-browser.mjs` | PASS: all 9 guest groups, including State 169 approval, denial, malformed values, errors/rate limits/timeouts, expiry, stale responses, keyboard and unrestricted opponents. |
| `tests/compare-admin-browser.mjs` | PASS: all 11 administrator groups, including no player ID, no tool flags, disabled/rejected profiles, mandatory password change, account switching, expiry/sign-out, retry and stale responses. |
| `tests/transfer-design-browser.mjs` | PASS: all 10 groups; published/missing/zero settings, timeline boundaries, contacts, preserved notice, application from another state, consent/reference/success and admin preview. |
| `TRANSFER_SETTINGS_TEST=1` with preferences browser | PASS: editor draft/save/preview/publish/conflict/unpublish using mocked RPCs; safe original copy, keyboard close, unsaved values and API failure. 16 additional fixture screenshots. |
| `tests/transfer-settings-unit.cjs` | PASS: existing strict TypeScript and mocked recruitment validation/permission/revision tests. Backend source was read by the existing fixture, not modified. |
| `tests/site-refresh-browser.mjs` | PASS: 94 after captures; every active route at 390/1440px, every route at 320px in Arabic in both themes, French/light at 390px, and representative initial/loading/error/empty states. Zero page-wide overflow or missing translation reports. |
| `tests/site-refresh-interactions.mjs` | PASS: 7 focused groups covering native slot keyboard access, preserved selections, table keyboard scrolling, timer/copy controls, schedule exports with player IDs and fallback, saved draft previews, long names, missing images and normal-text contrast in both themes. |
| Gallery and preservation | PASS: local screenshot links and route filter; tracked-file audit; unchanged Transfer screenshot bytes. |
| `git diff --check` | PASS. Nothing staged. |

Screenshots were inspected during implementation; this caught and corrected missing-avatar name compression, unreadable slot selection, light gear/preview backgrounds, header alignment and duplicate navigation. Desktop sticky booking actions were also checked in actual viewports for visibility and pointer hit targets.

The gallery contains 34 before, 94 after and 13 focused/viewport screenshots. Machine-readable results are beside the gallery. Existing regression logs/results were written to temporary files, preserving the unrelated pending results file.

The pre-existing `css-visual.cjs` asserts pixel identity for the earlier CSS extraction task. That invariant is not applicable to an intentional redesign; it was left unchanged. This task uses its own before/after captures and actual layout checks.

## Re-running locally

The new browser scripts use the already available Deno/Playwright/Chrome tooling:

```powershell
$env:DENO_DIR = "$env:TEMP\transfer-design-deno-cache"
& "$env:TEMP\player-lookup-deno\deno.exe" run -A tests/site-refresh-browser.mjs
& "$env:TEMP\player-lookup-deno\deno.exe" run -A tests/site-refresh-interactions.mjs
& "$env:TEMP\player-lookup-deno\deno.exe" run -A tests/site-refresh-gallery.mjs
```

Run from the website root, one browser suite at a time when they share ports. `REFRESH_ROUTES` supports a comma-separated subset; default is all active routes. The generator creates a file-friendly gallery with no network dependencies.

Existing Node-based tests ran with VS Code's bundled Node 24 runtime (`ELECTRON_RUN_AS_NODE=1`). `TYPESCRIPT_PATH` pointed at a temporary CommonJS copy of its bundled TypeScript and standard libraries. Direct Deno execution of those VM-based fixtures had compatibility issues; the established Node runtime completed them successfully. Keep `PREFERENCES_RESULTS` pointed outside the existing pending results file when rerunning that suite.

## Limitations and review scope

Validation used local Chrome 152 with emulated widths, keyboard input and reduced-motion preference, not physical iOS/Android devices or a screen reader. Translation coverage is structural and representative visual review, not a native-speaker audit. No production session, service response or deployment was tested or changed. Mocked database tests do not validate PostgreSQL execution. There are no known blocking failures in the completed local checks.

Production changes: 13 HTML files, their 13 page stylesheets, new `shared/modern.css`, one translation row and regenerated translation coverage. Supporting changes: stylesheet-order static check, three new review/test scripts, this document and the local review artifact directory. No new raster assets were needed.

Unrelated work remains: `.release/`, `TRANSFER_DESIGN_REVIEW.md`, `ks169-transfer-manager-implementation-brief/`, existing Transfer artifact directories, `transfer/assets/lantern-citadel.svg` and the pre-existing preferences-results change. Nothing was staged, committed, pushed or deployed.

## Git status at the design handoff

```text
 M admin/account/account.css
 M admin/account/index.html
 M admin/audit/audit.css
 M admin/audit/index.html
 M admin/dashboard.css
 M admin/index.html
 M admin/kings-buffs/index.html
 M admin/kings-buffs/kings-buffs.css
 M admin/player-search/index.html
 M admin/player-search/player-search.css
 M admin/transfers/index.html
 M admin/transfers/transfers.css
 M admin/usage/index.html
 M admin/usage/usage.css
 M admin/users/index.html
 M admin/users/users.css
 M compare/compare.css
 M compare/index.html
 M gift-codes/gift-codes.css
 M gift-codes/index.html
 M home.css
 M index.html
 M kings-buffs/index.html
 M kings-buffs/kings-buffs.css
 M rally/index.html
 M rally/rally.css
 M shared/translation-coverage.json
 M shared/translations.js
 M tests/preferences-results.json
 M tests/preferences-static.cjs
?? .release/
?? TRANSFER_DESIGN_REVIEW.md
?? WEBSITE_REFRESH_REVIEW.md
?? ks169-transfer-manager-implementation-brief/
?? shared/modern.css
?? tests/site-refresh-artifacts/
?? tests/site-refresh-browser.mjs
?? tests/site-refresh-gallery.mjs
?? tests/site-refresh-interactions.mjs
?? tests/transfer-community-artifacts/
?? tests/transfer-design-artifacts/
?? transfer/assets/lantern-citadel.svg
```

## Release preparation — 15 September 2026

The release includes the reviewed application sources and test/documentation files, but excludes screenshot galleries, historical Transfer reviews, superseded artwork and unrelated pending files. Existing gallery/preservation links above refer to local review artifacts and are not included in a fresh checkout. The small committed `tests/fixtures/site-refresh-routes.json` supplies route metadata independently of those artifacts. The published recruitment mock fixture was already tracked.

The browser and gallery scripts now read this committed fixture. A fresh gallery reports absent local captures rather than linking broken images; a first partial capture run does not require a previous results file. These packaging corrections do not change production HTML, CSS, translations or application behavior. The approved visual review is reused.

Release validation runs on an isolated export of the exact staged Git tree with unrelated files excluded. Authentication and write operations remain mocked. Publication and live verification are reported separately after the deployment finishes.
