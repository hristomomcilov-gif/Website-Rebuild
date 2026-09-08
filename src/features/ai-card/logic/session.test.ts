import { describe, expect, it } from "vitest";
import { CONTENT_VERSION } from "../content";
import { clearSession, loadSession, saveSession, SESSION_KEY } from "./session";
import { aiCardReducer, initialAiCardState, type AiCardState } from "./stateMachine";

const answered: AiCardState = {
  ...initialAiCardState,
  current: { stage: "questions", questionIndex: 2 },
  answers: { primaryChallenge: "fragmented", businessType: "msp" },
  optionalContext: "",
};

describe("session persistence", () => {
  it("round-trips answers and stage through sessionStorage", () => {
    saveSession(answered, window.sessionStorage);
    expect(window.localStorage.getItem(SESSION_KEY)).toBeNull();
    expect(loadSession(window.sessionStorage)).toEqual(answered);
  });

  it("stores the optional description only in sessionStorage and clears it on restart", () => {
    const withText: AiCardState = { ...answered, optionalContext: "We provide managed IT." };
    saveSession(withText, window.sessionStorage);
    expect(window.sessionStorage.getItem(SESSION_KEY)).toContain("We provide managed IT.");
    expect(document.cookie).toBe("");
    expect(window.location.search).toBe("");

    const restarted = aiCardReducer(withText, { type: "RESTART" });
    saveSession(restarted, window.sessionStorage);
    expect(window.sessionStorage.getItem(SESSION_KEY)).toBeNull();
  });

  it("rejects payloads from another content version", () => {
    window.sessionStorage.setItem(SESSION_KEY, JSON.stringify({ version: "other", state: answered }));
    expect(loadSession(window.sessionStorage)).toBeNull();
  });

  it("rejects tampered answer values", () => {
    window.sessionStorage.setItem(
      SESSION_KEY,
      JSON.stringify({ version: CONTENT_VERSION, state: { ...answered, answers: { businessType: "not_a_value" } } }),
    );
    expect(loadSession(window.sessionStorage)).toBeNull();
  });

  it("reopens the map instead of a transient sheet or handoff", () => {
    const sheet: AiCardState = { ...answered, current: { stage: "agent-sheet", sheet: "scout", returnCardIndex: 1 } };
    saveSession(sheet, window.sessionStorage);
    expect(loadSession(window.sessionStorage)?.current).toEqual({ stage: "map", cardIndex: 1 });
  });

  it("clearSession removes the entry", () => {
    saveSession(answered, window.sessionStorage);
    clearSession(window.sessionStorage);
    expect(window.sessionStorage.getItem(SESSION_KEY)).toBeNull();
  });
});
