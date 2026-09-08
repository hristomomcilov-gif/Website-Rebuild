"use client";

import { useCallback, useEffect, useMemo, useReducer, useRef, useState, type ReactNode } from "react";
import { LABELS, MAP_WRAPPER, PATHS, QUESTIONS } from "../content";
import type { AnswerValueFor, QuestionKey, SheetKey } from "../content/types";
import { resolveAiCardPath, resolveDepartment } from "../logic/resolveAiCardPath";
import { clearSession, loadSession, saveSession } from "../logic/session";
import { aiCardReducer, initialAiCardState, isComplete, type AiCardState, type CardIndex } from "../logic/stateMachine";
import { AgentSheet } from "./AgentSheet";
import { AiCardHandoff } from "./AiCardHandoff";
import { AiCardShell } from "./AiCardShell";
import { DepartmentAssembly } from "./DepartmentAssembly";
import { OperatingMap } from "./OperatingMap";
import { OptionalContextStep } from "./OptionalContextStep";
import { QuestionStep } from "./QuestionStep";
import { RestartDialog } from "./RestartDialog";
import { SelectionsPanel } from "./SelectionsPanel";
import { TruthBoundaryDisclosure } from "./TruthBoundaryDisclosure";
import { WelcomeStep } from "./WelcomeStep";

/**
 * Route-level composition for the AI Card v1 (guided sample).
 *
 * All transitions go through `aiCardReducer`; the only side effects are
 * session persistence and focus management. There is no network activity.
 */
