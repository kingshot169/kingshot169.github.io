# CSS ownership and local review

This refactor is based on frontend commit `69994eb`, including its completed header layout, language/theme preferences and session-loading fixes. No routes, navigation destinations or backend files changed.

## Loading order and ownership

Styled pages load ordinary render-blocking head links in this order:

1. `shared/foundation.css`: only the five identical `:root` tokens (`--bg`, `--panel`, `--text`, `--muted`, `--gold`) and universal border-box sizing extracted from every styled page.
2. `shared/site-preferences.css`: the existing, unchanged header, language controls, direction support and light-theme overrides. Make shared preference/header changes here, without introducing another theme system.
3. The page stylesheet listed below, at the original embedded style block's position. All remaining tokens, selectors, media queries, animations and page-specific layouts stay local. Generic selectors such as `.card`, `button` and `header` are intentionally not consolidated because their declarations differ across tools.

The existing early preference script still runs in the head. Page stylesheet links precede body content and application initialization, preserving initial authentication/loading visibility. Existing asset paths have no version suffixes; the same convention is used here. No CSS contains image/font URLs, `@import` or external fonts, so no URL rebasing was necessary. The CSS files are adjacent to their owning HTML to keep future relative asset references straightforward.

## Route manifest and changed page files

Every row except the redirect changes the listed HTML and adds the listed page stylesheet. Each styled route also loads the two shared files above, using the appropriate `./`, `../` or `../../` prefix.

| Route | HTML | Page stylesheet |
| --- | --- | --- |
| `/` | `index.html` | `home.css` |
| `/admin/` | `admin/index.html` | `admin/dashboard.css` |
| `/admin/account/` | `admin/account/index.html` | `admin/account/account.css` |
| `/admin/audit/` | `admin/audit/index.html` | `admin/audit/audit.css` |
| `/admin/kings-buffs/` | `admin/kings-buffs/index.html` | `admin/kings-buffs/kings-buffs.css` |
| `/admin/player-search/` | `admin/player-search/index.html` | `admin/player-search/player-search.css` |
| `/admin/transfers/` | `admin/transfers/index.html` | `admin/transfers/transfers.css` |
| `/admin/usage/` | `admin/usage/index.html` | `admin/usage/usage.css` |
| `/admin/users/` | `admin/users/index.html` | `admin/users/users.css` |
| `/compare/` | `compare/index.html` | `compare/compare.css` |
| `/gift-codes/` | `gift-codes/index.html` | `gift-codes/gift-codes.css` |
| `/kings-buffs/` | `kings-buffs/index.html` | `kings-buffs/kings-buffs.css` |
| `/rally/` | `rally/index.html` | `rally/rally.css` |
| `/transfer/` | `transfer/index.html` | `transfer/transfer.css` |
| `/transfer/admin/` | `transfer/admin/index.html` (unchanged) | None: existing redirect to `/admin/`; retains only its original preferences CSS link |

Other release files: new `shared/foundation.css`, new `tests/css-visual.cjs`, updated `tests/preferences-browser.cjs`, updated `tests/preferences-static.cjs`, and this document. Together with the 28 HTML/page-CSS files above, the release contains 33 files. The original 34-file local-review inventory also included regenerated `tests/preferences-results.json`; this generated output is deliberately excluded from the release commit. Temporary screenshots and browser profiles are also excluded. Existing `shared/site-preferences.css`, shared JavaScript and translation dictionaries are unchanged.

## Static presentation and deliberate inline exceptions

Static style attributes in page content and generated markup now use descriptive classes at the end of each page stylesheet. Rally's table header classes use `th.class-name` so they retain the old inline widths over the existing mobile `th:nth-child(...)` widths. The Rally return-link class retains its former font-size priority without replacing the shared navigation styling. The shared navigation runtime still moves the existing element and removes inline color as before.

Deliberately retained:

