import { describe, expect, it } from "vitest";
import { SAMPLE_ANSWERS } from "../content";
import { aiCardReducer, initialAiCardState, type AiCardAction, type AiCardState } from "./stateMachine";

function run(actions: AiCardAction[], from: AiCardState = initialAiCardState): AiCardState {
  return actions.reduce(aiCardReducer, from);
}

const answerAll: AiCardAction[] = [
  { type: "START" },
  { type: "ANSWER", question: "primaryChallenge", value: "backlog_capacity" },
  { type: "CONTINUE" },
  { type: "ANSWER", question: "businessType", value: "professional_services" },
  { type: "CONTINUE" },
  { type: "ANSWER", question: "currentCapacity", value: "founder_led" },
  { type: "CONTINUE" },
  { type: "ANSWER", question: "businessGoal", value: "measurement_visibility" },
  { type: "CONTINUE" },
  { type: "ANSWER", question: "operatingFriction", value: "prioritization" },
  { type: "CONTINUE" },
];

describe("aiCardReducer — question flow", () => {
  it("starts on welcome and moves to the first question", () => {
    expect(initialAiCardState.current).toEqual({ stage: "welcome" });
    expect(run([{ type: "START" }]).current).toEqual({ stage: "questions", questionIndex: 0 });
  });

  it("does not continue without a selection", () => {
    const s = run([{ type: "START" }, { type: "CONTINUE" }]);
    expect(s.current).toEqual({ stage: "questions", questionIndex: 0 });
  });

  it("ignores answers for a question that is not current", () => {
    const s = run([{ type: "START" }, { type: "ANSWER", question: "businessType", value: "msp" }]);
    expect(s.answers).toEqual({});
  });

  it("walks through five questions to the optional-context step", () => {
    const s = run(answerAll);
    expect(s.current).toEqual({ stage: "optional-context" });
    expect(s.answers).toEqual({
      primaryChallenge: "backlog_capacity",
      businessType: "professional_services",
      currentCapacity: "founder_led",
      businessGoal: "measurement_visibility",
      operatingFriction: "prioritization",
    });
  });
});

describe("aiCardReducer — back preserves, restart clears", () => {
  it("Back returns to the previous question and keeps every answer", () => {
    const s = run([...answerAll, { type: "BACK" }, { type: "BACK" }]);
    expect(s.current).toEqual({ stage: "questions", questionIndex: 3 });
    expect(s.answers.operatingFriction).toBe("prioritization");
    expect(s.answers.businessGoal).toBe("measurement_visibility");
  });

  it("Back from the first question returns to welcome and keeps the answer", () => {
    const s = run([
      { type: "START" },
      { type: "ANSWER", question: "primaryChallenge", value: "fragmented" },
      { type: "BACK" },
    ]);
    expect(s.current).toEqual({ stage: "welcome" });
    expect(s.answers.primaryChallenge).toBe("fragmented");
  });

  it("changing an earlier answer keeps later answers (visible in Based on your selections)", () => {
    const s = run([...answerAll, { type: "BACK" }, { type: "BACK" }, { type: "ANSWER", question: "businessGoal", value: "lifecycle_crm" }]);
    expect(s.answers.businessGoal).toBe("lifecycle_crm");
    expect(s.answers.operatingFriction).toBe("prioritization");
  });

  it("Restart clears all answers, the optional text and the stage", () => {
    const s = run([
      ...answerAll,
      { type: "SET_OPTIONAL_CONTEXT", value: "We provide managed IT." },
      { type: "SUBMIT_OPTIONAL_CONTEXT" },
      { type: "RESTART" },
    ]);
    expect(s).toEqual(initialAiCardState);
  });
});

