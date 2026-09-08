import Link from "next/link";
import type { ReactNode } from "react";
import { StatusLabel } from "@/components/ui/StatusLabel";
import { LABELS } from "../content";

export type AiCardShellProps = {
  /** Top-bar stage label: "Guided sample", "2 of 5" or "Your operating map". */
  stageLabel: string;
  showContextLine: boolean;
  onBack?: () => void;
  onRestart?: () => void;
  /** Left orientation rail (desktop only). */
  leftRail?: ReactNode;
  /** Right context rail (desktop) — rendered below the canvas on mobile. */
  rightRail?: ReactNode;
  children: ReactNode;
};

/**
 * Mobile-first application shell (Wireframe §6). One primary canvas; desktop
 * adds orientation and context rails without adding hidden meaning.
 */
export function AiCardShell({ stageLabel, showContextLine, onBack, onRestart, leftRail, rightRail, children }: AiCardShellProps) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-10 border-b border-line bg-canvas/95 backdrop-blur supports-[backdrop-filter]:bg-canvas/80">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-3 px-4">
          <div className="flex min-w-0 items-center gap-2">
            {onBack ? (
              <button
                type="button"
                onClick={onBack}
                className="flex h-10 min-w-10 items-center justify-center gap-1 rounded-full px-2 text-sm font-medium text-ink-muted hover:text-ink"
              >
                <span aria-hidden="true">←</span>
                <span className="hidden sm:inline">{LABELS.back}</span>
                <span className="sr-only sm:hidden">{LABELS.back}</span>
              </button>
            ) : (
              <Link href="/" className="flex h-10 items-center gap-2 rounded-full px-2 text-sm font-semibold text-ink" aria-label="Teamulate home">
                <span aria-hidden="true" className="inline-block h-2.5 w-2.5 rounded-full bg-brand-soft" />
                Teamulate
              </Link>
            )}
          </div>
          <p className="truncate text-sm font-semibold text-ink">{LABELS.pageLabel}</p>
          <div className="flex items-center gap-2">
            <StatusLabel>{stageLabel}</StatusLabel>
            {onRestart ? (
              <button
                type="button"
                onClick={onRestart}
                className="hidden h-10 items-center rounded-full px-3 text-sm font-medium text-ink-muted hover:text-ink sm:inline-flex"
              >
                {LABELS.startOver}
              </button>
            ) : null}
          </div>
        </div>
        {showContextLine ? (
          <p className="mx-auto w-full max-w-6xl px-4 pb-2 text-xs text-ink-faint">{LABELS.trustLine}</p>
        ) : null}
      </header>

      <main id="main-content" className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:py-8">
        <div className={`grid gap-8 ${leftRail || rightRail ? "md:grid-cols-[200px_minmax(0,1fr)] lg:grid-cols-[220px_minmax(0,1fr)_280px]" : ""}`}>
          {leftRail ? <aside className="hidden md:block">{leftRail}</aside> : null}
          <div className="mx-auto w-full max-w-2xl md:mx-0">{children}</div>
          {rightRail ? <aside className="lg:block">{rightRail}</aside> : null}
        </div>
        {onRestart ? (
          <div className="mt-8 sm:hidden">
            <button type="button" onClick={onRestart} className="min-h-11 text-sm font-medium text-ink-muted underline-offset-4 hover:text-ink hover:underline">
              {LABELS.startOver}
            </button>
          </div>
        ) : null}
      </main>
    </div>
  );
}
