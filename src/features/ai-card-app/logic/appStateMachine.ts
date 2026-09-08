import type {
  AgentKey,
  AiCardAnswers,
  AiCardPathKey,
  AnswerValueFor,
  PrimaryChallenge,
  QuestionKey,
  SheetKey,
} from "@/features/ai-card/content/types";
import { CANONICAL_SAMPLES, COMPOSER, type CardKey } from "../content/appCopy";
import { resolveBasePath } from "./resolveBasePath";

/**
 * App-first experience model (Reset v2 §9):
 *
 *   app_at_rest → challenge_selected → map_exploration
 *     → contextual_refinement (optional, repeatable) → handoff
 *
 * There is no ordered question sequence. Every action is reachable from any
 * stage; `Edit signal` returns the visitor to the composer without losing
 * other context.
 */
export type AppStage =
  | "app_at_rest"
  | "challenge_selected"
  | "map_exploration"
  | "contextual_refinement"
  | "handoff";

export type RefinementKey = Exclude<QuestionKey, "primaryChallenge">;

export type AppState = {
  stage: AppStage;
  answers: AiCardAnswers;
  /** Visitor-provided context. Reflected back only; never routed on. */
  description: string;
  activePath: AiCardPathKey;
  /** Which canonical sample was loaded via "Explore a complete sample", if any. */
  sample: Exclude<AiCardPathKey, "fragmented_operation"> | null;
  activeCard: CardKey | null;
  activeRole: AgentKey | null;
  openSheet: SheetKey | null;
  refining: RefinementKey | null;
  handoff: "dashboard" | "review" | null;
  /** Incremented on every challenge change so the activation scene can replay. */
  activationId: number;
};

export const initialAppState: AppState = {
  stage: "app_at_rest",
  answers: {},
  description: "",
  activePath: "fragmented_operation",
  sample: null,
  activeCard: null,
  activeRole: null,
  openSheet: null,
  refining: null,
  handoff: null,
  activationId: 0,
};

export type AppAction =
  | { type: "SELECT_CHALLENGE"; value: Exclude<PrimaryChallenge, "explore_sample"> }
  | { type: "EDIT_SIGNAL" }
  | { type: "SET_DESCRIPTION"; value: string }
  | { type: "EXPLORE_SAMPLE"; path: Exclude<AiCardPathKey, "fragmented_operation"> }
  | { type: "ACTIVATION_DONE" }
  | { type: "OPEN_CARD"; card: CardKey | null }
  | { type: "FOCUS_ROLE"; role: AgentKey | null }
  | { type: "OPEN_SHEET"; sheet: SheetKey }
  | { type: "CLOSE_SHEET" }
  | { type: "OPEN_REFINEMENT"; key: RefinementKey }
  | { type: "CLOSE_REFINEMENT" }
  | { type: "ANSWER"; key: RefinementKey; value: AnswerValueFor<RefinementKey> }
  | { type: "CLEAR_ANSWER"; key: RefinementKey }
  | { type: "OPEN_HANDOFF"; kind: "dashboard" | "review" }
  | { type: "CLOSE_HANDOFF" }
  | { type: "RESTART" }
  | { type: "RESTORE"; state: AppState };

function withPath(state: AppState): AppState {
  return { ...state, activePath: resolveBasePath(state.answers) };
}

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SELECT_CHALLENGE": {
      const answers = { ...state.answers, primaryChallenge: action.value };
      return withPath({
        ...state,
        stage: "challenge_selected",
        answers,
        sample: null,
        activeCard: "bottleneck",
        activeRole: null,
        openSheet: null,
        refining: null,
        handoff: null,
        activationId: state.activationId + 1,
      });
    }
    case "EDIT_SIGNAL": {
      const { primaryChallenge: _drop, ...rest } = state.answers;
      void _drop;
      return withPath({
        ...state,
        stage: "app_at_rest",
        answers: rest,
        sample: null,
        activeCard: null,
        activeRole: null,
        openSheet: null,
        refining: null,
        handoff: null,
      });
    }
    case "SET_DESCRIPTION":
      return { ...state, description: action.value.slice(0, COMPOSER.maxLength) };
    case "EXPLORE_SAMPLE":
      return withPath({
        ...state,
        stage: "challenge_selected",
        answers: { ...CANONICAL_SAMPLES[action.path] },
        sample: action.path,
        activeCard: "bottleneck",
        activeRole: null,
        openSheet: null,
        refining: null,
        handoff: null,
        activationId: state.activationId + 1,
      });
    case "ACTIVATION_DONE":
      return state.stage === "challenge_selected" ? { ...state, stage: "map_exploration" } : state;
    case "OPEN_CARD":
      if (state.stage === "app_at_rest") return state;
      return {
        ...state,
        stage: state.stage === "challenge_selected" ? "map_exploration" : state.stage === "handoff" ? "map_exploration" : state.stage,
        activeCard: action.card,
        handoff: null,
      };
    case "FOCUS_ROLE":
      return { ...state, activeRole: action.role };
    case "OPEN_SHEET":
      return { ...state, openSheet: action.sheet };
    case "CLOSE_SHEET":
      return { ...state, openSheet: null };
    case "OPEN_REFINEMENT":
      if (state.stage === "app_at_rest") return state;
      return { ...state, stage: "contextual_refinement", refining: action.key, handoff: null };
    case "CLOSE_REFINEMENT":
      return state.stage === "contextual_refinement"
        ? { ...state, stage: "map_exploration", refining: null }
        : { ...state, refining: null };
    case "ANSWER": {
      if (state.stage === "app_at_rest") return state;
      const answers = { ...state.answers, [action.key]: action.value };
      // Editing any context turns a canonical sample into the visitor's own map.
      return withPath({ ...state, answers, sample: null });
    }
    case "CLEAR_ANSWER": {
      if (state.stage === "app_at_rest") return state;
      const answers = { ...state.answers };
      delete answers[action.key];
      return withPath({ ...state, answers, sample: null });
    }
    case "OPEN_HANDOFF":
      if (state.stage === "app_at_rest") return state;
      return { ...state, stage: "handoff", handoff: action.kind, refining: null, openSheet: null };
    case "CLOSE_HANDOFF":
      return { ...state, stage: "map_exploration", handoff: null };
    case "RESTART":
      return { ...initialAppState, activationId: state.activationId };
    case "RESTORE":
      return action.state;
    default:
      return state;
  }
}

export const REFINEMENT_KEYS: ReadonlyArray<RefinementKey> = [
  "businessType",
  "currentCapacity",
  "businessGoal",
  "operatingFriction",
];
