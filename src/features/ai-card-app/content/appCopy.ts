import { ACKNOWLEDGEMENTS } from "@/features/ai-card/content";
import type {
  AiCardPathKey,
  CompleteAnswers,
  PrimaryChallenge,
  QuestionKey,
} from "@/features/ai-card/content/types";

/**
 * Copy for the app-first AI Card (Experience Reset v2).
 *
 * Sources, in priority order:
 *  - Reset v2 §4/§5/§8 (Chris) — at-rest labels, problem chips, the demand
 *    hypothesis, the human-authority line and the "good V1 language".
 *  - Content & Conversation Script v1 — the controlled acknowledgements reused
 *    as Strategos' first response for the other four chips.
 *  - Copy Deck v1 / existing fixtures — everything rendered inside the cards.
 * Connective microcopy written here is marked `draft` in
 * docs/KNOWN_GAPS_AND_ASSUMPTIONS.md and needs Chris's sign-off.
 */
export const APP_CONTENT_VERSION = "ai-card-app-v2.0.0";

export const APP_META = {
  title: "Your AI Card — a sample marketing department | Teamulate",
  description:
    "Enter a sample Teamulate marketing department. Choose the problem slowing your marketing down and watch the operating map respond. Guided sample; no private systems connected.",
};

/** Reset v2 §5 Step A — the only labels allowed while the app is at rest. */
export const AT_REST = {
  title: "Your AI Card",
  guidedSample: "Guided sample",
  start: "Start with an operating problem",
  noPrivateSystems: "No private systems connected",
  trustLine: "Guided sample · No private systems connected",
} as const;

export const APP_SHELL = {
  brand: "Teamulate",
  rail: [
    { key: "ai-card", label: "AI Card", target: "#scene" },
    { key: "department", label: "Department", target: "#card-department" },
    { key: "workflow", label: "Workflow", target: "#card-workflow" },
    { key: "proof", label: "Proof", target: "#card-control" },
    { key: "research", label: "Research", target: "https://teamulate.ca/research/marketing-team-cost-2026/" },
  ],
  strategosRole: "Strategos · Head of Marketing",
  previewTag: "Preview",
} as const;

/** Reset v2 §5 Step B. Chip labels are verbatim from the brief. */
export const COMPOSER = {
  question: "What is slowing your marketing down?",
  chips: [
    { value: "consistent_demand", label: "More qualified demand" },
    { value: "fragmented", label: "Fragmented marketing" },
    { value: "backlog_capacity", label: "Too little capacity" },
    { value: "website_conversion", label: "Website conversion" },
    { value: "measurement_visibility", label: "We cannot see what is working" },
  ] as ReadonlyArray<{ value: Exclude<PrimaryChallenge, "explore_sample">; label: string }>,
  optionalLabel: "Describe the problem in your own words (optional)",
  optionalPlaceholder: "e.g. We publish a lot but nothing reliably turns into pipeline.",
  optionalHint: "Reflected back as your context only. It is not analysed and does not change the sample.",
  optionalCapsule: "Your context · used for this sample only",
  maxLength: 240,
  editSignal: "Edit signal",
  currentChallenge: "Your current challenge",
  exploreHeading: "Or explore a complete sample",
  exploreSamples: [
    { path: "msp_demand", label: "MSP sample" },
    { path: "cybersecurity_trust", label: "Cybersecurity sample" },
    { path: "services_coordination", label: "Services sample" },
  ] as ReadonlyArray<{ path: Exclude<AiCardPathKey, "fragmented_operation">; label: string }>,
  sampleLoaded: "Complete sample loaded",
} as const;

/**
 * Strategos' first response after one selection (Reset v2 §5 Step C).
 * `consistent_demand` is the example sentence from the brief; the others are
 * the Script's approved acknowledgements.
 */
export const HYPOTHESES: Record<Exclude<PrimaryChallenge, "explore_sample">, string> = {
  consistent_demand:
    "More qualified demand is rarely a single-channel problem. The first map connects buyer evidence, discoverability, conversion and handoff before we add more activity.",
  fragmented: ACKNOWLEDGEMENTS.fragmented!,
  backlog_capacity: ACKNOWLEDGEMENTS.backlog_capacity!,
  website_conversion: ACKNOWLEDGEMENTS.website_conversion!,
  measurement_visibility: ACKNOWLEDGEMENTS.measurement_visibility!,
};

