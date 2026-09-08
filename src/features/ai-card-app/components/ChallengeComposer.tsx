"use client";

import { useId, useState } from "react";
import type { AiCardPathKey, PrimaryChallenge } from "@/features/ai-card/content/types";
import { COMPOSER } from "../content/appCopy";

type Props = {
  selected: PrimaryChallenge | undefined;
  description: string;
  onSelect: (value: Exclude<PrimaryChallenge, "explore_sample">) => void;
  onDescription: (value: string) => void;
  onExploreSample: (path: Exclude<AiCardPathKey, "fragmented_operation">) => void;
  /** Compact variant for the mobile bottom composer. */
  compact?: boolean;
};

/**
 * Reset v2 §5 Step B — one decisive signal. Chips are toggle buttons (not a
 * radio wizard step); the optional text is a secondary surface that is only
 * ever reflected back as visitor context.
 */
export function ChallengeComposer({ selected, description, onSelect, onDescription, onExploreSample, compact = false }: Props) {
  const headingId = useId();
  const textId = useId();
  const [showText, setShowText] = useState(description.length > 0);

  return (
    <section aria-labelledby={headingId} className="flex flex-col gap-3">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h2 id={headingId} className={`font-semibold tracking-tight text-ink ${compact ? "text-base" : "text-lg sm:text-xl"}`}>
          {COMPOSER.question}
        </h2>
        {!showText ? (
          <button
            type="button"
            onClick={() => setShowText(true)}
            className="text-xs text-ink-muted underline-offset-4 hover:text-ink hover:underline sm:text-sm"
          >
            {COMPOSER.optionalLabel}
          </button>
        ) : null}
      </div>
      <div className="flex flex-wrap gap-2" role="group" aria-labelledby={headingId}>
        {COMPOSER.chips.map((chip) => {
          const pressed = selected === chip.value;
          return (
            <button
              key={chip.value}
              type="button"
              aria-pressed={pressed}
              onClick={() => onSelect(chip.value)}
              className={`rounded-full border font-medium transition-colors duration-150 ${compact ? "min-h-10 px-3 text-[13px]" : "min-h-11 px-4 text-sm"} ${
                pressed
                  ? "border-brand-soft bg-brand text-white"
                  : "border-line-strong bg-panel/70 text-ink hover:border-white hover:bg-white/5"
              }`}
            >
              {chip.label}
            </button>
          );
        })}
      </div>

      {showText ? (
        <div className="flex flex-col gap-1.5">
          <label htmlFor={textId} className="text-sm font-medium text-ink">
            {COMPOSER.optionalLabel}
          </label>
          <textarea
            id={textId}
            value={description}
            maxLength={COMPOSER.maxLength}
            rows={compact ? 2 : 3}
            placeholder={COMPOSER.optionalPlaceholder}
            onChange={(e) => onDescription(e.target.value)}
            className="w-full resize-none rounded-md border border-line bg-canvas/60 px-3 py-2 text-base text-ink placeholder:text-ink-faint focus:border-brand-soft"
          />
          <p className="text-xs text-ink-muted">{COMPOSER.optionalHint}</p>
        </div>
      ) : null}

      {!compact ? (
        <div className="flex flex-wrap items-center gap-2 pt-1 text-sm text-ink-muted">
          <span>{COMPOSER.exploreHeading}</span>
          {COMPOSER.exploreSamples.map((s) => (
            <button
              key={s.path}
              type="button"
              onClick={() => onExploreSample(s.path)}
              className="min-h-9 rounded-full border border-line px-3 text-sm text-ink hover:border-white"
            >
              {s.label}
            </button>
          ))}
        </div>
      ) : null}
    </section>
  );
}
