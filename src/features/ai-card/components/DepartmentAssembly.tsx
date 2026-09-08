"use client";

import dynamic from "next/dynamic";
import { Component, useEffect, useMemo, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { StatusLabel } from "@/components/ui/StatusLabel";
import { AGENTS, ASSEMBLY, LABELS, PATHS } from "../content";
import type { AgentKey, AiCardPathKey } from "../content/types";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { specialistsOf } from "./DepartmentMap";

const STEP_MS = 700;

/**
 * The map is code-split so the reading path never waits on it; while (or if)
 * it does not load, the textual role list carries the same meaning.
 */
const LazyDepartmentMap = dynamic(
  () => import("./DepartmentMap").then((m) => m.DepartmentMap),
  { ssr: false, loading: () => <div aria-hidden="true" className="aspect-[4/3] w-full" /> },
);

class MapErrorBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

export type DepartmentAssemblyProps = {
  pathKey: AiCardPathKey;
  department: ReadonlyArray<AgentKey>;
  complete: boolean;
  onComplete: () => void;
  onViewMap: () => void;
};

export function DepartmentAssembly({ pathKey, department, complete, onComplete, onViewMap }: DepartmentAssemblyProps) {
  const reducedMotion = useReducedMotion();
  const path = PATHS[pathKey];
  const foreground = useMemo(
    () => specialistsOf(path.assemblyForeground.length ? path.assemblyForeground : department),
    [path.assemblyForeground, department],
  );
  const specialists = useMemo(() => {
    const rest = specialistsOf(department).filter((k) => !foreground.includes(k));
    return [...foreground, ...rest].slice(0, 6);
  }, [department, foreground]);

  // Step index 0..4 mirrors the five controlled status lines; 5 = complete.
  // The timed sequence only advances via the interval callback; the static
  // (reduced-motion / already-complete) path is derived, not scheduled.
  const [timedStep, setTimedStep] = useState(0);
  const step = complete || reducedMotion ? 5 : timedStep;

  useEffect(() => {
    if (complete) return;
    if (reducedMotion) {
      onComplete();
      return;
    }
    let current = 0;
    const id = window.setInterval(() => {
      current += 1;
      setTimedStep(current);
      if (current >= 5) {
        window.clearInterval(id);
        onComplete();
      }
    }, STEP_MS);
    return () => window.clearInterval(id);
  }, [complete, reducedMotion, onComplete]);

  const visible = useMemo(() => {
    const set = new Set<AgentKey>(["strategos"]);
    if (step >= 1 && specialists[0]) set.add(specialists[0]);
    if (step >= 2) specialists.slice(1, 4).forEach((k) => set.add(k));
    if (step >= 3) specialists.slice(4).forEach((k) => set.add(k));
    return set;
  }, [step, specialists]);

  const isDone = step >= 5;
  const activeRoles = department.map((k) => AGENTS[k].name);

  const textualSummary = (
    <ol className="grid gap-2 text-sm text-ink-muted sm:grid-cols-2" aria-label="Active roles in this sample">
      {department.map((k) => (
        <li key={k} className="flex items-baseline gap-2 rounded-md border border-line bg-panel/60 px-3 py-2">
          <span className="font-semibold text-ink">{AGENTS[k].name}</span>
          <span>{AGENTS[k].mapLabel}</span>
        </li>
      ))}
    </ol>
  );

  return (
    <section aria-labelledby="assembly-heading" className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 id="assembly-heading" className="text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">
          {ASSEMBLY.h1}
        </h1>
        <p className="text-sm text-ink-muted">{ASSEMBLY.subline}</p>
      </header>

      <div className="rounded-lg border border-line bg-panel p-3 sm:p-5">
        <MapErrorBoundary fallback={textualSummary}>
          <LazyDepartmentMap
            specialists={specialists}
            visible={visible}
            showHandoff={step >= 3}
            showMetric={step >= 4}
            showGuardian={step >= 5}
            animate={!reducedMotion && !complete}
          />
        </MapErrorBoundary>
        <p className="sr-only">
          {ASSEMBLY.accessibleDescription} Active roles: {activeRoles.join(", ")}.
        </p>
      </div>

      <ol className="flex flex-col gap-2" aria-live="polite" aria-label="Assembly status">
        {ASSEMBLY.statuses.map((status, i) => {
          const reached = step > i || isDone;
          const active = step === i && !isDone;
          if (!reached && !active) return null;
          return (
            <li
              key={status}
              className={`flex items-center gap-3 rounded-md border px-3 py-2 text-sm ${
                active ? "border-brand-soft/60 text-ink" : "border-line text-ink-muted"
              } ${active ? "motion-safe:animate-fade" : ""}`}
            >
              <span aria-hidden="true" className={`h-2 w-2 rounded-full ${reached ? "bg-ready" : "bg-brand-soft"}`} />
              <span>{status}</span>
              {reached ? <span className="sr-only">(done)</span> : null}
            </li>
          );
        })}
      </ol>

      {reducedMotion ? textualSummary : null}

      <div className="flex flex-col gap-3">
        {isDone ? (
          <p className="text-base font-medium text-ink motion-safe:animate-fade">{ASSEMBLY.complete}</p>
        ) : null}
        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={onViewMap} disabled={!isDone} aria-disabled={!isDone}>
            {ASSEMBLY.cta}
          </Button>
          <StatusLabel>{LABELS.guidedSample}</StatusLabel>
        </div>
      </div>
    </section>
  );
}
