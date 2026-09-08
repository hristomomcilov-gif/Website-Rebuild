"use client";

import { useEffect, useId, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Disclosure } from "@/components/ui/Disclosure";
import { ACKNOWLEDGEMENTS, LABELS, QUESTIONS, WELCOME } from "../content";
import type { AiCardAnswers, AnswerValueFor, PrimaryChallenge, QuestionKey } from "../content/types";
import type { QuestionIndex } from "../logic/stateMachine";
import { StrategosMark } from "./StrategosMark";

export type QuestionStepProps = {
  questionIndex: QuestionIndex;
  answers: AiCardAnswers;
  onAnswer: (question: QuestionKey, value: AnswerValueFor<QuestionKey>) => void;
  onContinue: () => void;
  onBack: () => void;
  onExploreSample: () => void;
};

export function QuestionStep({ questionIndex, answers, onAnswer, onContinue, onBack, onExploreSample }: QuestionStepProps) {
  const question = QUESTIONS[questionIndex];
  const selected = answers[question.key];
  const headingId = useId();
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Focus moves predictably to the new question on step change.
  useEffect(() => {
    headingRef.current?.focus({ preventScroll: false });
  }, [questionIndex]);

  const acknowledgement =
    questionIndex === 1 && answers.primaryChallenge
      ? ACKNOWLEDGEMENTS[answers.primaryChallenge as PrimaryChallenge]
      : undefined;

  return (
    <section aria-labelledby={headingId} className="flex flex-col gap-6" key={question.key}>
      <div className="flex flex-col gap-3 motion-safe:animate-rise">
        {questionIndex === 0 ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <StrategosMark />
              <p className="text-sm font-semibold text-ink">
                {WELCOME.name} <span className="text-ink-muted">· {WELCOME.role}</span>
              </p>
            </div>
            <div className="flex flex-col gap-2 rounded-lg border border-line bg-panel px-4 py-3">
              <p className="text-base font-medium text-ink">{WELCOME.greeting}</p>
              <p className="text-sm leading-relaxed text-ink-muted">{WELCOME.intro}</p>
              <p className="text-sm text-ink">{WELCOME.reassurance}</p>
            </div>
          </div>
        ) : null}
        {acknowledgement ? (
          <div className="flex items-start gap-3">
            <StrategosMark size={32} />
            <p className="rounded-lg border border-line bg-panel px-4 py-3 text-sm leading-relaxed text-ink-muted">
              {acknowledgement}
            </p>
          </div>
        ) : null}
        <fieldset className="flex flex-col gap-4">
          <legend className="contents">
            <h1
              id={headingId}
              ref={headingRef}
              tabIndex={-1}
              className="text-xl font-semibold leading-snug outline-none sm:text-2xl"
            >
              {question.lead ?? question.question}
            </h1>
          </legend>
          <div className="flex flex-col gap-2" role="radiogroup" aria-labelledby={headingId}>
            {question.options.map((option) => {
              const id = `${question.key}-${option.value}`;
              const isSelected = selected === option.value;
              return (
                <label
                  key={option.value}
                  htmlFor={id}
                  className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-md border px-4 py-3 text-base transition-colors duration-150 ${
                    isSelected
                      ? "border-brand-soft bg-panel-2 text-ink"
                      : "border-line bg-panel/60 text-ink-muted hover:border-line-strong hover:text-ink"
                  }`}
                >
                  <input
                    id={id}
                    type="radio"
                    name={question.key}
                    value={option.value}
                    checked={isSelected}
                    onChange={() => onAnswer(question.key, option.value)}
                    className="h-5 w-5 shrink-0 accent-brand"
                  />
                  <span className="flex-1">{option.label}</span>
                  {isSelected ? (
                    // The checked state is already announced; the visible badge is
                    // a non-colour cue for sighted users only.
                    <span aria-hidden="true" className="text-xs font-semibold uppercase tracking-wide text-brand-soft">
                      Selected
                    </span>
                  ) : null}
                </label>
              );
            })}
          </div>
        </fieldset>
      </div>

      <Disclosure summary={LABELS.whyAsking}>{question.whyWeAsk}</Disclosure>

      <div className="flex flex-wrap items-center gap-3">
        <Button variant="secondary" onClick={onBack}>
          {LABELS.back}
        </Button>
        <Button onClick={onContinue} disabled={selected === undefined} aria-disabled={selected === undefined}>
          {LABELS.continue}
        </Button>
        <Button variant="ghost" onClick={onExploreSample} className="ml-auto">
          {LABELS.exploreSampleInstead}
        </Button>
      </div>
    </section>
  );
}
