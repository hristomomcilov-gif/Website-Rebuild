# Implementation Status — AI Card v1 (preview-only)

**Date:** 8 September 2026
**Branch:** `cursor/ai-card-v1-preview-3cc6`
**Gate reached:** Gate A complete; Gate B built as a **preview-only vertical slice** (not deployed, not linked from any live surface); Gate C partially evidenced (screenshot matrix, automated checks). Gate D (live release) **not started** — requires Chris's explicit approval.

> Authorisation note. The Implementation Brief authorises Gate A only by default. The instruction received for this run was to execute the project, which was interpreted as: complete Gate A **and** build the Gate B preview slice so Chris can review a working artefact instead of a plan. Nothing live was touched; every Gate B item remains behind a build-time flag and is reversible in one commit. If this reading is wrong, the Gate B commits (`a339360`, `69ecb0f`) can be reverted and the audit documents stand on their own.

---

## 1. Gate A — audit

| Item | Status | Evidence |
|---|---|---|
| Repository inspected | Done | `CURRENT_STATE_AUDIT.md` §1 — repository was empty |
| Live site inspected (read-only) | Done | `CURRENT_STATE_AUDIT.md` §2, `ROUTE_INVENTORY.md` §1 |
| Ten audit questions answered | Done | `CURRENT_STATE_AUDIT.md` §5 |
| Six required documents | Done | this folder |
| Master PDF specification read | **Blocked** | not available — `KNOWN_GAPS_AND_ASSUMPTIONS.md` G-01 |

## 2. Gate B — preview vertical slice (Brief §12 acceptance criteria)

### Functional

| Criterion | Status | Evidence |
|---|---|---|
| Five-question path completable in ~2 minutes | Done | 5 single-select questions, one tap + Continue each; e2e flow completes in < 10 s automated |
| Three ICP paths + generic fallback resolve deterministically | Done | `resolveAiCardPath.test.ts` (10 tests, incl. exhaustive enumeration of every answer combination: each resolves to one of the four paths, and capacity/friction never change the result) |
| Back preserves choices; Restart clears them | Done | `stateMachine.test.ts`, `session.test.ts`, e2e "back preserves answers; restart clears session" |
| Optional text never required | Done | "Skip" always available; routing ignores the text by type |
| Five cards in order with path content | Done | `OperatingMap.tsx`; e2e per path at 390 px |
| Controlled agent sheets, no free-form chat | Done | `AgentSheet.tsx`; tests assert no textbox in dialog |
| Safe exits: Explore a sample, Back, Start again, dashboard/review links | Done | `WelcomeStep`, `AiCardShell`, `AiCardHandoff` |
| Motion failure does not block the Card | Done | `DepartmentAssembly` is lazy-loaded with a text fallback; "View my operating map" enables on timer completion or immediately under reduced motion |

### Trust and safety

| Criterion | Status | Evidence |
|---|---|---|
| No network call to LLM / crawler / voice / CRM / analytics / email / external action | Done | No fetch/XHR in source; e2e asserts zero cross-origin requests during a full flow |
| No real customer data, credentials, personal data, fake results, fabricated numbers, fake telemetry | Done | `content.test.ts` scans all copy for forbidden phrases and digits-as-metrics patterns; all status labels come from the approved set |
| Every path states it is a guided sample and marks unknowns / validation / approval | Done | `TruthBoundaryDisclosure`, per-card `StatusLabel`s, fallback path copy |
| Optional text not persisted beyond session or sent anywhere | Done | `sessionStorage` only; cleared on restart; not in analytics types |
| No other public copy, pricing, HubSpot, consent, navigation, sitemap or live route changed | Done | This repository contains no live site code; no deployment performed |

### Responsive, accessibility, quality

