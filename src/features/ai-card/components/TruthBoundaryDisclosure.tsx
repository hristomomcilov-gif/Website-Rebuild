import { Disclosure } from "@/components/ui/Disclosure";
import { StatusLabel } from "@/components/ui/StatusLabel";
import { LABELS, MAP_WRAPPER, TRUST } from "../content";

/**
 * "Guided sample", unknowns, validation and approval explanations
 * (Copy Deck §22, Script §14). Rendered on every card and in the desktop rail.
 */
export function TruthBoundaryDisclosure({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex flex-col gap-2">
      {!compact ? (
        <div className="flex flex-wrap gap-2">
          <StatusLabel>{LABELS.basedOnSelections}</StatusLabel>
          <StatusLabel>{LABELS.guidedSample}</StatusLabel>
          <StatusLabel>{LABELS.noPrivateSystems}</StatusLabel>
        </div>
      ) : null}
      <Disclosure summary={MAP_WRAPPER.unknownLink}>
        <p>{MAP_WRAPPER.unknownBody}</p>
        <p className="mt-2">{TRUST.dataGap}</p>
      </Disclosure>
      <Disclosure summary={LABELS.requiresValidation}>{MAP_WRAPPER.validationBody}</Disclosure>
      <Disclosure summary={MAP_WRAPPER.approvalsLink}>
        <p>
          <span className="font-semibold text-ink">{LABELS.requiresApproval}.</span> {MAP_WRAPPER.approvalBody}
        </p>
      </Disclosure>
    </div>
  );
}
