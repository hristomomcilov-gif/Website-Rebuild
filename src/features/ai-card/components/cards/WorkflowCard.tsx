"use client";

import { useState } from "react";
import { StatusLabel } from "@/components/ui/StatusLabel";
import { MAP_WRAPPER } from "../../content";
import type { PathFixture, WorkflowGate } from "../../content/types";
import { CardHeader } from "./CardHeader";

const gateTone: Record<WorkflowGate, "neutral" | "approval" | "measure" | "ready"> = {
  client_validation: "neutral",
  approval: "approval",
  staging_qa: "measure",
  measurement: "ready",
};

export function WorkflowCard({ path }: { path: PathFixture }) {
  const [expanded, setExpanded] = useState<number | null>(0);

  return (
    <article aria-labelledby="card-3-title" className="flex flex-col gap-5">
      <CardHeader index={3} label={MAP_WRAPPER.cardTitles[2]} title={path.card3.title} titleId="card-3-title" />
      <p className="text-sm text-ink-muted">{MAP_WRAPPER.workflowDescription}</p>

      <ol className="relative flex flex-col gap-2 border-l border-line pl-5" aria-label="Workflow stages">
        {path.card3.stages.map((stage, i) => {
          const open = expanded === i;
          const panelId = `stage-${i}-panel`;
          return (
            <li key={stage.stage} className="relative">
              <span
                aria-hidden="true"
                className="absolute -left-[27px] top-4 h-3 w-3 rounded-full border border-brand-soft bg-canvas"
              />
              <button
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setExpanded(open ? null : i)}
                className={`flex w-full flex-col items-start gap-1 rounded-md border px-4 py-3 text-left transition-colors duration-150 ${
                  open ? "border-brand-soft bg-panel-2" : "border-line bg-panel/60 hover:border-line-strong"
                }`}
              >
                <span className="text-xs font-semibold uppercase tracking-wide text-ink-faint">Stage {i + 1}</span>
                <span className="text-base font-semibold text-ink">{stage.stage}</span>
                <span className="text-sm text-ink-muted">Owner: {stage.owner}</span>
              </button>
              <div id={panelId} hidden={!open} className="flex flex-col gap-2 px-4 pb-3 pt-2 text-sm">
                <p className="text-ink-muted">
                  <span className="font-semibold text-ink">Example output:</span> {stage.output}
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <StatusLabel tone={gateTone[stage.gateKind]}>{MAP_WRAPPER.gateLabels[stage.gateKind]}</StatusLabel>
                  <span className="text-ink-muted">{stage.gate}</span>
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      <p className="rounded-md border border-line bg-panel/60 px-4 py-3 text-sm leading-relaxed text-ink">
        {path.card3.note ?? MAP_WRAPPER.whatHappensNext}
      </p>
    </article>
  );
}
