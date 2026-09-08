import { expect, test, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

/**
 * Review package for the app-first AI Card (Experience Reset v2 §11):
 * desktop and mobile first viewport before/after the first challenge
 * selection, a reduced-motion state, the widths matrix, keyboard operation
 * and the no-external-request guarantee.
 */
const OUT_DIR = path.resolve("docs/qa/screenshots/app-first");
fs.mkdirSync(OUT_DIR, { recursive: true });

async function shot(page: Page, name: string, fullPage = false) {
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForTimeout(50);
  await page.screenshot({ path: path.join(OUT_DIR, `${name}.png`), fullPage, animations: "disabled" });
}

async function open(page: Page) {
  await page.goto("/ai-card-app/");
  await expect(page.getByRole("heading", { level: 1, name: "Your AI Card" })).toBeVisible();
}

async function selectDemand(page: Page) {
  await page.getByRole("button", { name: "More qualified demand" }).first().click();
}

const activatedMap = (page: Page) => page.getByRole("img", { name: /Department map for the challenge “More qualified demand”/ });

test.describe("first viewport (Reset v2 §4, §11)", () => {
  for (const [name, width, height] of [
    ["desktop-1440", 1440, 900],
    ["laptop-1024", 1024, 768],
    ["tablet-768", 768, 1024],
    ["mobile-390", 390, 844],
    ["mobile-320", 320, 700],
  ] as const) {
    test(`${name}: at rest, then after “More qualified demand”`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await open(page);
      // No start screen, no wizard progress, no radios.
      await expect(page.getByRole("button", { name: "Build my AI Card" })).toHaveCount(0);
      await expect(page.getByText(/1 of 5/)).toHaveCount(0);
      await expect(page.getByRole("radio")).toHaveCount(0);
      await expect(page.getByRole("img", { name: /department map at rest/i })).toBeVisible();
      await expect(page.getByRole("heading", { name: "What is slowing your marketing down?" }).first()).toBeVisible();
      await expect(page.getByRole("button", { name: /1 · Operating bottleneck/ })).toBeAttached();
      await shot(page, `${name}-rest`);

      await selectDemand(page);
      await expect(page.getByTestId("hypothesis")).toContainText("More qualified demand is rarely a single-channel problem");
      await page.waitForTimeout(900);
      await shot(page, `${name}-activating`);
      await expect(page.getByRole("heading", { name: /Likely bottleneck: demand work is fragmented/ })).toBeVisible({ timeout: 5000 });
      await expect(activatedMap(page)).toHaveAccessibleName(/Scout, Seeker/);
      await expect(page.locator("[data-scene-state='active']")).toHaveCount(1);
      await shot(page, `${name}-after`);
    });
  }

  test("desktop full page after activation", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await open(page);
    await selectDemand(page);
    await expect(page.getByRole("heading", { name: /Likely bottleneck/ })).toBeVisible({ timeout: 5000 });
    await shot(page, "desktop-1440-after-full", true);
  });

  test("reduced motion: finished state at once, same story", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: 390, height: 844 });
    await open(page);
    await selectDemand(page);
    await expect(page.locator("[data-scene-state='active']")).toHaveCount(1, { timeout: 1000 });
    await expect(page.getByRole("button", { name: "Skip" })).toHaveCount(0);
    await expect(page.getByRole("heading", { name: /Likely bottleneck/ })).toBeVisible();
    await shot(page, "mobile-390-reduced-motion-after");
  });

  test("200% zoom equivalent (720 css px)", async ({ page }) => {
    await page.setViewportSize({ width: 720, height: 600 });
    await open(page);
    await selectDemand(page);
    await expect(page.getByRole("heading", { name: /Likely bottleneck/ })).toBeVisible({ timeout: 5000 });
    await shot(page, "zoom200-720-after");
  });
});

