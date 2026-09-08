import type {
  AgentKey,
  AiCardPathKey,
  BusinessGoal,
  BusinessType,
  CompleteAnswers,
  PrimaryChallenge,
} from "../content/types";
import { PATHS } from "../content";

/**
 * Deterministic answer → fixture-path mapping (Implementation Brief §7.3,
 * Content & Conversation Script §7).
 *
 * A path matches when the business type, the primary challenge AND the
 * 90-day goal are all inside its allowed sets. Anything else resolves to the
 * transparent `fragmented_operation` fallback. Capacity and friction never
 * change the path; they are kept visible in "Based on your selections".
 *
 * This is a lookup table on enums — no scoring, no string matching, no
 * inference, no network.
 */
export type PathRule = {
  key: Exclude<AiCardPathKey, "fragmented_operation">;
  businessTypes: ReadonlySet<BusinessType>;
  challenges: ReadonlySet<PrimaryChallenge>;
  goals: ReadonlySet<BusinessGoal>;
};

export const PATH_RULES: ReadonlyArray<PathRule> = [
  {
    key: "msp_demand",
    businessTypes: new Set<BusinessType>(["msp"]),
    challenges: new Set<PrimaryChallenge>([
      "consistent_demand",
      "backlog_capacity",
      "fragmented",
    ]),
    goals: new Set<BusinessGoal>([
      "qualified_demand",
      "content_search",
      "positioning_trust",
      "website_conversion",
    ]),
  },
  {
    key: "cybersecurity_trust",
    businessTypes: new Set<BusinessType>(["cybersecurity"]),
    // The Script lists "fragmented marketing, unclear positioning, lack of
    // trust or content/search visibility". Positioning/trust/visibility are
    // captured by the goal set below; the challenge chips that can express
    // them are "fragmented" and "consistent_demand".
    challenges: new Set<PrimaryChallenge>(["fragmented", "consistent_demand"]),
    goals: new Set<BusinessGoal>([
      "positioning_trust",
      "qualified_demand",
      "content_search",
    ]),
  },
  {
    key: "services_coordination",
    businessTypes: new Set<BusinessType>([
      "professional_services",
      "technical_services",
      "other_b2b",
    ]),
    challenges: new Set<PrimaryChallenge>([
      "backlog_capacity",
      "fragmented",
      "measurement_visibility",
    ]),
    goals: new Set<BusinessGoal>([
      "measurement_visibility",
      "website_conversion",
      "lifecycle_crm",
      "qualified_demand",
      "positioning_trust",
    ]),
  },
];

export function resolveAiCardPath(answers: CompleteAnswers): AiCardPathKey {
  for (const rule of PATH_RULES) {
    if (
      rule.businessTypes.has(answers.businessType) &&
      rule.challenges.has(answers.primaryChallenge) &&
      rule.goals.has(answers.businessGoal)
    ) {
      return rule.key;
    }
  }
  return "fragmented_operation";
}

/**
 * Department for the resolved path, including the Script's conditional
 * specialists for Path C ("Seeker for search/GEO priority; GrowthTrack for
 * approved demand experiments"). Pixel has no answer-level signal in v1 and is
 * therefore never added automatically.
 */
export function resolveDepartment(
  pathKey: AiCardPathKey,
  answers: CompleteAnswers,
): ReadonlyArray<AgentKey> {
  const base = [...PATHS[pathKey].department];
  if (pathKey === "services_coordination" || pathKey === "fragmented_operation") {
    if (answers.businessGoal === "content_search" && !base.includes("seeker")) {
      base.splice(base.indexOf("wordsmith") + 1, 0, "seeker");
    }
    if (answers.businessGoal === "qualified_demand" && !base.includes("growthtrack")) {
      base.splice(base.indexOf("flow"), 0, "growthtrack");
    }
  }
  return base;
}
