# Known Gaps and Assumptions — AI Card v1 (preview-only)

**Date:** 8 September 2026
**Rule applied (Brief §2):** where sources conflict or information is missing, the more restrictive, more truthful option was taken and the item is recorded here rather than decided silently.

---

## A. Gaps (missing inputs or unverified facts)

| ID | Gap | Impact | Mitigation in this branch | Owner / next step |
|---|---|---|---|---|
| G-01 | `Teamulate_Master_Website_Dashboard_Technical_Specification_BG_v1.1.pdf` was not available (not in repository, not in uploads). | The Brief ranks it above all AI Card documents. Route registry, component conventions, dashboard boundaries and consent rules it may define could not be checked. | Only the five available `.md` documents were used. Route, tokens and destinations were verified against the **live site** instead. | Chris to supply the PDF; re-audit `ROUTE_INVENTORY.md`, ADR-011/012 and destinations against it. |
| G-02 | The live website's source code is not in this repository (`Website-Rebuild` was empty). | "Reuse existing components without a rewrite" cannot be verified; forms/consent/analytics/feature-flag mechanisms of the live site are unknown. | Stack, tokens and URL conventions were mirrored from the served site (ADR-001). The Card is an isolated module designed to be ported. | Chris to confirm whether the live codebase should be added here or the Card should be ported there. |
| G-03 | No hosting, CI, preview or deploy workflow exists in the repository. | No preview URL can be provided; Lighthouse on a hosted preview is not possible. | Static `out/` can be served locally (`npm run serve:out`); screenshot matrix committed. | Decide hosting for a non-indexed preview (e.g. the `/preview/` or `/stg/` paths already disallowed in live `robots.txt`). |
| G-04 | Live site performance baseline not captured. | Cannot compare Card performance to the live baseline. | Card bundle is code-split; no third-party scripts. | Capture Lighthouse mobile/desktop for `/` and `/team/` before any live change. |
| G-05 | Live consent behaviour for Google Analytics not inspected. | Unknown whether any future Card analytics could ride on the existing consent state. | Card has no analytics transport (ADR-008). | Consent review before any event is enabled. |
| G-06 | `/demo/dashboard/` safety not fully audited. | It is publicly reachable and labelled as demo/"Tenant 0 live feed" data; whether all its tables are safe to show to prospects is unknown. | Linked only as an external destination from the W12 gateway, with copy stating it is a sample dashboard. | Chris to confirm this is the approved sample destination (D-04). |
| G-07 | `/request-demo/` form and HubSpot flow not inspected in depth. | The live-review hand-off could later be wired to it, but its consent text and fields are unknown. | W13 is a plain link; no form or data submission in the Card. | Audit before any deeper integration. |
| G-08 | No manual assistive-technology pass (VoiceOver, NVDA, TalkBack) and no real-device test yet. | Automated checks cover semantics and keyboard focus but not the lived screen-reader experience. | Native controls and `<dialog>` used throughout; SVG map has `role="img"` with a descriptive `aria-label` and a visually-hidden text summary. | Manual pass on hosted preview (Gate C). |
| G-09 | 200 % zoom was approximated with a 720 css-px viewport, not with real browser zoom. | Font-size-based reflow differences could exist. | Layout uses `rem` units and fluid containers. | Manual zoom check on hosted preview. |
| G-10 | No CI runs the checks yet; screenshots are committed to `docs/qa/screenshots/` (~6 MB). | Repository grows with each regeneration. | Single generation committed for this review. | Move screenshots to CI artifacts once a workflow exists. |

## B. Assumptions made (and how to revisit them)

