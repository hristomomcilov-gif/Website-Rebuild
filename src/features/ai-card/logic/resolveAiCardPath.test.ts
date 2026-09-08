import { describe, expect, it } from "vitest";
import { QUESTIONS, SAMPLE_ANSWERS } from "../content";
import type {
  BusinessGoal,
  BusinessType,
  CompleteAnswers,
  CurrentCapacity,
  OperatingFriction,
  PrimaryChallenge,
} from "../content/types";
import { resolveAiCardPath, resolveDepartment } from "./resolveAiCardPath";

const base: CompleteAnswers = {
  primaryChallenge: "consistent_demand",
  businessType: "msp",
  currentCapacity: "one_marketer",
  businessGoal: "qualified_demand",
  operatingFriction: "handoffs_tools",
};

const with_ = (overrides: Partial<CompleteAnswers>): CompleteAnswers => ({ ...base, ...overrides });

describe("resolveAiCardPath", () => {
  it("routes the canonical sample answers to the MSP path", () => {
    expect(resolveAiCardPath(SAMPLE_ANSWERS)).toBe("msp_demand");
  });

  it("routes MSP demand / capacity / fragmentation to msp_demand", () => {
    expect(resolveAiCardPath(with_({ primaryChallenge: "consistent_demand" }))).toBe("msp_demand");
    expect(resolveAiCardPath(with_({ primaryChallenge: "backlog_capacity", businessGoal: "content_search" }))).toBe("msp_demand");
    expect(resolveAiCardPath(with_({ primaryChallenge: "fragmented", businessGoal: "website_conversion" }))).toBe("msp_demand");
  });

  it("routes cybersecurity positioning / trust / visibility to cybersecurity_trust", () => {
    expect(
      resolveAiCardPath(
        with_({ businessType: "cybersecurity", primaryChallenge: "fragmented", businessGoal: "positioning_trust" }),
      ),
    ).toBe("cybersecurity_trust");
    expect(
      resolveAiCardPath(
        with_({ businessType: "cybersecurity", primaryChallenge: "consistent_demand", businessGoal: "content_search" }),
      ),
    ).toBe("cybersecurity_trust");
  });

  it("routes professional, technical and other B2B coordination problems to services_coordination", () => {
    const types: BusinessType[] = ["professional_services", "technical_services", "other_b2b"];
    for (const businessType of types) {
      expect(
        resolveAiCardPath(
          with_({ businessType, primaryChallenge: "backlog_capacity", businessGoal: "measurement_visibility" }),
        ),
      ).toBe("services_coordination");
    }
  });

  it("falls back to fragmented_operation when answers do not map cleanly", () => {
    // MSP with a measurement challenge is not in the MSP rule set.
    expect(
      resolveAiCardPath(with_({ primaryChallenge: "measurement_visibility", businessGoal: "measurement_visibility" })),
    ).toBe("fragmented_operation");
    // Cybersecurity with website-conversion challenge.
    expect(
      resolveAiCardPath(
        with_({ businessType: "cybersecurity", primaryChallenge: "website_conversion", businessGoal: "website_conversion" }),
      ),
    ).toBe("fragmented_operation");
    // Services with demand challenge + content goal (challenge not in rule).
    expect(
      resolveAiCardPath(
        with_({ businessType: "professional_services", primaryChallenge: "consistent_demand", businessGoal: "content_search" }),
      ),
    ).toBe("fragmented_operation");
  });

  it("is deterministic and total over every combination of the routing-relevant enums", () => {
    const challenges = QUESTIONS[0].options.map((o) => o.value) as PrimaryChallenge[];
    const types = QUESTIONS[1].options.map((o) => o.value) as BusinessType[];
    const capacities = QUESTIONS[2].options.map((o) => o.value) as CurrentCapacity[];
    const goals = QUESTIONS[3].options.map((o) => o.value) as BusinessGoal[];
    const frictions = QUESTIONS[4].options.map((o) => o.value) as OperatingFriction[];
    const valid = new Set(["msp_demand", "cybersecurity_trust", "services_coordination", "fragmented_operation"]);

    for (const primaryChallenge of challenges) {
      for (const businessType of types) {
        for (const businessGoal of goals) {
          const first = resolveAiCardPath({ ...base, primaryChallenge, businessType, businessGoal });
          expect(valid.has(first)).toBe(true);
          // Capacity and friction must never change the path.
          for (const currentCapacity of capacities) {
            for (const operatingFriction of frictions) {
              expect(
                resolveAiCardPath({ primaryChallenge, businessType, businessGoal, currentCapacity, operatingFriction }),
              ).toBe(first);
            }
          }
        }
      }
    }
  });
});

describe("resolveDepartment", () => {
  it("returns the fixed department for MSP and cybersecurity paths", () => {
    expect(resolveDepartment("msp_demand", base)).toEqual([
      "strategos", "scout", "seeker", "wordsmith", "growthtrack", "flow", "nexus", "metric", "guardian",
    ]);
    expect(resolveDepartment("cybersecurity_trust", base)).toHaveLength(9);
  });

  it("adds Seeker for services when content/search is the goal", () => {
    const dept = resolveDepartment("services_coordination", with_({ businessType: "professional_services", businessGoal: "content_search" }));
    expect(dept).toContain("seeker");
    expect(dept).not.toContain("growthtrack");
  });

  it("adds GrowthTrack for services when qualified demand is the goal", () => {
    const dept = resolveDepartment("services_coordination", with_({ businessType: "professional_services", businessGoal: "qualified_demand" }));
    expect(dept).toContain("growthtrack");
    expect(dept).not.toContain("seeker");
  });

  it("always keeps Strategos first and Metric + Guardian present", () => {
    for (const key of ["msp_demand", "cybersecurity_trust", "services_coordination", "fragmented_operation"] as const) {
      const dept = resolveDepartment(key, base);
      expect(dept[0]).toBe("strategos");
      expect(dept).toContain("metric");
      expect(dept).toContain("guardian");
      expect(dept.length).toBeLessThanOrEqual(11);
    }
  });
});
