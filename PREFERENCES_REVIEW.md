The documented application-owned translation gaps have been addressed using the shared language system. The current audit covers 493 marked/called messages with no missing keys across Korean, Spanish, Portuguese, French and Arabic. This is a structural and behavioural result, not a claim of linguistic accuracy. Intentional untranslated data, review needs and test limitations are listed below.

The earlier preference-fix pass began with edits to `shared/site-preferences.js` and `shared/site-preferences.css`. This translation-completion pass began with that pass's uncommitted page, shared-asset, test and documentation changes already present. Those changes were preserved. The native selector, language-before-theme ordering, two-row header, storage keys, session-loading behaviour and no-op text-write protection remain in place. No older HTML version was restored; this pass did not change the header CSS or legacy redirect.

Evidence and changes:

- Usage Analytics referenced `../shared/` from `/admin/usage/`, resolving to `/admin/shared/`. It now uses `../../shared/` like the other nested admin pages. All 15 HTML routes load the same shared runtime and local dictionaries.
- The original phrase dictionary mostly covered the homepage. Other pages had few translation keys, and template renderers inserted English after initial translation. Pages now explicitly identify application-owned text and attributes. Renderers use shared text bindings; templates carry translation markers. Names, IDs, codes, notes and other raw values do not enter the phrase translator.
- The old observer watched all text and several attributes. Its boolean guard was restored before asynchronous observer delivery, so it did not itself suppress feedback. The existing no-op write protection helped the homepage. The replacement retains guarded writes, observes only child insertion/removal, processes only marked elements and disconnects while translating. It does not rerender application panels on language changes.
- Preference reads/writes are guarded; `ks-language` and `ks-theme` are preserved. `pageshow` and `storage` restore preferences and selector state. The head runtime applies document language, direction and theme early. The supplementary local dictionary is deferred, with an end-of-body mount and a dictionary-ready event; there is no hidden-page gate waiting for translations. Missing keys fall back to English.
- Header link discovery previously depended on ancestor/href heuristics, while the positioning override covered only `.admin-login`. Each page now identifies its actual existing link with `data-site-nav`; the shared header moves that node beneath the controls. CSS uses normal-flow grid/flex layout, wrapping, theme colors and an explicit static-position rule. It does not create another navigation link. Live Rally mode hides the header.
- Gift-code redemption previously examined the button's English text in `finally`. It now tracks the API success result separately, so translating “Redeemed” does not re-enable redemption. Status option values remain API values, with separate translated display labels. Confirmation text uses the shared dictionary.

The complete changed-file inventory:

| Files | Purpose |
| --- | --- |
| `index.html` | Shared asset loading, explicit header link and application labels; session-dependent Admin/Admin Login preserved |
| `rally/index.html` | Shared loading, editor labels and live HUD label binding; timer state preserved |
| `transfer/index.html` | Shared loading, form labels, placeholders, statuses and messages |
| `kings-buffs/index.html` | Shared loading, booking labels, selection counts, application buttons and displayed statuses |
| `compare/index.html` | Shared loading, static labels and dynamic result-table headings |
| `gift-codes/index.html` | Shared loading, verification/redemption labels and result-based button state |
| `admin/index.html` | Shared loading, session/loading/login labels and generated tool-card markers |
| `admin/account/index.html` | Shared loading, password form and loading/validation messages |
| `admin/audit/index.html` | Shared loading, filters, headings and marked empty/loading states |
| `admin/kings-buffs/index.html` | Shared loading, booking controls, status displays, confirmations and messages |
| `admin/player-search/index.html` | Shared loading, profile/gear headings and marked loading/empty states |
| `admin/transfers/index.html` | Shared loading, filters, application labels and status options/confirmation |
| `admin/usage/index.html` | Correct nested asset paths; shared loading and analytics labels |
| `admin/users/index.html` | Shared loading, account/permission controls and confirmations |
| `transfer/admin/index.html` | Existing legacy redirect retained; shared loading and fallback link marker |
| `shared/site-preferences.js` | Shared storage, translation bindings, header mounting and lifecycle handling |
| `shared/site-preferences.css` | Responsive two-row header, theme styling and RTL isolation |
| `shared/translations.js` | Supplementary local Korean, Spanish, Portuguese, French and Arabic dictionaries |
| `shared/translation-coverage.json` | 493 audited source keys, missing-key results and intentional untranslated-data categories |
| `tests/preferences-static.cjs` | Script syntax, asset paths, single initialization markers and dictionary checks |
| `tests/preferences-coverage.cjs` | Dictionary parity, marked/called keys, named placeholders and explicit untranslated-data inventory |
| `tests/preferences-browser.cjs` | Isolated Chrome/CDP regression checks; all external requests mocked |
| `tests/preferences-results.json` | Detailed browser results and mocked request inventory |
| `PREFERENCES_REVIEW.md` | This review, coverage limits and verification record |