- `style="display:none"` on public King's Buff `#daysWrap`; admin King's Buff `#prepSecurity`, `#prepCodeReveal`, `#prepCodeLegacyNotice`, `#prepCodeManage`, `#prepCodeManageNote`; admin Users `#tempBox`. These are runtime visibility states managed through `.style.display`.
- All existing JavaScript visibility assignments for authentication/loading panels, forms, results, avatars and booking panels, including assignments that clear `style.display` to restore the stylesheet default.
- Admin Usage's generated `.fill` width: a calculated percentage of the daily maximum. The enclosing static grid moved to `.daily-usage-row`.
- Image error handlers that hide failed images in admin Transfers and Player Search.
- Rally's temporary clipboard-fallback textarea position/opacity assignments. The element is created and removed within the existing fallback; this transient behavior was not rewritten.

Inspection found no `[style]` selectors, reads of style attributes, stylesheet DOM manipulation or JavaScript-injected stylesheet blocks in application code. The shared runtime's `navigation.style.removeProperty('color')` and all visibility dependencies remain intact.

## Reproduce validation

Run from the repository root:

```text
node tests/preferences-static.cjs
node tests/preferences-coverage.cjs
node tests/preferences-browser.cjs
```

The static check now verifies that embedded style blocks are absent, every linked stylesheet exists, relative CSS assets resolve and the stylesheet order is correct. The existing browser suite retains its interaction checks and additionally verifies Transfer's required passes, reason and consent constraints before the mocked submission. Admin interaction checks explicitly wait for populated fixture controls/rows; the previous fixed delay could inspect an empty intermediate state after adding stylesheet requests.

Visual capture reuses the exact regression server and mocked API/SDK responses. Set `CSS_SNAPSHOT=before` or `after`, set `CSS_ARTIFACTS` to an absolute output directory, and run `tests/preferences-browser.cjs`. Baseline capture must happen before changing application files. The helper fixes the fixture clock, restores persisted preferences before navigation, waits for loaded data/fonts, captures full-page PNGs and records element geometry/computed presentation. After capture compares every screenshot pixel and recorded element against the baseline, checks loaded stylesheets and fails on any difference. It covers 15 routes in both themes, 1280/375 px widths and French/Arabic labels, plus signed-out homepage/admin views: 136 comparisons.

This machine uses VS Code's Electron runtime with `ELECTRON_RUN_AS_NODE=1` because `node` is not on PATH. Chrome requires execution outside the filesystem sandbox. Screenshots and detailed geometry records are stored locally at `C:\Users\User\AppData\Local\Temp\ks-css-extraction-69994eb\before` and `after`, outside the repository.

Physical devices, native picker appearance and actual browser UI zoom are not tested. The normal regression suite uses simulated CSS zoom at 200%. No production data was written. The user approved publication after the final local visual check; generated artifacts remain outside the release commit.

## Validation results — 2026-09-10

- All 136 before/after full-page PNG comparisons passed with zero changed pixels and identical recorded element geometry/presentation. Both themes, French/Arabic labels, mobile/desktop and guest/restored-session fixtures were compared. None of these 375/1280 px fixtures has horizontal page overflow.
- All linked stylesheets loaded and parsed in Chrome. The static path/order check passed for all 15 routes. No moved CSS image/font references exist.
- The final full mocked frontend suite passed: zero JavaScript exceptions, 240 header layout combinations, responsive language menus/theme controls, persisted preferences, original navigation destinations and placement, zero sampled admin login-form flashes, preserved dashboard cards, Transfer required-field validation and form values, booking selections and updates, populated admin controls, loaded results, and the running focused Rally timer with its header hidden.
- Translation coverage passed for 493 marked/called keys in all five supplementary dictionaries, including placeholder parity. Application/shared script syntax and nested asset checks passed.
- `git diff --check` passed. The only application script differences are static style-to-class substitutions inside generated markup. Authentication, requests, permissions, translations, storage and tool rules are unchanged. All 34 original local-review changes are accounted for above; the release excludes the generated results file.

The comparison initially exposed a Rally mobile specificity mismatch when replacing inline column widths; the final `th.class-name` selectors fixed it and the complete comparison then passed. Existing visual styling, including any pre-existing theme quirks, was intentionally preserved. Sandbox crash-report warnings from the Electron runtime did not prevent the static checks from printing PASS; browser validation completed with the required execution access.
