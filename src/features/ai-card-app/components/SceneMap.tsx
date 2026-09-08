"use client";

import { useEffect, useState } from "react";
import { AGENTS, PATHS } from "@/features/ai-card/content";
import type { AgentKey } from "@/features/ai-card/content/types";
import { DepartmentMap, specialistsOf } from "@/features/ai-card/components/DepartmentMap";
import { SCENE } from "../content/appCopy";

/**
 * The one cinematic moment (Reset v2 §7), triggered by the first problem
 * selection and replayed on every change of signal:
 *
 *   0 rest → 1 Strategos lights → 2 specialists activate in sequence
 *   → 3 one handoff runs → 4 Metric + Guardian checkpoints attach → done
 *
 * Total ≈ 1.7 s. Reduced motion shows the finished state at once. The parent
 * re-mounts this component with `key={activationId}` so timers restart from
 * zero without any state reset inside effects.
 */
const STEP_MS = [0, 280, 900, 1300, 1700] as const;

const REST_DEPARTMENT = PATHS.fragmented_operation.department;

export type SceneMapProps = {
  active: boolean;
  department: ReadonlyArray<AgentKey>;
  challengeLabel: string | null;
  reducedMotion: boolean;
  highlight: AgentKey | null;
  onDone: () => void;
  className?: string;
};

export function SceneMap({ active, department, challengeLabel, reducedMotion, highlight, onDone, className = "" }: SceneMapProps) {
  const [timedStep, setTimedStep] = useState(0);
  const [skipped, setSkipped] = useState(false);

  useEffect(() => {
    if (!active) return;
    if (reducedMotion) {
      onDone();
      return;
    }
    const timers = STEP_MS.slice(1).map((ms, i) =>
      window.setTimeout(() => {
        setTimedStep(i + 1);
        if (i + 1 === STEP_MS.length - 1) onDone();
      }, ms),
    );
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [active, reducedMotion, onDone]);

  const step = !active ? 0 : reducedMotion || skipped ? 4 : timedStep;
  const animate = active && !reducedMotion && !skipped;

  const dept = active ? department : REST_DEPARTMENT;
  const specialists = specialistsOf(dept).slice(0, 6);
  const visible = new Set<AgentKey>(["strategos"]);
  if (!active || step >= 2) specialists.forEach((k) => visible.add(k));
  if (!active || step >= 4) {
    visible.add("metric");
    visible.add("guardian");
  }

  const roleNames = specialists.map((k) => AGENTS[k].name).join(", ");
  const description = active && challengeLabel ? SCENE.mapDescriptionActive(challengeLabel, roleNames) : SCENE.mapDescriptionRest;

  return (
    <div className={`relative ${className}`}>
      <div
        className={`transition-[opacity,filter] duration-500 ${active ? "opacity-100 saturate-100" : "opacity-70 saturate-50"}`}
        data-scene-step={step}
        data-scene-state={active ? (step >= 4 ? "active" : "activating") : "rest"}
      >
        <DepartmentMap
          specialists={specialists}
          visible={visible}
          showHandoff={active && step >= 3}
          showMetric={!active || step >= 4}
          showGuardian={!active || step >= 4}
          highlight={highlight}
          animate={animate}
          description={description}
        />
      </div>
      {active && animate && step < 4 ? (
        <button
          type="button"
          onClick={() => {
            setSkipped(true);
            onDone();
          }}
          className="absolute right-2 top-2 min-h-9 rounded-full border border-line px-3 text-xs font-medium text-ink-muted hover:text-ink"
        >
          {SCENE.skipMotion}
        </button>
      ) : null}
      <p className="sr-only" aria-live="polite">
        {active && step >= 4 && challengeLabel ? description : ""}
      </p>
    </div>
  );
}
