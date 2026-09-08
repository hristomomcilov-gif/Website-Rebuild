# AI Card — Experience Reset v2: Preview Report

**Date:** 8 September 2026
**Source:** `TEAMULATE-AI-CARD-EXPERIENCE-RESET-V2` (Chris) — supersedes the v1 *interaction topology* only. Positioning, approved content, deterministic fixtures, human-control model and no-live-action constraints are unchanged.
**Status:** Preview-only. Built beside the frozen v1 wizard. No deploy, no live copy/navigation/sitemap change, no tracking, forms, HubSpot, model access, voice, crawling or integrations.

---

## 1. What was implemented

An **app-first** AI Card at `/ai-card-app/` (same preview flag, `noindex`, no sitemap or navigation entry). The v1 wizard at `/ai-card/` is untouched and remains the rollback baseline (Reset §10 step 1).

### First viewport (Reset §4) — all five elements before any input

| Requirement | Implementation |
|---|---|
| Active app shell | Sticky header `Teamulate / Your AI Card`, quiet `Guided sample · No private systems connected`; desktop left orientation rail (AI Card, Department, Workflow, Proof, Research) |
| Strategos as active guide | Abstract role mark + `Strategos · Head of Marketing` + state line (`Start with an operating problem` → `Here is a sample operating hypothesis.`) |
| Visible department map at rest | Strategos centre with Scout, Wordsmith, Flow, Nexus present, Metric and Guardian checkpoints below; muted, no motion, no "running" claim |
| One conversational starting point | `What is slowing your marketing down?` + five chips (verbatim from Reset §5) + `Describe the problem in your own words (optional)` |
| Partially visible operating-map rail | Five tiles with one summary each, visible on desktop at 1440×900; on mobile the five card labels sit inside the scene and the tiles follow directly below |

Removed: the separate `Build my AI Card` start screen, the two competing CTAs, the dominant disclosure block, the centred form column, the `1 of 5` progress and all radio inputs.

### Primary flow (Reset §5)

```
app_at_rest → challenge_selected → (activation ≈1.7 s / instant under reduced motion)
  → map_exploration → contextual_refinement (optional, repeatable) → handoff
```

