import type { ReactNode } from "react";

/**
 * Native, keyboard-operable progressive disclosure. Used for "Why are you
 * asking?", "What Teamulate does not know yet" and similar trust copy.
 */
export function Disclosure({
  summary,
  children,
  defaultOpen = false,
  className = "",
}: {
  summary: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
}) {
  return (
    <details
      className={`group rounded-md border border-line bg-panel/60 open:bg-panel ${className}`}
      open={defaultOpen || undefined}
    >
      <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-medium text-ink marker:content-none [&::-webkit-details-marker]:hidden">
        <span>{summary}</span>
        <span
          aria-hidden="true"
          className="text-ink-muted transition-transform duration-150 group-open:rotate-180"
        >
          ▾
        </span>
      </summary>
      <div className="px-4 pb-4 text-sm leading-relaxed text-ink-muted">{children}</div>
    </details>
  );
}
