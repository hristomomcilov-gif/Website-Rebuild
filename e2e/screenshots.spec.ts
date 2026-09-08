import { expect, test, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

/**
 * Review-evidence matrix for the AI Card v1 preview
 * (Implementation Brief §12 "Testing and review evidence").
 *
 * Widths: 320, 390, 768, 1024, 1440 plus a 720 px viewport that approximates
 * 200% browser zoom on a 1440 px desktop. Paths: MSP, cybersecurity, services
 * and the generic fallback; motion and reduced-motion variants.
 */
const OUT_DIR = path.resolve("docs/qa/screenshots");
fs.mkdirSync(OUT_DIR, { recursive: true });

const WIDTHS = [320, 390, 768, 1024, 1440] as const;

async function shot(page: Page, name: string, fullPage = true) {
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForTimeout(50);
  await page.screenshot({ path: path.join(OUT_DIR, `${name}.png`), fullPage, animations: "disabled" });
}

async function answer(page: Page, label: string) {
  await page.getByRole("radio", { name: label }).check();
}

async function continueTo(page: Page) {
  await page.getByRole("button", { name: "Continue", exact: true }).click();
}

type Flow = {
  challenge: string;
  business: string;
  capacity: string;
  goal: string;
  friction: string;
};

const FLOWS: Record<string, Flow> = {
  msp: {
    challenge: "We need more consistent qualified demand",
    business: "Managed IT / MSP",
    capacity: "One in-house marketer",
    goal: "A more consistent flow of qualified demand",
    friction: "Work gets lost between people, channels or tools",
  },
  cyber: {
    challenge: "Our marketing feels fragmented",
    business: "Cybersecurity",
    capacity: "A small in-house team",
    goal: "Clearer positioning and better buyer trust",
    friction: "We cannot publish or launch confidently",
  },
  services: {
    challenge: "We have too much backlog and too little capacity",
    business: "Professional services",
    capacity: "Founder-led",
    goal: "Clearer measurement and operating visibility",
    friction: "We are not sure what to prioritize",
  },
  fallback: {
    challenge: "We cannot clearly see what is working",
    business: "Managed IT / MSP",
    capacity: "A mix of internal and external people",
    goal: "Clearer measurement and operating visibility",
    friction: "We cannot prove what is working",
  },
};

async function runQuestions(page: Page, flow: Flow) {
  await page.goto("/ai-card/");
  await page.getByRole("button", { name: "Build my AI Card" }).click();
  await answer(page, flow.challenge);
  await continueTo(page);
  await answer(page, flow.business);
  await continueTo(page);
  await answer(page, flow.capacity);
  await continueTo(page);
  await answer(page, flow.goal);
  await continueTo(page);
  await answer(page, flow.friction);
  await continueTo(page);
}

async function toMap(page: Page, flow: Flow) {
  await runQuestions(page, flow);
  await page.getByRole("button", { name: "Continue with the sample" }).click();
  await page.getByRole("button", { name: "View my operating map" }).click({ timeout: 15_000 });
  await expect(page.getByRole("heading", { name: "Your sample operating map" })).toBeVisible();
}

test.describe("homepage entry (W00)", () => {
  for (const width of [390, 1440] as const) {
    test(`home @${width}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      await expect(page.getByRole("heading", { level: 1 })).toHaveText("A full marketing department. Without building one.");
      await shot(page, `home-${width}`);
    });
  }
});

test.describe("AI Card landing (W-entry) across widths", () => {
  for (const width of WIDTHS) {
    test(`landing @${width}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/ai-card/");
      await expect(page.getByRole("heading", { name: "What is slowing your marketing down?" })).toBeVisible();
      await expect(page.getByText("No private systems connected")).toBeVisible();
      await expect(page.getByText(/This is a guided sample, not a live audit/)).toBeVisible();
      await shot(page, `landing-${width}`);
    });
  }
});

