import type { PrimaryChallenge, QuestionDefinition } from "./types";

/**
 * Approved public copy for the AI Card v1 wrapper states.
 *
 * Sources (verbatim unless noted in docs/KNOWN_GAPS_AND_ASSUMPTIONS.md):
 * - Content & Conversation Script v1 (§5, §6, §13, §14, §15)
 * - Homepage / AI Card / Team Page Copy Deck v1 (§18–§24)
 * - Mobile Wireframe & Motion Map v1 (§6.3, §8, §12)
 */

export const CONTENT_VERSION = "ai-card-content-v1.0.0";

export const LABELS = {
  guidedSample: "Guided sample",
  noPrivateSystems: "No private systems connected",
  basedOnSelections: "Based on your selections",
  requiresValidation: "Requires validation",
  requiresApproval: "Requires approval",
  trustLine: "Guided sample · no private systems connected",
  sourceLine: "Based on your selections · guided sample",
  pageLabel: "Your AI Card",
  headerMicrocopy: "Guided sample · no private data used",
  operatingMapProgress: "Your operating map",
  back: "Back",
  continue: "Continue",
  previous: "Previous",
  next: "Next",
  startOver: "Start a new sample operating map",
  startNewSample: "Start a new sample",
  exploreSample: "Explore a sample",
  exploreSampleInstead: "Explore a sample instead",
  whyAsking: "Why are you asking?",
  sampleAnswers: "Sample answers",
} as const;

export const META = {
  title: "Build a Sample Marketing Operating Map | Teamulate AI Card",
  description:
    "Answer five simple questions to see a guided sample of the Teamulate department, workflow, controls and first 90 days behind your marketing operating problem.",
} as const;

export const ENTRY = {
  eyebrow: "Start with the operating problem",
  h1: "What is slowing your marketing down?",
  body: "In about two minutes, Teamulate will build a sample operating map around the problem you choose. You will see the relevant department, the first coordinated workflow, what can keep moving and where you stay in control.",
  primaryCta: "Build my AI Card",
  secondaryCta: "Explore a sample",
  disclosure:
    "This is a guided sample, not a live audit. Teamulate cannot see your private tools, data, CRM, analytics, ad accounts, budget or documents.",
} as const;

export const HERO = {
  eyebrow: "Managed AI marketing department for growing B2B companies",
  h1: "A full marketing department. Without building one.",
  body: "Your dedicated marketing system works inside the tools you already use to plan, create, launch, measure and improve — continuously, with human oversight for the decisions that matter.",
  primaryCta: "Build my AI Card",
  secondaryCta: "See the team in action",
  trustLine:
    "Start with a guided sample. No client data or private-system access is used.",
  quietLine: "What is slowing your marketing down?",
  accessibilitySummary:
    "A business goal enters Teamulate. Strategos coordinates selected specialists. One decision waits for human approval, and the system prepares a measurable next action.",
  visualLabels: [
    "Business goal received",
    "Strategos is coordinating the work",
    "Approval required",
    "Measurement ready",
    "Guided sample",
  ],
} as const;

export const WELCOME = {
  header: "Strategos · Head of Marketing",
  name: "Strategos",
  role: "Head of Marketing",
  greeting: "Hi — I’m Strategos, Teamulate’s Head of Marketing.",
  intro:
    "I’ll map the operating problem first, not pitch you a tool. In about two minutes, you’ll see which parts of a marketing department would matter most for your business — and where you stay in control.",
  reassurance:
    "You will get a sample operating map, not a sales pitch or a live audit.",
} as const;

