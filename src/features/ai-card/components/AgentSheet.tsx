"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { StatusLabel } from "@/components/ui/StatusLabel";
import { LABELS, MAP_WRAPPER, getAgentSheet } from "../content";
import type { SheetKey } from "../content/types";

/**
 * Controlled agent answer sheet (W11). A native modal dialog renders one
 * approved scripted reply. There is no composer, typing simulation or model.
 */
export function AgentSheet({ sheet, onClose }: { sheet: SheetKey; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const content = getAgentSheet(sheet);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (!dialog.open) {
      if (typeof dialog.showModal === "function") dialog.showModal();
      else dialog.setAttribute("open", "");
    }
    const handleCancel = (event: Event) => {
      event.preventDefault();
      onClose();
    };
    dialog.addEventListener("cancel", handleCancel);
    return () => dialog.removeEventListener("cancel", handleCancel);
  }, [onClose]);

  if (!content) return null;

  return (
    <dialog
      ref={ref}
      aria-labelledby="sheet-title"
      aria-describedby="sheet-answer"
      className="m-0 mt-auto w-full max-w-none rounded-t-lg border border-line bg-panel p-0 text-ink backdrop:bg-canvas/70 sm:m-auto sm:max-w-lg sm:rounded-lg"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="flex flex-col gap-4 p-5">
        <header className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-soft">{content.role}</p>
            <h2 id="sheet-title" className="text-xl font-semibold leading-snug">
              {content.name}
            </h2>
          </div>
          <StatusLabel>{LABELS.guidedSample}</StatusLabel>
        </header>

        <p className="text-sm font-medium text-ink-muted">“{content.question}”</p>
        <p id="sheet-answer" className="text-base leading-relaxed text-ink">
          {content.answer}
        </p>

        <div className="flex flex-col gap-1 rounded-md border border-line bg-canvas/40 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">{MAP_WRAPPER.knownGapHeading}</p>
          <p className="text-sm text-ink-muted">{content.knownGap}</p>
        </div>

        <div className="flex justify-end">
          <Button variant="secondary" onClick={onClose} autoFocus>
            {MAP_WRAPPER.backToDepartment}
          </Button>
        </div>
      </div>
    </dialog>
  );
}
