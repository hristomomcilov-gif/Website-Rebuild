# Architecture Decisions — Teamulate Website Rebuild / AI Card v1

**Date:** 8 September 2026
**Status legend:** `Accepted` = applied in this branch and reversible; `Proposed` = applied only in preview and needs Chris's confirmation; `Deferred` = explicitly not done.

Each record follows the same shape: context, decision, alternatives considered, consequences, and how to reverse it.

---

## ADR-001 — Match the live site's stack (Next.js App Router + Tailwind v4 + Inter)

**Status:** Accepted
**Context:** The rebuild repository was empty (see `CURRENT_STATE_AUDIT.md` §1). The live site is Next.js App Router with Tailwind v4 and Inter. The Brief asks to "reuse existing code without a visual or framework rewrite", which cannot be satisfied literally in an empty repository.
**Decision:** Scaffold the rebuild with the same framework family so components, tokens and routes can be ported into the live codebase (or the live site can be migrated here) without a translation layer. Versions: Next.js 16.3.4, React 19.2.8, Tailwind 4.
**Alternatives:** Plain HTML/JS embed (hard to keep copy-as-data typed and testable); Astro/SvelteKit (would create a second framework family).
**Consequences:** `npm run build:preview` produces a static `out/` folder. No server runtime is required.
**Reversal:** Delete the scaffold; nothing outside this repository depends on it.

---

## ADR-002 — Static export (`output: "export"`, `trailingSlash: true`)

**Status:** Accepted
**Context:** The live site uses trailing-slash URLs and is server/static rendered. The AI Card needs no server (deterministic fixtures, no data submission).
**Decision:** Build to plain static files so the preview can be hosted anywhere (any static host, a `/preview/` path, or the existing `/stg/` convention seen in `robots.txt`) and so the entry copy is present in the HTML for crawlers when the route is eventually indexed.
**Alternatives:** Node server (unnecessary attack surface and hosting requirement); ISR (no dynamic data).
**Consequences:** `next/image` optimisation is disabled (`images.unoptimized`); there are no images in the AI Card, only inline SVG.
**Reversal:** Remove `output: "export"` from `next.config.ts`.

---

## ADR-003 — Build-time feature flag `NEXT_PUBLIC_AI_CARD_PREVIEW`

**Status:** Accepted (mechanism) / Proposed (as the long-term flag for the live site)
**Context:** Brief §6 requires reuse of an existing feature-flag mechanism if one exists and forbids introducing a heavy vendor for one page. No mechanism exists in this repository; the live site's mechanism (if any) is unknown.
**Decision:** A single environment variable read once in `src/lib/featureFlags.ts`. When it is not `"true"`:
- `/ai-card/` renders the 404 page (`notFound()` in a server component), and the static export contains no AI Card client bundle for that route;
- the homepage hero omits the "Build my AI Card" CTA.
**Alternatives:** Runtime flag via cookie/query (leaks preview into production bundles); LaunchDarkly-type vendor (disproportionate).
**Consequences:** Turning the Card on for production is a deliberate build with the variable set — it cannot be enabled by a visitor. Turning it off is a rebuild without it.
**Reversal:** Delete the flag module and the two call sites.

---

## ADR-004 — Isolated feature module `src/features/ai-card/`

**Status:** Accepted
**Context:** Brief §5 Q10 asks for the smallest reversible implementation; Brief §8 lists conceptual modules (content config, routing, state, session, UI, analytics dictionary).
**Decision:** Everything Card-specific lives under one folder with three layers:
- `content/` — versioned copy and fixture data (`CONTENT_VERSION = "ai-card-v1"`), typed with string-literal unions;
- `logic/` — `resolveAiCardPath` (pure lookup on enums), `stateMachine` (reducer), `session` (sessionStorage adapter), `analyticsEvents` (typed dictionary + no-op sink);
- `components/` + `hooks/` — UI.
Only two generic primitives live outside (`src/components/ui/*`, `src/lib/featureFlags.ts`).
**Consequences:** `rm -rf src/features/ai-card src/app/ai-card` plus removing one CTA in `src/app/page.tsx` removes the feature entirely.
**Reversal:** As above.

