import { describe, expect, it } from "vitest";
import * as content from "./index";
import { AGENT_SHEETS } from "./agentSheets";
import { PATHS, QUESTIONS } from "./index";

/**
 * Content-fidelity guard (Implementation Brief §11): labels that may not
 * appear anywhere in the V1 public copy.
 */
const FORBIDDEN_PHRASES = [
  /running now/i,
  /agent online/i,
  /real-time analysis/i,
  /fully autonomous/i,
  /24\/7/i,
  /guaranteed (leads|revenue|pipeline)/i,
  /works with every tool/i,
  /replaces? your (entire )?(marketing )?team/i,
  /reading your data/i,
  /analy[sz]ing your private/i,
];

/** Short label-like strings that would read as a fake status badge. */
const FORBIDDEN_STATUS_LABELS = [/^\s*live\s*$/i, /^\s*connected\s*$/i, /^\s*online\s*$/i];

function collectStrings(value: unknown, out: string[] = []): string[] {
  if (typeof value === "string") out.push(value);
  else if (Array.isArray(value)) value.forEach((v) => collectStrings(v, out));
  else if (value && typeof value === "object") Object.values(value).forEach((v) => collectStrings(v, out));
  return out;
}

describe("AI Card content configuration", () => {
  const allStrings = collectStrings({
    ...content,
    PATHS,
    AGENT_SHEETS,
  }).filter((s) => !s.startsWith("http"));

  it("asks exactly five single-select questions", () => {
    expect(QUESTIONS).toHaveLength(5);
    for (const q of QUESTIONS) {
      expect(q.options.length).toBeGreaterThanOrEqual(5);
      const values = q.options.map((o) => o.value);
      expect(new Set(values).size).toBe(values.length);
    }
  });

  it("never uses forbidden status or claim language", () => {
    for (const s of allStrings) {
      for (const pattern of FORBIDDEN_PHRASES) {
        expect(s, `"${s}" matches ${pattern}`).not.toMatch(pattern);
      }
      for (const pattern of FORBIDDEN_STATUS_LABELS) {
        expect(s, `"${s}" is a forbidden status label`).not.toMatch(pattern);
      }
      // "Live" is only allowed in "live (operating) review" or in an explicit
      // negation such as "not a live audit" / "not a live analysis".
      const liveMentions =
        s.match(/(?<!not a )(?<!or a )\blive\b(?! (operating )?review)(?! audit)/gi) ?? [];
      expect(liveMentions, `"${s}" uses "live" outside "live operating review"`).toHaveLength(0);
    }
  });

  it("every path has five cards with a truth boundary and a complete department", () => {
    for (const path of Object.values(PATHS)) {
      expect(path.card1.unknown.length).toBeGreaterThan(20);
      expect(path.card1.validate.length).toBeGreaterThan(20);
      expect(path.card2.roles.length).toBeGreaterThanOrEqual(7);
      expect(path.card3.stages.length).toBeGreaterThanOrEqual(5);
      expect(path.card4.rows.length).toBeGreaterThanOrEqual(5);
      expect(path.card5.windows).toHaveLength(3);
      expect(path.card5.footer).toMatch(/directional|hypothesis/i);
      expect(path.department[0]).toBe("strategos");
      expect(path.department).toContain("metric");
      expect(path.department).toContain("guardian");
      expect(path.assemblyForeground.length).toBeLessThanOrEqual(6);
      // Every card-2 role must be part of the department and vice versa.
      const roleKeys = path.card2.roles.map((r) => r.agent);
      expect([...roleKeys].sort()).toEqual([...path.department].sort());
    }
  });

  it("every interaction chip points at an approved scripted sheet", () => {
    for (const path of Object.values(PATHS)) {
      for (const chip of path.card2.chips) {
        expect(AGENT_SHEETS[chip.sheet], `${path.key}: ${chip.label}`).toBeDefined();
      }
    }
  });

  it("no card fabricates numbers, percentages or currency", () => {
    const cardStrings = collectStrings(PATHS);
    for (const s of cardStrings) {
      expect(s).not.toMatch(/\d+\s?%/);
      expect(s).not.toMatch(/[$€£]\s?\d/);
    }
  });
});