describe("aiCardReducer — optional context and assembly", () => {
  it("optional text is never required: skipping clears it and reaches assembly", () => {
    const s = run([...answerAll, { type: "SET_OPTIONAL_CONTEXT", value: "draft" }, { type: "SKIP_OPTIONAL_CONTEXT" }]);
    expect(s.current).toEqual({ stage: "assembly" });
    expect(s.optionalContext).toBe("");
  });

  it("submitting keeps the description in session state only", () => {
    const s = run([...answerAll, { type: "SET_OPTIONAL_CONTEXT", value: "We provide managed IT." }, { type: "SUBMIT_OPTIONAL_CONTEXT" }]);
    expect(s.current).toEqual({ stage: "assembly" });
    expect(s.optionalContext).toBe("We provide managed IT.");
  });

  it("Back from assembly returns to optional context for a personal card", () => {
    const s = run([...answerAll, { type: "SKIP_OPTIONAL_CONTEXT" }, { type: "BACK" }]);
    expect(s.current).toEqual({ stage: "optional-context" });
  });

  it("VIEW_MAP opens the overview", () => {
    const s = run([...answerAll, { type: "SKIP_OPTIONAL_CONTEXT" }, { type: "VIEW_MAP" }]);
    expect(s.current).toEqual({ stage: "map", cardIndex: null });
    expect(s.assemblyComplete).toBe(true);
  });
});

describe("aiCardReducer — explore a sample", () => {
  it("loads the canonical sample answers and marks the card as a sample", () => {
    const s = run([{ type: "EXPLORE_SAMPLE" }]);
    expect(s.answers).toEqual(SAMPLE_ANSWERS);
    expect(s.isSample).toBe(true);
    expect(s.current).toEqual({ stage: "assembly" });
  });

  it("the 'I want to explore a sample' chip behaves like Explore a sample", () => {
    const s = run([{ type: "START" }, { type: "ANSWER", question: "primaryChallenge", value: "explore_sample" }]);
    expect(s.isSample).toBe(true);
    expect(s.current).toEqual({ stage: "assembly" });
  });

  it("Back from a sample assembly returns to welcome (there were no personal questions)", () => {
    const s = run([{ type: "EXPLORE_SAMPLE" }, { type: "BACK" }]);
    expect(s.current).toEqual({ stage: "welcome" });
  });
});

describe("aiCardReducer — cards, sheets and handoff", () => {
  const atMap: AiCardAction[] = [...answerAll, { type: "SKIP_OPTIONAL_CONTEXT" }, { type: "VIEW_MAP" }];

  it("navigates cards in order with Next / Previous", () => {
    let s = run([...atMap, { type: "NEXT_CARD" }]);
    expect(s.current).toEqual({ stage: "map", cardIndex: 0 });
    s = run([{ type: "NEXT_CARD" }, { type: "NEXT_CARD" }], s);
    expect(s.current).toEqual({ stage: "map", cardIndex: 2 });
    s = run([{ type: "PREVIOUS_CARD" }], s);
    expect(s.current).toEqual({ stage: "map", cardIndex: 1 });
    s = run([{ type: "PREVIOUS_CARD" }, { type: "PREVIOUS_CARD" }], s);
    expect(s.current).toEqual({ stage: "map", cardIndex: null });
  });

  it("Next from card 5 opens the dashboard gateway; Back returns to card 5", () => {
    let s = run([...atMap, { type: "OPEN_CARD", cardIndex: 4 }, { type: "NEXT_CARD" }]);
    expect(s.current).toEqual({ stage: "handoff", kind: "dashboard" });
    s = aiCardReducer(s, { type: "BACK" });
    expect(s.current).toEqual({ stage: "map", cardIndex: 4 });
  });

  it("opens and closes an agent sheet, returning to the triggering card", () => {
    let s = run([...atMap, { type: "OPEN_CARD", cardIndex: 1 }, { type: "OPEN_SHEET", sheet: "scout" }]);
    expect(s.current).toEqual({ stage: "agent-sheet", sheet: "scout", returnCardIndex: 1 });
    s = aiCardReducer(s, { type: "CLOSE_SHEET" });
    expect(s.current).toEqual({ stage: "map", cardIndex: 1 });
  });

  it("cannot open a sheet from the overview (no triggering card)", () => {
    const s = run([...atMap, { type: "OPEN_SHEET", sheet: "scout" }]);
    expect(s.current).toEqual({ stage: "map", cardIndex: null });
  });

  it("opens the live-review handoff and closes back to card 5", () => {
    let s = run([...atMap, { type: "OPEN_CARD", cardIndex: 4 }, { type: "OPEN_HANDOFF", kind: "review" }]);
    expect(s.current).toEqual({ stage: "handoff", kind: "review" });
    s = aiCardReducer(s, { type: "CLOSE_HANDOFF" });
    expect(s.current).toEqual({ stage: "map", cardIndex: 4 });
  });
});
