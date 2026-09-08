/**
 * Typed selection values for the AI Card v1.
 *
 * Routing is done on these enums only — never on option labels — so that copy
 * changes can never silently change which fixture path a visitor receives.
 */

export type PrimaryChallenge =
  | "consistent_demand"
  | "fragmented"
  | "backlog_capacity"
  | "website_conversion"
  | "measurement_visibility"
  | "explore_sample";

export type BusinessType =
  | "msp"
  | "cybersecurity"
  | "professional_services"
  | "technical_services"
  | "other_b2b";

export type CurrentCapacity =
  | "founder_led"
  | "one_marketer"
  | "small_team"
  | "vendors"
  | "mixed";

export type BusinessGoal =
  | "qualified_demand"
  | "positioning_trust"
  | "content_search"
  | "website_conversion"
  | "lifecycle_crm"
  | "measurement_visibility";

export type OperatingFriction =
  | "capacity"
  | "handoffs_tools"
  | "prioritization"
  | "launch_confidence"
  | "crm_tracking"
  | "proof";

export type AiCardPathKey =
  | "msp_demand"
  | "cybersecurity_trust"
  | "services_coordination"
  | "fragmented_operation";

export type AgentKey =
  | "strategos"
  | "scout"
  | "wordsmith"
  | "seeker"
  | "growthtrack"
  | "pixel"
  | "flow"
  | "socialite"
  | "nexus"
  | "metric"
  | "guardian";

/** The human-oversight answer sheet is scripted alongside the agent sheets. */
export type SheetKey = AgentKey | "human_oversight";

export type QuestionKey =
  | "primaryChallenge"
  | "businessType"
  | "currentCapacity"
  | "businessGoal"
  | "operatingFriction";

export type AnswerValueFor<Q extends QuestionKey> = Q extends "primaryChallenge"
  ? PrimaryChallenge
  : Q extends "businessType"
    ? BusinessType
    : Q extends "currentCapacity"
      ? CurrentCapacity
      : Q extends "businessGoal"
        ? BusinessGoal
        : OperatingFriction;

export type AiCardAnswers = {
  primaryChallenge?: PrimaryChallenge;
  businessType?: BusinessType;
  currentCapacity?: CurrentCapacity;
  businessGoal?: BusinessGoal;
  operatingFriction?: OperatingFriction;
};

export type CompleteAnswers = Required<AiCardAnswers>;

export type QuestionOption<V extends string> = {
  value: V;
  label: string;
};

export type QuestionDefinition<Q extends QuestionKey = QuestionKey> = {
  key: Q;
  /** Strategos line shown above the question, if the script defines one. */
  lead?: string;
  question: string;
  options: ReadonlyArray<QuestionOption<AnswerValueFor<Q>>>;
  whyWeAsk: string;
};

export type AgentDefinition = {
  key: AgentKey;
  name: string;
  role: string;
  /** Used for the accessible department-map summary and Card 2 fallback. */
  mission: string;
  /** Short action label rendered next to the node in the department map. */
  mapLabel: string;
};

export type RoleReason = {
  agent: AgentKey;
  reason: string;
};

export type WorkflowGate =
  | "client_validation"
  | "approval"
  | "staging_qa"
  | "measurement";

export type WorkflowStage = {
  stage: string;
  owner: string;
  output: string;
  gate: string;
  gateKind: WorkflowGate;
};

export type ControlRow = {
  teamulate: string;
  human: string;
};

export type NinetyDayWindow = {
  time: string;
  focus: string;
  outputs: string;
};

export type InteractionChip = {
  label: string;
  sheet: SheetKey;
};

export type PathFixture = {
  key: AiCardPathKey;
  /** Short human-readable name used in labels and analytics documentation. */
  name: string;
  /** One-sentence summary shown on the operating-map overview (W05). */
  summary: string;
  teachingPoint: string;
  /** Roles that always appear for the path, in display order. */
  department: ReadonlyArray<AgentKey>;
  /** Foreground roles for the assembly scene (max 6 incl. checks). */
  assemblyForeground: ReadonlyArray<AgentKey>;
  card1: {
    title: string;
    body: ReadonlyArray<string>;
    unknown: string;
    validate: string;
  };
  card2: {
    title: string;
    roles: ReadonlyArray<RoleReason>;
    note: string;
    conditionalNote?: string;
    chips: ReadonlyArray<InteractionChip>;
  };
  card3: {
    title: string;
    stages: ReadonlyArray<WorkflowStage>;
    note?: string;
  };
  card4: {
    title: string;
    rows: ReadonlyArray<ControlRow>;
    body?: string;
  };
  card5: {
    title: string;
    windows: ReadonlyArray<NinetyDayWindow>;
    footer: string;
  };
};

export type AgentSheet = {
  sheet: SheetKey;
  /** Displayed name, e.g. "Seeker" or "Human oversight". */
  name: string;
  role: string;
  question: string;
  answer: string;
  knownGap: string;
};
