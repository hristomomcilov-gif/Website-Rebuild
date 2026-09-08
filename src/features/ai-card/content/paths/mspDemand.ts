import type { PathFixture } from "../types";

/** Path A — MSP / Managed IT. Content & Conversation Script v1 §7, §9. */
export const mspDemand: PathFixture = {
  key: "msp_demand",
  name: "MSP / Managed IT — consistent qualified demand",
  summary:
    "MSP demand does not begin with “send more outreach”. It begins with a credible buyer problem, an approved message, discoverable content, conversion path, clean handoff and measured learning loop.",
  teachingPoint:
    "MSP demand does not begin with “send more outreach”. It begins with a credible buyer problem, an approved message, discoverable content, conversion path, clean handoff and measured learning loop.",
  department: [
    "strategos",
    "scout",
    "seeker",
    "wordsmith",
    "growthtrack",
    "flow",
    "nexus",
    "metric",
    "guardian",
  ],
  assemblyForeground: ["strategos", "scout", "seeker", "growthtrack", "flow"],
  card1: {
    title: "Likely bottleneck: demand work is fragmented, not simply under-produced.",
    body: [
      "Based on the answers you selected, the likely issue is not that your team has no marketing activity. It is that buyer research, messaging, search visibility, campaign preparation, website conversion and CRM handoff may not be operating as one connected system.",
      "For an MSP, a useful marketing motion must help the right buyer understand a real operational risk or growth problem, find credible proof, take the next step and reach the right follow-up process. More disconnected activity can create more noise without creating a reliable demand engine.",
    ],
    unknown:
      "We do not know your current service mix, sales cycle, ideal account profile, CRM setup, website conversion data or approved claims.",
    validate:
      "Where does a qualified prospect most often lose momentum today: before discovery, on the website, during follow-up or between marketing and sales?",
  },
  card2: {
    title: "The department that would work on this first",
    roles: [
      {
        agent: "strategos",
        reason:
          "Turns your growth priority into one coordinated operating plan and routes decisions.",
      },
      {
        agent: "scout",
        reason: "Builds the buyer-problem, ICP, competitor and proof foundation.",
      },
      {
        agent: "seeker",
        reason:
          "Maps demand queries, search/GEO opportunities and technical discoverability priorities.",
      },
      {
        agent: "wordsmith",
        reason:
          "Converts the approved message into useful content, pages and distribution.",
      },
      {
        agent: "growthtrack",
        reason: "Prepares approved demand, audience and acquisition motions.",
      },
      {
        agent: "flow",
        reason: "Improves the path from attention to form, meeting or next action.",
      },
      {
        agent: "nexus",
        reason: "Keeps CRM fields, routing, tracking and handoffs observable.",
      },
      {
        agent: "metric",
        reason:
          "Defines what can be measured and distinguishes evidence from assumptions.",
      },
      {
        agent: "guardian",
        reason: "Checks claims, quality, approval state and release readiness.",
      },
    ],
    note: "This is not nine disconnected bots. Strategos coordinates a shared brief; Metric and Guardian remain independent checks; important decisions remain with your approved human owners.",
    chips: [
      { label: "Ask why Scout starts here", sheet: "scout" },
      { label: "Ask what Seeker would measure", sheet: "seeker" },
      { label: "Ask where the human stays involved", sheet: "human_oversight" },
    ],
  },
  card3: {
    title: "A sample MSP demand workflow",
    stages: [
      {
        stage: "Define buyer problem",
        owner: "Scout + Strategos",
        output: "ICP and buyer-pain evidence brief",
        gate: "Client validates business truth",
        gateKind: "client_validation",
      },
      {
        stage: "Set message and proof",
        owner: "Scout + Wordsmith",
        output: "Positioning and proof inventory",
        gate: "Brand / claim approval",
        gateKind: "approval",
      },
      {
        stage: "Map demand opportunities",
        owner: "Seeker + GrowthTrack",
        output: "Search/GEO and acquisition opportunity map",
        gate: "Priority approval",
        gateKind: "approval",
      },
      {
        stage: "Build conversion path",
        owner: "Flow + Wordsmith + Pixel when needed",
        output: "Landing page / content / form plan",
        gate: "Staging and quality review",
        gateKind: "staging_qa",
      },
      {
        stage: "Connect handoff",
        owner: "Nexus",
        output: "CRM routing, tracking and ownership plan",
        gate: "Technical owner confirms access / fields",
        gateKind: "client_validation",
      },
      {
        stage: "Prepare controlled launch",
        owner: "GrowthTrack + Guardian",
        output: "Launch packet, audience/scope and QA result",
        gate: "Spend / publishing approval",
        gateKind: "approval",
      },
      {
        stage: "Measure and learn",
        owner: "Metric + Strategos",
        output: "Readout, limitations and next recommendation",
        gate: "Human chooses scale, hold or change",
        gateKind: "measurement",
      },
    ],
    note: "The workflow is closed only when the result and learning return to the next decision. Publishing a page or launching a campaign is a midpoint, not the end.",
  },
  card4: {
    title: "Always-on operations. Human-led decisions.",
    rows: [
      {
        teamulate: "Search and content-decay monitoring",
        human: "Company strategy and priority changes",
      },
      {
        teamulate: "Research, content and campaign preparation",
        human: "Brand-sensitive claims and message decisions",
      },
      {
        teamulate: "Reporting preparation and anomaly flags",
        human: "Advertising spend and major budget changes",
      },
      {
        teamulate: "Workflow, queue and connector-health monitoring",
        human: "Publishing, customer communications and irreversible actions",
      },
      {
        teamulate: "Cross-channel status summaries",
        human: "Legal, security, financial and executive decisions",
      },
    ],
    body: "The department keeps low-risk work visible and moving beyond the hours your team is online. It does not remove accountability or make high-impact decisions for you.",
  },
  card5: {
    title: "A sample 90-day operating map",
    windows: [
      {
        time: "Days 1–30",
        focus: "Establish the truth",
        outputs:
          "Business context, buyer and message evidence, stack review, measurement plan, approval policy and first workflow.",
      },
      {
        time: "Days 31–60",
        focus: "Activate one repeatable demand motion",
        outputs:
          "Priority content/search/GEO or demand workflow, conversion path, CRM handoff and controlled launch.",
      },
      {
        time: "Days 61–90",
        focus: "Learn and improve",
        outputs:
          "Evidence review, process correction, workflow reliability review and next-priority plan.",
      },
    ],
    footer:
      "This is a directional sample, not a forecast or guarantee. A live review validates your actual business context, approved stack and decision model.",
  },
};
