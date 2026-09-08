"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { StatusLabel } from "@/components/ui/StatusLabel";
import { PATHS } from "@/features/ai-card/content";
import type { AgentKey, AiCardPathKey, AnswerValueFor, PrimaryChallenge, SheetKey } from "@/features/ai-card/content/types";
import { useReducedMotion } from "@/features/ai-card/hooks/useReducedMotion";
import { RestartDialog } from "@/features/ai-card/components/RestartDialog";
import { APP_SHELL, AT_REST, COMPOSER, HANDOFF_STRIP, REFINE } from "../content/appCopy";
import { clearAppSession, loadAppSession, saveAppSession } from "../logic/appSession";
import { appReducer, initialAppState, type AppState, type RefinementKey } from "../logic/appStateMachine";
import { isAssumedSample, resolveBaseDepartment } from "../logic/resolveBasePath";
import { ChallengeComposer } from "./ChallengeComposer";
import { ContextRail } from "./ContextRail";
import { OperatingRail } from "./OperatingRail";
import { RefinementSheet } from "./Refinement";
import { RoleSheet } from "./RoleSheet";
import { SceneCanvas, challengeLabelOf } from "./SceneCanvas";

/**
 * App-first AI Card (Experience Reset v2). The visitor is inside the sample
 * department from the first paint: shell, Strategos, department map, one
 * problem composer and the five-card rail are all present at rest. One
 * selection activates the map and Card 1; everything else is optional.
 *
 * Deterministic fixtures only. No network, no model, no free-form chat.
 */
