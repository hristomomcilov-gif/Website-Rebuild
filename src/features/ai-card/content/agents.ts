import type { AgentDefinition, AgentKey } from "./types";

/**
 * The 11-role department. Names, roles and missions are taken from the Team
 * page section of the Copy Deck v1 (§30). `mapLabel` is the short action
 * label used on the department-map nodes.
 */
export const AGENTS: Record<AgentKey, AgentDefinition> = {
  strategos: {
    key: "strategos",
    name: "Strategos",
    role: "Head of Marketing / Orchestrator",
    mission:
      "Turns business goals into a coordinated marketing plan and keeps the department aligned on priorities, approvals and learning.",
    mapLabel: "Coordinates",
  },
  scout: {
    key: "scout",
    name: "Scout",
    role: "Intelligence & Product Marketing",
    mission:
      "Turns market, customer, competitor and product evidence into decision-ready insight, positioning, messaging and sales-enablement input.",
    mapLabel: "Buyer evidence",
  },
  wordsmith: {
    key: "wordsmith",
    name: "Wordsmith",
    role: "Content, Social & Community",
    mission:
      "Runs the editorial engine — creating, repurposing and distributing useful content across owned, founder and social channels.",
    mapLabel: "Content",
  },
  seeker: {
    key: "seeker",
    name: "Seeker",
    role: "Search & GEO",
    mission:
      "Improves qualified discoverability across traditional search and generative-AI search surfaces through evidence-based SEO and GEO work.",
    mapLabel: "Search / GEO",
  },
  growthtrack: {
    key: "growthtrack",
    name: "GrowthTrack",
    role: "Demand Generation & Paid Growth",
    mission:
      "Builds qualified demand across approved paid, account-based and outbound motions inside audience, spend and communication guardrails.",
    mapLabel: "Demand",
  },
  pixel: {
    key: "pixel",
    name: "Pixel",
    role: "Creative Studio",
    mission:
      "Produces the visual and video assets the department needs from structured briefs, keeping design, motion and production connected to the strategy.",
    mapLabel: "Creative",
  },
  flow: {
    key: "flow",
    name: "Flow",
    role: "Web & CRO",
    mission:
      "Turns traffic and messaging into reliable conversion experiences, then improves them through structured testing and governed experimentation.",
    mapLabel: "Conversion",
  },
  socialite: {
    key: "socialite",
    name: "Socialite",
    role: "Lifecycle & Customer Marketing",
    mission:
      "Manages the relationship journey from lead nurture through onboarding, adoption, retention, expansion and advocacy.",
    mapLabel: "Lifecycle",
  },
  nexus: {
    key: "nexus",
    name: "Nexus",
    role: "Marketing Ops & CRM",
    mission:
      "Keeps the marketing operating system, CRM, data flows, automation and lead handoff reliable, governed and observable.",
    mapLabel: "CRM / ops",
  },
  metric: {
    key: "metric",
    name: "Metric",
    role: "Analytics & Attribution",
    mission:
      "Provides an independent evidence layer that explains what happened, how confident the team can be and what cannot be attributed from the available data.",
    mapLabel: "Measure",
  },
  guardian: {
    key: "guardian",
    name: "Guardian",
    role: "QA, Governance & Brand Assurance",
    mission:
      "Prevents low-quality, misleading, inconsistent or unsafe work from reaching the public and acts as a release gate across the department.",
    mapLabel: "Quality / approval",
  },
};

export const ALL_AGENT_KEYS: ReadonlyArray<AgentKey> = [
  "strategos",
  "scout",
  "wordsmith",
  "seeker",
  "growthtrack",
  "pixel",
  "flow",
  "socialite",
  "nexus",
  "metric",
  "guardian",
];