test("welcome + question 1 (W01) @390 and @320", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/ai-card/");
  await page.getByRole("button", { name: "Build my AI Card" }).click();
  await expect(page.getByText("Hi — I’m Strategos, Teamulate’s Head of Marketing.")).toBeVisible();
  await shot(page, "welcome-q1-390");
  await page.setViewportSize({ width: 320, height: 700 });
  await shot(page, "welcome-q1-320");
});

test("question 2 with acknowledgement, selected state @390", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/ai-card/");
  await page.getByRole("button", { name: "Build my AI Card" }).click();
  await answer(page, FLOWS.msp.challenge);
  await continueTo(page);
  await expect(page.getByText("That gives us a useful outcome to design around.")).toBeVisible();
  await answer(page, "Managed IT / MSP");
  await shot(page, "question-2-selected-390");
});

test("questions desktop three-zone layout @1024", async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 900 });
  await page.goto("/ai-card/");
  await page.getByRole("button", { name: "Build my AI Card" }).click();
  await answer(page, FLOWS.msp.challenge);
  await continueTo(page);
  await answer(page, "Managed IT / MSP");
  await continueTo(page);
  await shot(page, "question-3-desktop-1024");
});

test("optional context (W03) @390", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await runQuestions(page, FLOWS.msp);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("One optional detail");
  await page.getByRole("textbox").fill("We provide managed IT and security support for 50–500 employee companies in Ontario.");
  await expect(page.getByText("Your description — used for this sample only").first()).toBeVisible();
  await shot(page, "optional-context-390");
});

test("department assembly (W04) with motion @390", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await runQuestions(page, FLOWS.msp);
  await page.getByRole("button", { name: "Skip" }).click();
  await expect(page.getByRole("heading", { name: /Building a sample department/ })).toBeVisible();
  await page.waitForTimeout(1600);
  await shot(page, "assembly-motion-mid-390");
  await expect(page.getByRole("button", { name: "View my operating map" })).toBeEnabled({ timeout: 15_000 });
  await shot(page, "assembly-motion-complete-390");
});

test("department assembly (W04) reduced motion @390", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
  await runQuestions(page, FLOWS.cyber);
  await page.getByRole("button", { name: "Skip" }).click();
  await expect(page.getByRole("button", { name: "View my operating map" })).toBeEnabled({ timeout: 5_000 });
  await expect(page.getByText("Your sample operating map is ready.")).toBeVisible();
  await shot(page, "assembly-reduced-motion-390");
});

test("department assembly desktop @1440", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await runQuestions(page, FLOWS.msp);
  await page.getByRole("button", { name: "Skip" }).click();
  await expect(page.getByRole("button", { name: "View my operating map" })).toBeEnabled({ timeout: 15_000 });
  await shot(page, "assembly-complete-1440");
});

for (const [key, flow] of Object.entries(FLOWS)) {
  test(`operating map and five cards — ${key} @390`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await toMap(page, flow);
    await shot(page, `map-overview-${key}-390`);
    await page.getByRole("button", { name: "Start with the bottleneck" }).click();
    await expect(page.getByText("1 · Operating bottleneck")).toBeVisible();
    await shot(page, `card1-bottleneck-${key}-390`);
    await page.getByRole("button", { name: "See the department" }).click();
    await expect(page.getByText("2 · Your department")).toBeVisible();
    await shot(page, `card2-department-${key}-390`);
    if (key === "msp") {
      await page.getByRole("button", { name: "See the workflow" }).click();
      await expect(page.getByText("3 · First workflow")).toBeVisible();
      await shot(page, `card3-workflow-${key}-390`);
      await page.getByRole("button", { name: "See what keeps moving" }).click();
      await expect(page.getByText("4 · Operations and control")).toBeVisible();
      await shot(page, `card4-control-${key}-390`);
      await page.getByRole("button", { name: "See the 90-day map" }).click();
      await expect(page.getByText("5 · First 90 days")).toBeVisible();
      await shot(page, `card5-90-days-${key}-390`);
      await page.getByRole("button", { name: "See the department on a sample dashboard" }).click();
      await expect(page.getByRole("heading", { name: "See the work behind the operating map." })).toBeVisible();
      await expect(page.getByRole("link", { name: "Open the sample dashboard" })).toHaveAttribute("href", "https://teamulate.ca/demo/dashboard/");
      await shot(page, `handoff-dashboard-${key}-390`);
      await page.getByRole("button", { name: "Request a live operating review" }).click();
      await expect(page.getByRole("heading", { name: "Turn the sample into a real operating review." })).toBeVisible();
      await shot(page, `handoff-review-${key}-390`);
    }
  });
}