export function AiCardApp({ initialState }: { initialState?: AppState } = {}) {
  const [state, dispatch] = useReducer(appReducer, initialState ?? initialAppState);
  const reducedMotion = useReducedMotion();
  const [confirmRestart, setConfirmRestart] = useState(false);
  const hydratedRef = useRef(Boolean(initialState));

  useEffect(() => {
    if (hydratedRef.current) saveAppSession(state);
  }, [state]);

  useEffect(() => {
    if (hydratedRef.current) return;
    const restored = loadAppSession();
    hydratedRef.current = true;
    if (restored) dispatch({ type: "RESTORE", state: restored });
  }, []);

  const path = PATHS[state.activePath];
  const department = useMemo(() => resolveBaseDepartment(state.activePath, state.answers), [state.activePath, state.answers]);
  const challengeLabel = challengeLabelOf(state);
  const assumedSample = isAssumedSample(state.answers) && !state.sample;
  const activated = state.stage !== "app_at_rest" && state.stage !== "challenge_selected";

  const onActivationDone = useCallback(() => dispatch({ type: "ACTIVATION_DONE" }), []);
  const onSelect = useCallback((value: Exclude<PrimaryChallenge, "explore_sample">) => dispatch({ type: "SELECT_CHALLENGE", value }), []);
  const onDescription = useCallback((value: string) => dispatch({ type: "SET_DESCRIPTION", value }), []);
  const onExploreSample = useCallback((p: Exclude<AiCardPathKey, "fragmented_operation">) => dispatch({ type: "EXPLORE_SAMPLE", path: p }), []);
  const onEditSignal = useCallback(() => dispatch({ type: "EDIT_SIGNAL" }), []);
  const onAnswer = useCallback((key: RefinementKey, value: AnswerValueFor<RefinementKey>) => dispatch({ type: "ANSWER", key, value }), []);
  const onClear = useCallback((key: RefinementKey) => dispatch({ type: "CLEAR_ANSWER", key }), []);
  const onOpenSheet = useCallback((sheet: SheetKey) => dispatch({ type: "OPEN_SHEET", sheet }), []);
  const onCloseSheet = useCallback(() => {
    dispatch({ type: "CLOSE_SHEET" });
    dispatch({ type: "FOCUS_ROLE", role: null });
  }, []);
  const onFocusRole = useCallback((role: AgentKey | null) => {
    dispatch({ type: "FOCUS_ROLE", role });
    if (role) dispatch({ type: "OPEN_SHEET", sheet: role });
  }, []);
  const onCloseRefinement = useCallback(() => dispatch({ type: "CLOSE_REFINEMENT" }), []);
  const onHandoff = useCallback((kind: "dashboard" | "review") => {
    dispatch({ type: "OPEN_HANDOFF", kind });
    document.getElementById("operating-map")?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
  }, [reducedMotion]);
  const onCloseHandoff = useCallback(() => dispatch({ type: "CLOSE_HANDOFF" }), []);
  const restart = useCallback(() => {
    clearAppSession();
    dispatch({ type: "RESTART" });
    setConfirmRestart(false);
  }, []);

  const atRest = state.stage === "app_at_rest";

  return (
    <div className="flex min-h-dvh flex-col bg-canvas text-ink">
      <header className="sticky top-0 z-20 border-b border-line bg-canvas/90 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-[1400px] items-center justify-between gap-3 px-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-ink" aria-label="Teamulate home">
              <span aria-hidden="true" className="inline-block h-2.5 w-2.5 rounded-full bg-brand-soft" />
              {APP_SHELL.brand}
            </Link>
            <span aria-hidden="true" className="text-ink-faint">/</span>
            <h1 className="whitespace-nowrap text-sm font-semibold text-ink">{AT_REST.title}</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden text-xs text-ink-muted md:inline">{AT_REST.trustLine}</span>
            {atRest ? (
              <StatusLabel tone="brand" className="md:hidden">{AT_REST.guidedSample}</StatusLabel>
            ) : (
              <Button variant="ghost" className="min-h-9 whitespace-nowrap text-sm" onClick={() => setConfirmRestart(true)}>
                {HANDOFF_STRIP.restart}
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-[1400px] flex-1 gap-5 px-4 py-5 lg:grid-cols-[168px_minmax(0,1fr)_300px] lg:py-6">
        <nav aria-label="AI Card sections" className="hidden lg:block">
          <ol className="sticky top-20 flex flex-col gap-1">
            {APP_SHELL.rail.map((item, i) => {
              const external = item.target.startsWith("http");
              const cls = "flex min-h-10 items-center gap-3 rounded-md px-3 text-sm text-ink-muted hover:bg-white/5 hover:text-ink";
              return (
                <li key={item.key}>
                  {external ? (
                    <a href={item.target} rel="noopener" className={cls}>
                      <span className="text-xs text-ink-faint">{String(i + 1).padStart(2, "0")}</span>
                      {item.label}
                    </a>
                  ) : (
                    <a href={item.target} className={cls}>
                      <span className="text-xs text-ink-faint">{String(i + 1).padStart(2, "0")}</span>
                      {item.label}
                    </a>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>

        <main id="main-content" className="flex min-w-0 flex-col gap-5 pb-44 lg:pb-0">
          <SceneCanvas
            state={state}
            department={department}
            reducedMotion={reducedMotion}
            assumedSample={assumedSample}
            onEditSignal={onEditSignal}
            onActivationDone={onActivationDone}
            composer={
              <ChallengeComposer
                selected={state.answers.primaryChallenge}
                description={state.description}
                onSelect={onSelect}
                onDescription={onDescription}
                onExploreSample={onExploreSample}
              />
            }
          />

          <div className="lg:hidden">
            <ContextRail
              showExplore
              state={state}
              challengeLabel={challengeLabel}
              department={department}
              assumedSample={assumedSample}
              onFocusRole={onFocusRole}
              onRefine={() => dispatch({ type: "OPEN_REFINEMENT", key: "businessType" })}
              onExploreSample={onExploreSample}
              onHandoff={onHandoff}
              onEditSignal={onEditSignal}
            />
          </div>

          <OperatingRail
            state={state}
            path={path}
            department={department}
            activated={activated}
            onOpenCard={(card) => dispatch({ type: "OPEN_CARD", card })}
            onOpenSheet={onOpenSheet}
            onAnswer={onAnswer}
            onHandoff={onHandoff}
            onCloseHandoff={onCloseHandoff}
            onRestart={() => setConfirmRestart(true)}
          />
        </main>

        <div className="hidden lg:block">
          <div className="sticky top-20">
            <ContextRail
              state={state}
              challengeLabel={challengeLabel}
              department={department}
              assumedSample={assumedSample}
              onFocusRole={onFocusRole}
              onRefine={() => dispatch({ type: "OPEN_REFINEMENT", key: "businessType" })}
              onExploreSample={onExploreSample}
              onHandoff={onHandoff}
              onEditSignal={onEditSignal}
            />
          </div>
        </div>
      </div>

      {/* Mobile / tablet composer: fixed-safe at the bottom, never a survey page. */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-canvas/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
        <div className="mx-auto w-full max-w-[1400px] px-4 py-3">
          {atRest ? (
            <ChallengeComposer
              selected={state.answers.primaryChallenge}
              description={state.description}
              onSelect={onSelect}
              onDescription={onDescription}
              onExploreSample={onExploreSample}
              compact
            />
          ) : (
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex min-h-9 items-center rounded-full border border-brand-soft bg-brand/20 px-3 text-sm font-medium text-ink">
                {challengeLabel}
              </span>
              <Button variant="ghost" className="min-h-9 text-sm" onClick={onEditSignal}>
                {COMPOSER.editSignal}
              </Button>
              <Button variant="secondary" className="ml-auto min-h-9 px-4 text-sm" onClick={() => dispatch({ type: "OPEN_REFINEMENT", key: "businessType" })}>
                {REFINE.cta}
              </Button>
            </div>
          )}
        </div>
      </div>

      {state.openSheet ? <RoleSheet sheet={state.openSheet} path={path} onClose={onCloseSheet} /> : null}
      {state.refining ? <RefinementSheet answers={state.answers} focus={state.refining} onAnswer={onAnswer} onClear={onClear} onClose={onCloseRefinement} /> : null}
      {confirmRestart ? <RestartDialog onConfirm={restart} onCancel={() => setConfirmRestart(false)} /> : null}
    </div>
  );
}
