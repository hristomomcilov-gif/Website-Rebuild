import type { PathFixture } from "../types";

/** Path B — Cybersecurity. Content & Conversation Script v1 §7, §10. */
export const cybersecurityTrust: PathFixture = {
  key: "cybersecurity_trust",
  name: "Cybersecurity — positioning and trust",
  summary:
    "When the buyer has to trust you with risk, quality of proof, claims, message discipline and the conversion journey matter as much as lead volume.",
  teachingPoint:
    "When the buyer has to trust you with risk, quality of proof, claims, message discipline and the conversion journey matter as much as lead volume.",
  department: [
    "strategos",
    "scout",
    "wordsmith",
    "seeker",
    "pixel",
    "flow",
    "socialite",
    "metric",
    "guardian",
  ],
  assemblyForeground: ["strategos", "scout", "wordsmith", "guardian", "flow"],
  card1: {
    title: "Likely bottleneck: trust, proof and demand execution are not yet one system.",
    body: [
      "Based on the path you selected, the likely constraint is not simply “we need more leads”. In cybersecurity, buyers need a clear reason to trust your expertise before they take a serious next step. That requires disciplined positioning, accurate claims, useful proof, discoverability, a credible website journey and measured follow-up.",
      "If those parts are handled separately, marketing can look active while buyer confidence and conversion remain inconsistent.",
    ],
    unknown:
      "We do not know your regulated-market requirements, service boundaries, buyer committees, current proof assets, sales process, security review requirements or approved claims.",
    validate:
      "Which buyer question currently causes the most friction: “Why you?”, “Why now?”, “Can we trust this?”, or “What happens after we contact you?”",
  },
  card2: {
    title: "The department that would make trust operational",
    roles: [
      {
        agent: "strategos",
        reason:
          "Connects business priorities, proof, channels and approvals into one operating plan.",
      },
      {
        agent: "scout",
        reason:
          "Turns market, competitor and buyer evidence into a defensible message foundation.",
      },
      {
        agent: "wordsmith",
        reason:
          "Creates precise content, nurture and conversion copy from approved evidence.",
      },
      {
        agent: "seeker",
        reason:
          "Improves visibility for buyer questions across traditional and AI search surfaces.",
      },
      {
        agent: "pixel",
        reason:
          "Produces visual proof, sales-enablement and campaign assets from approved briefs.",
      },
      {
        agent: "flow",
        reason:
          "Builds a clearer path from content and campaign attention to a credible next action.",
      },
      {
        agent: "socialite",
        reason:
          "Supports nurture, onboarding and relationship communications once priorities are approved.",
      },
      {
        agent: "metric",
        reason:
          "Defines what can be measured, what confidence is justified and what cannot be attributed.",
      },
      {
        agent: "guardian",
        reason: "Protects factual accuracy, brand quality, claims and release decisions.",
      },
    ],
    note: "Security marketing creates risk when speed is separated from evidence. In Teamulate, Guardian and Metric are visible parts of the workflow, not a final checkbox.",
    chips: [
      { label: "Ask why Scout starts here", sheet: "scout" },
      { label: "Ask what Seeker would measure", sheet: "seeker" },
      { label: "Ask where the human stays involved", sheet: "human_oversight" },
    ],
  },
  card3: {
    title: "A sample cybersecurity trust-to-demand workflow",
    stages: [
      {
        stage: "Find buyer proof gaps",
        owner: "Scout + Strategos",
        output: "Buyer-question and proof-gap brief",
        gate: "Client validates business truth",
        gateKind: "client_validation",
      },
      {
        stage: "Set defensible narrative",
        owner: "Scout + Wordsmith",
        output: "Positioning, message and claim inventory",
        gate: "Brand / legal / client approval where needed",
        gateKind: "approval",
      },
      {
        stage: "Build discoverability plan",
        owner: "Seeker + Wordsmith",
        output: "Search/GEO content and internal-link map",
        gate: "Priority approval",
        gateKind: "approval",
      },
      {
        stage: "Build trust surfaces",
        owner: "Flow + Pixel + Wordsmith",
        output: "Content, proof page, landing page or sales-enablement plan",
        gate: "Staging and quality review",
        gateKind: "staging_qa",
      },
      {
        stage: "Prepare relationship flow",
        owner: "Socialite + Nexus when configured",
        output: "Nurture and routing proposal",
        gate: "Consent / data / owner review",
        gateKind: "client_validation",
      },
      {
        stage: "Check and release",
        owner: "Guardian + Metric",
        output: "Claim validation, measurement plan and release packet",
        gate: "Required approval",
        gateKind: "approval",
      },
      {
        stage: "Learn",
        owner: "Metric + Strategos",
        output: "Evidence readout and next recommendation",
        gate: "Human decides what changes",
        gateKind: "measurement",
      },
    ],
  },
  card4: {
    title: "Stronger execution does not remove governance.",
    rows: [
      {
        teamulate: "Research synthesis and buyer-question monitoring",
        human: "Security, legal and regulated claims",
      },
      {
        teamulate: "Draft content, proof structures and campaign preparation",
        human: "Final message and brand decisions",
      },
      {
        teamulate: "Search / content health monitoring",
        human: "Publishing and customer-facing communications",
      },
      {
        teamulate: "Measurement preparation and anomaly flags",
        human: "Budget, executive commitments and escalation decisions",
      },
      { teamulate: "Workflow / queue status", human: "Any irreversible action" },
    ],
    body: "Teamulate can increase the speed and consistency of preparation. Your designated owners remain responsible for high-impact decisions and approve the work that needs judgment.",
  },
  card5: {
    title: "A sample 90-day trust and demand map",
    windows: [
      {
        time: "Days 1–30",
        focus: "Establish a defensible foundation",
        outputs:
          "Buyer questions, proof inventory, claim boundaries, measurement definitions and approval model.",
      },
      {
        time: "Days 31–60",
        focus: "Activate credible visibility and conversion surfaces",
        outputs:
          "Priority content, search/GEO plan, proof/landing experience and approved nurture path.",
      },
      {
        time: "Days 61–90",
        focus: "Validate and improve",
        outputs:
          "Readout, conversion / content learning, quality-control review and next operating priority.",
      },
    ],
    footer: "This is a directional sample, not a security, legal or performance guarantee.",
  },
};
