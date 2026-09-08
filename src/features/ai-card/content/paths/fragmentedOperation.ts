import type { PathFixture } from "../types";

/**
 * Safe fallback — "Fragmented Operation".
 *
 * The Script (§7 "Safe fallback", §15 "Low-confidence") defines the Strategos
 * message and the rule "show the core Teamulate model; do not invent a niche
 * diagnosis". It does not supply full card copy, so this fixture is composed
 * only from already-approved generic copy:
 * - Copy Deck §8 "How it works" (five steps) for the workflow;
 * - Copy Deck §12 "Human control" lists for operations and control;
 * - Blueprint §7 Card 5 generic 90-day table;
 * - Copy Deck §22 wrapper copy for unknowns/validation.
 * Connective titles are flagged in docs/KNOWN_GAPS_AND_ASSUMPTIONS.md.
 */
export const fragmentedOperation: PathFixture = {
  key: "fragmented_operation",
  name: "Fragmented operation — core operating model",
  summary:
    "Your answers point to more than one possible bottleneck. Rather than force a confident conclusion, the Card will show the core operating model and the questions to validate first.",
  teachingPoint:
    "Marketing breaks when important work is distributed across too many people, tools and handoffs without one operating cadence.",
  department: ["strategos", "scout", "wordsmith", "flow", "nexus", "metric", "guardian"],
  assemblyForeground: ["strategos", "scout", "wordsmith", "flow", "nexus"],
  card1: {
    title: "Your answers point to more than one possible bottleneck.",
    body: [
      "Your situation may cross more than one operating path. Rather than make a false-specific diagnosis, I’ll show the core Teamulate model and flag the questions that need a live review.",
      "Marketing breaks when important work is distributed across too many people, tools and handoffs without one operating cadence. The backlog grows, priorities blur, systems drift and nobody can see the whole loop from insight to outcome.",
    ],
    unknown:
      "Teamulate has not connected to your CRM, analytics, website, advertising accounts, budget, customer data or private documents. This Card does not make a claim about those systems.",
    validate:
      "Which important marketing task repeatedly starts but does not reliably reach a measured outcome?",
  },
  card2: {
    title: "The core Teamulate department",
    roles: [
      {
        agent: "strategos",
        reason:
          "Turns your business goals into priorities, briefs, decision packets and a coordinated plan across the department.",
      },
      {
        agent: "scout",
        reason:
          "Turns market, customer, competitor and product evidence into decision-ready insight, positioning, messaging and sales-enablement input.",
      },
      {
        agent: "wordsmith",
        reason:
          "Runs the editorial engine — creating, repurposing and distributing useful content across owned, founder and social channels.",
      },
      {
        agent: "flow",
        reason:
          "Turns traffic and messaging into reliable conversion experiences, then improves them through structured testing and governed experimentation.",
      },
      {
        agent: "nexus",
        reason:
          "Keeps the marketing operating system, CRM, data flows, automation and lead handoff reliable, governed and observable.",
      },
      {
        agent: "metric",
        reason:
          "Provides an independent evidence layer that explains what happened, how confident the team can be and what cannot be attributed from the available data.",
      },
      {
        agent: "guardian",
        reason:
          "Prevents low-quality, misleading, inconsistent or unsafe work from reaching the public and acts as a release gate across the department.",
      },
    ],
    note: "Strategos coordinates the work. Metric checks evidence. Guardian protects quality and approval boundaries. You retain high-impact decisions.",
    conditionalNote:
      "Seeker joins when discoverability, technical SEO or GEO is a priority. GrowthTrack joins for approved demand experiments. Pixel joins when a defined creative or motion need supports the workflow.",
    chips: [
      { label: "Ask why Strategos starts with an operating problem", sheet: "strategos" },
      { label: "Ask what Metric would measure", sheet: "metric" },
      { label: "Ask where the human stays involved", sheet: "human_oversight" },
    ],
  },
  card3: {
    title: "The core operating loop",
    stages: [
      {
        stage: "Learn your business",
        owner: "Strategos + Scout",
        output:
          "Approved business context, ICP, positioning, priorities, stack and measurement baseline",
        gate: "Client validates business truth",
        gateKind: "client_validation",
      },
      {
        stage: "Set goals and guardrails",
        owner: "You + Strategos",
        output: "What matters, who approves what and where the system can act inside policy",
        gate: "Client confirms goal and constraints",
        gateKind: "client_validation",
      },
      {
        stage: "Strategos coordinates the department",
        owner: "Strategos",
        output: "Briefs, dependencies, priorities and an accountable workflow",
        gate: "Priority approval",
        gateKind: "approval",
      },
      {
        stage: "Specialists execute. Metric and Guardian check.",
        owner: "Specialists + Metric + Guardian",
        output:
          "Research, content, search, creative, demand, lifecycle, web and CRM work through visible quality and evidence checks",
        gate: "Staging and QA",
        gateKind: "staging_qa",
      },
      {
        stage: "You see what changed and decide what happens next.",
        owner: "You + Strategos",
        output:
          "Work, approvals, results, limitations, risks and recommendations in one operating view",
        gate: "Human chooses scale, hold or change",
        gateKind: "measurement",
      },
    ],
  },
  card4: {
    title: "Autonomous where safe. Gated where it matters.",
    rows: [
      { teamulate: "Monitoring and alerts", human: "Strategy and priority changes" },
      {
        teamulate: "Research and draft preparation",
        human: "Material spend and budget changes",
      },
      {
        teamulate: "Repetitive content / asset workflows",
        human: "Sensitive claims and brand decisions",
      },
      {
        teamulate: "Reporting preparation",
        human: "External launches and customer-facing communications",
      },
      {
        teamulate: "Workflow and connector-health checks",
        human: "Legal, financial, security and executive decisions",
      },
      {
        teamulate: "Routine, reversible actions inside policy",
        human: "Any irreversible action",
      },
    ],
    body: "Teamulate can monitor, prepare and run approved routine work inside defined policy. It does not take over strategy, make material spend decisions, publish sensitive claims or perform irreversible actions without the right human decision.",
  },
  card5: {
    title: "A sample 90-day operating map",
    windows: [
      {
        time: "Days 1–30",
        focus: "Establish truth, goals, stack and governance",
        outputs:
          "Business context, ICP, measurement plan, priority workflow, approval matrix.",
      },
      {
        time: "Days 31–60",
        focus: "Activate first repeatable motion",
        outputs:
          "Core content / demand / CRO / lifecycle workflow in staging and controlled launch.",
      },
      {
        time: "Days 61–90",
        focus: "Measure, learn and improve",
        outputs: "Evidence review, workflow iteration, next-priority plan.",
      },
    ],
    footer:
      "Your card is a starting hypothesis. A live operating review validates the actual stack, data, priority and approval model.",
  },
};
