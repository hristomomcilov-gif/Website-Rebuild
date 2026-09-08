# Route Inventory

**Date:** 8 September 2026
**Purpose:** Record the routes that exist on the live public site, the routes that exist in this rebuild repository, and the AI Card route proposal — so that no route, navigation entry or sitemap change is made implicitly.

---

## 1. Live site (teamulate.ca) — observed, read-only

Source: `https://teamulate.ca/sitemap.xml`, homepage links, and HTTP probes on 2026-09-08. Status codes are from a single probe with a desktop user agent.

| Route | In sitemap | Status | Notes |
|---|:-:|:-:|---|
| `/` | yes | 200 | Homepage; canonical `https://teamulate.ca/` |
| `/autonomous-ai-marketing-department/` | yes | — | Guide |
| `/ai-marketing-team/` | yes | — | Guide |
| `/ai-marketing-automation/` | yes | — | Guide |
| `/workflows/` | yes | — | Workflow library |
| `/research/marketing-team-cost-2026/` | yes | — | Research |
| `/compare/ai-vs-agency-vs-fractional-vs-inhouse/` | yes | — | Comparison |
| `/blog/` (+2 posts) | yes | — | Blog |
| `/how-it-works/` | yes | 200 | Operating model |
| `/team/` | yes | 200 | Department page; hero "See the team in action" target |
| `/dashboard/` | yes | 200 | Dashboard marketing page |
| `/pricing/` | yes | — | Pricing |
| `/security-governance/` | yes | 200 | Governance |
| `/contact/` | yes | — | Contact |
| `/request-demo/` | yes | 200 | Existing HubSpot-backed request flow (not inspected in depth) |
| `/privacy/`, `/terms/` | yes | — | Legal |
| `/demo/` | no | 301 → `/demo/dashboard/` | Redirect |
| `/demo/dashboard/` | no (robots: disallow `/demo/`) | 200 | Interactive sample dashboard; page labels itself as demo / Tenant 0 sample |
| `/app/` | no (robots: disallow) | — | Private app entry |
| `/ai-card/` | no | **404** | Does not exist today |

`robots.txt` also disallows `/preview/`, `/admin/`, `/api/`, `/login/`, `/_retired/`, `/_site-versions/`, `/preview-filled/`, `/stg/` and ~60 client demo slugs.

**Navigation:** live header links observed: Dashboard, How it works, Team, Pricing, Security, Request demo (plus guides/blog in the footer). The Copy Deck's proposed navigation (`Product | How it works | Your department | Industries | Research | Dashboard | Security | Build my AI Card`) is **not** implemented anywhere and is not part of this work.

---

## 2. Rebuild repository — routes in this branch

| Route | Rendering | Flag | Indexing | Notes |
|---|---|---|---|---|
| `/` | Static export | — | `noindex, nofollow` (site-wide in `layout.tsx`) | Preview homepage: hero (W00) only. With the flag **on**, primary CTA "Build my AI Card" → `/ai-card/`, secondary "See the team in action" → live `/team/`. With the flag **off**, only "See the team in action" is rendered |
| `/ai-card/` | Static export; entry copy server-rendered, interaction client-side | `NEXT_PUBLIC_AI_CARD_PREVIEW=true` | `noindex, nofollow`; not in any sitemap (no sitemap is generated) | The AI Card **v1 wizard** — frozen as the rollback baseline after Experience Reset v2. With the flag off the route renders the 404 page |
| `/ai-card-app/` | Static export; shell, Strategos, map, composer and rail server-rendered, interaction client-side | `NEXT_PUBLIC_AI_CARD_PREVIEW=true` | `noindex, nofollow`; no sitemap | The **app-first AI Card** (Experience Reset v2). Preview route name only — see `AI_CARD_V2_RESET_REPORT.md` D-13. Homepage preview CTA points here |
| `/_not-found` (`404.html`) | Static | — | — | Neutral copy |

No sitemap, `robots.txt`, redirects, navigation component or additional pages exist in the rebuild yet.

---

## 3. External destinations used by the AI Card preview

Defined once in `src/features/ai-card/content/copy.ts` (`DESTINATIONS`). All are existing live URLs (HTTP 200 on 2026-09-08). They are **candidates pending Chris's approval**.

| Purpose | Destination | Where used |
|---|---|---|
| Sample dashboard proof | `https://teamulate.ca/demo/dashboard/` | Card 5 primary CTA → W12 gateway "Open the sample dashboard" |
| Live operating review | `https://teamulate.ca/request-demo/` | W13 "Request a live operating review" (link only; no form in the Card) |
| Meet the full department | `https://teamulate.ca/team/` | W12 secondary; homepage secondary CTA |
| How it works | `https://teamulate.ca/how-it-works/` | Reserved in config; not yet linked |
| Research | `https://teamulate.ca/research/marketing-team-cost-2026/` | App-first left rail "Research" (placeholder target, D-14) |

---

## 4. Proposed AI Card route — decision required

| Option | Proposed by | Notes |
|---|---|---|
| `/ai-card/` (built here, preview-only) | Copy Deck §18 | Matches trailing-slash convention. Needs canonical, navigation and sitemap decisions before release |
| `/demo/ai-card/` | Blueprint §9 | Would inherit the live `robots.txt` `/demo/` disallow — useful for a non-indexed preview, but the Copy Deck wants indexable entry copy |
| Modal flow from homepage | Blueprint §0 | Not built; would conflict with the crawlable-entry requirement |

Until Chris decides: the route stays `noindex`, is absent from any sitemap, is not linked from live navigation and is only present in builds with the preview flag.
