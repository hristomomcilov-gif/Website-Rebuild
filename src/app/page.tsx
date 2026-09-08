import { LinkButton } from "@/components/ui/Button";
import { StatusLabel } from "@/components/ui/StatusLabel";
import { DESTINATIONS, HERO, LABELS } from "@/features/ai-card/content";
import { AI_CARD_PREVIEW_ENABLED } from "@/lib/featureFlags";
import { HeroSystemMap } from "@/features/ai-card/components/HeroSystemMap";

/**
 * Preview homepage entry (W00). Only the hero from the Copy Deck (§4) is built
 * here: the rebuild repository has no other homepage sections yet, and the
 * live homepage CTA hierarchy must not change without Chris's approval. When
 * the preview flag is off, the CTA order keeps the live site's primary
 * ("See the team in action") and the AI Card CTA is absent.
 */
export default function HomePage() {
  return (
    <main id="main-content" className="flex min-h-dvh flex-col">
      <header className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4">
        <span className="flex items-center gap-2 text-sm font-semibold">
          <span aria-hidden="true" className="inline-block h-2.5 w-2.5 rounded-full bg-brand-soft" />
          Teamulate
        </span>
        <StatusLabel>Preview build</StatusLabel>
      </header>

      <section aria-labelledby="hero-heading" className="mx-auto grid w-full max-w-6xl flex-1 items-center gap-10 px-4 py-12 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] md:py-20">
        <div className="flex flex-col gap-6 motion-safe:animate-rise">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-soft">{HERO.eyebrow}</p>
          <h1 id="hero-heading" className="text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            {HERO.h1}
          </h1>
          <p className="max-w-prose text-lg leading-relaxed text-ink-muted">{HERO.body}</p>
          <p className="text-base font-medium text-ink">{HERO.quietLine}</p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {AI_CARD_PREVIEW_ENABLED ? (
              <>
                <LinkButton href="/ai-card/">{HERO.primaryCta}</LinkButton>
                <LinkButton href={DESTINATIONS.team} variant="secondary" external>
                  {HERO.secondaryCta}
                </LinkButton>
              </>
            ) : (
              <LinkButton href={DESTINATIONS.team} external>
                {HERO.secondaryCta}
              </LinkButton>
            )}
          </div>
          <p className="text-sm text-ink-muted">{HERO.trustLine}</p>
        </div>

        <div className="flex flex-col gap-3">
          <div className="rounded-lg border border-line bg-panel p-4">
            <HeroSystemMap />
          </div>
          <div className="flex flex-wrap gap-2">
            {HERO.visualLabels.map((label) => (
              <StatusLabel key={label} tone={label === LABELS.guidedSample ? "brand" : "neutral"}>
                {label}
              </StatusLabel>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
