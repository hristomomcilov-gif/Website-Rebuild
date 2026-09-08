import type { AgentKey, AiCardPathKey, QuestionKey } from "../content/types";

/**
 * Analytics event dictionary — DOCUMENTATION / STAGING ONLY.
 *
 * Implementation Brief §10: no new live analytics may be activated without a
 * consent review and Chris's approval. This module therefore defines the
 * typed contract (event names and the only properties that may ever be sent)
 * and ships a no-op dispatcher. There is no transport, no vendor SDK and no
 * network call. The optional free-text description is not representable in
 * these types on purpose.
 */
export type AiCardEvent =
  | { name: "ai_card_started"; entrySource: "homepage" | "direct" | "sample" }
  | {
      name: "ai_card_question_answered";
      questionIndex: 0 | 1 | 2 | 3 | 4;
      question: QuestionKey;
      answer: string;
    }
  | { name: "ai_card_assembly_viewed"; pathKey: AiCardPathKey; reducedMotion: boolean }
  | { name: "ai_card_card_viewed"; cardIndex: 0 | 1 | 2 | 3 | 4; pathKey: AiCardPathKey }
  | {
      name: "ai_card_agent_sheet_opened";
      agent: AgentKey | "human_oversight";
      cardIndex: 0 | 1 | 2 | 3 | 4;
    }
  | { name: "ai_card_completed"; pathKey: AiCardPathKey; completion: "map_viewed" | "card5_viewed" }
  | {
      name: "ai_card_cta_clicked";
      destination: "sample_dashboard" | "live_review" | "team" | "restart";
      pathKey: AiCardPathKey;
    };

export type AiCardEventSink = (event: AiCardEvent) => void;

/** Default sink: intentionally does nothing. */
export const noopEventSink: AiCardEventSink = () => {};
