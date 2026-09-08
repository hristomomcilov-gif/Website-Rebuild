# Website-Rebuild

Teamulate website redesign. This repository currently contains the **preview-only AI Card v1** — a guided, deterministic sample of Teamulate's managed marketing department — built to the AI Card Implementation Brief v1.

The AI Card is **not** an AI assistant: no model call, chat, crawling, voice, CRM access, analytics or external action. All copy and paths are versioned fixtures under `src/features/ai-card/content/`.

## Run

```bash
npm ci
npm run dev:preview     # http://localhost:3000/ai-card/  (flag on)
npm run check           # lint + typecheck + unit/component tests + preview build
npm run serve:out       # serve the static export from out/ on :4173
npm run screenshots     # Playwright flow tests + screenshot matrix → docs/qa/screenshots/
```

The route `/ai-card/` and the homepage "Build my AI Card" CTA exist only when `NEXT_PUBLIC_AI_CARD_PREVIEW=true` at build time. A plain `npm run build` contains neither.

## Documentation

- `docs/AI_CARD_V1_AUDIT_AND_PLAN.md` — audit readout, preview plan, rollback, decisions for Chris
- `docs/CURRENT_STATE_AUDIT.md`, `docs/ROUTE_INVENTORY.md`
- `docs/ARCHITECTURE_DECISIONS.md`
- `docs/IMPLEMENTATION_STATUS.md`, `docs/KNOWN_GAPS_AND_ASSUMPTIONS.md`
- `docs/qa/screenshots/` — responsive and reduced-motion review evidence
