import { CONTENT_VERSION, QUESTIONS } from "../content";
import type { AiCardAnswers } from "../content/types";
import { initialAiCardState, type AiCardState } from "./stateMachine";

/**
 * Session-only persistence (Implementation Brief §8 "Data handling").
 *
 * Only selected enums, the optional description and the current stage are
 * kept, in `sessionStorage`, so Back/refresh behave predictably. Nothing is
 * written to cookies, localStorage, the URL, or any network destination.
 * "Start again" clears the entry.
 */
export const SESSION_KEY = "teamulate.aiCard.v1";

type PersistedShape = {
  version: string;
  state: AiCardState;
};

function isValidAnswers(answers: unknown): answers is AiCardAnswers {
  if (typeof answers !== "object" || answers === null) return false;
  const record = answers as Record<string, unknown>;
  return QUESTIONS.every((q) => {
    const value = record[q.key];
    return (
      value === undefined ||
      q.options.some((option) => (option.value as string) === value)
    );
  });
}

export function loadSession(storage: Storage | undefined = safeStorage()): AiCardState | null {
  if (!storage) return null;
  try {
    const raw = storage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<PersistedShape>;
    if (parsed.version !== CONTENT_VERSION || !parsed.state) return null;
    const state = parsed.state;
    if (!isValidAnswers(state.answers)) return null;
    if (typeof state.optionalContext !== "string") return null;
    if (!state.current || typeof state.current.stage !== "string") return null;
    // Agent sheets and handoffs are transient overlays; reopen the map instead.
    if (state.current.stage === "agent-sheet") {
      return { ...state, current: { stage: "map", cardIndex: state.current.returnCardIndex } };
    }
    if (state.current.stage === "handoff") {
      return { ...state, current: { stage: "map", cardIndex: 4 } };
    }
    return state;
  } catch {
    return null;
  }
}

export function saveSession(state: AiCardState, storage: Storage | undefined = safeStorage()): void {
  if (!storage) return;
  try {
    if (state.current.stage === "welcome" && Object.keys(state.answers).length === 0) {
      storage.removeItem(SESSION_KEY);
      return;
    }
    const payload: PersistedShape = { version: CONTENT_VERSION, state };
    storage.setItem(SESSION_KEY, JSON.stringify(payload));
  } catch {
    // Storage may be unavailable (private mode, quota). The Card still works
    // from in-memory state.
  }
}

export function clearSession(storage: Storage | undefined = safeStorage()): void {
  try {
    storage?.removeItem(SESSION_KEY);
  } catch {
    // ignore
  }
}

export function safeStorage(): Storage | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    return window.sessionStorage;
  } catch {
    return undefined;
  }
}

export { initialAiCardState };