---

## ADR-005 — Deterministic routing is a lookup table, not a scorer

**Status:** Accepted
**Context:** Brief §7.3 / Script §7: three ICP paths plus a transparent fallback; no inference.
**Decision:** `PATH_RULES` matches on the triple (business type, primary challenge, 90-day goal) with allow-sets; anything unmatched resolves to `fragmented_operation`. Capacity and friction never change the path — they are surfaced in "Based on your selections" and used only to pick which extra specialist is highlighted (`resolveDepartment`), again by lookup.
**Alternatives:** Weighted scoring (opaque, harder to explain to a visitor); free-text keyword matching on the optional description (forbidden — optional text must never influence routing).
**Consequences:** Every reachable combination is unit-tested for a valid path; the fallback copy states explicitly that it is a generic sample.
**Reversal:** Not applicable — this is a hard product boundary.

---

## ADR-006 — Reducer state machine with explicit stages

**Status:** Accepted
**Context:** Brief §7.1 lists required experience states; Back must preserve choices, Restart must clear them.
**Decision:** `aiCardReducer` with stages `landing → question(0..4) → optional → assembly → map → card(0..4) → handoff`, plus `RESTORE` (session hydration) and `RESTART`. Transitions are exhaustively unit-tested (20 tests) including illegal transitions being no-ops.
**Consequences:** UI components are thin; behaviour is testable without a browser.
**Reversal:** Not needed.

---

## ADR-007 — Session-only persistence in `sessionStorage`, versioned and validated

**Status:** Accepted
**Context:** Brief §8 "Data handling": optional text must not be persisted beyond the session or sent anywhere.
**Decision:** One key `teamulate.aiCard.v1` holding `{ version, state }`. `loadSession` rejects unknown versions, unknown enum values and malformed JSON (tampering → clean start). No cookies, no `localStorage`, no URL state, no network.
**Alternatives:** URL query state (shareable, therefore leaks answers into logs/analytics referrers); `localStorage` (persists beyond the session).
**Reversal:** Remove the two `useEffect` hooks in `AiCardExperience.tsx`.

---

## ADR-008 — Analytics: typed event dictionary, no transport

**Status:** Accepted (documentation only)
**Context:** Brief §10: analytics plan is documentation/staging only; no new live analytics without consent review.
**Decision:** `analyticsEvents.ts` defines the union type of allowed events and properties (enums only; the free-text description is not representable by type) and exports `noopEventSink`. Nothing in the UI calls a vendor; the Playwright suite asserts that **zero** requests leave the origin during a full flow.
**Reversal:** Delete the module.

---

## ADR-009 — Motion: CSS/SVG only, one cinematic moment, reduced-motion first

**Status:** Accepted
**Context:** Wireframe & Motion Map: "one cinematic moment" (department assembly), 60 fps on mid-range mobile, must not block the flow, static fallback required.
**Decision:** The department map is inline SVG animated with CSS transitions driven by a stepped timer (`DepartmentAssembly.tsx`); no animation library, no canvas/WebGL, no video. `useReducedMotion` defaults to **true** on the server and when `prefers-reduced-motion: reduce`, in which case the finished map is shown immediately with the same textual story. The visual is `dynamic()`-loaded; while it loads, a text summary is rendered, so a failed asset never blocks "View my operating map".
**Alternatives:** Framer Motion / GSAP (bundle weight for one scene); Lottie (binary asset, hard to keep truthful copy in sync).
**Reversal:** Replace `DepartmentAssembly` with the static `DepartmentMap`.

---

## ADR-010 — Native `<dialog>` for agent sheets and restart confirmation

