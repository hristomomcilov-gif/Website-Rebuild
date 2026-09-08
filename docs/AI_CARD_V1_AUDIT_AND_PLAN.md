# AI Card v1 — Audit and Plan

**Date:** 8 September 2026
**Required by:** GrokBot / Cursor AI Card Implementation Brief v1 §5 ("one focused document")
**Companion documents:** `CURRENT_STATE_AUDIT.md`, `ROUTE_INVENTORY.md`, `ARCHITECTURE_DECISIONS.md`, `IMPLEMENTATION_STATUS.md`, `KNOWN_GAPS_AND_ASSUMPTIONS.md`

This document is written in the Gate A response format (Brief §5) and then extends it with the preview plan actually executed in this branch so that Chris can review a working artefact and decide on Gate D.

---

## 1. Current stack summary

| Layer | Repository before this work | Live teamulate.ca (observed) | This branch |
|---|---|---|---|
| Framework | none (empty repo) | Next.js App Router (Turbopack chunks) | Next.js 16.3.4, App Router, static export |
| Styling | none | Tailwind CSS v4, `--tm-*` brand tokens | Tailwind v4, same tokens in `globals.css` |
| Typography | none | Inter via `next/font` | Inter via `next/font` |
| Rendering | — | server/static rendered HTML | static HTML for entry copy, client interaction after hydration |
| Client scripts | — | React hydration + 3 plain scripts | React only; no third-party scripts |
| Analytics | — | Google Analytics gtag `G-N9TCF45QX6` | none (typed event dictionary, no-op sink) |
| Feature flags | none | unknown | build-time `NEXT_PUBLIC_AI_CARD_PREVIEW` |
| Tests | none | unknown | Vitest + Testing Library (50), Playwright (25 + screenshot matrix) |
| CI / hosting / preview | none | unknown | none (see G-03) |

## 2. Route inventory relevant to the AI Card

Full table in `ROUTE_INVENTORY.md`. Relevant subset:

- `/ai-card/` — **does not exist live (404)**, not in sitemap. Built here preview-only.
- `/demo/dashboard/` — exists live (200), robots-disallowed, self-labelled demo. Candidate for "Open the sample dashboard".
- `/request-demo/` — exists live (200), HubSpot-backed. Candidate for "Request a live operating review" (link only).
- `/team/` — exists live (200). Candidate for "Meet the full department".
- `/` — live hero CTA "See the team in action" → `/team/`. **Not changed.**

## 3. What already supports the experience

- The live site's framework, token set, pill-button pattern and trailing-slash URL convention — mirrored so the Card can be ported without redesign.
- Existing public destinations for all three Card exits (dashboard, review, team) — no new route or form needs to be invented.
- The five source documents are complete enough to build all copy as data: five questions, three ICP paths + fallback, five cards per path, eleven agent definitions, scripted agent replies, status labels, entry/hand-off copy.
- `robots.txt` already reserves `/preview/` and `/stg/`, which suggests a place to host a non-indexed preview.

## 4. Main gaps, risks and conflicts

Detailed in `KNOWN_GAPS_AND_ASSUMPTIONS.md`. Headlines:

1. **Master PDF specification missing** (G-01) — highest-ranked source not checked.
2. **Live codebase not in this repository** (G-02) — the Card is built in a parallel scaffold, so "reuse existing components" is satisfied only by mirroring.
3. **No hosting/CI** (G-03) — no preview URL; Lighthouse and manual AT passes are pending.
4. **Copy conflict with live homepage** (C-01) — "24/7 / autonomous" on the live site vs Copy Deck guardrails.
5. **Route decision open** (C-02) — `/ai-card/` vs `/demo/ai-card/`.
6. **Destination approval** (G-06/G-07) — `/demo/dashboard/` and `/request-demo/` linked but not formally approved.

## 5. Proposed (and built) smallest preview-only vertical slice

One flagged route, one isolated module, zero backend, zero third parties:

```
NEXT_PUBLIC_AI_CARD_PREVIEW=true
  /            → hero (W00) with "Build my AI Card" → /ai-card/
  /ai-card/    → landing (crawlable) → Q1–Q5 → optional context → assembly → operating map → cards 1–5 → hand-off
flag unset
  /            → hero without the Card CTA
  /ai-card/    → 404
```

Everything is `noindex, nofollow`; no sitemap, navigation, footer or other pages exist.