| ID | Assumption | Basis | If wrong |
|---|---|---|---|
| A-01 | "Execute this project" authorises building the preview slice (Gate B) in addition to the Gate A audit, provided nothing live changes. | User instruction is more specific than the Brief's default; Brief §2 ranks Chris's explicit instruction above the Brief. All changes are flagged and reversible. | Revert `69ecb0f` and `a339360`; the audit documents remain valid. |
| A-02 | English is the only public language for V1. | Copy Deck supplies English production copy; no Bulgarian public copy was provided. | Add a locale layer to `content/`; the content module is already data-only. |
| A-03 | `/ai-card/` is the working route. | Copy Deck §18 (newer/more specific) over Blueprint's `/demo/ai-card/`. Preview-only, `noindex`, no sitemap, no navigation. | Rename `src/app/ai-card` — one folder move. |
| A-04 | The Card uses a dark application surface; the homepage keeps the light marketing surface. | Wireframe & Motion Map specifies a premium dark application feel; live site already uses dark navy for its CTA band. | Token change in `globals.css` (ADR-011). |
| A-05 | Each question offers 5–6 bounded single-select chips taken from the Script's option lists, with no "other" free-text option (the only free text is the separate, optional description step). | Brief §7.2 requires single-select, bounded input; Script §5 lists the options. | Edit `content/copy.ts` `QUESTIONS`; routing sets in `PATH_RULES` are typed and tests will flag any orphaned value. |
| A-06 | Where the Script's routing description is prose (e.g. cybersecurity: "fragmented marketing, unclear positioning, lack of trust or content/search visibility"), it was translated into explicit allow-sets on the challenge and goal enums. | Brief §7.3 requires deterministic mapping; a lookup table is the only way to make prose testable. | Adjust `PATH_RULES`; the exhaustive routing test guarantees totality. |
| A-07 | Capacity and friction never change the path; they only decide which extra specialist is highlighted and appear in "Based on your selections". | Script §7 defines paths by business type/challenge/goal only. | Extend `PATH_RULES` with capacity/friction sets. |
| A-08 | Agents without a scripted reply in Script §12 get **no** interaction chip rather than an invented one. | Brief §11 forbids unapproved copy. | Add approved replies to `agentSheets.ts`. |
| A-09 | The homepage hero (W00) in this repository is a **preview stand-in** to reach the Card, not a proposal to change the live homepage. | Brief §6 "Live hero CTA": do not change the live CTA. | Delete `src/app/page.tsx` hero if the Card is linked from elsewhere. |
| A-10 | The department map is a 2-D orbital SVG (Strategos centre, specialists on an arc, Metric and Guardian anchored) rather than a literal reproduction of the Wireframe's sketch. | Wireframe describes intent and choreography, not pixel geometry. | Adjust constants at the top of `DepartmentMap.tsx`. |
| A-11 | Analytics event names/properties in `analyticsEvents.ts` are a proposal for staging review, not an approved dictionary. | Brief §10. | Edit types; no runtime impact. |
| A-12 | The four external destinations (`/demo/dashboard/`, `/request-demo/`, `/team/`, `/how-it-works/`) point at the **live** domain from the preview build. | They are the only existing, publicly reachable candidates. | Change `DESTINATIONS` in `content/copy.ts`. |

## C. Content and product conflicts recorded (not resolved here)

| ID | Conflict | Sources | Position taken in preview |
|---|---|---|---|
| C-01 | Live homepage says "24/7", "Your autonomous marketing department", "Autonomous — Agents run the routine work"; Copy Deck / Blueprint forbid that language for the Card and new homepage. | Live site vs Copy Deck §3, Blueprint §2 | Card follows the Copy Deck; live copy untouched. Reviewers will see the two side by side until the homepage is rebuilt. |
| C-02 | Route: `/ai-card/` (Copy Deck) vs `/demo/ai-card/` (Blueprint) vs modal (Blueprint §0). | Copy Deck §18, Blueprint §0/§9 | `/ai-card/` preview-only (A-03). |
| C-03 | Sample dashboard label: live page says "Tenant 0 live feed"; Brief forbids "fake live status" in the Card. | Live `/demo/dashboard/` vs Brief §3 | Card copy calls it a "sample dashboard" and never repeats "live feed". The live page itself is out of scope. |
| C-04 | The Copy Deck proposes a new primary navigation including "Build my AI Card"; the Brief forbids navigation changes in V1. | Copy Deck vs Brief §6 | No navigation built. |
| C-05 | Wireframe wants the Card's first screen to open with Strategos' welcome; Copy Deck wants a crawlable entry with a clear headline and two CTAs. | Wireframe W01 vs Copy Deck §18 | Entry screen is the crawlable headline + "Build my AI Card" / "Explore a sample"; Strategos' welcome opens immediately with Question 1 after the tap. |

## D. Explicitly out of scope (Brief §13) — confirmed absent

No LLM/model call, chat composer, voice, URL analysis, crawling, enrichment, lead scoring, accounts, shareable pages, HubSpot handoff, authenticated mode, agent e-mail identities, client integrations or 3-D engine. There are no stubs or feature flags for any of them.
