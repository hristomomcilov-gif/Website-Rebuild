import type { AgentSheet, SheetKey } from "./types";

const GENERIC_GAP =
  "Teamulate has not connected to your CRM, analytics, website, advertising accounts, budget, customer data or private documents. This Card does not make a claim about those systems.";

/**
 * Controlled agent mini-conversations — Content & Conversation Script v1 §12.
 * Only roles with an approved scripted answer have a sheet. Wordsmith, Pixel
 * and Socialite have no approved answer yet, so no "Ask" affordance is shown
 * for them (see docs/KNOWN_GAPS_AND_ASSUMPTIONS.md).
 */
export const AGENT_SHEETS: Partial<Record<SheetKey, AgentSheet>> = {
  strategos: {
    sheet: "strategos",
    name: "Strategos",
    role: "Head of Marketing / Orchestrator",
    question: "Why do you start with an operating problem?",
    answer:
      "Because a marketing tool can create more activity without fixing the system that turns activity into results. We first identify where work, ownership, information or approval is breaking down. Then we choose the right workflow and specialists.",
    knownGap: GENERIC_GAP,
  },
  scout: {
    sheet: "scout",
    name: "Scout",
    role: "Intelligence & Product Marketing",
    question: "Why does research come first?",
    answer:
      "Good execution starts with buyer truth. Scout helps turn market, customer, competitor and product evidence into clearer priorities, positioning and proof. We do not treat assumptions as confirmed facts.",
    knownGap: GENERIC_GAP,
  },
  seeker: {
    sheet: "seeker",
    name: "Seeker",
    role: "Search & GEO",
    question: "What would you measure for search and GEO?",
    answer:
      "We would begin with the buyer questions that matter, the pages and technical conditions required to answer them, visibility across search surfaces and the quality of the conversion path. A live review determines which sources are available and how fresh they are.",
    knownGap:
      "No website, Search Console or analytics data is connected in this sample.",
  },
  flow: {
    sheet: "flow",
    name: "Flow",
    role: "Web & CRO",
    question: "Where would conversion be leaking?",
    answer:
      "We cannot diagnose your site without permitted evidence. In a live review, Flow would examine the journey from intent to next action: message clarity, page structure, forms, friction, technical performance, measurement and handoff.",
    knownGap: GENERIC_GAP,
  },
  growthtrack: {
    sheet: "growthtrack",
    name: "GrowthTrack",
    role: "Demand Generation & Paid Growth",
    question: "Will this immediately run ads or outreach?",
    answer:
      "No. Demand actions are prepared within the approved audience, message, budget and policy boundaries. Strategy, spend, outreach and publication remain human-approved decisions.",
    knownGap: GENERIC_GAP,
  },
  nexus: {
    sheet: "nexus",
    name: "Nexus",
    role: "Marketing Ops & CRM",
    question: "Can Teamulate work with our CRM?",
    answer:
      "Teamulate works through a defined, client-approved stack. We do not claim universal compatibility. A stack review confirms permissions, fields, routing, consent, tracking and health requirements before work is activated.",
    knownGap: GENERIC_GAP,
  },
  metric: {
    sheet: "metric",
    name: "Metric",
    role: "Analytics & Attribution",
    question: "Can you prove marketing caused revenue?",
    answer:
      "We show what the available data supports, how current it is and what cannot be confidently attributed. We do not turn incomplete data into false certainty.",
    knownGap: GENERIC_GAP,
  },
  guardian: {
    sheet: "guardian",
    name: "Guardian",
    role: "QA, Governance & Brand Assurance",
    question: "What keeps AI from publishing bad work?",
    answer:
      "Guardian checks factual and brand quality, source/claim support, approval state, duplicates and release readiness. Work that needs revision or approval is marked, not silently published.",
    knownGap: GENERIC_GAP,
  },
  human_oversight: {
    sheet: "human_oversight",
    name: "Human oversight",
    role: "Chris / client owner",
    question: "Where does the human stay involved?",
    answer:
      "Human oversight remains central to strategy, judgment, taste, relationships, major budgets, sensitive claims, legal or security decisions, crises and other high-impact actions. AI increases operating capacity; it does not remove accountability.",
    knownGap: GENERIC_GAP,
  },
};

export function getAgentSheet(sheet: SheetKey): AgentSheet | undefined {
  return AGENT_SHEETS[sheet];
}
