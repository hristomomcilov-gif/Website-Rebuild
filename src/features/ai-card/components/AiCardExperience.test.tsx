import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { AiCardExperience } from "./AiCardExperience";
import { DESTINATIONS, PATHS } from "../content";
import { SESSION_KEY } from "../logic/session";

/**
 * Integration tests run through the real reducer, content and components.
 * jsdom has no `matchMedia`, so `useReducedMotion` reports reduced motion and
 * the assembly completes immediately — the same path a reduced-motion visitor
 * takes in a browser.
 */

async function answerAndContinue(user: ReturnType<typeof userEvent.setup>, label: string) {
  await user.click(screen.getByRole("radio", { name: label }));
  await user.click(screen.getByRole("button", { name: "Continue" }));
}

async function completeMspFlow(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole("button", { name: "Build my AI Card" }));
  await answerAndContinue(user, "We need more consistent qualified demand");
  await answerAndContinue(user, "Managed IT / MSP");
  await answerAndContinue(user, "One in-house marketer");
  await answerAndContinue(user, "A more consistent flow of qualified demand");
  await answerAndContinue(user, "Work gets lost between people, channels or tools");
}

describe("AiCardExperience — landing and questions", () => {
  it("renders the crawlable landing state with the trust disclosure", () => {
    render(<AiCardExperience />);
    expect(screen.getByRole("heading", { level: 1, name: "What is slowing your marketing down?" })).toBeInTheDocument();
    expect(screen.getByText(/This is a guided sample, not a live audit/)).toBeInTheDocument();
    expect(screen.getAllByText("Guided sample").length).toBeGreaterThan(0);
    expect(screen.getByText("No private systems connected")).toBeInTheDocument();
  });

  it("uses semantic radio groups, blocks Continue until a selection exists and exposes 'Why are you asking?'", async () => {
    const user = userEvent.setup();
    render(<AiCardExperience />);
    await user.click(screen.getByRole("button", { name: "Build my AI Card" }));

    expect(screen.getByRole("radiogroup")).toBeInTheDocument();
    expect(screen.getAllByRole("radio")).toHaveLength(6);
    expect(screen.getByText("1 of 5")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Continue" })).toBeDisabled();
    expect(screen.getByText("Why are you asking?")).toBeInTheDocument();

    await user.click(screen.getByRole("radio", { name: "Our marketing feels fragmented" }));
    expect(screen.getByRole("radio", { name: "Our marketing feels fragmented" })).toBeChecked();
    expect(screen.getByText("Selected")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Continue" })).toBeEnabled();
  });

  it("shows the controlled acknowledgement after the first answer and preserves answers on Back", async () => {
    const user = userEvent.setup();
    render(<AiCardExperience />);
    await user.click(screen.getByRole("button", { name: "Build my AI Card" }));
    await answerAndContinue(user, "We cannot clearly see what is working");
    expect(screen.getByText(/Visibility is a control problem as much as a reporting problem/)).toBeInTheDocument();
    expect(screen.getByText("2 of 5")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Back" }));
    expect(screen.getByRole("radio", { name: "We cannot clearly see what is working" })).toBeChecked();
  });
});

describe("AiCardExperience — optional context, assembly and output", () => {
  it("keeps the optional text optional and session-only, then assembles and shows five cards in order", async () => {
    const user = userEvent.setup();
    render(<AiCardExperience />);
    await completeMspFlow(user);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("One optional detail");
    expect(screen.getByRole("button", { name: "Continue with my description" })).toBeDisabled();
    await user.type(screen.getByRole("textbox"), "We provide managed IT.");
    expect(window.sessionStorage.getItem(SESSION_KEY)).toContain("We provide managed IT.");
    expect(document.cookie).toBe("");

    await user.click(screen.getByRole("button", { name: "Continue with my description" }));
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Building a sample department");
    expect(screen.getByText("Your sample operating map is ready.")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "View my operating map" }));
    const list = screen.getByRole("list", { name: "The five cards in your operating map" });
    const items = within(list).getAllByRole("listitem").map((li) => li.textContent);
    expect(items[0]).toContain("Operating bottleneck");
    expect(items[1]).toContain("Your department");
    expect(items[2]).toContain("First workflow");
    expect(items[3]).toContain("Operations and control");
    expect(items[4]).toContain("First 90 days");
    expect(screen.getByText(PATHS.msp_demand.summary)).toBeInTheDocument();
  });

  it("card 1 carries the truth boundary labels and the MSP hypothesis", async () => {
    const user = userEvent.setup();
    render(<AiCardExperience />);
    await completeMspFlow(user);
    await user.click(screen.getByRole("button", { name: "Skip" }));
    await user.click(screen.getByRole("button", { name: "View my operating map" }));
    await user.click(screen.getByRole("button", { name: "Start with the bottleneck" }));

    expect(screen.getByRole("heading", { level: 2, name: PATHS.msp_demand.card1.title })).toBeInTheDocument();
    expect(screen.getByText("Based on your selections · guided sample")).toBeInTheDocument();
    expect(screen.getByText(PATHS.msp_demand.card1.unknown)).toBeInTheDocument();
    expect(screen.getByText(PATHS.msp_demand.card1.validate)).toBeInTheDocument();
    expect(screen.getAllByText("What Teamulate does not know yet").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Requires validation").length).toBeGreaterThan(0);
  });

  it("controlled agent sheets show only the scripted reply — no composer — and return focus", async () => {
    const user = userEvent.setup();
    render(<AiCardExperience />);
    await completeMspFlow(user);
    await user.click(screen.getByRole("button", { name: "Skip" }));
    await user.click(screen.getByRole("button", { name: "View my operating map" }));
    await user.click(screen.getByRole("button", { name: "Start with the bottleneck" }));
    await user.click(screen.getByRole("button", { name: "See the department" }));

    const trigger = screen.getByRole("button", { name: "Ask what Seeker would measure" });
    await user.click(trigger);
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveTextContent("What would you measure for search and GEO?");
    expect(dialog).toHaveTextContent("We would begin with the buyer questions that matter");
    expect(dialog).toHaveTextContent("No website, Search Console or analytics data is connected in this sample.");
    expect(within(dialog).queryByRole("textbox")).toBeNull();

    await user.click(within(dialog).getByRole("button", { name: "Back to your department" }));
    expect(screen.queryByRole("dialog")).toBeNull();
    await new Promise((r) => setTimeout(r, 0));
    expect(trigger).toHaveFocus();
  });

  it("card 5 leads to approved external destinations only and restart clears the session", async () => {
    const user = userEvent.setup();
    render(<AiCardExperience />);
    await completeMspFlow(user);
    await user.click(screen.getByRole("button", { name: "Skip" }));
    await user.click(screen.getByRole("button", { name: "View my operating map" }));
    await user.click(screen.getByRole("button", { name: "Start with the bottleneck" }));
    await user.click(screen.getByRole("button", { name: "See the department" }));
    await user.click(screen.getByRole("button", { name: "See the workflow" }));
    await user.click(screen.getByRole("button", { name: "See what keeps moving" }));
    await user.click(screen.getByRole("button", { name: "See the 90-day map" }));

    expect(screen.getByText(PATHS.msp_demand.card5.footer)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "See the department on a sample dashboard" }));
    expect(screen.getByRole("link", { name: "Open the sample dashboard" })).toHaveAttribute("href", DESTINATIONS.sampleDashboard);
    expect(screen.getByText("Sample dashboard data is clearly labeled and is not client data.")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Request a live operating review" }));
    expect(screen.getByRole("link", { name: "Request a live operating review" })).toHaveAttribute("href", DESTINATIONS.requestReview);
    expect(screen.queryByRole("form")).toBeNull();
    expect(screen.queryByRole("textbox")).toBeNull();

    await user.click(screen.getAllByRole("button", { name: "Start a new sample operating map" })[0]);
    expect(screen.getByRole("dialog")).toHaveTextContent("Start again? Your current selections will be cleared from this session.");
    await user.click(screen.getByRole("button", { name: "Start again" }));
    expect(screen.getByRole("heading", { level: 1, name: "What is slowing your marketing down?" })).toBeInTheDocument();
    expect(window.sessionStorage.getItem(SESSION_KEY)).toBeNull();
  });
});

describe("AiCardExperience — explore a sample and session restore", () => {
  it("Explore a sample loads the canonical fixture and labels the answers as sample answers", async () => {
    const user = userEvent.setup();
    render(<AiCardExperience />);
    await user.click(screen.getByRole("button", { name: "Explore a sample" }));
    await user.click(screen.getByRole("button", { name: "View my operating map" }));
    expect(screen.getByText("Sample answers")).toBeInTheDocument();
    expect(screen.getByText("Managed IT / MSP")).toBeInTheDocument();
  });

  it("restores an in-progress card from sessionStorage", async () => {
    const user = userEvent.setup();
    const first = render(<AiCardExperience />);
    await user.click(screen.getByRole("button", { name: "Build my AI Card" }));
    await answerAndContinue(user, "Our marketing feels fragmented");
    first.unmount();

    render(<AiCardExperience />);
    expect(await screen.findByText("2 of 5")).toBeInTheDocument();
  });
});
