"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { RESTART } from "../content";

export function RestartDialog({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (!dialog.open) {
      if (typeof dialog.showModal === "function") dialog.showModal();
      else dialog.setAttribute("open", "");
    }
    const handleCancel = (event: Event) => {
      event.preventDefault();
      onCancel();
    };
    dialog.addEventListener("cancel", handleCancel);
    return () => dialog.removeEventListener("cancel", handleCancel);
  }, [onCancel]);

  return (
    <dialog
      ref={ref}
      aria-labelledby="restart-title"
      aria-describedby="restart-body"
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-lg border border-line bg-panel p-0 text-ink backdrop:bg-canvas/70"
    >
      <div className="flex flex-col gap-4 p-5">
        <h2 id="restart-title" className="text-lg font-semibold">
          {RESTART.title}
        </h2>
        <p id="restart-body" className="text-sm leading-relaxed text-ink-muted">
          {RESTART.body}
        </p>
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="secondary" onClick={onCancel} autoFocus>
            {RESTART.cancel}
          </Button>
          <Button onClick={onConfirm}>{RESTART.confirm}</Button>
        </div>
      </div>
    </dialog>
  );
}
