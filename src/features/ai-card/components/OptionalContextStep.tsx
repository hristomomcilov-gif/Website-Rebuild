"use client";

import { useEffect, useId, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { LABELS, OPTIONAL_CONTEXT } from "../content";
import { StrategosMark } from "./StrategosMark";

export type OptionalContextStepProps = {
  value: string;
  onChange: (value: string) => void;
  onContinueWithDescription: () => void;
  onContinueWithSample: () => void;
  onSkip: () => void;
  onBack: () => void;
};

export function OptionalContextStep({
  value,
  onChange,
  onContinueWithDescription,
  onContinueWithSample,
  onSkip,
  onBack,
}: OptionalContextStepProps) {
  const headingId = useId();
  const inputId = useId();
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  const trimmed = value.trim();

  return (
    <section aria-labelledby={headingId} className="flex flex-col gap-6 motion-safe:animate-rise">
      <div className="flex items-start gap-3">
        <StrategosMark size={32} />
        <h1 id={headingId} ref={headingRef} tabIndex={-1} className="text-xl font-semibold leading-snug outline-none sm:text-2xl">
          {OPTIONAL_CONTEXT.prompt}
        </h1>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor={inputId} className="text-sm font-medium text-ink-muted">
          Optional — one sentence
        </label>
        <textarea
          id={inputId}
          value={value}
          onChange={(e) => onChange(e.target.value.slice(0, OPTIONAL_CONTEXT.maxLength))}
          placeholder={OPTIONAL_CONTEXT.placeholder}
          rows={3}
          maxLength={OPTIONAL_CONTEXT.maxLength}
          autoComplete="off"
          spellCheck
          className="w-full rounded-md border border-line bg-panel px-4 py-3 text-base text-ink placeholder:text-ink-faint"
        />
        <p className="text-xs text-ink-faint">
          {value.length}/{OPTIONAL_CONTEXT.maxLength}
        </p>
        {trimmed ? (
          <p className="motion-safe:animate-fade inline-flex w-fit items-center gap-2 rounded-full border border-line px-3 py-1 text-xs text-ink-muted">
            {OPTIONAL_CONTEXT.capsuleLabel}
          </p>
        ) : null}
      </div>

      <p className="rounded-md border border-line bg-panel/60 px-4 py-3 text-sm leading-relaxed text-ink-muted">
        {OPTIONAL_CONTEXT.disclosure}
      </p>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <Button onClick={onContinueWithDescription} disabled={!trimmed} aria-disabled={!trimmed}>
          {OPTIONAL_CONTEXT.continueWithDescription}
        </Button>
        <Button variant="secondary" onClick={onContinueWithSample}>
          {OPTIONAL_CONTEXT.continueWithSample}
        </Button>
        <Button variant="ghost" onClick={onSkip}>
          {OPTIONAL_CONTEXT.skip}
        </Button>
        <Button variant="ghost" onClick={onBack} className="sm:ml-auto">
          {LABELS.back}
        </Button>
      </div>
    </section>
  );
}
