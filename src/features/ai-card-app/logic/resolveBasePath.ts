import { PATHS } from "@/features/ai-card/content";
import type {
  AgentKey,
  AiCardAnswers,
  AiCardPathKey,
  PrimaryChallenge,
} from "@/features/ai-card/content/types";
import { PATH_RULES, resolveDepartment } from "@/features/ai-card/logic/resolveAiCardPath";

/**
 * Path resolution for partial answers (Reset v2 §9: "primaryChallenge alone
 * resolves to an honest base fixture … the mapper should accept partial
 * answers and return a safe base path/fallback").
 *
 * 1. No challenge → the core operating model (transparent fallback).
 * 2. Challenge only → a fixed, documented base fixture per chip. Only the two
 *    chips whose fixture is literally about that problem get a named sample
 *    (demand → the MSP demand sample named in the brief; capacity → the
 *    services coordination sample). Everything else shows the core model
 *    rather than a false-specific diagnosis.
 * 3. Challenge + business type (+ optional goal) → the v1 rule table, with
 *    the goal test skipped while the goal is unknown.
 *
 * Still a lookup on enums: no scoring, no free text, no inference.
 */
export const BASE_PATH_BY_CHALLENGE: Record<PrimaryChallenge, AiCardPathKey> = {
  consistent_demand: "msp_demand",
  backlog_capacity: "services_coordination",
  fragmented: "fragmented_operation",
  website_conversion: "fragmented_operation",
  measurement_visibility: "fragmented_operation",
  explore_sample: "msp_demand",
};

export function resolveBasePath(answers: AiCardAnswers): AiCardPathKey {
  const { primaryChallenge, businessType, businessGoal } = answers;
  if (!primaryChallenge) return "fragmented_operation";
  if (!businessType) return BASE_PATH_BY_CHALLENGE[primaryChallenge];
  for (const rule of PATH_RULES) {
    if (
      rule.businessTypes.has(businessType) &&
      rule.challenges.has(primaryChallenge) &&
      (businessGoal === undefined || rule.goals.has(businessGoal))
    ) {
      return rule.key;
    }
  }
  return "fragmented_operation";
}

/** Department for a partial answer set; unknown goal adds no conditional role. */
export function resolveBaseDepartment(
  pathKey: AiCardPathKey,
  answers: AiCardAnswers,
): ReadonlyArray<AgentKey> {
  return resolveDepartment(pathKey, {
    primaryChallenge: answers.primaryChallenge ?? "fragmented",
    businessType: answers.businessType ?? "other_b2b",
    currentCapacity: answers.currentCapacity ?? "mixed",
    businessGoal: answers.businessGoal ?? "measurement_visibility",
    operatingFriction: answers.operatingFriction ?? "prioritization",
  });
}

/** True when the base fixture is the named sample rather than the visitor's business type. */
export function isAssumedSample(answers: AiCardAnswers): boolean {
  return answers.primaryChallenge !== undefined && answers.businessType === undefined;
}

export { PATHS };
