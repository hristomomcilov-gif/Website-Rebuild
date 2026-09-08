import { defineConfig } from "@playwright/test";

/**
 * Screenshot/QA harness for the preview build. It serves the static export
 * from `out/` (built with `npm run build:preview`) and captures the review
 * matrix required by docs/AI_CARD_V1_AUDIT_AND_PLAN.md.
 */
export default defineConfig({
  testDir: "./e2e",
  outputDir: "./e2e/.results",
  timeout: 60_000,
  fullyParallel: false,
  workers: 1,
  reporter: [["list"]],
  use: {
    baseURL: "http://127.0.0.1:4173",
    channel: "chrome",
    headless: true,
  },
  webServer: {
    command: "npx serve out -l 4173 --no-clipboard",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
