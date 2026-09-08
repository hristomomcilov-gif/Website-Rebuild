import { StatusLabel } from "@/components/ui/StatusLabel";
import { LABELS, MAP_WRAPPER, TRUST } from "../../content";
import type { PathFixture } from "../../content/types";
import { CardHeader } from "./CardHeader";

export function ControlCard({ path }: { path: PathFixture }) {
  return (
    <article aria-labelledby="card-4-title" className="flex flex-col gap-5">
      <CardHeader index={4} label={MAP_WRAPPER.cardTitles[3]} title={path.card4.title} titleId="card-4-title" />
      <p className="text-sm text-ink-muted">{MAP_WRAPPER.controlDescription}</p>

      <div className="flex flex-col gap-4 md:grid md:grid-cols-2 md:gap-4">
        <section aria-labelledby="control-teamulate" className="flex flex-col gap-3 rounded-lg border border-line bg-panel/60 p-4 motion-safe:animate-rise">
          <h3 id="control-teamulate" className="text-sm font-semibold text-ink">
            {MAP_WRAPPER.card4Sections.teamulate}
          </h3>
          <ul className="flex flex-col gap-2 text-sm text-ink-muted">
            {path.card4.rows.map((row) => (
              <li key={row.teamulate} className="flex items-start gap-2">
                <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-measure" />
                {row.teamulate}
              </li>
            ))}
          </ul>
        </section>

        <p className="text-center text-sm font-medium text-ink md:col-span-2 md:order-last">{MAP_WRAPPER.approvalIsFeature}</p>

        <section
          aria-labelledby="control-human"
          className="flex flex-col gap-3 rounded-lg border border-approval-deep/50 bg-panel/60 p-4 motion-safe:animate-rise"
          style={{ animationDelay: "120ms" }}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 id="control-human" className="text-sm font-semibold text-ink">
              {MAP_WRAPPER.card4Sections.human}
            </h3>
            <StatusLabel tone="approval">{LABELS.requiresApproval}</StatusLabel>
          </div>
          <ul className="flex flex-col gap-2 text-sm text-ink-muted">
            {path.card4.rows.map((row) => (
              <li key={row.human} className="flex items-start gap-2">
                <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-approval" />
                {row.human}
              </li>
            ))}
          </ul>
        </section>
      </div>

      {path.card4.body ? <p className="text-base leading-relaxed text-ink-muted">{path.card4.body}</p> : null}
      <p className="text-sm text-ink-muted">{TRUST.approval}</p>
    </article>
  );
}