test.describe("exploration, refinement and controls", () => {
  test("cards open in any order; refinement is optional and re-routes; Edit signal restores the composer", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await open(page);
    await selectDemand(page);
    await expect(page.getByRole("heading", { name: /Likely bottleneck/ })).toBeVisible({ timeout: 5000 });

    await page.getByRole("button", { name: /5 · First 90 days/ }).click();
    await expect(page.getByRole("heading", { name: "A sample 90-day operating map" })).toBeVisible();
    await expect(page.getByText("Why it matters")).toBeVisible();
    await shot(page, "desktop-1440-card5-with-optional-prompt", true);

    await page.getByRole("button", { name: /2 · Your department/ }).click();
    await expect(page.getByRole("heading", { name: "The department that would work on this first" })).toBeVisible();
    await shot(page, "desktop-1440-card2", true);

    await page.getByRole("button", { name: "Refine this sample" }).first().click();
    const dialog = page.getByRole("dialog", { name: "Refine this sample" });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("textbox")).toHaveCount(0);
    await shot(page, "desktop-1440-refine-sheet");
    await dialog.getByRole("button", { name: "Cybersecurity" }).click();
    await dialog.getByRole("button", { name: "Done" }).click();
    await expect(page.getByText("Cybersecurity — positioning and trust").filter({ visible: true }).first()).toBeVisible();
    await shot(page, "desktop-1440-after-refinement");

    await page.getByRole("button", { name: "Edit signal" }).first().click();
    await expect(page.getByText("No signal selected yet").filter({ visible: true }).first()).toBeVisible();
    await expect(page.getByRole("button", { name: /1 · Operating bottleneck/ })).toBeDisabled();
  });

  test("mobile: vertical card rail, role sheet, hand-off", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await open(page);
    await page.getByRole("button", { name: "Too little capacity" }).first().click();
    await expect(page.getByRole("heading", { name: /bottleneck/i })).toBeVisible({ timeout: 5000 });
    await page.getByRole("button", { name: /3 · First workflow/ }).click();
    await page.getByRole("button", { name: /3 · First workflow/ }).scrollIntoViewIfNeeded();
    await page.waitForTimeout(100);
    await page.screenshot({ path: path.join(OUT_DIR, "mobile-390-card3-inline.png"), animations: "disabled" });

    await page.getByRole("button", { name: /^Scout/ }).first().click();
    const sheet = page.getByRole("dialog", { name: "Scout" });
    await expect(sheet).toBeVisible();
    await expect(sheet.getByRole("textbox")).toHaveCount(0);
    await page.screenshot({ path: path.join(OUT_DIR, "mobile-390-role-sheet-scout.png"), animations: "disabled" });
    await page.keyboard.press("Escape");
    await expect(sheet).toBeHidden();

    await page.getByRole("button", { name: /5 · First 90 days/ }).click();
    await page.locator("#operating-card-panel").getByRole("button", { name: "See the department on a sample dashboard" }).click();
    await expect(page.getByRole("link", { name: "Open the sample dashboard" })).toHaveAttribute("href", "https://teamulate.ca/demo/dashboard/");
    await page.getByRole("link", { name: "Open the sample dashboard" }).scrollIntoViewIfNeeded();
    await page.screenshot({ path: path.join(OUT_DIR, "mobile-390-handoff-dashboard.png"), animations: "disabled" });
  });

  test("keyboard: select a challenge, open a card, open/close a sheet, change the selection", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await open(page);
    await page.getByRole("button", { name: "Fragmented marketing" }).first().focus();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("heading", { name: /more than one possible bottleneck/ })).toBeVisible({ timeout: 5000 });
    await page.getByRole("button", { name: /4 · Operations and control/ }).focus();
    await page.keyboard.press("Enter");
    await expect(page.locator("#operating-card-panel").getByRole("heading", { level: 2 })).toBeVisible();
    const role = page.getByRole("button", { name: /^Scout/ }).filter({ visible: true }).first();
    await role.focus();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("dialog", { name: "Scout" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(role).toBeFocused();
    await page.getByRole("button", { name: "Edit signal" }).filter({ visible: true }).first().focus();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("button", { name: "More qualified demand" }).first()).toBeVisible();
  });

  test("refresh restores the map; restart clears the session", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await open(page);
    await page.getByRole("button", { name: "Website conversion" }).first().click();
    await expect(page.getByRole("heading", { name: /bottleneck/i })).toBeVisible({ timeout: 5000 });
    await page.reload();
    await expect(page.getByRole("heading", { name: /bottleneck/i })).toBeVisible({ timeout: 5000 });
    await page.getByRole("button", { name: "Start a new sample" }).first().click();
    await page.getByRole("button", { name: "Start again" }).click();
    await expect(page.getByRole("button", { name: /1 · Operating bottleneck/ })).toBeDisabled();
    expect(await page.evaluate(() => window.sessionStorage.getItem("teamulate.aiCardApp.v2"))).toBeNull();
  });

  test("no request leaves the origin during the whole flow", async ({ page }) => {
    const external: string[] = [];
    page.on("request", (req) => {
      if (new URL(req.url()).origin !== "http://127.0.0.1:4173") external.push(req.url());
    });
    await page.setViewportSize({ width: 390, height: 844 });
    await open(page);
    await selectDemand(page);
    await expect(page.getByRole("heading", { name: /Likely bottleneck/ })).toBeVisible({ timeout: 5000 });
    await page.getByRole("button", { name: "Refine this sample" }).first().click();
    await page.getByRole("dialog").getByRole("button", { name: "Managed IT / MSP" }).click();
    await page.getByRole("dialog").getByRole("button", { name: "Done" }).click();
    await page.getByRole("button", { name: /2 · Your department/ }).click();
    expect(external).toEqual([]);
  });
});
