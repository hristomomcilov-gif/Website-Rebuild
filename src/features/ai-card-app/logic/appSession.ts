import { QUESTIONS } from "@/features/ai-card/content";
import type { AiCardAnswers } from "@/features/ai-card/content/types";
import { safeStorage } from "@/features/ai-card/logic/session";
import { APP_CONTENT_VERSION } from "../content/appCopy";
import { initialAppState, type AppState } from "./appStateMachine";
import { resolveBasePath } from "./resolveBasePath";

/**
 * Session-only persistence for the app-first experience — same rules as v1:
 * `sessionStorage` only, versioned, validated on read, cleared on restart.
 * Overlays (sheets, refinement, hand-off) are not restored; the map is.
 */
export const APP_SESSION_KEY = "teamulate.aiCardApp.v2";

type Persisted = { version: string; state: AppState };

function isValidAnswers(answers: unknown): answers is AiCardAnswers {
  if (typeof answers !== "object" || answers === null) return false;
  const record = answers as Record<string, unknown>;
  return QUESTIONS.every((q) => {
    const value = record[q.key];
    return value === undefined || q.options.some((o) => (o.value as string) === value);
  });
}

export function loadAppSession(storage: Storage | undefined = safeStorage()): AppState | null {
  if (!storage) return null;
  try {
    const raw = storage.getItem(APP_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Persisted>;
    if (parsed.version !== APP_CONTENT_VERSION || !parsed.state) return null;
    const s = parsed.state;
    if (!isValidAnswers(s.answers) || typeof s.description !== "string") return null;
    if (!s.answers.primaryChallenge) return null;
    return {
      ...initialAppState,
      stage: "map_exploration",
      answers: s.answers,
      description: s.description,
      sample: s.sample ?? null,
      activeCard: s.activeCard ?? "bottleneck",
      activePath: resolveBasePath(s.answers),
    };
  } catch {
    return null;
  }
}

export function saveAppSession(state: AppState, storage: Storage | undefined = safeStorage()): void {
  if (!storage) return;
  try {
    if (state.stage === "app_at_rest" && !state.description) {
      storage.removeItem(APP_SESSION_KEY);
      return;
    }
    const payload: Persisted = { version: APP_CONTENT_VERSION, state };
    storage.setItem(APP_SESSION_KEY, JSON.stringify(payload));
  } catch {
    // Storage unavailable: the app still works from memory.
  }
}

export function clearAppSession(storage: Storage | undefined = safeStorage()): void {
  try {
    storage?.removeItem(APP_SESSION_KEY);
  } catch {
    // ignore
  }
}
