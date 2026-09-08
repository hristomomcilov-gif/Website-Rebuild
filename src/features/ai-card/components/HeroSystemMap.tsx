import { HERO } from "../content";
import { DepartmentMap } from "./DepartmentMap";

/**
 * Small, static operating map for the homepage hero (W00): Strategos at the
 * centre with four neutral nodes, Metric and Guardian checks. No autoplay,
 * no loop; a text summary carries the same meaning for assistive technology.
 */
export function HeroSystemMap() {
  return (
    <DepartmentMap
      specialists={["scout", "wordsmith", "flow", "nexus"]}
      visible={new Set(["strategos", "scout", "wordsmith", "flow", "nexus"])}
      showHandoff
      showMetric
      showGuardian
      animate={false}
      description={HERO.accessibilitySummary}
    />
  );
}