export function AiCardExperience({ initialState }: { initialState?: AiCardState } = {}) {
  const [state, dispatch] = useReducer(aiCardReducer, initialState ?? initialAiCardState);
  const [confirmRestart, setConfirmRestart] = useState(false);
  const sheetTriggerRef = useRef<HTMLElement | null>(null);
  const hydratedRef = useRef(Boolean(initialState));

  // Persist to sessionStorage only after the stored session has been read,
  // so a refresh never overwrites the visitor's in-progress Card.
  useEffect(() => {
    if (hydratedRef.current) saveSession(state);
  }, [state]);

  // Restore a same-session Card after refresh (sessionStorage only).
  useEffect(() => {
    if (hydratedRef.current) return;
    const restored = loadSession();
    hydratedRef.current = true;
    if (restored) dispatch({ type: "RESTORE", state: restored });
  }, []);

  const { current, answers, optionalContext, isSample } = state;

  const pathKey = useMemo(() => (isComplete(answers) ? resolveAiCardPath(answers) : null), [answers]);
  const path = pathKey ? PATHS[pathKey] : null;
  const department = useMemo(
    () => (pathKey && isComplete(answers) ? resolveDepartment(pathKey, answers) : []),
    [pathKey, answers],
  );

  const onAnswer = useCallback(
    (question: QuestionKey, value: AnswerValueFor<QuestionKey>) => dispatch({ type: "ANSWER", question, value }),
    [],
  );
  const onAssemblyComplete = useCallback(() => dispatch({ type: "ASSEMBLY_COMPLETE" }), []);
  const onExploreSample = useCallback(() => dispatch({ type: "EXPLORE_SAMPLE" }), []);
  const onBack = useCallback(() => dispatch({ type: "BACK" }), []);

  const openSheet = useCallback((sheet: SheetKey) => {
    sheetTriggerRef.current = document.activeElement as HTMLElement | null;
    dispatch({ type: "OPEN_SHEET", sheet });
  }, []);
  const closeSheet = useCallback(() => {
    dispatch({ type: "CLOSE_SHEET" });
    const trigger = sheetTriggerRef.current;
    sheetTriggerRef.current = null;
    // Return focus to the control that opened the sheet.
    window.setTimeout(() => trigger?.focus(), 0);
  }, []);

  const requestRestart = useCallback(() => setConfirmRestart(true), []);
  const cancelRestart = useCallback(() => setConfirmRestart(false), []);
  const confirmRestartNow = useCallback(() => {
    setConfirmRestart(false);
    clearSession();
    dispatch({ type: "RESTART" });
  }, []);

  const stageLabel = (() => {
    if (current.stage === "questions") return `${current.questionIndex + 1} of ${QUESTIONS.length}`;
    if (current.stage === "map" || current.stage === "agent-sheet" || current.stage === "handoff") {
      return LABELS.operatingMapProgress;
    }
    return LABELS.guidedSample;
  })();

  const hasAnswers = Object.keys(answers).length > 0;
  const inOutput = current.stage === "map" || current.stage === "agent-sheet" || current.stage === "handoff";
  // Welcome and assembly carry their own trust line in the canvas.
  const showContextLine = inOutput;
  // Question and optional-context steps have Back in their footer already.
  const headerBack = current.stage === "assembly" || inOutput ? onBack : undefined;

  const leftRail =
    current.stage === "questions" ? (
      <ol className="flex flex-col gap-2 text-sm" aria-label="Progress">
        {QUESTIONS.map((q, i) => {
          const done = answers[q.key] !== undefined;
          const active = i === current.questionIndex;
          return (
            <li key={q.key} className={`flex items-center gap-2 ${active ? "text-ink" : "text-ink-faint"}`}>
              <span className={`flex h-6 w-6 items-center justify-center rounded-full border text-xs ${active ? "border-brand-soft text-brand-soft" : done ? "border-ready text-ready" : "border-line"}`}>
                {done && !active ? "✓" : i + 1}
              </span>
              <span className="truncate">{q.question}</span>
            </li>
          );
        })}
      </ol>
    ) : inOutput && path ? (
      <ol className="flex flex-col gap-1 text-sm" aria-label="Cards">
        {MAP_WRAPPER.cardTitles.map((title, i) => {
          const active = current.stage === "map" && current.cardIndex === i;
          return (
            <li key={title}>
              <button
                type="button"
                onClick={() => dispatch({ type: "OPEN_CARD", cardIndex: i as CardIndex })}
                aria-current={active ? "step" : undefined}
                className={`flex min-h-10 w-full items-center gap-2 rounded-md px-2 text-left ${active ? "bg-panel text-ink" : "text-ink-muted hover:text-ink"}`}
              >
                <span className="text-xs font-semibold text-brand-soft">{i + 1}</span>
                <span>{title}</span>
              </button>
            </li>
          );
        })}
      </ol>
    ) : undefined;

  const rightRail =
    hasAnswers && current.stage !== "welcome" ? (
      <div className="flex flex-col gap-4">
        <SelectionsPanel answers={answers} optionalContext={optionalContext} isSample={isSample} />
        {inOutput ? <div className="hidden lg:block"><TruthBoundaryDisclosure compact /></div> : null}
      </div>
    ) : undefined;

  let canvas: ReactNode;
  switch (current.stage) {
    case "welcome":
      canvas = <WelcomeStep onStart={() => dispatch({ type: "START" })} onExploreSample={onExploreSample} />;
      break;
    case "questions":
      canvas = (
        <QuestionStep
          questionIndex={current.questionIndex}
          answers={answers}
          onAnswer={onAnswer}
          onContinue={() => dispatch({ type: "CONTINUE" })}
          onBack={onBack}
          onExploreSample={onExploreSample}
        />
      );
      break;
    case "optional-context":
      canvas = (
        <OptionalContextStep
          value={optionalContext}
          onChange={(value) => dispatch({ type: "SET_OPTIONAL_CONTEXT", value })}
          onContinueWithDescription={() => dispatch({ type: "SUBMIT_OPTIONAL_CONTEXT" })}
          onContinueWithSample={() => dispatch({ type: "SKIP_OPTIONAL_CONTEXT" })}
          onSkip={() => dispatch({ type: "SKIP_OPTIONAL_CONTEXT" })}
          onBack={onBack}
        />
      );
      break;
    case "assembly":
      canvas = pathKey ? (
        <DepartmentAssembly
          pathKey={pathKey}
          department={department}
          complete={state.assemblyComplete}
          onComplete={onAssemblyComplete}
          onViewMap={() => dispatch({ type: "VIEW_MAP" })}
        />
      ) : null;
      break;
    case "map":
    case "agent-sheet":
      canvas = path ? (
        <OperatingMap
          path={path}
          department={department}
          cardIndex={current.stage === "map" ? current.cardIndex : current.returnCardIndex}
          onOpenCard={(cardIndex) => dispatch({ type: "OPEN_CARD", cardIndex })}
          onNext={() => dispatch({ type: "NEXT_CARD" })}
          onPrevious={() => dispatch({ type: "PREVIOUS_CARD" })}
          onOpenSheet={openSheet}
          onDashboard={() => dispatch({ type: "OPEN_HANDOFF", kind: "dashboard" })}
          onReview={() => dispatch({ type: "OPEN_HANDOFF", kind: "review" })}
          onRestart={requestRestart}
        />
      ) : null;
      break;
    case "handoff":
      canvas = (
        <AiCardHandoff
          kind={current.kind}
          onBack={() => dispatch({ type: "CLOSE_HANDOFF" })}
          onOpenReview={() => dispatch({ type: "OPEN_HANDOFF", kind: "review" })}
        />
      );
      break;
  }

  // Guard: a completed answer set that somehow lost its path falls back safely.
  if ((current.stage === "assembly" || inOutput) && !path) {
    canvas = <WelcomeStep onStart={() => dispatch({ type: "START" })} onExploreSample={onExploreSample} />;
  }

  return (
    <AiCardShell
      stageLabel={stageLabel}
      showContextLine={showContextLine}
      onBack={headerBack}
      onRestart={hasAnswers ? requestRestart : undefined}
      leftRail={leftRail}
      rightRail={rightRail}
    >
      {canvas}
      {current.stage === "agent-sheet" ? <AgentSheet sheet={current.sheet} onClose={closeSheet} /> : null}
      {confirmRestart ? <RestartDialog onConfirm={confirmRestartNow} onCancel={cancelRestart} /> : null}
    </AiCardShell>
  );
}
