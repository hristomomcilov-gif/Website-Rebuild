/**
 * Build-time feature flags.
 *
 * The rebuild repository has no feature-flag vendor. A `NEXT_PUBLIC_*`
 * environment variable is the smallest reversible mechanism that works with
 * a static export: the flag is resolved at build time, so a production build
 * without the variable contains no AI Card route at all.
 */
export const AI_CARD_PREVIEW_ENABLED =
  process.env.NEXT_PUBLIC_AI_CARD_PREVIEW === "true";
