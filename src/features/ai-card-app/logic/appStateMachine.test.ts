import { describe, expect, it } from "vitest";
import { appReducer, initialAppState, type AppAction, type AppState } from "./appStateMachine";
import { clearAppSession, loadAppSession, saveAppSession } from "./appSession";

function run(...actions: AppAction[]): AppState {
  return actions.reduce(appReducer, initialAppState);
}

describe("app-first reducer", () => {
  it("starts at rest with the core model and no card", () => {
    expect(initialAppState.stage).toBe("app_at_rest");
    expect(initialAppState.activePath).toBe("fragmented_operation");
    expect(initialAppState.activeCard).toBeNull();
  });

  it("one challenge selection activates a path and Card 1 immediately", () => {
    const s = run({ type: "SELECT_CHALLENGE", value: "consistent_demand" });
    expect(s.stage).toBe("challenge_selected");
    expect(s.activePath).toBe("msp_demand");
    expect(s.activeCard).toBe("bottleneck");
    expect(s.activationId).toBe(1);
  });

  it("changing the challenge replays the activation and keeps other context", () => {
    const s = run(
      { type: "SELECT_CHALLENGE", value: "consistent_demand" },
      { type: "ANSWER", key: "currentCapacity", value: "founder_led" },
      { type: "SELECT_CHALLENGE", value: "backlog_capacity" },
    );
    expect(s.activationId).toBe(2);
    expect(s.answers.currentCapacity).toBe("founder_led");
    expect(s.activePath).toBe("services_coordination");
  });

  it("Edit signal returns to rest, drops only the challenge and keeps the description", () => {
    const s = run(
      { type: "SET_DESCRIPTION", value: "We publish a lot." },
      { type: "SELECT_CHALLENGE", value: "fragmented" },
      { type: "ANSWER", key: "businessType", value: "cybersecurity" },
      { type: "EDIT_SIGNAL" },
    );
    expect(s.stage).toBe("app_at_rest");
    expect(s.answers.primaryChallenge).toBeUndefined();
    expect(s.answers.businessType).toBe("cybersecurity");
    expect(s.description).toBe("We publish a lot.");
    expect(s.activeCard).toBeNull();
  });

  it("cards cannot open while at rest; after activation any card opens in any order", () => {
    expect(run({ type: "OPEN_CARD", card: "90_days" }).activeCard).toBeNull();
    const s = run(
      { type: "SELECT_CHALLENGE", value: "consistent_demand" },
      { type: "ACTIVATION_DONE" },
      { type: "OPEN_CARD", card: "90_days" },
    );
    expect(s.stage).toBe("map_exploration");
    expect(s.activeCard).toBe("90_days");
  });

  it("refinement is optional, repeatable and re-resolves the path", () => {
    const s = run(
      { type: "SELECT_CHALLENGE", value: "consistent_demand" },
      { type: "OPEN_REFINEMENT", key: "businessType" },
      { type: "ANSWER", key: "businessType", value: "cybersecurity" },
      { type: "CLOSE_REFINEMENT" },
    );
    expect(s.stage).toBe("map_exploration");
    expect(s.activePath).toBe("cybersecurity_trust");
    const cleared = appReducer(s, { type: "CLEAR_ANSWER", key: "businessType" });
    expect(cleared.activePath).toBe("msp_demand");
  });

  it("Explore sample loads the canonical fixture and is labelled until edited", () => {
    const s = run({ type: "EXPLORE_SAMPLE", path: "cybersecurity_trust" });
    expect(s.sample).toBe("cybersecurity_trust");
    expect(s.activePath).toBe("cybersecurity_trust");
    expect(s.activeCard).toBe("bottleneck");
    const edited = appReducer(s, { type: "ANSWER", key: "businessGoal", value: "qualified_demand" });
    expect(edited.sample).toBeNull();
  });

  it("the description is capped and never influences the path", () => {
    const s = run(
      { type: "SET_DESCRIPTION", value: "x".repeat(500) },
      { type: "SELECT_CHALLENGE", value: "website_conversion" },
    );
    expect(s.description).toHaveLength(240);
    expect(s.activePath).toBe("fragmented_operation");
  });

  it("hand-off and restart", () => {
    const s = run(
      { type: "SELECT_CHALLENGE", value: "consistent_demand" },
      { type: "OPEN_HANDOFF", kind: "review" },
    );
    expect(s.stage).toBe("handoff");
    expect(appReducer(s, { type: "CLOSE_HANDOFF" }).stage).toBe("map_exploration");
    const r = appReducer(s, { type: "RESTART" });
    expect(r.answers).toEqual({});
    expect(r.stage).toBe("app_at_rest");
  });
});

describe("app session", () => {
  it("restores an active map into exploration and drops overlays", () => {
    const s = run(
      { type: "SELECT_CHALLENGE", value: "backlog_capacity" },
      { type: "OPEN_CARD", card: "workflow" },
      { type: "OPEN_REFINEMENT", key: "businessGoal" },
    );
    saveAppSession(s, sessionStorage);
    const restored = loadAppSession(sessionStorage);
    expect(restored?.stage).toBe("map_exploration");
    expect(restored?.activeCard).toBe("workflow");
    expect(restored?.refining).toBeNull();
    expect(restored?.activePath).toBe("services_coordination");
  });

  it("rejects tampered or foreign payloads and clears on restart", () => {
    sessionStorage.setItem("teamulate.aiCardApp.v2", JSON.stringify({ version: "ai-card-app-v2.0.0", state: { answers: { primaryChallenge: "evil" }, description: "" } }));
    expect(loadAppSession(sessionStorage)).toBeNull();
    saveAppSession(run({ type: "SELECT_CHALLENGE", value: "fragmented" }), sessionStorage);
    clearAppSession(sessionStorage);
    expect(sessionStorage.getItem("teamulate.aiCardApp.v2")).toBeNull();
  });
});
