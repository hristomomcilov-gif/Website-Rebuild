import { Button } from "@/components/ui/Button";
import { StatusLabel } from "@/components/ui/StatusLabel";
import { ENTRY, LABELS } from "../content";

/**
 * AI Card landing state (Copy Deck §19). The visitor reads the promise and the
 * disclosure before any question is asked; this content is server-rendered so
 * the entry is crawlable.
 */
export function WelcomeStep({ onStart, onExploreSample }: { onStart: () => void; onExploreSample: () => void }) {
  return (
    <section aria-labelledby="entry-heading" className="flex flex-col gap-6 motion-safe:animate-rise">
      <div className="flex flex-col gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-soft">{ENTRY.eyebrow}</p>
        <h1 id="entry-heading" className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
          {ENTRY.h1}
        </h1>
        <p className="max-w-prose text-base leading-relaxed text-ink-muted sm:text-lg">{ENTRY.body}</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button onClick={onStart}>{ENTRY.primaryCta}</Button>
        <Button variant="secondary" onClick={onExploreSample}>
          {ENTRY.secondaryCta}
        </Button>
      </div>

      <div className="flex flex-col gap-3 rounded-lg border border-line bg-panel/60 p-4">
        <div className="flex flex-wrap gap-2">
          <StatusLabel>{LABELS.guidedSample}</StatusLabel>
          <StatusLabel>{LABELS.noPrivateSystems}</StatusLabel>
        </div>
        <p className="text-sm leading-relaxed text-ink-muted">{ENTRY.disclosure}</p>
      </div>
    </section>
  );
}
