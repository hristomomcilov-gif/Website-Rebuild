"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { LABELS, MAP_WRAPPER } from "../content";
import type { AgentKey, PathFixture, SheetKey } from "../content/types";
import type { CardIndex } from "../logic/stateMachine";
import { BottleneckCard } from "./cards/BottleneckCard";
import { ControlCard } from "./cards/ControlCard";
import { DepartmentCard } from "./cards/DepartmentCard";
import { NinetyDayCard } from "./cards/NinetyDayCard";
import { WorkflowCard } from "./cards/WorkflowCard";
import { TruthBoundaryDisclosure } from "./TruthBoundaryDisclosure";

export type OperatingMapProps = {
  path: PathFixture;
  department: ReadonlyArray<AgentKey>;
  cardIndex: CardIndex | null;
  onOpenCard: (index: CardIndex) => void;
  onNext: () => void;
  onPrevious: () => void;
  onOpenSheet: (sheet: SheetKey) => void;
  onDashboard: () => void;
  onReview: () => void;
  onRestart: () => void;
};

export function OperatingMap(props: OperatingMapProps) {
  const { path, department, cardIndex, onOpenCard, onNext, onPrevious, onOpenSheet, onDashboard, onReview, onRestart } = props;
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    topRef.current?.focus();
  }, [cardIndex]);

  if (cardIndex === null) {
    return (
      <section aria-labelledby="map-heading" className="flex flex-col gap-6 motion-safe:animate-rise">
        <div ref={topRef} tabIndex={-1} className="flex flex-col gap-3 outline-none">
          <h1 id="map-heading" className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            {MAP_WRAPPER.h1}
          </h1>
          <p className="max-w-prose text-base leading-relaxed text-ink-muted">{MAP_WRAPPER.intro}</p>
          <p className="max-w-prose rounded-md border border-brand-soft/40 bg-panel/60 px-4 py-3 text-sm leading-relaxed text-ink">
            {path.summary}
          </p>
        </div>

        <ol className="flex flex-col gap-2" aria-label="The five cards in your operating map">
          {MAP_WRAPPER.cardTitles.map((title, i) => (
            <li key={title} className="motion-safe:animate-rise" style={{ animationDelay: `${i * 70}ms` }}>
              <button
                type="button"
                onClick={() => onOpenCard(i as CardIndex)}
                className="flex min-h-12 w-full items-center gap-3 rounded-md border border-line bg-panel/60 px-4 py-3 text-left text-base text-ink hover:border-line-strong"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-brand-soft text-sm font-semibold text-brand-soft">
                  {i + 1}
                </span>
                <span className="flex-1">{title}</span>
                <span aria-hidden="true" className="text-ink-faint">
                  →
                </span>
              </button>
            </li>
          ))}
        </ol>

        <div>
          <Button onClick={() => onOpenCard(0)}>{MAP_WRAPPER.startWithBottleneck}</Button>
        </div>

        <TruthBoundaryDisclosure />
      </section>
    );
  }

  const card = [
    <BottleneckCard key="c1" path={path} />,
    <DepartmentCard key="c2" path={path} department={department} onOpenSheet={onOpenSheet} />,
    <WorkflowCard key="c3" path={path} />,
    <ControlCard key="c4" path={path} />,
    <NinetyDayCard key="c5" path={path} onDashboard={onDashboard} onReview={onReview} onRestart={onRestart} />,
  ][cardIndex];

  return (
    <div className="flex flex-col gap-6">
      <nav aria-label="Card navigation" className="flex flex-col gap-3 md:hidden">
        <ol className="flex flex-wrap gap-1.5">
          {MAP_WRAPPER.cardTitles.map((title, i) => {
            const active = i === cardIndex;
            return (
              <li key={title}>
                <button
                  type="button"
                  aria-current={active ? "step" : undefined}
                  aria-label={`${i + 1}. ${title}`}
                  onClick={() => onOpenCard(i as CardIndex)}
                  className={`flex h-10 min-w-10 items-center justify-center gap-1.5 rounded-full border px-3 text-sm font-semibold ${
                    active ? "border-brand-soft bg-panel-2 text-ink" : "border-line text-ink-muted hover:border-line-strong"
                  }`}
                >
                  <span>{i + 1}</span>
                  <span className="hidden md:inline">{title}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      <div ref={topRef} tabIndex={-1} className="outline-none motion-safe:animate-rise" key={cardIndex}>
        {card}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
        <Button variant="secondary" onClick={onPrevious}>
          {LABELS.previous}
        </Button>
        {cardIndex < 4 ? <Button onClick={onNext}>{MAP_WRAPPER.nextCardCtas[cardIndex]}</Button> : null}
      </div>

      <div className="lg:hidden">
        <TruthBoundaryDisclosure compact />
      </div>
    </div>
  );
}
