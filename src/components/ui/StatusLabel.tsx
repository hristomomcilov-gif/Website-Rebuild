import type { ReactNode } from "react";

type Tone = "neutral" | "measure" | "approval" | "ready" | "brand";

const tones: Record<Tone, string> = {
  neutral: "border-line text-ink-muted",
  measure: "border-measure-deep/70 text-measure",
  approval: "border-approval-deep/70 text-approval",
  ready: "border-ready/60 text-ready",
  brand: "border-brand-soft/70 text-brand-soft",
};

/**
 * Textual status label. Meaning is always carried by the text; the tone is a
 * secondary cue only (Wireframe §12: never colour alone).
 */
export function StatusLabel({ tone = "neutral", children, className = "" }: { tone?: Tone; children: ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium tracking-wide ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
