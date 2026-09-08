import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AiCardApp } from "./AiCardApp";

/**
 * jsdom has no `prefers-reduced-motion` support, so `useReducedMotion` stays
 * `true` and the activation completes synchronously — the same path a
 * reduced-motion visitor takes. Timers are still faked for safety.
 */
beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
  if (!HTMLDialogElement.prototype.showModal) {
    HTMLDialogElement.prototype.showModal = function () {
      this.setAttribute("open", "");
    };
  }
});
afterEach(() => vi.useRealTimers());

const user = () => userEvent.setup({ advanceTimers: vi.advanceTimersByTime.bind(vi) });

describe("AiCardApp — app-first first viewport (Reset v2 §4)", () => {
  it("shows the shell, Strategos, department map, composer and five-card rail at rest — with no start screen", () => {
    render(<AiCardApp />);
    expect(screen.getByRole("heading", { level: 1, name: "Your AI Card" })).toBeInTheDocument();
    expect(screen.getAllByText("Strategos · Head of Marketing").length).toBeGreaterThan(0);
    expect(screen.getByRole("img", { name: /department map at rest/i })).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { name: "What is slowing your marketing down?" }).length).toBeGreaterThan(0);
    for (const title of ["Operating bottleneck", "Your department", "First workflow", "Operations and control", "First 90 days"]) {
      expect(screen.getAllByText(new RegExp(title)).length).toBeGreaterThan(0);
    }
    expect(screen.queryByRole("button", { name: "Build my AI Card" })).toBeNull();
    expect(screen.queryByText(/1 of 5/)).toBeNull();
    expect(screen.queryByRole("radio")).toBeNull();
    expect(screen.getAllByText(/No private systems connected/).length).toBeGreaterThan(0);
    expect(screen.queryByText(/Agents online|Live analysis|Scanning|Running now/)).toBeNull();
  });

  it("first milestone: selecting “More qualified demand” activates Scout, Seeker, Flow, Metric and Guardian and shows Card 1", async () => {
    const u = user();
    render(<AiCardApp />);
    await u.click(screen.getAllByRole("button", { name: "More qualified demand" })[0]);

    expect(screen.getByTestId("hypothesis")).toHaveTextContent(/More qualified demand is rarely a single-channel problem/);
    const map = screen.getByRole("img", { name: /Department map for the challenge “More qualified demand”/ });
    for (const role of ["Scout", "Seeker", "Flow"]) expect(map).toHaveAccessibleName(new RegExp(role));
    expect(map).toHaveAccessibleName(/Metric attaches a measurement checkpoint and Guardian an approval checkpoint/);

    act(() => vi.advanceTimersByTime(2000));
    expect(screen.getByRole("heading", { name: /Likely bottleneck: demand work is fragmented/ })).toBeInTheDocument();
    expect(screen.getAllByText(/Sample shown: MSP \/ Managed IT/).length).toBeGreaterThan(0);
    // The chips give way to the signal capsule; the selection stays visible.
    expect(screen.getByTestId("signal-capsule")).toHaveTextContent("More qualified demand");
  });

  it("cards open in any order before any further context; Edit signal returns to the composer", async () => {
    const u = user();
    render(<AiCardApp />);
    await u.click(screen.getAllByRole("button", { name: "Too little capacity" })[0]);
    act(() => vi.advanceTimersByTime(2000));

    await u.click(screen.getByRole("button", { name: /5 · First 90 days/ }));
    expect(screen.getByRole("heading", { name: /90-day/ })).toBeInTheDocument();
    await u.click(screen.getByRole("button", { name: /3 · First workflow/ }));
    expect(screen.getByRole("heading", { name: /workflow/i })).toBeInTheDocument();
    // Optional refinement appears inside the card and explains why it matters.
    expect(screen.getByText(/Why it matters/)).toBeInTheDocument();
    expect(screen.getByText("What would you most like to be true in 90 days?")).toBeInTheDocument();

    await u.click(screen.getAllByRole("button", { name: "Edit signal" })[0]);
    expect(screen.getAllByText("No signal selected yet").length).toBeGreaterThan(0);
    expect(screen.getByRole("button", { name: /1 · Operating bottleneck/ })).toBeDisabled();
  });

  it("refinement re-routes the map without a wizard and is clearable", async () => {
    const u = user();
    render(<AiCardApp />);
    await u.click(screen.getAllByRole("button", { name: "More qualified demand" })[0]);
    act(() => vi.advanceTimersByTime(2000));
    await u.click(screen.getAllByRole("button", { name: "Refine this sample" })[0]);
    const dialog = screen.getByRole("dialog", { name: "Refine this sample" });
    expect(within(dialog).queryByRole("textbox")).toBeNull();
    await u.click(within(dialog).getByRole("button", { name: "Cybersecurity" }));
    await u.click(within(dialog).getByRole("button", { name: "Done" }));
    expect(screen.getAllByText(/Cybersecurity — positioning and trust/).length).toBeGreaterThan(0);
    expect(screen.queryByText(/Sample shown:/)).toBeNull();
  });

  it("role sheets are scripted only and the optional description is reflected, session-only and never routed on", async () => {
    const u = user();
    render(<AiCardApp />);
    await u.click(screen.getAllByRole("button", { name: /Describe the problem in your own words/ })[0]);
    await u.type(screen.getAllByRole("textbox")[0], "We publish a lot but nothing turns into pipeline.");
    await u.click(screen.getAllByRole("button", { name: "Website conversion" })[0]);
    act(() => vi.advanceTimersByTime(2000));
    expect(screen.getByText(/“We publish a lot but nothing turns into pipeline.”/)).toBeInTheDocument();
    expect(screen.getAllByText(/Fragmented operation — core operating model/).length).toBeGreaterThan(0);

    await u.click(screen.getAllByRole("button", { name: /^Scout/ })[0]);
    const sheet = screen.getByRole("dialog", { name: "Scout" });
    expect(within(sheet).queryByRole("textbox")).toBeNull();
    expect(within(sheet).getByText(/Known gap in this sample/)).toBeInTheDocument();
    await u.keyboard("{Escape}");

    const stored = JSON.parse(window.sessionStorage.getItem("teamulate.aiCardApp.v2")!);
    expect(stored.state.description).toBe("We publish a lot but nothing turns into pipeline.");
    await u.click(screen.getByRole("button", { name: "Start a new sample" }));
    await u.click(screen.getByRole("button", { name: "Start again" }));
    expect(window.sessionStorage.getItem("teamulate.aiCardApp.v2")).toBeNull();
  });

  it("Explore sample loads a labelled complete fixture immediately", async () => {
    const u = user();
    render(<AiCardApp />);
    await u.click(screen.getAllByRole("button", { name: "Cybersecurity sample" })[0]);
    act(() => vi.advanceTimersByTime(2000));
    expect(screen.getByText("Complete sample loaded")).toBeInTheDocument();
    expect(screen.getAllByText(/Cybersecurity — positioning and trust/).length).toBeGreaterThan(0);
  });
});