**Status:** Accepted
**Context:** Controlled agent interactions must not be a chat surface; dialogs must be keyboard/screen-reader operable.
**Decision:** Native `<dialog showModal()>` with focus return to the invoking button, Escape to close, no `<textarea>`/`<input>` anywhere in the sheet (asserted by tests). Agent answers are scripted strings from `agentSheets.ts`.
**Reversal:** Not needed.

---

## ADR-011 — Dark "application" surface for the Card, light surface for marketing pages

**Status:** Proposed
**Context:** The live site is predominantly light; the Wireframe & Motion Map specifies a dark, premium application feel for the Card itself ("night-mode operating surface").
**Decision:** `globals.css` carries the live brand tokens (`--tm-*`) plus a dark Card surface built from `--tm-navy-950/900` and the brand violet accent. The preview homepage hero uses the dark band already present on the live site's closing CTA, so the transition into the Card is continuous.
**Risk:** Chris may prefer the Card to inherit the light marketing surface. This is a token change, not a structural one.
**Reversal:** Swap the surface tokens in `globals.css`.

---

## ADR-012 — Preview route `/ai-card/`, `noindex`, absent from navigation and sitemap

**Status:** Proposed (route) / Accepted (preview protections)
**Context:** Brief §6 "Canonical route": build preview-only until Chris approves canonical, navigation and sitemap treatment. Copy Deck proposes `/ai-card/`; Blueprint mentions `/demo/ai-card/`.
**Decision:** Build at `/ai-card/` because it matches the Copy Deck (the more recent, more specific source) and the live trailing-slash convention. Protections: `robots: noindex, nofollow` on the route **and** site-wide in `layout.tsx` for the preview build; no sitemap is generated; no navigation component exists.
**Reversal:** Rename the folder `src/app/ai-card` to change the route; remove the `robots` metadata when a canonical decision is made.

---

## ADR-013 — Testing stack: Vitest + Testing Library for logic/components, Playwright for evidence

**Status:** Accepted
**Context:** Brief §12 requires unit tests for routing/fallback/state transitions, component tests for selections/sheets/truth labels/CTAs, and a responsive screenshot matrix.
**Decision:** Vitest (jsdom) for 50 unit/component tests; Playwright (`channel: "chrome"`) serving the static `out/` folder for 25 flow tests that also write the screenshot matrix into `docs/qa/screenshots/`. Screenshots are committed as review evidence for this preview; they should be moved to CI artifacts once a CI workflow exists (see `KNOWN_GAPS_AND_ASSUMPTIONS.md`).
**Reversal:** Not needed.

---

## ADR-014 — Experience Reset v2: app-first module beside the frozen wizard

**Status:** Accepted (preview)
**Context:** Chris's Reset v2 replaces the form-first topology. Reset §10 requires the wizard to stay as a rollback baseline and the new experience to be previewed independently.
**Decision:** A second isolated module `src/features/ai-card-app/` and route `/ai-card-app/` under the same build-time flag. It imports v1 fixtures, agents, sheets, card components and the SVG map; nothing in `src/features/ai-card/` was modified. The linear reducer is replaced by a stage model with overlays (`appStateMachine.ts`); path resolution accepts partial answers (`resolveBasePath.ts`) and is asserted to agree with the v1 resolver whenever all routing answers exist.
**Alternatives:** Refactor the v1 module in place (breaks the rollback requirement); a runtime toggle between the two experiences on one route (mixes bundles, harder to review).
**Consequences:** Two preview routes until Chris chooses (D-13, D-15); some duplicated shell code that disappears when one is retired.
**Reversal:** Delete the module, the route and the e2e spec; repoint the hero CTA.

---

## Deferred (not decided here — Brief §13)

Live AI chat, voice, URL analysis, crawling/enrichment, lead scoring, accounts/shareable cards, HubSpot handoff, authenticated client mode, agent email identities, client integrations, 3D/game engine. None of these has a stub, hook or placeholder in the code.