### 5.1 Experience states implemented (Brief §7.1 ↔ Wireframe)

| State | Component | Notes |
|---|---|---|
| Entry (W00) | `src/app/page.tsx`, `HeroSystemMap` | Preview stand-in for the homepage hero |
| Landing (crawlable) | `WelcomeStep` | Headline, two CTAs, trust disclosure "No private systems connected", "guided sample, not a live audit" |
| Welcome + Q1…Q5 (W01–W02) | `QuestionStep`, `SelectionsPanel` | Strategos welcome shown with Q1; acknowledgement after each answer; "Why are you asking?" disclosure; Back preserves |
| Optional context (W03) | `OptionalContextStep` | Optional, skippable, session-only label |
| Department assembly (W04) | `DepartmentAssembly`, `DepartmentMap` | Stepped SVG choreography; reduced-motion shows the finished map with the same text |
| Operating map + 5 cards (W05–W10) | `OperatingMap`, `cards/*` | Bottleneck → Department → Workflow → Operations & control → First 90 days |
| Controlled agent sheet (W11) | `AgentSheet` | Native dialog, scripted reply only, no composer |
| Dashboard gateway (W12) / Live review (W13) | `AiCardHandoff` | External links only |
| Restart confirmation | `RestartDialog` | Clears `sessionStorage` |
| Explore a sample | `SAMPLE_ANSWERS` → MSP path | Answers labelled "Sample answers" |

### 5.2 Deterministic paths (Brief §7.3)

| Path key | Trigger (business type × challenge × goal) | Fixture |
|---|---|---|
| `msp_demand` | MSP × {demand, backlog, fragmented} × {demand, content/search, positioning, website} | `content/paths/mspDemand.ts` |
| `cybersecurity_trust` | Cybersecurity × {fragmented, demand} × {positioning, demand, content/search} | `content/paths/cybersecurityTrust.ts` |
| `services_coordination` | {Professional, Technical, Other B2B} × {backlog, fragmented, measurement} × {measurement, website, lifecycle, demand, positioning} | `content/paths/servicesCoordination.ts` |
| `fragmented_operation` | everything else (transparent generic sample) | `content/paths/fragmentedOperation.ts` |

## 6. Exact files created / changed

### Scaffold (`ae25ec7`)
`package.json`, `package-lock.json`, `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `postcss.config.mjs`, `vitest.config.mts`, `vitest.setup.ts`, `.gitignore`, `src/app/globals.css`, `src/app/layout.tsx`, `src/app/not-found.tsx`, `src/components/ui/{Button,Disclosure,StatusLabel}.tsx`, `src/lib/featureFlags.ts`

### AI Card feature (`a339360`)
```
src/features/ai-card/
  content/  types.ts  copy.ts  agents.ts  agentSheets.ts  index.ts  content.test.ts
            paths/{mspDemand,cybersecurityTrust,servicesCoordination,fragmentedOperation}.ts
  logic/    resolveAiCardPath.ts(.test)  stateMachine.ts(.test)  session.ts(.test)  analyticsEvents.ts
  hooks/    useReducedMotion.ts
  components/
            AiCardExperience.tsx(.test)  AiCardShell.tsx  WelcomeStep.tsx  QuestionStep.tsx
            SelectionsPanel.tsx  OptionalContextStep.tsx  DepartmentAssembly.tsx  DepartmentMap.tsx
            OperatingMap.tsx  AgentSheet.tsx  RestartDialog.tsx  AiCardHandoff.tsx
            TruthBoundaryDisclosure.tsx  StrategosMark.tsx  HeroSystemMap.tsx
            cards/{CardHeader,BottleneckCard,DepartmentCard,WorkflowCard,ControlCard,NinetyDayCard}.tsx