Translation completion:

- Homepage attribution and the complete Transfer journey now bind whole messages, including profile metadata, eligibility feedback, form validation, submission errors and the named thank-you message. The original English eligibility rules and consent text remain the source wording. Submission fields and values are unchanged.
- Public King's Buff registration and availability editing now translate the full instructions, Prep-day/date headings, displayed statuses, selection/completion counts, edit guidance and submitted/updated feedback. Dates use the selected locale with UTC explicitly retained. Existing request status values, editing eligibility and booking payloads remain unchanged.
- Rally summaries, copy previews, named validation errors and live countdown messages use complete message templates. Changing language refreshes only summary text and the copy payload; it does not recalculate the schedule or restart timers. Compare's day counts and Gift Codes' generated metadata/errors are covered too.
- Admin dashboard descriptions, permissions, account errors, profile/gear summaries, counts, audit metadata, appointment controls, security-code feedback and transfer deletion messages now use the shared system. Generated schedule-copy fallback text also refreshes when language changes. API actions and raw data remain separate from display labels.
- Shared helpers support named parameters, nested message parameters, locale-aware UTC dates, plural selection, escaped text/attribute markup and tracked application errors. Native form validity messages are localized without changing required fields or constraints. Unknown API errors are displayed as escaped text, never interpreted as markup or matched against guessed English wording. The inspected frontend contracts provide free-text errors rather than an established structured error-code field; no backend contract was added or changed.
- Translation updates target leaf labels/attributes. Existing form nodes, selected values, active tabs, loaded result nodes and event handlers remain in place. The existing bounded child-insertion observer is retained; no recursive observer or whole-panel translation rerender was introduced.

Remaining gaps and intentionally unchanged content:

- No missing key was found by the 493-key source audit or the populated admin fixtures across all five non-English languages. The static audit covers titles, explicit markers, literal/conditional translation calls, referenced message variables, shared validation keys and selected rendering helpers. It cannot prove that every arbitrary runtime string or future API state has been exercised.
- Player/alliance names and tags, Player IDs, references, contact details, gift/Prep codes, credentials and user-authored notes/reasons remain unchanged. Custom API-provided event/buff labels remain unchanged, so a translated sentence can still contain a label such as `Construction`. Those values are not treated as missing dictionary entries.
- Unknown server messages, audit action names/targets/details, API-provided gear names/qualities/ranking names and other descriptive data remain safely rendered verbatim. Translating these reliably would need a reviewed display-value contract or established error codes. No meaning is guessed from unknown responses.
- Brand names, `VIP`, `VS`, numeric UTC time ranges, coordinates and compact numeric units remain unchanged. Data-only message templates are explicitly identified in the coverage report. Underlying action names, status values and database fields are never translated.
- Fluent-speaker review is still needed in all five non-English languages. Prioritize Transfer consent and eligibility wording; the distinction between requested, assigned, booked, completed and cancelled appointments; King's Buff/MoJ/Town Center/governor-gear terminology; Rally launch instructions; Korean particles around names; Arabic directionality and count-label wording; and Spanish/Portuguese/French singular/plural and regional terminology. Key parity and automated tests do not establish that these translations are idiomatic or semantically perfect.