export const QUESTIONS: readonly [
  QuestionDefinition<"primaryChallenge">,
  QuestionDefinition<"businessType">,
  QuestionDefinition<"currentCapacity">,
  QuestionDefinition<"businessGoal">,
  QuestionDefinition<"operatingFriction">,
] = [
  {
    key: "primaryChallenge",
    question: "What is slowing your marketing down most right now?",
    options: [
      { value: "consistent_demand", label: "We need more consistent qualified demand" },
      { value: "fragmented", label: "Our marketing feels fragmented" },
      { value: "backlog_capacity", label: "We have too much backlog and too little capacity" },
      {
        value: "website_conversion",
        label: "Our website is not converting enough of the traffic we have",
      },
      { value: "measurement_visibility", label: "We cannot clearly see what is working" },
      { value: "explore_sample", label: "I want to explore a sample" },
    ],
    whyWeAsk:
      "Teamulate starts with the operating bottleneck. The right team and workflow depend on what is actually holding the system back.",
  },
  {
    key: "businessType",
    lead: "Good starting point. What kind of B2B business are you building?",
    question: "What kind of B2B business are you building?",
    options: [
      { value: "msp", label: "Managed IT / MSP" },
      { value: "cybersecurity", label: "Cybersecurity" },
      { value: "professional_services", label: "Professional services" },
      { value: "technical_services", label: "Technical services" },
      { value: "other_b2b", label: "Another B2B company" },
    ],
    whyWeAsk:
      "Buyer language, proof requirements, sales cycles and channel priorities differ by business model. This only chooses a sample operating path; it does not create a claim about your company.",
  },
  {
    key: "currentCapacity",
    question: "Who is carrying marketing today?",
    options: [
      { value: "founder_led", label: "Founder-led" },
      { value: "one_marketer", label: "One in-house marketer" },
      { value: "small_team", label: "A small in-house team" },
      { value: "vendors", label: "Agencies, freelancers or vendors" },
      { value: "mixed", label: "A mix of internal and external people" },
    ],
    whyWeAsk:
      "Capacity problems are not always headcount problems. We need to know whether the main friction is ownership, coordination, specialization or execution volume.",
  },
  {
    key: "businessGoal",
    question: "What do you most need marketing to improve over the next 90 days?",
    options: [
      { value: "qualified_demand", label: "A more consistent flow of qualified demand" },
      { value: "positioning_trust", label: "Clearer positioning and better buyer trust" },
      { value: "content_search", label: "More useful content and search visibility" },
      { value: "website_conversion", label: "Better website conversion" },
      { value: "lifecycle_crm", label: "Stronger lifecycle, CRM or lead follow-up" },
      {
        value: "measurement_visibility",
        label: "Clearer measurement and operating visibility",
      },
    ],
    whyWeAsk:
      "Teamulate connects activity to business priorities. A goal tells the department what to prioritize; it does not guarantee an outcome.",
  },
  {
    key: "operatingFriction",
    question: "Where does work most often get stuck?",
    options: [
      { value: "capacity", label: "We do not have enough capacity to keep things moving" },
      { value: "handoffs_tools", label: "Work gets lost between people, channels or tools" },
      { value: "prioritization", label: "We are not sure what to prioritize" },
      { value: "launch_confidence", label: "We cannot publish or launch confidently" },
      {
        value: "crm_tracking",
        label: "Our CRM, tracking or handoff process is unreliable",
      },
      { value: "proof", label: "We cannot prove what is working" },
    ],
    whyWeAsk:
      "This identifies the first workflow to fix. A department is valuable when it creates a reliable flow of work, not when it generates a longer task list.",
  },
];

/**
 * Controlled acknowledgements after the primary-challenge answer
 * (Wireframe & Motion Map v1, W02). The script defines copy for these five
 * categories only; other questions advance without an acknowledgement.
 */
export const ACKNOWLEDGEMENTS: Partial<Record<PrimaryChallenge, string>> = {
  consistent_demand:
    "That gives us a useful outcome to design around. Demand needs a connected path, not just more activity.",
  fragmented:
    "That usually points to an operating problem: handoffs, priorities, tools or ownership are no longer connected.",
  backlog_capacity:
    "More capacity matters only if the work is coordinated. Let’s identify what is causing the backlog.",
  website_conversion:
    "Traffic only becomes useful when the buyer can understand the message, trust the proof and take the next step.",
  measurement_visibility:
    "Visibility is a control problem as much as a reporting problem. We will mark what needs evidence.",
};

export const OPTIONAL_CONTEXT = {
  prompt:
    "One optional detail: describe your offer in one sentence, or choose “Continue with the sample”.",
  placeholder:
    "Example: We provide managed IT and security support for 50–500 employee companies in Ontario.",
  continueWithDescription: "Continue with my description",
  continueWithSample: "Continue with the sample",
  skip: "Skip",
  disclosure:
    "In this guided version, your answer creates a starting hypothesis only. Teamulate cannot see your CRM, analytics, ad accounts, budget or private documents.",
  capsuleLabel: "Your description — used for this sample only",
  maxLength: 240,
} as const;

export const ASSEMBLY = {
  h1: "Building a sample department around the problem you described.",
  subline: "Guided sample · no private systems connected",
  statuses: [
    "Strategos is structuring your operating map",
    "Scout is checking the buyer and message questions to validate",
    "Relevant specialists are joining the workflow",
    "Metric is defining what would need to be measured",
    "Guardian is marking approval and quality gates",
  ],
  complete: "Your sample operating map is ready.",
  cta: "View my operating map",
  accessibleDescription:
    "Strategos coordinates a sample workflow. Relevant specialist roles, Metric and Guardian are active for this operating path.",
  /** Wireframe §11 connection labels. */
  connectionLabels: { handoff: "Brief", measure: "Measure", approve: "Approve", qa: "QA" },
} as const;