- **One selection → immediate response**: the chip becomes the `Your current challenge` capsule, Strategos gives one controlled hypothesis (the Reset §5 sentence for demand; the Script's approved acknowledgements for the other four chips), the relevant roles activate with one visible `Brief` handoff, Metric/Guardian attach, and Card 1 opens with its takeaway. No spinner, no fake typing.
- **Explore before answering more**: all five cards open in any order; roles open a scripted sheet; `Refine this sample` and the three complete samples are always available; `Edit signal` undoes/changes the challenge without losing other context.
- **Progressive context** (Reset §5 Step E): the four remaining questions never appear as a sequence. They surface (a) in the `Refine this sample` sheet, all optional and clearable, and (b) as one inline optional prompt inside the card where the answer visibly matters (capacity on Bottleneck/90 days; goal on Workflow/90 days; friction on Workflow), each with `Why it matters`.
- **Human authority inside the scene**: `Strategos prepares → Metric checks evidence → Guardian checks quality and policy → Your designated owner approves` sits under the map on every state.

### Engineering (Reset §9)

- New isolated module `src/features/ai-card-app/` reusing v1 fixtures, agents, sheets, card components, `DepartmentMap`, `RestartDialog`, `AiCardHandoff`, `TruthBoundaryDisclosure`, `useReducedMotion`.
- `resolveBasePath()` accepts partial answers: challenge only → documented base fixture (`demand → MSP demand`, `capacity → services coordination`, others → core model); challenge + business type (+ goal when known) → the v1 rule table; agreement with the complete v1 resolver is asserted for every combination.
- `appReducer` implements the Reset §9 state model (`stage`, `answers`, `activePath`, `activeRole`, `activeCard`, plus overlays). Capacity/friction never change the path; the optional description is not representable as a routing input.
- Session-only persistence (`sessionStorage`, key `teamulate.aiCardApp.v2`, versioned/validated); overlays are not restored, the map is.
- Motion: CSS/SVG, stepped timer, `Skip` control, reduced-motion equivalent; no particles, terminal effects, orbiting loops, video or WebGL.

## 2. Files created / changed

```
src/features/ai-card-app/
  content/appCopy.ts
  logic/resolveBasePath.ts(.test)  appStateMachine.ts(.test)  appSession.ts
  components/AiCardApp.tsx(.test)  SceneCanvas.tsx  SceneMap.tsx  ChallengeComposer.tsx
             ContextRail.tsx  OperatingRail.tsx  Refinement.tsx  RoleSheet.tsx  ModalDialog.tsx
src/app/ai-card-app/page.tsx
src/app/page.tsx                    (preview hero CTA now points at /ai-card-app/)
e2e/app-first.spec.ts
docs/qa/screenshots/app-first/*.png (25 images)
```

Untouched: `src/features/ai-card/**`, `src/app/ai-card/page.tsx` (v1 wizard, rollback baseline).

## 3. Tests and checks (2026-09-08)

```
npm run lint / typecheck      → clean
npm run test                  → 8 files, 73 tests (v1: 50; reset: 23)
npm run build:preview         → /, /ai-card/, /ai-card-app/, /_not-found
npx playwright test           → 38 passed (v1 matrix 25; app-first 13)
```

Reset-specific coverage: first-viewport contents and absence of start screen/wizard markers; the §10 first milestone (demand → Scout, Seeker, Flow, Metric, Guardian + Card 1); any-order card access; optional refinement with `Why it matters`; re-routing and clearing; `Edit signal`; role sheets without a composer; description reflected but never routed; refresh restore; restart clears; keyboard path; zero cross-origin requests.

## 4. Review package (Reset §11)

`docs/qa/screenshots/app-first/`

| Item | File(s) |
|---|---|
| Desktop first viewport before / after | `desktop-1440-rest.png`, `desktop-1440-activating.png`, `desktop-1440-after.png`, `desktop-1440-after-full.png` |
| Mobile first viewport before / after | `mobile-390-rest.png`, `mobile-390-activating.png`, `mobile-390-after.png`; also 320, 768, 1024 |
| Reduced motion | `mobile-390-reduced-motion-after.png` |
| 200 % zoom equivalent | `zoom200-720-after.png` |
| Exploration | `desktop-1440-card2.png`, `desktop-1440-card5-with-optional-prompt.png`, `desktop-1440-refine-sheet.png`, `desktop-1440-after-refinement.png`, `mobile-390-card3-inline.png`, `mobile-390-role-sheet-scout.png`, `mobile-390-handoff-dashboard.png` |

Hosted preview: once GitHub Pages is enabled (see `AI_CARD_V1_AUDIT_AND_PLAN.md` §10), `https://hristomomcilov-gif.github.io/Website-Rebuild/ai-card-app/`.

## 5. Performance impact

No new dependency. The route adds one client bundle for the app module; the map is the same inline SVG as v1; no images, fonts or third-party scripts were added. Lighthouse on a hosted preview is still pending (G-03/G-04).

## 6. Known limitations

- **Draft connective copy.** Chip labels, the demand hypothesis, at-rest labels and the "good language" lines are verbatim from Reset v2. Rail labels, refinement titles/"why it matters" lines, tile summaries at rest and the `Sample shown:` line were written for this preview and need Chris's sign-off (see `KNOWN_GAPS_AND_ASSUMPTIONS.md` A-13).
- **Base fixture for three chips is the core model.** `Fragmented marketing`, `Website conversion` and `We cannot see what is working` resolve to the transparent core-model fixture until a business type is given; its Card 1 title reads "Your answers point to more than one possible bottleneck", which is honest but generic after a single tap. Path-specific base fixtures for these chips would be a content decision (D-10).
- **Left rail "Research"** links to the live research page; "Proof" anchors to the Operations & control card. Both are placeholders for Chris's intended information architecture.
- **Two maps on Card 2.** The department card keeps its own map (v1 component) below the scene map; acceptable for preview, could be replaced by role list only.
- Manual assistive-technology pass, real-device test and Lighthouse remain pending.

## 7. Rollback

- Remove the reset only: delete `src/features/ai-card-app/`, `src/app/ai-card-app/`, `e2e/app-first.spec.ts`, `docs/qa/screenshots/app-first/` and point the hero CTA back to `/ai-card/` (`git revert` of the reset commits).
- Exposure: build without `NEXT_PUBLIC_AI_CARD_PREVIEW` — neither route exists.
- v1 wizard is intact and independently reviewable at `/ai-card/`.

## 8. Decisions required from Chris (Reset §13)

| ID | Decision |
|---|---|
| D-10 | Does the first selected challenge feel like entering a marketing department rather than a form? If not clearly yes: iterate on the first viewport/activation before more content. |
| D-11 | Approve or edit the draft connective copy (A-13). |
| D-12 | Base fixtures for `Fragmented marketing`, `Website conversion`, `We cannot see what is working` when no business type is known: keep the core model, or author chip-specific base cards. |
| D-13 | Route: keep `/ai-card-app/` as the preview name, or swap it into `/ai-card/` and move the wizard to a legacy path once approved. |
| D-14 | Left-rail information architecture (`Proof`, `Research` targets). |
| D-15 | Retire the v1 wizard code after the reset is approved, or keep both for A/B on the preview. |
