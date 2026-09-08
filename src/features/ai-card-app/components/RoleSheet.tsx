"use client";

import { Button } from "@/components/ui/Button";
import { StatusLabel } from "@/components/ui/StatusLabel";
import { AGENTS, LABELS, MAP_WRAPPER, getAgentSheet } from "@/features/ai-card/content";
import type { PathFixture, SheetKey } from "@/features/ai-card/content/types";
import { ModalDialog } from "./ModalDialog";

/**
 * Controlled role sheet. Shows what a role contributes in this sample (fixture
 * reason + Copy Deck mission) and, where the Script provides one, the single
 * scripted question/answer. No free-form input exists.
 */
export function RoleSheet({ sheet, path, onClose }: { sheet: SheetKey; path: PathFixture; onClose: () => void }) {
  const scripted = getAgentSheet(sheet);
  const agent = sheet === "human_oversight" ? null : AGENTS[sheet];
  const reason = sheet === "human_oversight" ? null : path.card2.roles.find((r) => r.agent === sheet)?.reason;
  const name = scripted?.name ?? agent?.name ?? "";
  const role = scripted?.role ?? agent?.role ?? "";

  return (
    <ModalDialog labelledBy="role-sheet-title" describedBy="role-sheet-body" onClose={onClose}>
      <div className="flex flex-col gap-4 p-5">
        <header className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-soft">{role}</p>
            <h2 id="role-sheet-title" className="text-xl font-semibold leading-snug">
              {name}
            </h2>
          </div>
          <StatusLabel>{LABELS.guidedSample}</StatusLabel>
        </header>

        <div id="role-sheet-body" className="flex flex-col gap-3">
          {reason ? <p className="text-base leading-relaxed text-ink">{reason}</p> : null}
          {agent ? <p className="text-sm leading-relaxed text-ink-muted">{agent.mission}</p> : null}
          {scripted ? (
            <div className="flex flex-col gap-2 rounded-md border border-line bg-canvas/40 px-4 py-3">
              <p className="text-sm font-medium text-ink-muted">“{scripted.question}”</p>
              <p className="text-base leading-relaxed text-ink">{scripted.answer}</p>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">{MAP_WRAPPER.knownGapHeading}</p>
              <p className="text-sm text-ink-muted">{scripted.knownGap}</p>
            </div>
          ) : null}
        </div>

        <div className="flex justify-end">
          <Button variant="secondary" onClick={onClose}>
            {MAP_WRAPPER.backToMap}
          </Button>
        </div>
      </div>
    </ModalDialog>
  );
}