Browser verification used an isolated headless Chrome profile and a local HTTP server. Every nonlocal page request, including the authentication SDK and API responses, was intercepted. No live applications, bookings, password changes or verification messages were submitted.

Passed checks:

- Spanish preference and selector state across all 15 routes; authenticated nested admin routes; Portuguese reload; Korean Back/Forward restoration.
- 120 header geometry checks: 15 routes × light/dark × 1280/375 px × 100%/200% CSS zoom. No control/navigation overlap or navigation extending outside the viewport. Additional 188 px checks also passed.
- Repeated language changes, selecting the current language, 20 theme toggles and ten mouse/Escape menu cycles; input node/value retained, input focus available, body scrolling not locked, one shared header.
- Delayed booking lookup and code-check mocks; selected slot, active panel, code and player name retained through language/theme changes; selection count translated in place and UTC remained present.
- Mocked Transfer lookup, form completion and submission: field values survived language changes, submitted Player ID/passes/reason were unchanged, thank-you text changed language in the same node, and the application reference stayed verbatim.
- Mocked public booking submission followed by availability editing: selected slots, edit button and booking code survived language changes; the update still used `update_availability` and the original two selected times. Saved feedback translated and UTC labels remained visible.
- Shared application-error and native required-field messages in all five non-English languages; valid input cleared the shared validation error. An unknown API message containing HTML syntax stayed identical and created no HTML children. English, Spanish, Portuguese and French day counts use singular/plural forms; Korean and Arabic use appropriate count wording/labels.
- Delayed kingdom comparison: loaded result-table cell retained and heading updated without another lookup.
- Live Rally: countdown continued while language/theme changed; header hidden and player name retained.
- Generated Rally copy preview changed from Arabic to French without replacing its node or leaving live mode; player names and numeric delays remained unchanged.
- Mocked restored admin session: six permitted tools shown, zero observed login-form flashes during 10 ms sampling; mandatory password change redirected to `/admin/account/?required=1`.
- Mocked successful gift redemption: translated button remained disabled, code and player name equal to `Admin` remained unchanged.
- Populated admin users, transfers, booking requests, audit, usage and player-search fixtures were switched through all five non-English languages. No missing keys were reported; controls, edited selections and event handlers survived. Raw names and API action values stayed unchanged.
- Missing supplementary dictionary: controls and input remained usable; core translations still worked and missing supplementary phrases used English fallback.
- Zero JavaScript exceptions in the final browser run.

Not verified: fluent linguistic accuracy, native browser UI zoom (CSS zoom was used), physical mobile/native picker rendering, screen-reader announcements, every supported language in every public state, every admin failure/Retry/logout/permission combination, all API error variants, real clipboard-denied behaviour, cross-tab storage delivery, and actual browser-storage-denied execution. Native validation checks cover required-field behaviour rather than every browser constraint/popup. Authentication logic itself was not replaced; tests mock the SDK at its boundary. No real applications, booking updates or admin mutations were performed.

Run checks from the frontend repository root with `node tests/preferences-static.cjs`, `node tests/preferences-coverage.cjs` and `node tests/preferences-browser.cjs`. Coverage uses TypeScript's parser: it accepts a local `typescript` installation or `TYPESCRIPT_PATH`, and can discover the bundled Windows VS Code copy. The browser check defaults to the Windows Chrome install path; set `CHROME_PATH` for another installation. It uses local ports 8766 and 9228, writes only mock results and uses a fresh temporary browser profile. It requires Node with built-in WebSocket support. In this workspace, VS Code's Electron executable with `ELECTRON_RUN_AS_NODE=1` supplied that runtime because `node` was not on PATH.

Final validation on 2026-09-10: static syntax/asset checks, 493-key coverage/placeholder checks, the full mocked browser regression suite and `git diff --check` passed. The sandboxed Electron runtime emitted a crash-report registration warning while the static scripts completed and printed PASS; the Chrome regression process exited successfully. An automatic approval-review timeout delayed one final browser launch; the permitted retry succeeded. No commit, push or deployment was performed. Backend files, credentials, authentication settings, booking/transfer rules and proof-of-concept scripts were not modified.
