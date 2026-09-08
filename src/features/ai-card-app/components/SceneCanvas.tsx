"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { StatusLabel } from "@/components/ui/StatusLabel";
import { AGENTS, MAP_WRAPPER, PATHS } from "@/features/ai-card/content";
import type { AgentKey } from "@/features/ai-card/content/types";
import { StrategosMark } from "@/features/ai-card/components/StrategosMark";
import { APP_SHELL, AT_REST, CARD_ORDER, COMPOSER, HYPOTHESES, SCENE } from "../content/appCopy";
import type { AppState } from "../logic/appStateMachine";
import { SceneMap } from "./SceneMap";

type Props = {
  state: AppState;
  department: ReadonlyArray<AgentKey>;
  reducedMotion: boolean;
  assumedSample: boolean;
  /** Desktop composer, rendered inside the scene while the app is at rest. */
  composer?: ReactNode;
  onEditSignal: () => void;
  onActivationDone: () => void;
};

export function challengeLabelOf(state: AppState): string | null {
  const c = state.answers.primaryChallenge;
  return COMPOSER.chips.find((chip) => chip.value === c)?.label ?? null;
}

/**
 * Main canvas (Reset v2 §6): Strategos as the active guide, the selected
 * signal as an input capsule, one controlled hypothesis, the department map
 * and the human-authority chain inside the scene. On mobile the map leads.
 */
export function SceneCanvas({ state, department, reducedMotion, assumedSample, composer, onEditSignal, onActivationDone }: Props) {
  const active = state.stage !== "app_at_rest";
  const challenge = challengeLabelOf(state);
  const hypothesis = state.answers.primaryChallenge && state.answers.primaryChallenge !== "explore_sample" ? HYPOTHESES[state.answers.primaryChallenge] : null;

  return (
    <section id="scene" aria-label={AT_REST.title} className="flex flex-col gap-4 rounded-lg border border-line bg-panel/70 p-4 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.8)] sm:p-5">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <StrategosMark size={36} />
          <div className="flex flex-col">
            <p className="text-sm font-semibold text-ink">{APP_SHELL.strategosRole}</p>
            <p className="text-xs text-ink-muted">{active ? SCENE.hypothesisLabel : AT_REST.start}</p>
          </div>
        </div>
        <div className="hidden items-center gap-2 sm:flex">
          {active && challenge ? (
            <>
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">{COMPOSER.currentChallenge}</span>
              <span className="inline-flex min-h-9 items-center rounded-full border border-brand-soft bg-brand/20 px-3 text-sm font-medium text-ink" data-testid="signal-capsule">
                {challenge}
              </span>
              <Button variant="ghost" className="min-h-9 text-sm" onClick={onEditSignal}>
                {COMPOSER.editSignal}
              </Button>
              {state.sample ? <StatusLabel>{COMPOSER.sampleLoaded}</StatusLabel> : null}
            </>
          ) : (
            <StatusLabel tone="brand">{AT_REST.guidedSample}</StatusLabel>
          )}
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start">
        <div className="order-first flex flex-col gap-2 rounded-lg border border-line bg-canvas/60 p-2 lg:order-none sm:p-3">
          <div className="mx-auto w-full max-w-[340px] sm:max-w-[420px] lg:max-w-none">
            <SceneMap
              key={state.activationId}
              active={active}
              department={department}
              challengeLabel={challenge}
              reducedMotion={reducedMotion}
              highlight={state.activeRole}
              onDone={onActivationDone}
            />
          </div>
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 px-1 text-[11px] text-ink-muted" aria-label="Who prepares, checks and approves">
            {SCENE.authorityChain.map((step, i) => (
              <li key={step} className="flex items-center gap-1.5">
                <span className={i === SCENE.authorityChain.length - 1 ? "font-semibold text-ink" : ""}>{step}</span>
                {i < SCENE.authorityChain.length - 1 ? <span aria-hidden="true">→</span> : null}
              </li>
            ))}
          </ol>
        </div>

        <div className="flex flex-col gap-3">
          {active && hypothesis ? (
            <div className="flex flex-col gap-2 motion-safe:animate-rise" style={{ animationDelay: reducedMotion ? undefined : "200ms" }}>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-soft">{SCENE.basedOn}</p>
              <p className="text-base font-medium leading-snug text-ink sm:text-lg" data-testid="hypothesis">
                <span className="text-ink-muted">{AGENTS.strategos.name}: </span>“{hypothesis}”
              </p>
              <p className="text-sm text-ink-muted">
                {assumedSample ? `${SCENE.sampleShown(PATHS[state.activePath].name)} · ${SCENE.refineHint}` : SCENE.illustrative}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              <p className="text-xl font-semibold leading-tight tracking-tight text-ink sm:text-2xl">{AT_REST.title}</p>
              <p className="text-sm text-ink-muted sm:text-base">{SCENE.restPrompt}</p>
            </div>
          )}

          {state.description ? (
            <div className="flex flex-col gap-1 rounded-md border border-line bg-canvas/50 px-3 py-2">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">{COMPOSER.optionalCapsule}</p>
              <p className="text-sm text-ink">“{state.description}”</p>
            </div>
          ) : null}

          {!active && composer ? <div className="hidden lg:block">{composer}</div> : null}

          {/* Mobile: the operating-map rail is signalled inside the first viewport. */}
          <ol className="flex flex-wrap gap-1.5 lg:hidden" aria-label={MAP_WRAPPER.h1}>
            {CARD_ORDER.map((card) => (
              <li key={card.key}>
                <a
                  href={`#${card.anchor}`}
                  className={`inline-flex min-h-7 items-center gap-1 rounded-full border px-2 text-[11px] ${
                    active && state.activeCard === card.key ? "border-brand-soft text-ink" : "border-line text-ink-muted"
                  }`}
                >
                  <span className="font-semibold">{card.index + 1}</span> {MAP_WRAPPER.cardTitles[card.index]}
                </a>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
