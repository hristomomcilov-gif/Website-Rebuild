import { QUESTIONS, SAMPLE_ANSWERS } from "../content";
import type {
  AiCardAnswers,
  AnswerValueFor,
  CompleteAnswers,
  QuestionKey,
  SheetKey,
} from "../content/types";

export type QuestionIndex = 0 | 1 | 2 | 3 | 4;
export type CardIndex = 0 | 1 | 2 | 3 | 4;

export type AiCardStage =
  | { stage: "welcome" }
  | { stage: "questions"; questionIndex: QuestionIndex }
  | { stage: "optional-context" }
  | { stage: "assembly" }
  | { stage: "map"; cardIndex: CardIndex | null }
  | { stage: "agent-sheet"; sheet: SheetKey; returnCardIndex: CardIndex }
  | { stage: "handoff"; kind: "dashboard" | "review" };

export type AiCardState = {
  current: AiCardStage;
  answers: AiCardAnswers;
  /** Optional one-sentence description. Session-only; never transmitted. */
  optionalContext: string;
  /** True when answers were loaded by "Explore a sample" instead of chosen. */
  isSample: boolean;
  /** True once the assembly sequence has completed at least once. */
  assemblyComplete: boolean;
};

export type AiCardAction =
  | { type: "START" }
  | { type: "EXPLORE_SAMPLE" }
  | { type: "ANSWER"; question: QuestionKey; value: AnswerValueFor<QuestionKey> }
  | { type: "CONTINUE" }
  | { type: "BACK" }
  | { type: "SET_OPTIONAL_CONTEXT"; value: string }
  | { type: "SUBMIT_OPTIONAL_CONTEXT" }
  | { type: "SKIP_OPTIONAL_CONTEXT" }
  | { type: "ASSEMBLY_COMPLETE" }
  | { type: "VIEW_MAP" }
  | { type: "OPEN_CARD"; cardIndex: CardIndex }
  | { type: "NEXT_CARD" }
  | { type: "PREVIOUS_CARD" }
  | { type: "OPEN_SHEET"; sheet: SheetKey }
  | { type: "CLOSE_SHEET" }
  | { type: "OPEN_HANDOFF"; kind: "dashboard" | "review" }
  | { type: "CLOSE_HANDOFF" }
  | { type: "RESTART" }
  | { type: "RESTORE"; state: AiCardState };

export const initialAiCardState: AiCardState = {
  current: { stage: "welcome" },
  answers: {},
  optionalContext: "",
  isSample: false,
  assemblyComplete: false,
};

export const QUESTION_COUNT = QUESTIONS.length;

export function isComplete(answers: AiCardAnswers): answers is CompleteAnswers {
  return QUESTIONS.every((q) => answers[q.key] !== undefined);
}

function clampCard(i: number): CardIndex {
  return Math.min(4, Math.max(0, i)) as CardIndex;
}