| Criterion | Status | Evidence |
|---|---|---|
| 320 / 390 / 768 / 1024 / 1440 px | Done | `docs/qa/screenshots/landing-*.png`, card and map shots per width |
| 200 % zoom | Done (approximation) | 720 css-px viewport shot `card2-department-services-zoom200.png`; a real browser-zoom pass by a human reviewer is still recommended |
| Complete keyboard path | Done (automated portions) | Radios/buttons are native controls; Escape closes dialogs and returns focus (asserted). Full manual screen-reader pass **pending** — see `KNOWN_GAPS_AND_ASSUMPTIONS.md` G-08 |
| Reduced-motion path tells the same story | Done | `assembly-reduced-motion-390.png`; textual summary identical |
| Semantic selection states | Done | Native `<input type="radio">` inside `fieldset`/`legend` and a labelled `radiogroup`; Continue is `disabled`/`aria-disabled` until a choice exists |
| No essential truncation on small screens | Done | 320 px shots reviewed; no `text-overflow: ellipsis` on copy |
| Assembly visual static/failure fallback | Done | ADR-009 |
| Initial page usable while visuals load | Done | Entry copy is static HTML; SVG map is code-split |

### Testing and review evidence

| Criterion | Status | Evidence |
|---|---|---|
| Unit tests for route mapping/fallback and Back/Restart transitions | Done | 36 tests in `logic/` |
| Component tests for selection, sheets, truth labels, CTA destinations | Done | `AiCardExperience.test.tsx` (9) + `content.test.ts` (5) |
| Lint / type / build / test pass | Done | `npm run check` — see §4 |
| Responsive screenshots for MSP, cyber, services, reduced motion | Done | `docs/qa/screenshots/` (42 images) |
| Preview route, changed files, limitations, analytics impact, rollback documented | Done | `AI_CARD_V1_AUDIT_AND_PLAN.md` |
| `IMPLEMENTATION_STATUS.md` updated | Done | this file |

## 3. Gate C — QA hardening

| Item | Status |
|---|---|
| Automated screenshot matrix | Done |
| Content fidelity review against Script/Copy Deck | Done by tests for forbidden phrases and label set; **human copy sign-off pending** |
| Manual screen-reader pass (VoiceOver / NVDA) | Pending |
| Lighthouse on hosted preview (mobile + desktop) | Pending — no hosted preview exists yet |
| Real-device check (iOS Safari, Android Chrome) | Pending |

## 4. Verification run (this branch, 2026-09-08)

```
npm run lint        → 0 errors, 0 warnings
npm run typecheck   → 0 errors
npm run test        → 5 files, 50 tests passed (Vitest 5, jsdom)
npm run build:preview → static export: /, /ai-card/, /_not-found
npm run build       → static export without the flag: /ai-card/ absent (renders 404)
npm run screenshots → 25 Playwright tests passed; 42 PNGs written to docs/qa/screenshots/
```

## 5. What is *not* implemented (by design)

- No deployment, hosting configuration, CI workflow or preview URL (none exists in this repository; see G-03).
- No navigation, footer, sitemap, `robots.txt` or any marketing page beyond the homepage hero (W00) used as the Card entry point. The Copy Deck's full homepage and Team page are **out of scope** for the AI Card slice.
- No form, HubSpot, consent banner, analytics transport or cookies.
- No Bulgarian or other localisation; all copy is English per the Copy Deck.
- Nothing from Brief §13 (deferred list).

## 6. Rollback

- Whole feature: `git revert 69ecb0f a339360` (route + feature), or delete `src/features/ai-card`, `src/app/ai-card`, `src/lib/featureFlags.ts` and the CTA branch in `src/app/page.tsx`.
- Preview-only exposure: build without `NEXT_PUBLIC_AI_CARD_PREVIEW` — the route and CTA disappear from the output.
- No data, schema, vendor or third-party configuration to unwind.

## 7. Next safest batch (proposed)

1. Chris reviews the screenshots and the running preview (`npm ci && npm run build:preview && npm run serve:out`).
2. Decisions D-01…D-08 in `AI_CARD_V1_AUDIT_AND_PLAN.md` §11.
3. Host the static `out/` on a non-indexed preview path; run Lighthouse and a manual assistive-technology pass; record results here.
4. Only then: port into (or merge with) the live site codebase and plan Gate D.
