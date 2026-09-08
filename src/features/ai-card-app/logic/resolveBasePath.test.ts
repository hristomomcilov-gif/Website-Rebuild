import { describe, expect, it } from "vitest";
import { QUESTIONS } from "@/features/ai-card/content";
import type { BusinessGoal, BusinessType, PrimaryChallenge } from "@/features/ai-card/content/types";
import { resolveAiCardPath } from "@/features/ai-card/logic/resolveAiCardPath";
import { isAssumedSample, resolveBaseDepartment, resolveBasePath } from "./resolveBasePath";

describe("resolveBasePath (partial answers)", () => {
  it("shows the core model when nothing is selected", () => {
    expect(resolveBasePath({})).toBe("fragmented_operation");
  });

  it("maps the first chip alone to a documented base fixture", () => {
    expect(resolveBasePath({ primaryChallenge: "consistent_demand" })).toBe("msp_demand");
    expect(resolveBasePath({ primaryChallenge: "backlog_capacity" })).toBe("services_coordination");
    expect(resolveBasePath({ primaryChallenge: "fragmented" })).toBe("fragmented_operation");
    expect(resolveBasePath({ primaryChallenge: "website_conversion" })).toBe("fragmented_operation");
    expect(resolveBasePath({ primaryChallenge: "measurement_visibility" })).toBe("fragmented_operation");
  });

  it("marks challenge-only maps as an assumed sample", () => {
    expect(isAssumedSample({ primaryChallenge: "consistent_demand" })).toBe(true);
    expect(isAssumedSample({ primaryChallenge: "consistent_demand", businessType: "msp" })).toBe(false);
    expect(isAssumedSample({})).toBe(false);
  });

  it("uses the v1 rule table once the business type is known, ignoring the unknown goal", () => {
    expect(resolveBasePath({ primaryChallenge: "consistent_demand", businessType: "cybersecurity" })).toBe(
      "cybersecurity_trust",
    );
    expect(resolveBasePath({ primaryChallenge: "consistent_demand", businessType: "professional_services" })).toBe(
      "fragmented_operation",
    );
    expect(resolveBasePath({ primaryChallenge: "backlog_capacity", businessType: "msp" })).toBe("msp_demand");
  });

  it("agrees with the complete v1 resolver whenever all routing answers are present", () => {
    const challenges = QUESTIONS[0].options.map((o) => o.value) as PrimaryChallenge[];
    const types = QUESTIONS[1].options.map((o) => o.value) as BusinessType[];
    const goals = QUESTIONS[3].options.map((o) => o.value) as BusinessGoal[];
    for (const primaryChallenge of challenges) {
      for (const businessType of types) {
        for (const businessGoal of goals) {
          expect(resolveBasePath({ primaryChallenge, businessType, businessGoal })).toBe(
            resolveAiCardPath({
              primaryChallenge,
              businessType,
              businessGoal,
              currentCapacity: "mixed",
              operatingFriction: "proof",
            }),
          );
        }
      }
    }
  });

  it("activates Scout, Seeker, Flow, Metric and Guardian for the demand chip (Reset v2 first milestone)", () => {
    const department = resolveBaseDepartment("msp_demand", { primaryChallenge: "consistent_demand" });
    for (const role of ["strategos", "scout", "seeker", "flow", "metric", "guardian"]) {
      expect(department).toContain(role);
    }
  });
});
