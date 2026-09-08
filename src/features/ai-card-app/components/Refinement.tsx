"use client";

import { Button } from "@/components/ui/Button";
import { StatusLabel } from "@/components/ui/StatusLabel";
import { QUESTIONS } from "@/features/ai-card/content";
import type { AiCardAnswers, AnswerValueFor, QuestionDefinition } from "@/features/ai-card/content/types";
import { REFINE, REFINEMENT, type CardKey } from "../content/appCopy";
import { REFINEMENT_KEYS, type RefinementKey } from "../logic/appStateMachine";
import { ModalDialog } from "./ModalDialog";

type AnswerHandler = (key: RefinementKey, value: AnswerValueFor<RefinementKey>) => void;

function questionFor(key: RefinementKey): QuestionDefinition {
  return QUESTIONS.find((q) => q.key === key)!;
}

function answerLabel(key: RefinementKey, answers: AiCardAnswers): string | null {
  const value = answers[key];
  if (!value) return null;
  return questionFor(key).options.find((o) => (o.value as string) === value)?.label ?? null;
}

function OptionChips({ q, current, onPick }: { q: QuestionDefinition; current: string | undefined; onPick: (value: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label={q.question}>
      {q.options.map((o) => {
        const pressed = current === o.value;
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={pressed}
            onClick={() => onPick(o.value)}
            className={`min-h-10 rounded-full border px-3 text-sm transition-colors duration-150 ${
              pressed ? "border-brand-soft bg-brand text-white" : "border-line-strong text-ink hover:border-white"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/**
 * Inline, optional context prompt rendered inside a card (Reset v2 §5 Step E).
 * Shows at most one unanswered question relevant to that card, with the
 * reason it matters. Never blocks the card content.
 */
export function RefinementPrompt({ card, answers, onAnswer }: { card: CardKey; answers: AiCardAnswers; onAnswer: AnswerHandler }) {
  const key = REFINEMENT_KEYS.find((k) => REFINEMENT[k].appearsOn.includes(card) && !answers[k]);
  if (!key) return null;
  const meta = REFINEMENT[key];
  const q = questionFor(key);
  return (
    <aside aria-label={REFINE.moreDetail} className="flex flex-col gap-3 rounded-md border border-dashed border-line-strong bg-canvas/40 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <StatusLabel>{REFINE.optionalTag}</StatusLabel>
        <p className="text-sm font-medium text-ink">{meta.title}</p>
      </div>
      <p className="text-xs text-ink-muted">
        <span className="font-semibold">{REFINE.whyLabel}:</span> {meta.why}
      </p>
      <OptionChips q={q} current={undefined} onPick={(v) => onAnswer(key, v as AnswerValueFor<RefinementKey>)} />
    </aside>
  );
}

/**
 * "Refine this sample" sheet: all four context questions, each optional,
 * answerable in any order, clearable. This replaces the wizard.
 */
export function RefinementSheet({ answers, focus, onAnswer, onClear, onClose }: { answers: AiCardAnswers; focus: RefinementKey; onAnswer: AnswerHandler; onClear: (key: RefinementKey) => void; onClose: () => void }) {
  return (
    <ModalDialog labelledBy="refine-title" describedBy="refine-intro" onClose={onClose} wide>
      <div className="flex flex-col gap-5 p-5">
        <header className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <h2 id="refine-title" className="text-xl font-semibold leading-snug">
              {REFINE.sheetTitle}
            </h2>
            <p id="refine-intro" className="text-sm text-ink-muted">
              {REFINE.sheetIntro}
            </p>
          </div>
          <StatusLabel>{REFINE.optionalTag}</StatusLabel>
        </header>

        <ul className="flex flex-col gap-4">
          {REFINEMENT_KEYS.map((key) => {
            const meta = REFINEMENT[key];
            const q = questionFor(key);
            const current = answers[key] as string | undefined;
            const label = answerLabel(key, answers);
            return (
              <li key={key} className={`flex flex-col gap-2 rounded-md border p-4 ${key === focus ? "border-brand-soft" : "border-line"}`}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-base font-medium text-ink">{meta.title}</p>
                  {label ? (
                    <div className="flex items-center gap-2">
                      <StatusLabel tone="ready">{REFINE.answered}</StatusLabel>
                      <button type="button" onClick={() => onClear(key)} className="text-sm text-ink-muted underline-offset-4 hover:text-ink hover:underline">
                        {REFINE.change}
                      </button>
                    </div>
                  ) : null}
                </div>
                <p className="text-xs text-ink-muted">
                  <span className="font-semibold">{REFINE.whyLabel}:</span> {meta.why}
                </p>
                {label ? (
                  <p className="text-sm text-ink">{label}</p>
                ) : (
                  <OptionChips q={q} current={current} onPick={(v) => onAnswer(key, v as AnswerValueFor<RefinementKey>)} />
                )}
              </li>
            );
          })}
        </ul>

        <div className="flex justify-end">
          <Button onClick={onClose}>{REFINE.done}</Button>
        </div>
      </div>
    </ModalDialog>
  );
}