test("controlled agent sheet (W11) @390", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await toMap(page, FLOWS.msp);
  await page.getByRole("button", { name: "Start with the bottleneck" }).click();
  await page.getByRole("button", { name: "See the department" }).click();
  await page.getByRole("button", { name: "Ask what Seeker would measure" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText("We would begin with the buyer questions that matter");
  await expect(dialog.getByRole("textbox")).toHaveCount(0);
  await shot(page, "agent-sheet-seeker-390", false);
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(page.getByRole("button", { name: "Ask what Seeker would measure" })).toBeFocused();
});

test("cards on desktop @1024 and @1440 — msp", async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 900 });
  await toMap(page, FLOWS.msp);
  await page.getByRole("button", { name: "Start with the bottleneck" }).click();
  await shot(page, "card1-bottleneck-msp-1024");
  await page.getByRole("button", { name: "See the department" }).click();
  await shot(page, "card2-department-msp-1024");
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.getByRole("button", { name: "See the workflow" }).click();
  await shot(page, "card3-workflow-msp-1440");
  await page.getByRole("button", { name: "See what keeps moving" }).click();
  await shot(page, "card4-control-msp-1440");
});

test("cards @768 tablet — cyber", async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 1024 });
  await toMap(page, FLOWS.cyber);
  await page.getByRole("button", { name: "Start with the bottleneck" }).click();
  await shot(page, "card1-bottleneck-cyber-768");
});

test("200% zoom equivalent (720 css px) — services card 2", async ({ page }) => {
  await page.setViewportSize({ width: 720, height: 600 });
  await toMap(page, FLOWS.services);
  await page.getByRole("button", { name: "Start with the bottleneck" }).click();
  await page.getByRole("button", { name: "See the department" }).click();
  await shot(page, "card2-department-services-zoom200");
});

test("explore a sample loads the transparent canonical fixture", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/ai-card/");
  await page.getByRole("button", { name: "Explore a sample" }).click();
  await page.getByRole("button", { name: "View my operating map" }).click({ timeout: 15_000 });
  await expect(page.getByText("Sample answers")).toBeVisible();
  await shot(page, "explore-sample-overview-390");
});

test("back preserves answers; restart clears session", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await runQuestions(page, FLOWS.services);
  await page.getByRole("button", { name: "Back" }).first().click();
  await expect(page.getByRole("radio", { name: FLOWS.services.friction })).toBeChecked();
  await page.reload();
  await expect(page.getByRole("radio", { name: FLOWS.services.friction })).toBeChecked();
  await page.getByRole("button", { name: "Start a new sample operating map" }).first().click();
  await shot(page, "restart-confirmation-390", false);
  await page.getByRole("button", { name: "Start again" }).click();
  await expect(page.getByRole("heading", { name: "What is slowing your marketing down?" })).toBeVisible();
  const stored = await page.evaluate(() => window.sessionStorage.getItem("teamulate.aiCard.v1"));
  expect(stored).toBeNull();
});

test("no network requests leave the origin during the whole flow", async ({ page }) => {
  const external: string[] = [];
  page.on("request", (req) => {
    const url = new URL(req.url());
    if (url.origin !== "http://127.0.0.1:4173") external.push(req.url());
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await toMap(page, FLOWS.msp);
  await page.getByRole("button", { name: "Start with the bottleneck" }).click();
  await page.getByRole("button", { name: "See the department" }).click();
  await page.getByRole("button", { name: "Ask why Scout starts here" }).click();
  expect(external).toEqual([]);
});
