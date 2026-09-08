import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AiCardExperience } from "@/features/ai-card/components/AiCardExperience";
import { META } from "@/features/ai-card/content";
import { AI_CARD_PREVIEW_ENABLED } from "@/lib/featureFlags";

/**
 * Proposed route `/ai-card/` (Copy Deck §18). Preview-only: the page exists in
 * a build only when NEXT_PUBLIC_AI_CARD_PREVIEW=true, is marked noindex and is
 * not referenced from any sitemap. Canonical route, navigation and sitemap
 * treatment remain decisions for Chris.
 */
export const metadata: Metadata = {
  title: META.title,
  description: META.description,
  robots: { index: false, follow: false },
  openGraph: {
    title: META.title,
    description: META.description,
    type: "website",
  },
};

export default function AiCardPage() {
  if (!AI_CARD_PREVIEW_ENABLED) notFound();
  return <AiCardExperience />;
}
