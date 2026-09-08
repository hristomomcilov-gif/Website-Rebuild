"use client";

import { Button } from "@/components/ui/Button";
import { StatusLabel } from "@/components/ui/StatusLabel";
import { AGENTS, LABELS, PATHS } from "@/features/ai-card/content";
import type { AgentKey, AiCardPathKey } from "@/features/ai-card/content/types";
import { TruthBoundaryDisclosure } from "@/features/ai-card/components/TruthBoundaryDisclosure";
import { AT_REST, COMPOSER, HANDOFF_STRIP, REFINE, SCENE } from "../content/appCopy";
import type { AppState } from "../logic/appStateMachine";

type Props = {
  state: AppState;
  challengeLabel: string | null;
  department: ReadonlyArray<AgentKey>;
  assumedSample: boolean;
  onFocusRole: (role: AgentKey) => void;
  onRefine: () => void;
  onExploreSample: (path: Exclude<AiCardPathKey, "fragmented_operation">) => void;
  onHandoff: (kind: "dashboard" | "review") => void;
  onEditSignal: () => void;
  /** Mobile only: the desktop composer already offers the complete samples. */
  showExplore?: boolean;
};

/**
 * Right context rail (Reset v2 §6): the selected signal, active roles, the
 * truth boundary and the next depth. On mobile the same content renders
 * below the scene as a compact strip.
 */
export function ContextRail({ state, challengeLabel, department, assumedSample, onFocusRole, onRefine, onExploreSample, onHandoff, onEditSignal, showExplore = false }: Props) {
  const active = state.stage !== "app_at_rest";
  const answeredCount = (["businessType", "currentCapacity", "businessGoal", "operatingFriction"] as const).filter((k) => state.answers[k]).length;

  return (
    <aside aria-label="Context" className="flex flex-col gap-4">
      <section className="flex flex-col gap-2 rounded-lg border border-line bg-panel/70 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">{SCENE.yourSignal}</p>
        {active && challengeLabel ? (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-base font-medium text-ink">{challengeLabel}</span>
            <button type="button" onClick={onEditSignal} className="text-sm text-ink-muted underline-offset-4 hover:text-ink hover:underline">
              {COMPOSER.editSignal}
            </button>
          </div>
        ) : (
          <p className="text-sm text-ink-muted">{SCENE.noSignal}</p>
        )}
        {active ? (
          <p className="text-sm text-ink-muted">
            {assumedSample ? SCENE.sampleShown(PATHS[state.activePath].name) : PATHS[state.activePath].name}
          </p>
        ) : null}
        {active ? (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <Button variant="secondary" className="min-h-10 px-4 text-sm" onClick={onRefine}>
              {REFINE.cta}
            </Button>
            <span className="text-xs text-ink-muted">
              {answeredCount}/4 {REFINE.optionalTag.toLowerCase()} details
            </span>
          </div>
        ) : null}
      </section>

      <section className="flex flex-col gap-2 rounded-lg border border-line bg-panel/70 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">{active ? SCENE.activeRoles : SCENE.restingRoles}</p>
        <ul className="flex flex-col gap-1">
          {(active ? department : PATHS.fragmented_operation.department).map((k) => (
            <li key={k}>
              <button
                type="button"
                disabled={!active}
                onClick={() => onFocusRole(k)}
                className="flex w-full items-baseline justify-between gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-white/5 disabled:cursor-default disabled:hover:bg-transparent"
              >
                <span className="font-medium text-ink">{AGENTS[k].name}</span>
                <span className="text-xs text-ink-muted">{AGENTS[k].mapLabel}</span>
              </button>
            </li>
          ))}
        </ul>
        {active ? <p className="text-xs text-ink-muted">{SCENE.roleHint}</p> : null}
      </section>

      <section className="flex flex-col gap-2 rounded-lg border border-line bg-panel/70 p-4">
        <div className="flex flex-wrap gap-2">
          <StatusLabel tone="brand">{AT_REST.guidedSample}</StatusLabel>
          <StatusLabel>{LABELS.noPrivateSystems}</StatusLabel>
        </div>
        <TruthBoundaryDisclosure compact />
      </section>

      {active ? (
        <section className="flex flex-col gap-2">
          <Button onClick={() => onHandoff("dashboard")}>{HANDOFF_STRIP.dashboard}</Button>
          <Button variant="secondary" onClick={() => onHandoff("review")}>
            {HANDOFF_STRIP.review}
          </Button>
        </section>
      ) : showExplore ? (
        <section className="flex flex-col gap-2 rounded-lg border border-line bg-panel/40 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">{COMPOSER.exploreHeading}</p>
          <div className="flex flex-wrap gap-2">
            {COMPOSER.exploreSamples.map((s) => (
              <button key={s.path} type="button" onClick={() => onExploreSample(s.path)} className="min-h-9 rounded-full border border-line px-3 text-sm text-ink hover:border-white">
                {s.label}
              </button>
            ))}
          </div>
        </section>
      ) : null}
    </aside>
  );
}