export const MAP_WRAPPER = {
  h1: "Your sample operating map",
  intro:
    "This is a starting hypothesis based on the choices you made. A live operating review validates the actual business context, approved stack, data, priorities and decision model.",
  cardTitles: [
    "Operating bottleneck",
    "Your department",
    "First workflow",
    "Operations and control",
    "First 90 days",
  ],
  startWithBottleneck: "Start with the bottleneck",
  nextCardCtas: [
    "See the department",
    "See the workflow",
    "See what keeps moving",
    "See the 90-day map",
    "See the department on a sample dashboard",
  ],
  unknownLink: "What Teamulate does not know yet",
  approvalsLink: "How approvals work",
  unknownBody:
    "Teamulate has not connected to your CRM, analytics, website, advertising accounts, budget, customer data or private documents. This Card does not make a claim about those systems.",
  validationBody:
    "A live operating review confirms the problem, evidence, priorities, stack, owners and approval model before work is activated.",
  approvalBody:
    "A recommendation is not an action. High-impact work remains in an approval queue until the designated human owner decides.",
  validateHeading: "Validate in a live operating review",
  orchestrationStrip:
    "Strategos coordinates the work. Metric checks evidence. Guardian protects quality and approval boundaries. You retain high-impact decisions.",
  seeAllSpecialists: "See all 11 specialists",
  emailFormatLabel: "Client department email format:",
  emailFormat: "[agent].[yourcompany]@teamulate.ca",
  emailFormatNote:
    "In a configured client department, each specialist has a dedicated email identity. Direct requests remain connected to shared context, QA and approval rules.",
  approvalIsFeature: "Approval is a feature, not friction.",
  whatHappensNext:
    "The workflow is closed only when the result and learning return to the next decision.",
  card4Sections: {
    teamulate: "Teamulate can prepare, monitor or schedule when approved and low-risk",
    human: "Your team retains authority over",
  },
  workflowDescription:
    "A staged workflow from buyer problem through measurement and next decision, with marked approval gates.",
  controlDescription:
    "The first list shows low-risk work Teamulate can prepare or monitor when approved. The second list shows decisions retained by human owners.",
  ninetyDayDescription:
    "A three-stage directional plan: establish truth, activate one repeatable motion, then measure and improve.",
  gateLabels: {
    client_validation: "Needs client validation",
    approval: "Needs approval",
    staging_qa: "Staging and QA",
    measurement: "Ready for measurement",
  },
  askAgent: (name: string) => `Ask ${name}`,
  backToDepartment: "Back to your department",
  backToMap: "Back to my operating map",
  knownGapHeading: "Known gap in this sample",
} as const;

export const HANDOFF = {
  completion: {
    h2: "See the work behind the operating map.",
    body: "The AI Card shows the logic of a coordinated marketing department. The sample dashboard shows how goals, work, approvals, results and next actions become visible when that department is active.",
    primaryCta: "See the department on a sample dashboard",
    secondaryCta: "Request a live operating review",
    tertiary: "Start a new sample",
  },
  dashboardGateway: {
    body: "Your AI Card showed the operating model. The dashboard shows how work, approvals, goals, results and risks become visible once a department is active.",
    primaryCta: "Open the sample dashboard",
    secondaryCta: "Meet the full department",
    disclosure: "Sample dashboard data is clearly labeled and is not client data.",
  },
  review: {
    h2: "Turn the sample into a real operating review.",
    body: "Together, we validate the business context, approved tools, data, workflow priorities and decision model behind your Card. Teamulate does not connect to or change any system without explicit scope and approval.",
    cta: "Request a live operating review",
    formNote: "Do not include passwords, API keys or sensitive customer data.",
  },
} as const;

export const RESTART = {
  title: "Start a new sample operating map?",
  body: "Start again? Your current selections will be cleared from this session.",
  confirm: "Start again",
  cancel: "Keep my selections",
} as const;

export const TRUST = {
  general:
    "We ask only what changes the operating map. In this guided experience, Teamulate cannot see your private tools, data or systems.",
  sampleData:
    "This is a guided sample based on the choices you made. It is not a live audit, forecast or client-data view.",
  dataGap:
    "Unknown is not zero. Where information is missing, Teamulate marks what needs validation instead of inventing an answer.",
  approval:
    "A recommendation is not an action. High-impact work stays in an approval queue until the designated human owner decides.",
} as const;

export const FALLBACK_COPY = {
  strategosFallback:
    "Your situation may cross more than one operating path. Rather than make a false-specific diagnosis, I’ll show the core Teamulate model and flag the questions that need a live review.",
  lowConfidence:
    "Your answers point to more than one possible bottleneck. Rather than force a confident conclusion, the Card will show the core operating model and the questions to validate first.",
  technicalError:
    "Your sample operating map could not load. No data was changed. You can try again or explore the sample dashboard.",
  tryAgain: "Try again",
} as const;

/**
 * External destinations. These point at routes that exist on the live site
 * today (verified 2026-09-08 with HTTP 200). They are candidates only —
 * Chris must approve them before any public release.
 * See docs/AI_CARD_V1_AUDIT_AND_PLAN.md, "Decisions required".
 */
export const DESTINATIONS = {
  sampleDashboard: "https://teamulate.ca/demo/dashboard/",
  requestReview: "https://teamulate.ca/request-demo/",
  team: "https://teamulate.ca/team/",
  howItWorks: "https://teamulate.ca/how-it-works/",
} as const;
