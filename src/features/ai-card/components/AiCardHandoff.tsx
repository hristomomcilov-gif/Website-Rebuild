"use client";

import { useEffect, useRef } from "react";
import { Button, LinkButton } from "@/components/ui/Button";
import { StatusLabel } from "@/components/ui/StatusLabel";
import { DESTINATIONS, HANDOFF, LABELS, MAP_WRAPPER } from "../content";

/**
 * W12 sample-dashboard gateway and W13 live-operating-review hand-off.
 * Links go only to destinations that already exist on the live site; no form
 * is rendered and no data is submitted (Implementation Brief §6).
 */
export function AiCardHandoff({ kind, onBack, onOpenReview }: { kind: "dashboard" | "review"; onBack: () => void; onOpenReview: () => void }) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    headingRef.current?.focus();
  }, [kind]);

  if (kind === "dashboard") {
    return (
      <section aria-labelledby="handoff-heading" className="flex flex-col gap-6 motion-safe:animate-rise">
        <div className="flex flex-col gap-3">
          <h1 id="handoff-heading" ref={headingRef} tabIndex={-1} className="text-2xl font-semibold leading-tight tracking-tight outline-none sm:text-3xl">
            {HANDOFF.completion.h2}
          </h1>
          <p className="max-w-prose text-base leading-relaxed text-ink-muted">{HANDOFF.completion.body}</p>
          <p className="max-w-prose text-sm leading-relaxed text-ink-muted">{HANDOFF.dashboardGateway.body}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <LinkButton href={DESTINATIONS.sampleDashboard} external>
            {HANDOFF.dashboardGateway.primaryCta}
          </LinkButton>
          <LinkButton href={DESTINATIONS.team} variant="secondary" external>
            {HANDOFF.dashboardGateway.secondaryCta}
          </LinkButton>
          <Button variant="ghost" onClick={onOpenReview}>
            {HANDOFF.completion.secondaryCta}
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm text-ink-muted">
          <StatusLabel>{LABELS.guidedSample}</StatusLabel>
          <span>{HANDOFF.dashboardGateway.disclosure}</span>
        </div>
        <div>
          <Button variant="ghost" onClick={onBack}>
            {MAP_WRAPPER.backToMap}
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section aria-labelledby="handoff-heading" className="flex flex-col gap-6 motion-safe:animate-rise">
      <div className="flex flex-col gap-3">
        <h1 id="handoff-heading" ref={headingRef} tabIndex={-1} className="text-2xl font-semibold leading-tight tracking-tight outline-none sm:text-3xl">
          {HANDOFF.review.h2}
        </h1>
        <p className="max-w-prose text-base leading-relaxed text-ink-muted">{HANDOFF.review.body}</p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <LinkButton href={DESTINATIONS.requestReview} external>
          {HANDOFF.review.cta}
        </LinkButton>
        <Button variant="ghost" onClick={onBack}>
          {MAP_WRAPPER.backToMap}
        </Button>
      </div>
      <p className="text-sm text-ink-muted">{HANDOFF.review.formNote}</p>
    </section>
  );
}
