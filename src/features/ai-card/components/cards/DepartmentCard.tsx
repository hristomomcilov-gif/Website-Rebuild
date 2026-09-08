"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Disclosure } from "@/components/ui/Disclosure";
import { AGENTS, ALL_AGENT_KEYS, MAP_WRAPPER, getAgentSheet } from "../../content";
import type { AgentKey, PathFixture, SheetKey } from "../../content/types";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { DepartmentMap, specialistsOf } from "../DepartmentMap";
import { CardHeader } from "./CardHeader";

export function DepartmentCard({
  path,
  department,
  onOpenSheet,
}: {
  path: PathFixture;
  department: ReadonlyArray<AgentKey>;
  onOpenSheet: (sheet: SheetKey) => void;
}) {
  const reducedMotion = useReducedMotion();
  const [highlight, setHighlight] = useState<AgentKey | null>(null);
  const specialists = specialistsOf(department).slice(0, 6);
  const visible = new Set<AgentKey>(department);
  const roles = path.card2.roles.filter((r) => department.includes(r.agent));
  const conditional = department.filter((k) => !path.card2.roles.some((r) => r.agent === k));

  return (
    <article aria-labelledby="card-2-title" className="flex flex-col gap-5">
      <CardHeader index={2} label={MAP_WRAPPER.cardTitles[1]} title={path.card2.title} titleId="card-2-title" />

      <div className="rounded-lg border border-line bg-panel p-3 sm:p-4">
        <DepartmentMap
          specialists={specialists}
          visible={visible}
          showMetric
          showGuardian
          showHandoff
          highlight={highlight}
          animate={false}
          description={`Department map for this sample. ${department.map((k) => AGENTS[k].name).join(", ")}. Strategos coordinates; Metric measures; Guardian checks quality and approval.`}
        />
      </div>

      <p className="rounded-md border border-brand-soft/40 bg-panel/60 px-4 py-3 text-sm leading-relaxed text-ink">
        {MAP_WRAPPER.orchestrationStrip}
      </p>

      <ul className="flex flex-col gap-2" aria-label="Roles in this sample department">
        {roles.map(({ agent, reason }) => {
          const def = AGENTS[agent];
          const sheet = getAgentSheet(agent);
          const isActive = highlight === agent;
          return (
            <li
              key={agent}
              className={`flex flex-col gap-2 rounded-md border px-4 py-3 transition-colors duration-150 ${
                isActive ? "border-brand-soft bg-panel-2" : "border-line bg-panel/60"
              }`}
              onMouseEnter={reducedMotion ? undefined : () => setHighlight(agent)}
              onMouseLeave={reducedMotion ? undefined : () => setHighlight(null)}
              onFocus={() => setHighlight(agent)}
              onBlur={() => setHighlight(null)}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <p className="text-base font-semibold text-ink">
                  {def.name} <span className="text-sm font-normal text-ink-muted">· {def.role}</span>
                </p>
                {sheet ? (
                  <button
                    type="button"
                    onClick={() => onOpenSheet(agent)}
                    className="min-h-10 rounded-full border border-line-strong px-3 text-sm font-medium text-ink hover:border-white"
                  >
                    {MAP_WRAPPER.askAgent(def.name)}
                  </button>
                ) : null}
              </div>
              <p className="text-sm leading-relaxed text-ink-muted">{reason}</p>
            </li>
          );
        })}
        {conditional.map((agent) => (
          <li key={agent} className="flex flex-col gap-1 rounded-md border border-dashed border-line px-4 py-3">
            <p className="text-base font-semibold text-ink">
              {AGENTS[agent].name} <span className="text-sm font-normal text-ink-muted">· {AGENTS[agent].role}</span>
            </p>
            <p className="text-sm leading-relaxed text-ink-muted">{AGENTS[agent].mission}</p>
          </li>
        ))}
      </ul>

      <p className="text-sm leading-relaxed text-ink-muted">{path.card2.note}</p>
      {path.card2.conditionalNote ? (
        <p className="text-sm leading-relaxed text-ink-muted">{path.card2.conditionalNote}</p>
      ) : null}

      <div className="flex flex-wrap gap-2" aria-label="Controlled questions">
        {path.card2.chips.map((chip) => (
          <Button key={chip.label} variant="secondary" className="min-h-11 px-4 text-sm" onClick={() => onOpenSheet(chip.sheet)}>
            {chip.label}
          </Button>
        ))}
      </div>

      <Disclosure summary={MAP_WRAPPER.seeAllSpecialists}>
        <ul className="flex flex-col gap-2">
          {ALL_AGENT_KEYS.map((k) => (
            <li key={k} className="flex flex-col">
              <span className="font-semibold text-ink">
                {AGENTS[k].name} <span className="font-normal text-ink-muted">· {AGENTS[k].role}</span>
              </span>
              <span>{AGENTS[k].mission}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-ink-faint">
          {MAP_WRAPPER.emailFormatLabel} <code className="text-ink-muted">{MAP_WRAPPER.emailFormat}</code>
        </p>
        <p className="mt-1 text-xs text-ink-faint">{MAP_WRAPPER.emailFormatNote}</p>
      </Disclosure>
    </article>
  );
}
