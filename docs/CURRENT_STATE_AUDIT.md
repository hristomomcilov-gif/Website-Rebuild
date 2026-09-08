# Current State Audit — Teamulate Website Rebuild

**Date:** 8 September 2026
**Scope:** Gate A audit of the `Website-Rebuild` repository and the live public site (read-only inspection), as required by the GrokBot / Cursor AI Card Implementation Brief v1 §5.
**Method:** Repository inspection (`git log`, file tree), HTTP probes of `https://teamulate.ca` (status codes, `sitemap.xml`, `robots.txt`, served HTML/CSS), and tooling checks in the build environment. No live system was changed.

---

## 1. Repository state (before this work)

| Item | Evidence |
|---|---|
| Repository | `hristomomcilov-gif/Website-Rebuild`, public, default branch `main` |
| History | One commit (`3edc7ee Initial commit`) |
| Contents | `README.md` only ("Website-Rebuild — Teamulate website redesign") |
| Framework / routing / components / styling / tests | **None.** No `package.json`, no source, no CI, no `.cursor/environment.json` |
| Feature-flag mechanism | None |
| Forms / consent / analytics | None |
| Preview / staging / deploy workflow | None configured in the repository (no CI, no hosting config) |

**Conclusion:** the rebuild repository is greenfield. The live public website is *not* in this repository, so "reuse existing components without a rewrite" cannot be satisfied literally; the closest safe equivalent is to match the live site's framework and brand tokens so the AI Card can later be ported or the rebuild can continue here.

---

## 2. Live public site (teamulate.ca) — read-only evidence

### 2.1 Framework and rendering

| Signal | Evidence |
|---|---|
| Framework | Next.js (App Router) — `/_next/static/chunks/…`, `turbopack-*.js` chunk, `__next` markers |
| Styling | Tailwind CSS v4 (`@layer theme`, `--tw-*` variables, `--color-*` theme tokens in the served CSS, ~41 KB) |
| Typography | Inter via `next/font` (`--font-inter`, self-hosted `.woff2`) |
| Rendering | Server/static-rendered HTML: full page copy is present in the HTML response (crawlable) |
| Client-only interactions | Hydrated React components plus two plain scripts: `/js/footer-social.js`, `/js/launch-demo.js`, and `/login-intercept.js` |
| Analytics | Google Analytics gtag loaded from `googletagmanager.com` (`G-N9TCF45QX6`) on the homepage. Consent behaviour was not inspected in depth (no repository access); treat as **existing live analytics that must not be altered** |
| Canonical | `<link rel="canonical" href="https://teamulate.ca/">` on `/` |

### 2.2 Brand tokens (from the live CSS)

```
--tm-navy-950:#0b1631  --tm-navy-900:#10213f  --tm-text:#0b1631  --tm-text-muted:#64748b
--tm-blue-600:#3b6ef5  --tm-violet-600:#5b47f0 (brand button; hover #4a38d8)  --tm-purple-600:#6437f5
--tm-cyan-600:#19a9b8  --tm-green-600:#2da65a  --tm-orange-500:#f49a16  --tm-pink-500:#e3459b  --tm-red-600:#dc2626
--tm-lavender-50:#f5f4fb  --tm-lavender-100:#eceafa  --tm-border:#dbe3f0  --tm-surface:#fff  --tm-surface-muted:#f5f7fc
--tm-radius-sm:8px  --tm-radius-md:14px  --tm-radius-lg:22px  --tm-shadow-card:0 12px 36px #0b163114
```

The live site is predominantly a **light surface** (white / `#f5f7fc`) with navy text; dark navy (`#0b1631`) is used for the closing CTA band. Buttons are pill-shaped (`rounded-full`, `min-h-11`).

### 2.3 Routes, navigation, SEO (see `ROUTE_INVENTORY.md` for the full table)

