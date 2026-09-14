# Transfer community refinement — local review

Reviewed 14 September 2026. This release combines the original compact Transfer redesign and the approved community refinement.

Screenshots and generated galleries remain local review artifacts and are deliberately excluded from the release. The browser suite generates fresh captures in a temporary directory and prints its path.

## Experience

- Original navy-and-gold group illustration with a welcoming fortress; a deliberate mobile crop keeps all five characters visible. Published headline and strapline remain selectable HTML and update from settings. Start my application and Meet the team use existing section anchors.
- Three benefit cards follow the hero. The first two quote existing published recruitment sentences only while those sentences remain present; future different copy gets honest links to the full message and published contacts. The third describes the existing rally and King's Buffs tools without promising availability or appointments.
- The complete original recruitment message remains expandable, with original language attributes. Contacts precede the event and retain names, alliance tags, roles, manager distinction and copy-player-ID actions. No contact avatar requests were added.
- Compact localized UTC timeline labels preserve exact datetime attributes, with full timestamp titles and accessible labels. Phase highlighting requires a valid, non-future last-confirmed timestamp as well as consistent phase boundaries. Current published settings have no confirmation timestamp: the page displays Schedule unconfirmed and the full active administrator notice, without a countdown. Zero remains distinct from unknown.
- Profile found shows the existing basic lookup data, including an optional returned HTTPS avatar and initials fallback. It makes no ownership, eligibility or acceptance claim. Three-step progress advances on explicit profile confirmation and successful submission. Different Player resets progress; failed submissions retain fields and consent; success retains the reference and next steps.
- Generated optional-contact and no-reserved-place notices appear once near the application. Administrator-written notices remain intact. Public source-language metadata and duplicate step numbering were removed.

## Files changed in this refinement

| File | Purpose |
| --- | --- |
| transfer/index.html | Responsive picture, HTML actions, governor card and application progress hooks |
| transfer/transfer.css | Scoped hero, benefit cards, contact hierarchy, progress and mobile/light-theme styling |
| transfer/overview.js | Public card order, source-derived benefits, compact dates, confirmation-aware phases and safe repeat rendering |
| transfer/application.js | New presentation helpers for progress and optional returned avatar |
| shared/translations.js | Additive labels in English, Korean, Spanish, Portuguese, French and Arabic |
| transfer/assets/community-adventure.webp | Desktop artwork, 1600 × 800, 216,926 bytes |
| transfer/assets/community-adventure-mobile.webp | Mobile artwork, 840 × 630, 124,236 bytes |
| tests/transfer-design-browser.mjs | Updated and expanded mocked browser checks |
| tests/fixtures/transfer-published-settings.json | Read-only public settings fixture for repeatable mocked tests |
| transfer/recruitment.js | Routes the public settings response to the new public overview renderer |

The shared recruitment renderer and styles are unchanged. Both consumers (Transfer and administration previews) were inspected. Transfer's existing recruitment adapter, Compare files and unrelated pending files retain their pre-release bytes. The original redesign is included in the final production files. Its superseded SVG, historical review document and captures remain local. Backend authentication, lookup request payload, application payload, consent requirements and submit endpoint are unchanged. No Supabase settings, secrets, functions, command registration or bot files were modified.

## Validation

All ten browser groups passed in local Chrome 152 through Playwright 1.55.1 / Deno 2.5.6:

1. Published mobile and desktop artwork, copy, UTC labels, contact semantics and anchors.
2. All six languages in both themes at 320, 390 and 1440 pixels; no horizontal overflow and preferences/form-value preservation.
3. Timeline boundaries, upcoming/active/ended states, missing and contradictory dates.
4. Zero and missing capacity, long contact IDs, long translated text and original RTL content.
5. Keyboard expanders, visible focus, safe source/contact links and copy success/failure.
6. Failed artwork and missing/failed settings, with the application still usable.
7. Complete mocked application from another state, consent, fields, reference, optional contact and existing own-state restriction.
8. Actual administration preview, editing controls, keyboard close and unsaved values.
9. Benefit source changes, community/contact/event order, deduplicated notices and hidden implementation metadata.
10. Lookup failure, returned avatar and fallback, accurate progress, submission failure and successful retry with retained input.

Existing preferences-static.cjs passed for 15 pages, JavaScript syntax, nested paths, navigation markers and dictionary loading. git diff --check passed. Reduced-motion behavior is exercised in browser contexts. Screenshots were visually reviewed, including mobile Arabic/light theme and the governor/application states.

Run from the website repository with Deno and Chrome installed:

```powershell
deno run -A tests/preferences-static.cjs
deno run -A tests/transfer-design-browser.mjs
```

The browser suite intercepts every non-local request, including all submissions; it creates no real applications. A read-only public settings snapshot supplies the published fixture. Production end-to-end delivery, real avatar hosts, Safari/Firefox, assistive-technology speech output and human translation review were not validated locally. Native-speaker review of new UI translations remains advisable.

## Artwork provenance

Generated with the available built-in imagegen tool; original 1774 × 887 PNG was resized and WebP-encoded at quality 0.82 using browser canvas. Mobile uses a deliberate right-side 4:3 crop. No date, capacity, eligibility rule, headline or other changing data is baked into artwork. The scene is decorative fantasy illustration, not a depiction of actual State 169 members.

Prompt: Original fantasy production landscape hero, a welcoming mountain fortress at dusk with navy stone towers, golden banners, warmly lit gates and lanterns; five adult fantasy adventurers (knight, ranger, scholar, builder and traveller) with friendly faces and blue/gold clothing sharing a moment along the path. Painterly storybook game-inspired art, warm windows, trees and blue mountains. Wide 2:1 composition with quiet dark blue space in the left 35% for HTML copy; concentrate all five characters and open gate within the right 60% for a mobile crop. No lettering, numbers, logos, watermark or UI. Decorative scene, no real people or recruitment claims.

## Publishing scope

GitHub Pages uses the existing main branch at repository root (legacy branch build); no deployment configuration is changed. The public Git author is Ubersden with the existing configured email. Compare has no player-ID gate in this checkout: button, Enter and URL preset invoke comparison directly. No Compare change is included or claimed. Transfer continues to support applicants from other states.

Release validation must run from a separate exported Git index snapshot so excluded captures and pending files cannot satisfy dependencies. Existing tests/preferences-results.json, .release/, the implementation brief, historical design review and generated galleries are excluded. The checked-in fixture contains only previously published recruitment content, public contact cards and the original unconfirmed event notice; it contains no applications, account credentials or private administration data.

Release validation passed from the exported staged snapshot: all ten Transfer browser groups, the existing 15-page static check and the existing 15-route preferences browser suite (zero browser errors or layout failures). All backend requests in these test suites were intercepted. Staged secret-pattern and whitespace checks passed.
