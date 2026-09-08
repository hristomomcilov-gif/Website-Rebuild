import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AiCardApp } from "@/features/ai-card-app/components/AiCardApp";
import { APP_META } from "@/features/ai-card-app/content/appCopy";
import { AI_CARD_PREVIEW_ENABLED } from "@/lib/featureFlags";

/**
 * App-first AI Card preview (Experience Reset v2). Lives beside the frozen
 * v1 wizard at `/ai-card/` so both can be reviewed and either can be rolled
 * back. Same preview flag, same noindex, no sitemap or navigation entry.
 * The final canonical route remains Chris's decision.
 */
export const metadata: Metadata = {
  title: APP_META.title,
  description: APP_META.description,
  robots: { index: false, follow: false },
};

export default function AiCardAppPage() {
  if (!AI_CARD_PREVIEW_ENABLED) notFound();
  return <AiCardApp />;
}