export function aiCardReducer(state: AiCardState, action: AiCardAction): AiCardState {
  const { current } = state;

  switch (action.type) {
    case "START":
      return { ...state, current: { stage: "questions", questionIndex: 0 } };

    case "EXPLORE_SAMPLE":
      // Transparent canonical fixture: preset answers, labelled as sample.
      return {
        ...state,
        answers: { ...SAMPLE_ANSWERS },
        optionalContext: "",
        isSample: true,
        assemblyComplete: false,
        current: { stage: "assembly" },
      };

    case "ANSWER": {
      if (current.stage !== "questions") return state;
      const question = QUESTIONS[current.questionIndex];
      if (question.key !== action.question) return state;
      if (action.question === "primaryChallenge" && action.value === "explore_sample") {
        return aiCardReducer(state, { type: "EXPLORE_SAMPLE" });
      }
      return {
        ...state,
        isSample: false,
        answers: { ...state.answers, [action.question]: action.value },
      };
    }

    case "CONTINUE": {
      if (current.stage !== "questions") return state;
      const question = QUESTIONS[current.questionIndex];
      if (state.answers[question.key] === undefined) return state;
      if (current.questionIndex < QUESTION_COUNT - 1) {
        return {
          ...state,
          current: {
            stage: "questions",
            questionIndex: (current.questionIndex + 1) as QuestionIndex,
          },
        };
      }
      return { ...state, current: { stage: "optional-context" } };
    }

    case "BACK": {
      switch (current.stage) {
        case "questions":
          if (current.questionIndex === 0) return { ...state, current: { stage: "welcome" } };
          return {
            ...state,
            current: {
              stage: "questions",
              questionIndex: (current.questionIndex - 1) as QuestionIndex,
            },
          };
        case "optional-context":
          return {
            ...state,
            current: { stage: "questions", questionIndex: (QUESTION_COUNT - 1) as QuestionIndex },
          };
        case "assembly":
          return state.isSample
            ? { ...state, current: { stage: "welcome" } }
            : { ...state, current: { stage: "optional-context" } };
        case "map":
          if (current.cardIndex === null) {
            return state.isSample
              ? { ...state, current: { stage: "welcome" } }
              : { ...state, current: { stage: "optional-context" } };
          }
          return { ...state, current: { stage: "map", cardIndex: null } };
        case "agent-sheet":
          return { ...state, current: { stage: "map", cardIndex: current.returnCardIndex } };
        case "handoff":
          return { ...state, current: { stage: "map", cardIndex: 4 } };
        default:
          return state;
      }
    }

    case "SET_OPTIONAL_CONTEXT":
      return { ...state, optionalContext: action.value };

    case "SUBMIT_OPTIONAL_CONTEXT":
      if (current.stage !== "optional-context") return state;
      return { ...state, assemblyComplete: false, current: { stage: "assembly" } };

    case "SKIP_OPTIONAL_CONTEXT":
      if (current.stage !== "optional-context") return state;
      return {
        ...state,
        optionalContext: "",
        assemblyComplete: false,
        current: { stage: "assembly" },
      };

    case "ASSEMBLY_COMPLETE":
      return { ...state, assemblyComplete: true };

    case "VIEW_MAP":
      if (current.stage !== "assembly") return state;
      return { ...state, assemblyComplete: true, current: { stage: "map", cardIndex: null } };

    case "OPEN_CARD":
      if (current.stage !== "map" && current.stage !== "handoff") return state;
      return { ...state, current: { stage: "map", cardIndex: clampCard(action.cardIndex) } };

    case "NEXT_CARD": {
      if (current.stage !== "map") return state;
      if (current.cardIndex === null) return { ...state, current: { stage: "map", cardIndex: 0 } };
      if (current.cardIndex === 4) return { ...state, current: { stage: "handoff", kind: "dashboard" } };
      return { ...state, current: { stage: "map", cardIndex: clampCard(current.cardIndex + 1) } };
    }

    case "PREVIOUS_CARD": {
      if (current.stage !== "map" || current.cardIndex === null) return state;
      if (current.cardIndex === 0) return { ...state, current: { stage: "map", cardIndex: null } };
      return { ...state, current: { stage: "map", cardIndex: clampCard(current.cardIndex - 1) } };
    }

    case "OPEN_SHEET":
      if (current.stage !== "map" || current.cardIndex === null) return state;
      return {
        ...state,
        current: { stage: "agent-sheet", sheet: action.sheet, returnCardIndex: current.cardIndex },
      };

    case "CLOSE_SHEET":
      if (current.stage !== "agent-sheet") return state;
      return { ...state, current: { stage: "map", cardIndex: current.returnCardIndex } };

    case "OPEN_HANDOFF":
      if (current.stage !== "map" && current.stage !== "handoff") return state;
      return { ...state, current: { stage: "handoff", kind: action.kind } };

    case "CLOSE_HANDOFF":
      if (current.stage !== "handoff") return state;
      return { ...state, current: { stage: "map", cardIndex: 4 } };

    case "RESTART":
      return initialAiCardState;

    case "RESTORE":
      return action.state;

    default:
      return state;
  }
}
