"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Native `<dialog>` wrapper: modal, Escape/backdrop to close, focus returned
 * by the browser to the invoking control. No composer is ever rendered here.
 */
export function ModalDialog({ labelledBy, describedBy, onClose, children, wide = false }: { labelledBy: string; describedBy?: string; onClose: () => void; children: ReactNode; wide?: boolean }) {
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
      onClose();
    };
    dialog.addEventListener("cancel", handleCancel);
    return () => dialog.removeEventListener("cancel", handleCancel);
  }, [onClose]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      className={`m-0 mt-auto max-h-[92dvh] w-full max-w-none overflow-y-auto rounded-t-lg border border-line bg-panel p-0 text-ink backdrop:bg-canvas/70 sm:m-auto sm:rounded-lg ${wide ? "sm:max-w-2xl" : "sm:max-w-lg"}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {children}
    </dialog>
  );
}
