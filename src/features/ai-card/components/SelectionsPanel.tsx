import { StatusLabel } from "@/components/ui/StatusLabel";
import { LABELS, OPTIONAL_CONTEXT, QUESTIONS } from "../content";
import type { AiCardAnswers } from "../content/types";

/**
 * "Based on your selections" — every answer that produced the output stays
 * visible so the visitor can understand why the Card appeared
 * (Implementation Brief §7.3).
 */
export function SelectionsPanel({
  answers,
  optionalContext,
  isSample,
  className = "",
}: {
  answers: AiCardAnswers;
  optionalContext: string;
  isSample: boolean;
  className?: string;
}) {
  const rows = QUESTIONS.map((q) => {
    const value = answers[q.key];
    const option = q.options.find((o) => (o.value as string) === value);
    return { key: q.key, question: q.question, label: option?.label };
  }).filter((r) => r.label);

  if (rows.length === 0) return null;

  return (
    <aside aria-labelledby="selections-heading" className={`flex flex-col gap-3 rounded-lg border border-line bg-panel/60 p-4 ${className}`}>
      <div className="flex flex-wrap items-center gap-2">
        <h2 id="selections-heading" className="text-sm font-semibold text-ink">
          {LABELS.basedOnSelections}
        </h2>
        {isSample ? <StatusLabel tone="brand">{LABELS.sampleAnswers}</StatusLabel> : null}
      </div>
      <dl className="flex flex-col gap-2 text-sm">
        {rows.map((r) => (
          <div key={r.key} className="flex flex-col gap-0.5">
            <dt className="text-xs text-ink-faint">{r.question}</dt>
            <dd className="text-ink-muted">{r.label}</dd>
          </div>
        ))}
        {optionalContext.trim() ? (
          <div className="flex flex-col gap-0.5">
            <dt className="text-xs text-ink-faint">{OPTIONAL_CONTEXT.capsuleLabel}</dt>
            <dd className="text-ink-muted">{optionalContext.trim()}</dd>
          </div>
        ) : null}
      </dl>
      <StatusLabel>{LABELS.noPrivateSystems}</StatusLabel>
    </aside>
  );
}