/** Reset v2 §8 "Good V1 language". */
export const SCENE = {
  basedOn: "Based on the challenge you selected…",
  hypothesisLabel: "Here is a sample operating hypothesis.",
  restPrompt: "Pick the problem below and the department responds.",
  illustrative:
    "This configuration is illustrative; a live review validates your actual stack and context.",
  refineHint: "You can refine this map with one more detail.",
  sampleShown: (name: string) => `Sample shown: ${name}`,
  authorityChain: [
    "Strategos prepares",
    "Metric checks evidence",
    "Guardian checks quality and policy",
    "Your designated owner approves",
  ],
  activeRoles: "Active roles",
  restingRoles: "Department at rest",
  roleHint: "Tap a role to see what it contributes.",
  yourSignal: "Your selected signal",
  noSignal: "No signal selected yet",
  skipMotion: "Skip",
  mapDescriptionRest:
    "A department map at rest: Strategos in the centre with Scout, Wordsmith, Flow and Nexus present, and the Metric and Guardian checkpoints below. Nothing is running.",
  mapDescriptionActive: (challenge: string, roles: string) =>
    `Department map for the challenge “${challenge}”: Strategos coordinates ${roles}; Metric attaches a measurement checkpoint and Guardian an approval checkpoint.`,
} as const;

export const OPERATING_RAIL = {
  heading: "Your operating map",
  intro: "Five cards. Explore them in any order; the first is ready as soon as you choose a problem.",
  restSummary: [
    "Where growth is most likely stalling and what to validate first.",
    "The roles that would work on this first, and why.",
    "One coordinated workflow with visible approval gates.",
    "What keeps moving and which decisions stay human.",
    "A directional 90-day map — establish truth, activate, learn.",
  ],
  locked: "Choose a problem to fill this card",
  open: "Open",
  active: "Active",
  collapse: "Collapse",
} as const;

export type CardKey = "bottleneck" | "department" | "workflow" | "control" | "90_days";

export const CARD_ORDER: ReadonlyArray<{ key: CardKey; anchor: string; index: number }> = [
  { key: "bottleneck", anchor: "card-bottleneck", index: 0 },
  { key: "department", anchor: "card-department", index: 1 },
  { key: "workflow", anchor: "card-workflow", index: 2 },
  { key: "control", anchor: "card-control", index: 3 },
  { key: "90_days", anchor: "card-90-days", index: 4 },
];

/**
 * Reset v2 §5 Step E — contextual refinement. Each entry says where the
 * question may appear and, in the visitor's language, why it matters.
 */
export const REFINEMENT: Record<
  Exclude<QuestionKey, "primaryChallenge">,
  { title: string; why: string; appearsOn: ReadonlyArray<CardKey | "refine"> }
> = {
  businessType: {
    title: "What kind of company is this for?",
    why: "It changes which department and workflow story you see.",
    appearsOn: ["refine"],
  },
  currentCapacity: {
    title: "Who does marketing today?",
    why: "It makes the capacity and coordination diagnosis more useful.",
    appearsOn: ["bottleneck", "90_days"],
  },
  businessGoal: {
    title: "What would you most like to be true in 90 days?",
    why: "It makes the recommended motion concrete.",
    appearsOn: ["workflow", "90_days"],
  },
  operatingFriction: {
    title: "Where does work most often stall?",
    why: "It chooses the first repair point in the workflow.",
    appearsOn: ["workflow"],
  },
};

export const REFINE = {
  cta: "Refine this sample",
  sheetTitle: "Refine this sample",
  sheetIntro: "Optional. Each answer visibly changes the map; none is required.",
  optionalTag: "Optional",
  answered: "Answered",
  change: "Change",
  skipForNow: "Not now",
  moreDetail: "One optional detail makes this card more specific",
  whyLabel: "Why it matters",
  done: "Done",
} as const;

export const HANDOFF_STRIP = {
  dashboard: "See the department on a sample dashboard",
  review: "Request a live operating review",
  restart: "Start a new sample",
} as const;

export const CANONICAL_SAMPLES: Record<Exclude<AiCardPathKey, "fragmented_operation">, CompleteAnswers> = {
  msp_demand: {
    primaryChallenge: "consistent_demand",
    businessType: "msp",
    currentCapacity: "one_marketer",
    businessGoal: "qualified_demand",
    operatingFriction: "handoffs_tools",
  },
  cybersecurity_trust: {
    primaryChallenge: "fragmented",
    businessType: "cybersecurity",
    currentCapacity: "small_team",
    businessGoal: "positioning_trust",
    operatingFriction: "launch_confidence",
  },
  services_coordination: {
    primaryChallenge: "backlog_capacity",
    businessType: "professional_services",
    currentCapacity: "founder_led",
    businessGoal: "measurement_visibility",
    operatingFriction: "prioritization",
  },
};
