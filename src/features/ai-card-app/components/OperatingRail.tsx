"use client";

import { Fragment, type ReactNode } from "react";
import { StatusLabel } from "@/components/ui/StatusLabel";
import { MAP_WRAPPER } from "@/features/ai-card/content";
import type { AgentKey, AiCardAnswers, AnswerValueFor, PathFixture, SheetKey } from "@/features/ai-card/content/types";
import { AiCardHandoff } from "@/features/ai-card/components/AiCardHandoff";
import { BottleneckCard } from "@/features/ai-card/components/cards/BottleneckCard";
import { ControlCard } from "@/features/ai-card/components/cards/ControlCard";
import { DepartmentCard } from "@/features/ai-card/components/cards/DepartmentCard";
import { NinetyDayCard } from "@/features/ai-card/components/cards/NinetyDayCard";
import { WorkflowCard } from "@/features/ai-card/components/cards/WorkflowCard";
import { CARD_ORDER, OPERATING_RAIL, type CardKey } from "../content/appCopy";
import type { AppState, RefinementKey } from "../logic/appStateMachine";
import { RefinementPrompt } from "./Refinement";

type Props = {
  state: AppState;
  path: PathFixture;
  department: ReadonlyArray<AgentKey>;
  activated: boolean;
  onOpenCard: (card: CardKey | null) => void;
  onOpenSheet: (sheet: SheetKey) => void;
  onAnswer: (key: RefinementKey, value: AnswerValueFor<RefinementKey>) => void;
  onHandoff: (kind: "dashboard" | "review") => void;
  onCloseHandoff: () => void;
  onRestart: () => void;
};

function pathSummary(path: PathFixture, key: CardKey): string {
  switch (key) {
    case "bottleneck":
      return path.card1.title;
    case "department":
      return path.card2.title;
    case "workflow":
      return path.card3.title;
    case "control":
      return path.card4.title;
    case "90_days":
      return path.card5.title;
  }
}

/**
 * Lower operating-map rail (Reset v2 §6). Five tiles are visible from the
 * first viewport; one active card expands inline. On mobile the expanded
 * content sits directly under its tile (vertical rail); on desktop the
 * tiles form one row and the content spans beneath them (grid `order`).
 */
export function OperatingRail({ state, path, department, activated, onOpenCard, onOpenSheet, onAnswer, onHandoff, onCloseHandoff, onRestart }: Props) {
  const atRest = state.stage === "app_at_rest";
  const active = atRest ? null : state.activeCard;
  const answers: AiCardAnswers = state.answers;

  let content: ReactNode = null;
  if (!atRest && state.handoff) {
    content = <AiCardHandoff kind={state.handoff} onBack={onCloseHandoff} onOpenReview={() => onHandoff("review")} />;
  } else if (!atRest && active && activated) {
    switch (active) {
      case "bottleneck":
        content = <BottleneckCard path={path} />;
        break;
      case "department":
        content = <DepartmentCard path={path} department={department} onOpenSheet={onOpenSheet} />;
        break;
      case "workflow":
        content = <WorkflowCard path={path} />;
        break;
      case "control":
        content = <ControlCard path={path} />;
        break;
      case "90_days":
        content = <NinetyDayCard path={path} onDashboard={() => onHandoff("dashboard")} onReview={() => onHandoff("review")} onRestart={onRestart} />;
        break;
    }
  }

  return (
    <section id="operating-map" aria-labelledby="operating-map-heading" className="flex flex-col gap-3">
      <header className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="operating-map-heading" className="text-lg font-semibold tracking-tight text-ink">
          {OPERATING_RAIL.heading}
        </h2>
        <p className="text-sm text-ink-muted">{OPERATING_RAIL.intro}</p>
      </header>

      <div className="flex flex-col gap-2 md:grid md:grid-cols-5 md:gap-3">
        {CARD_ORDER.map((card) => {
          const isActive = active === card.key && !state.handoff;
          const summary = atRest ? OPERATING_RAIL.restSummary[card.index] : pathSummary(path, card.key);
          return (
            <Fragment key={card.key}>
              <button
                id={card.anchor}
                type="button"
                disabled={atRest}
                aria-expanded={atRest ? undefined : isActive}
                aria-controls={atRest ? undefined : "operating-card-panel"}
                onClick={() => onOpenCard(isActive ? null : card.key)}
                className={`flex min-h-24 flex-col items-start gap-1.5 rounded-lg border p-3 text-left transition-colors duration-150 disabled:cursor-default ${
                  isActive
                    ? "border-brand-soft bg-panel-2"
                    : atRest
                      ? "border-line bg-panel/40 opacity-80"
                      : "border-line bg-panel/70 hover:border-line-strong"
                }`}
              >
                <span className="flex w-full flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-soft">
                    {card.index + 1} · {MAP_WRAPPER.cardTitles[card.index]}
                  </span>
                  {isActive ? <StatusLabel tone="brand" className="py-0.5">{OPERATING_RAIL.active}</StatusLabel> : null}
                </span>
                <span className={`text-sm leading-snug ${atRest ? "text-ink-muted" : "text-ink"}`}>{summary}</span>
                {atRest ? <span className="text-xs text-ink-faint">{OPERATING_RAIL.locked}</span> : null}
              </button>
              {content && isActive ? (
                <div id="operating-card-panel" className="rounded-lg border border-line bg-panel/80 p-4 motion-safe:animate-rise sm:p-6 md:col-span-5 md:order-last">
                  {content}
                  {!state.handoff ? <div className="mt-6"><RefinementPrompt card={card.key} answers={answers} onAnswer={onAnswer} /></div> : null}
                </div>
              ) : null}
            </Fragment>
          );
        })}
        {content && state.handoff ? (
          <div id="operating-card-panel" className="rounded-lg border border-line bg-panel/80 p-4 sm:p-6 md:col-span-5 md:order-last">
            {content}
          </div>
        ) : null}
      </div>
    </section>
  );
}
