import { Button } from "@/components/ui/Button";
import { HANDOFF, MAP_WRAPPER } from "../../content";
import type { PathFixture } from "../../content/types";
import { CardHeader } from "./CardHeader";

export function NinetyDayCard({
  path,
  onDashboard,
  onReview,
  onRestart,
}: {
  path: PathFixture;
  onDashboard: () => void;
  onReview: () => void;
  onRestart: () => void;
}) {
  return (
    <article aria-labelledby="card-5-title" className="flex flex-col gap-5">
      <CardHeader index={5} label={MAP_WRAPPER.cardTitles[4]} title={path.card5.title} titleId="card-5-title" />
      <p className="text-sm text-ink-muted">{MAP_WRAPPER.ninetyDayDescription}</p>

      <ol className="flex flex-col gap-3" aria-label="90-day windows">
        {path.card5.windows.map((w, i) => (
          <li
            key={w.time}
            className="flex flex-col gap-2 rounded-lg border border-line bg-panel/60 p-4 motion-safe:animate-rise"
            style={{ animationDelay: `${i * 120}ms` }}
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-soft">{w.time}</p>
              <p className="text-base font-semibold text-ink">{w.focus}</p>
            </div>
            <p className="text-sm leading-relaxed text-ink-muted">
              <span className="font-semibold text-ink">Example outputs:</span> {w.outputs}
            </p>
          </li>
        ))}
      </ol>

      <p className="rounded-md border border-line bg-panel/60 px-4 py-3 text-sm leading-relaxed text-ink">{path.card5.footer}</p>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <Button onClick={onDashboard}>{HANDOFF.completion.primaryCta}</Button>
        <Button variant="secondary" onClick={onReview}>
          {HANDOFF.completion.secondaryCta}
        </Button>
        <Button variant="ghost" onClick={onRestart}>
          {HANDOFF.completion.tertiary}
        </Button>
      </div>
    </article>
  );
}