```

### Routes (`69ecb0f`)
`src/app/ai-card/page.tsx`, `src/app/page.tsx`

### Evidence and documentation (this commit)
`playwright.config.ts`, `e2e/screenshots.spec.ts`, `docs/*.md`, `docs/qa/screenshots/*.png`

**Nothing outside this repository was created or changed.**

## 7. Proposed route / feature-flag approach

- Route: `/ai-card/` (Copy Deck) — preview-only until D-01 is decided. Alternative `/demo/ai-card/` would inherit the live `/demo/` robots disallow for free, at the cost of the Copy Deck's indexable-entry intent.
- Flag: build-time environment variable (ADR-003). For the live codebase: if it already has a flag mechanism, replace the single read in `src/lib/featureFlags.ts`; otherwise the same variable works there.
- Indexing: `noindex, nofollow` on the route; site-wide `noindex` in `layout.tsx` **for the preview build only** — must be removed from `layout.tsx` when the rebuild becomes the production site.
- Sitemap / navigation: none generated, none changed.

## 8. Accessibility and performance risks

| Risk | Status / mitigation |
|---|---|
| Radio-chip groups on mobile need clear selected state for colour-blind users | Native radio indicator + border/fill change + visible "Selected" badge; not colour alone |
| Assembly animation on low-end devices | CSS transitions on ≤ 12 SVG nodes; stepped timer, no rAF loop; reduced-motion path is static |
| Dialog focus trapping | Native `<dialog showModal()>`; focus return asserted in tests |
| Long card copy at 320 px | Fluid type, no fixed heights; 320 px screenshots reviewed |
| Bundle size | No animation library, no icon library, no images; map is code-split. Production bundle numbers should be recorded from the hosted preview |
| Screen-reader narrative of the SVG map | `role="img"` with a full-sentence `aria-label` describing the department, plus a visually-hidden textual assembly summary in `DepartmentAssembly` |
| Pending | Manual AT pass, real-device pass, Lighthouse (G-08, G-04) |

## 9. Analytics and consent impact

- **Zero.** No script, pixel, cookie or request is added. The Playwright suite fails if any request leaves the origin during a complete flow.
- `logic/analyticsEvents.ts` documents the proposed funnel events (`ai_card_started`, `ai_card_question_answered`, `ai_card_assembly_viewed`, `ai_card_card_viewed`, `ai_card_agent_sheet_opened`, `ai_card_completed`, `ai_card_cta_clicked`) with enum-only properties; the optional free-text field is not representable.
- Staging verification plan (when approved): wire `noopEventSink` to the existing GA consent-gated loader on a staging build only; verify in GA DebugView that no property contains free text; confirm consent-denied sessions send nothing.

## 10. Exact preview plan and rollback path

### Run locally
```bash
npm ci
npm run check          # lint + typecheck + 50 unit/component tests + preview build
npm run serve:out      # http://localhost:4173/ and /ai-card/
npm run screenshots    # regenerates docs/qa/screenshots (needs Chrome)
```

### Host a preview (needs D-05)
Upload `out/` to any static host under a non-indexed path (`/preview/…` or `/stg/…` are already disallowed in live `robots.txt`). No server, env or secrets required at runtime.

### Rollback
- Feature: `git revert 69ecb0f a339360` — or delete `src/features/ai-card`, `src/app/ai-card`, `src/lib/featureFlags.ts` and the CTA branch in `src/app/page.tsx`.
- Exposure only: rebuild without `NEXT_PUBLIC_AI_CARD_PREVIEW`.
- No data, vendor, DNS or third-party configuration to unwind.

## 11. Decisions required from Chris

| ID | Decision | Default taken in preview |
|---|---|---|
| D-01 | Canonical route: `/ai-card/`, `/demo/ai-card/` or other; indexable or not; sitemap/navigation treatment | `/ai-card/`, `noindex`, no sitemap, no navigation |
| D-02 | Confirm that building the Gate B preview slice under "execute this project" was in scope (A-01) | Built, flagged, reversible |
| D-03 | Where should the Card live long-term: this rebuild repository, or ported into the live codebase? (G-02) | Isolated module ready to port |
| D-04 | Approve `https://teamulate.ca/demo/dashboard/` as the sample-dashboard destination (G-06) | Linked externally with "sample dashboard" copy |
| D-05 | Hosting for a non-indexed preview so Lighthouse and AT passes can run (G-03) | None |
| D-06 | Card visual surface: dark application surface (as built) or light marketing surface (ADR-011) | Dark |
| D-07 | Human copy sign-off on paths, acknowledgements and agent replies as rendered (they are verbatim from the Script/Copy Deck, adapted only where the Script gives prose) | Tests enforce guardrails |
| D-08 | Provide the master PDF specification for a re-audit (G-01) | Not available |
| D-09 | Whether the live homepage copy conflict (C-01) should be addressed before the Card is ever linked publicly | Recorded only |

After D-01…D-05 the next safest batch is: host the preview, run Lighthouse + manual AT pass, record results in `IMPLEMENTATION_STATUS.md`, then plan Gate D.
