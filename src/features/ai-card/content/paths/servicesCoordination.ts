import type { PathFixture } from "../types";

/** Path C — Professional / technical services. Content & Conversation Script v1 §7, §11. */
export const servicesCoordination: PathFixture = {
  key: "services_coordination",
  name: "Professional / technical services — capacity and coordination",
  summary:
    "The immediate problem may look like lack of content or lack of leads. The deeper issue is often that nobody owns the complete system from insight through handoff, measurement and next action.",
  teachingPoint:
    "The immediate problem may look like lack of content or lack of leads. The deeper issue is often that nobody owns the complete system from insight through handoff, measurement and next action.",
  department: [
    "strategos",
    "scout",
    "wordsmith",
    "flow",
    "socialite",
    "nexus",
    "metric",
    "guardian",
  ],
  assemblyForeground: ["strategos", "scout", "flow", "nexus", "metric"],
  card1: {
    title: "Likely bottleneck: ownership and coordination are constraining execution.",
    body: [
      "Based on the path you selected, marketing may be relying on a founder, a small internal team or several external partners to move work across too many disciplines. The visible symptoms can be inconsistent content, a website that does not keep up, missed follow-up, unclear reporting or a growing backlog.",
      "The deeper problem is often that no one owns the complete loop from insight to content, conversion, handoff, measurement and next action.",
    ],
    unknown:
      "We do not know your offer, sales process, buying committee, current assets, martech stack, data quality or approval cadence.",
    validate:
      "Which important marketing task repeatedly starts but does not reliably reach a measured outcome?",
  },
  card2: {
    title: "The department that would connect the work",
    roles: [
      {
        agent: "strategos",
        reason: "Owns prioritization, dependencies, review cadence and the decision path.",
      },
      {
        agent: "scout",
        reason: "Clarifies ICP, buyer pain, positioning evidence and offer questions.",
      },
      {
        agent: "wordsmith",
        reason:
          "Converts approved insight into content, campaign and lifecycle communication.",
      },
      { agent: "flow", reason: "Improves web, form and conversion experiences." },
      {
        agent: "socialite",
        reason:
          "Connects marketing to nurture, onboarding, retention and advocacy opportunities.",
      },
      {
        agent: "nexus",
        reason:
          "Stabilizes CRM, routing, tracking, consent and marketing-system health.",
      },
      {
        agent: "metric",
        reason: "Establishes meaningful measurement and reports limits honestly.",
      },
      {
        agent: "guardian",
        reason: "Protects quality, factual accuracy, approvals and release readiness.",
      },
    ],
    note: "Strategos coordinates the work. Metric checks evidence. Guardian protects quality and approval boundaries. You retain high-impact decisions.",
    conditionalNote:
      "Seeker joins when discoverability, technical SEO or GEO is a priority. GrowthTrack joins for approved demand experiments. Pixel joins when a defined creative or motion need supports the workflow.",
    chips: [
      { label: "Ask why Scout starts here", sheet: "scout" },
      { label: "Ask what Metric would measure", sheet: "metric" },
      { label: "Ask where the human stays involved", sheet: "human_oversight" },
    ],
  },
  card3: {
    title: "A sample capacity-and-coordination workflow",
    stages: [
      {
        stage: "Turn the backlog into priorities",
        owner: "Strategos + Scout",
        output: "90-day priority and opportunity map",
        gate: "Client confirms goal and constraints",
        gateKind: "client_validation",
      },
      {
        stage: "Establish message and proof",
        owner: "Scout + Wordsmith",
        output: "Message, proof and content brief",
        gate: "Brand approval",
        gateKind: "approval",
      },
      {
        stage: "Build the conversion path",
        owner: "Flow + Wordsmith + Pixel when needed",
        output: "Landing page, form or content experience",
        gate: "Staging and QA",
        gateKind: "staging_qa",
      },
      {
        stage: "Connect lifecycle and ops",
        owner: "Socialite + Nexus",
        output: "Follow-up, routing, CRM and consent plan",
        gate: "Data / technical owner review",
        gateKind: "client_validation",
      },
      {
        stage: "Publish through controls",
        owner: "Guardian + Strategos",
        output: "Release packet and approval record",
        gate: "Required approval",
        gateKind: "approval",
      },
      {
        stage: "Measure and improve",
        owner: "Metric + Strategos",
        output: "Readout, exception notes and next action",
        gate: "Human chooses priority",
        gateKind: "measurement",
      },
    ],
  },
  card4: {
    title: "A department removes coordination drag, not decision ownership.",
    rows: [
      {
        teamulate: "Research, drafts, asset preparation and repurposing",
        human: "Business strategy and commercial priorities",
      },
      {
        teamulate: "Website, form and workflow diagnostics",
        human: "Brand, client-sensitive and public claims",
      },
      {
        teamulate: "Nurture / lifecycle preparation",
        human: "Final communications and publication",
      },
      {
        teamulate: "CRM / tracking / connector-health monitoring",
        human: "Access, permissions, budget and systems policy",
      },
      {
        teamulate: "Status synthesis and reporting preparation",
        human: "High-impact, irreversible or executive decisions",
      },
    ],
  },
  card5: {
    title: "A sample 90-day capacity map",
    windows: [
      {
        time: "Days 1–30",
        focus: "Create operating clarity",
        outputs:
          "Business context, priorities, workflow choice, approved knowledge, data / measurement baseline and approval rules.",
      },
      {
        time: "Days 31–60",
        focus: "Launch one coherent operating motion",
        outputs:
          "Content / conversion / lifecycle / CRM workflow in staging and controlled release.",
      },
      {
        time: "Days 61–90",
        focus: "Create the learning loop",
        outputs:
          "Results and limitations review, workflow fixes, backlog reprioritization and next operating plan.",
      },
    ],
    footer:
      "This is a directional sample. The right scope depends on your actual business context, stack, data and decisions.",
  },
};
