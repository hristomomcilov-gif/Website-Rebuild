import { cybersecurityTrust } from "./paths/cybersecurityTrust";
import { fragmentedOperation } from "./paths/fragmentedOperation";
import { mspDemand } from "./paths/mspDemand";
import { servicesCoordination } from "./paths/servicesCoordination";
import type { AiCardPathKey, CompleteAnswers, PathFixture } from "./types";

export * from "./types";
export * from "./copy";
export * from "./agents";
export * from "./agentSheets";

export const PATHS: Record<AiCardPathKey, PathFixture> = {
  msp_demand: mspDemand,
  cybersecurity_trust: cybersecurityTrust,
  services_coordination: servicesCoordination,
  fragmented_operation: fragmentedOperation,
};

/**
 * The transparent canonical fixture loaded by "Explore a sample". The answers
 * are shown to the visitor under the "Sample answers" label so the output is
 * never mistaken for a personal diagnosis.
 */
export const SAMPLE_ANSWERS: CompleteAnswers = {
  primaryChallenge: "consistent_demand",
  businessType: "msp",
  currentCapacity: "one_marketer",
  businessGoal: "qualified_demand",
  operatingFriction: "handoffs_tools",
};