- `sitemap.xml` lists 19 URLs, all with trailing slashes. `/ai-card/` is **not** present and returns **404**.
- `robots.txt` allows marketing pages and explicitly **disallows** `/preview/`, `/demo/`, `/app/`, `/admin/`, `/api/`, `/login/`, `/stg/` and a list of client demo slugs. Named AI crawlers (`OAI-SearchBot`, `PerplexityBot`) are allowed.
- Existing sample dashboard: `/demo/dashboard/` (HTTP 200, redirected from `/demo/`), labelled in-page as "Demo … Tenant 0 live feed", "Demo tables only". It is disallowed for crawlers but publicly reachable — a valid candidate for the "Explore the sample dashboard" destination, pending Chris's approval.
- Existing conversion destination: `/request-demo/` (HTTP 200). "See the team in action" links to `/team/` in the hero and to `/request-demo/` elsewhere.

### 2.4 Copy observations relevant to the AI Card guardrails

The live homepage currently uses language that the Blueprint / Copy Deck explicitly avoid: "24/7", "Your autonomous marketing department", "Autonomous — Agents run the routine work". This is **not** changed by this work (no live copy change is authorised); it is recorded so the AI Card preview (which follows the Copy Deck language) is not read as inconsistent by reviewers.

### 2.5 Performance baseline

Not measured with Lighthouse in this pass (no browser-based Lighthouse run against production was performed to avoid load on the live site). Observed: server-rendered HTML, self-hosted font, ~41 KB CSS, several JS chunks, one third-party script (gtag). A Lighthouse baseline should be captured before any live change (see `AI_CARD_V1_AUDIT_AND_PLAN.md` §9).

---

## 3. Build environment (this audit)

| Tool | Version |
|---|---|
| Node.js | 22.14.0 (jsdom 30 and undici 8 warn that they prefer ≥ 22.19/22.22; tests run correctly) |
| npm | 10.9.7 |
| Chrome | present at `/usr/local/bin/google-chrome` (used by Playwright via `channel: "chrome"`) |
| Network | npm registry and Google Fonts reachable |

---

## 4. Documents available to this audit

| Source (Brief §2 order) | Available? |
|---|---|
| Chris's explicit written decisions | Not provided beyond the instruction to execute the project |
| `Teamulate_Master_Website_Dashboard_Technical_Specification_BG_v1.1.pdf` | **Not available** in the repository or uploads — see `KNOWN_GAPS_AND_ASSUMPTIONS.md` |
| AI Card Product & Experience Blueprint v1 | Yes |
| AI Card Content & Conversation Script v1 | Yes |
| AI Card Mobile Wireframe & Motion Map v1 | Yes |
| Homepage / AI Card / Team Page Copy Deck v1 | Yes |
| GrokBot / Cursor Implementation Brief v1 | Yes |

---

## 5. Answers to the Brief §5 audit questions

1. **Framework/version/routing/components/styling/tests today:** none in the repository. Live site: Next.js App Router + Tailwind v4 + Inter; test tooling unknown (no repo access).
2. **Routes, navigation, SEO, canonicals, sitemap, redirects:** see `ROUTE_INVENTORY.md`. Live site has canonical tags, a sitemap and `robots.txt` rules; `/demo/` → `/demo/dashboard/` redirect.
3. **Server/static rendering for SEO:** the live site is server-rendered. The rebuild uses Next.js static export so the AI Card entry copy is in the HTML.
4. **Brand tokens, typography, spacing, motion, icons, images:** tokens extracted (§2.2); Inter; pill buttons; no motion utilities observed beyond Tailwind transitions; images are `.webp` under `/agents/`.
5. **Forms, consent, analytics, feature flags:** live site has GA gtag; HubSpot form on `/request-demo/` (not inspected further); no feature-flag mechanism visible. The rebuild introduces a build-time `NEXT_PUBLIC_AI_CARD_PREVIEW` flag only.
6. **Performance baseline:** not captured; see §2.5.
7. **Preview/staging and deploy workflow:** none in this repository; live site's hosting is unknown. `robots.txt` reserves `/preview/` and `/stg/`, suggesting an existing staging convention.
8. **Dashboard/demo routes to link to:** `https://teamulate.ca/demo/dashboard/` (exists, sample-labelled) and `https://teamulate.ca/request-demo/`. Both are external to this repository and require Chris's approval as destinations.
9. **Reusable code without rewrite:** none in-repo. Brand tokens and the pill-button pattern were mirrored.
10. **Smallest reversible implementation:** an isolated `src/features/ai-card/` module, a single flagged route `/ai-card/`, no backend, no analytics transport, static export. Deleting the folder, the route and the flag removes the feature entirely.
