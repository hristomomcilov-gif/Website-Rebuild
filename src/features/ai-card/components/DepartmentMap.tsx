import { AGENTS, ASSEMBLY } from "../content";
import type { AgentKey } from "../content/types";

export type DepartmentMapProps = {
  /** Specialists (excluding Strategos, Metric, Guardian) in display order. Max 6. */
  specialists: ReadonlyArray<AgentKey>;
  /** Which nodes are currently visible. Strategos is always visible. */
  visible: ReadonlySet<AgentKey>;
  showHandoff?: boolean;
  showMetric?: boolean;
  showGuardian?: boolean;
  /** Foreground a single role (M09). Others soften; its link to Strategos stays. */
  highlight?: AgentKey | null;
  /** When false, nodes render in their final state without entrance motion. */
  animate?: boolean;
  description?: string;
  className?: string;
};

const CENTER = { x: 200, y: 158 };
const RX = 152;
const RY = 100;
/** Specialists occupy a 240° arc (left → over the top → right); the bottom is reserved for the two checks. */
const ARC_START = (150 * Math.PI) / 180;
const ARC_SPAN = (240 * Math.PI) / 180;

function specialistPosition(index: number, count: number) {
  const angle = ARC_START + ((index + 1) * ARC_SPAN) / (count + 1);
  return { x: CENTER.x + RX * Math.cos(angle), y: CENTER.y + RY * Math.sin(angle) };
}

const METRIC = { x: 118, y: 262 };
const GUARDIAN = { x: 282, y: 262 };

/**
 * Lightweight SVG department map. No WebGL, no video, no loops. Every visible
 * line represents a workflow relationship: brief handoffs from Strategos,
 * Metric's measurement check and Guardian's approval/quality check.
 */
export function DepartmentMap({
  specialists,
  visible,
  showHandoff = false,
  showMetric = false,
  showGuardian = false,
  highlight = null,
  animate = false,
  description = ASSEMBLY.accessibleDescription,
  className = "",
}: DepartmentMapProps) {
  const shown = specialists.slice(0, 6);
  const dim = (key: AgentKey) => highlight !== null && highlight !== key && key !== "strategos";
  const entrance = animate ? "motion-safe:animate-node-in" : "";

  return (
    <svg
      viewBox="0 0 400 320"
      role="img"
      aria-label={description}
      className={`h-auto w-full ${className}`}
      focusable="false"
    >
      <defs>
        <radialGradient id="tm-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#5b47f0" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#5b47f0" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Links: Strategos → specialists */}
      {shown.map((key, i) => {
        if (!visible.has(key)) return null;
        const p = specialistPosition(i, shown.length);
        const isFirst = i === 0;
        return (
          <g key={`link-${key}`} opacity={dim(key) ? 0.25 : 1}>
            <line
              x1={CENTER.x}
              y1={CENTER.y}
              x2={p.x}
              y2={p.y}
              stroke="rgba(255,255,255,0.28)"
              strokeWidth={1.25}
            />
            {isFirst && showHandoff ? (
              <>
                <line
                  x1={CENTER.x}
                  y1={CENTER.y}
                  x2={p.x}
                  y2={p.y}
                  stroke="#8f82f5"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  className={`tm-handoff ${animate ? "motion-safe:tm-handoff-run" : ""}`}
                  style={animate ? undefined : { strokeDashoffset: 0 }}
                />
                <text
                  x={(CENTER.x + p.x) / 2}
                  y={(CENTER.y + p.y) / 2 - 7}
                  textAnchor="middle"
                  fontSize="9.5"
                  fill="#c9c2fb"
                  fontWeight={600}
                >
                  {ASSEMBLY.connectionLabels.handoff}
                </text>
              </>
            ) : null}
          </g>
        );
      })}

      {/* Checkpoint links */}
      {showMetric ? (
        <g opacity={dim("metric") ? 0.25 : 1}>
          <line
            x1={CENTER.x}
            y1={CENTER.y}
            x2={METRIC.x}
            y2={METRIC.y}
            stroke="#4fd0dc"
            strokeWidth={1.5}
            strokeDasharray="4 4"
          />
        </g>
      ) : null}
      {showGuardian ? (
        <g opacity={dim("guardian") ? 0.25 : 1}>
          <line
            x1={CENTER.x}
            y1={CENTER.y}
            x2={GUARDIAN.x}
            y2={GUARDIAN.y}
            stroke="#f9c56d"
            strokeWidth={1.5}
            strokeDasharray="4 4"
          />
        </g>
      ) : null}

      {/* Strategos */}
      <g className={`tm-node ${entrance}`}>
        <circle cx={CENTER.x} cy={CENTER.y} r={46} fill="url(#tm-glow)" />
        <circle
          cx={CENTER.x}
          cy={CENTER.y}
          r={26}
          fill="#10213f"
          stroke="#8f82f5"
          strokeWidth={2}
        />
        <text
          x={CENTER.x}
          y={CENTER.y - 2}
          textAnchor="middle"
          fontSize="12.5"
          fontWeight={700}
          fill="#ffffff"
        >
          {AGENTS.strategos.name}
        </text>
        <text x={CENTER.x} y={CENTER.y + 11} textAnchor="middle" fontSize="8.5" fill="#b4bfd6">
          {AGENTS.strategos.mapLabel}
        </text>
      </g>

      {/* Specialists */}
      {shown.map((key, i) => {
        if (!visible.has(key)) return null;
        const p = specialistPosition(i, shown.length);
        const agent = AGENTS[key];
        const isHighlight = highlight === key;
        return (
          <g
            key={key}
            className={`tm-node ${entrance}`}
            opacity={dim(key) ? 0.35 : 1}
            style={animate ? { animationDelay: `${i * 90}ms` } : undefined}
          >
            <circle
              cx={p.x}
              cy={p.y}
              r={18}
              fill={isHighlight ? "#223a68" : "#10213f"}
              stroke={isHighlight ? "#ffffff" : "rgba(255,255,255,0.45)"}
              strokeWidth={isHighlight ? 2 : 1.25}
            />
            <text
              x={p.x}
              y={p.y + 30}
              textAnchor="middle"
              fontSize="11"
              fontWeight={600}
              fill="#ffffff"
            >
              {agent.name}
            </text>
            <text x={p.x} y={p.y + 41} textAnchor="middle" fontSize="8.5" fill="#b4bfd6">
              {agent.mapLabel}
            </text>
          </g>
        );
      })}

      {/* Metric checkpoint */}
      {showMetric ? (
        <g className={`tm-node ${entrance}`} opacity={dim("metric") ? 0.35 : 1}>
          <rect
            x={METRIC.x - 14}
            y={METRIC.y - 14}
            width={28}
            height={28}
            rx={6}
            transform={`rotate(45 ${METRIC.x} ${METRIC.y})`}
            fill="#10213f"
            stroke="#4fd0dc"
            strokeWidth={1.75}
          />
          <text x={METRIC.x} y={METRIC.y + 34} textAnchor="middle" fontSize="11" fontWeight={600} fill="#ffffff">
            {AGENTS.metric.name}
          </text>
          <text x={METRIC.x} y={METRIC.y + 45} textAnchor="middle" fontSize="8.5" fill="#4fd0dc">
            {ASSEMBLY.connectionLabels.measure}
          </text>
        </g>
      ) : null}

      {/* Guardian checkpoint */}
      {showGuardian ? (
        <g className={`tm-node ${entrance}`} opacity={dim("guardian") ? 0.35 : 1}>
          <rect
            x={GUARDIAN.x - 14}
            y={GUARDIAN.y - 14}
            width={28}
            height={28}
            rx={6}
            transform={`rotate(45 ${GUARDIAN.x} ${GUARDIAN.y})`}
            fill="#10213f"
            stroke="#f9c56d"
            strokeWidth={1.75}
          />
          <text x={GUARDIAN.x} y={GUARDIAN.y + 34} textAnchor="middle" fontSize="11" fontWeight={600} fill="#ffffff">
            {AGENTS.guardian.name}
          </text>
          <text x={GUARDIAN.x} y={GUARDIAN.y + 45} textAnchor="middle" fontSize="8.5" fill="#f9c56d">
            {AGENTS.guardian.mapLabel}
          </text>
        </g>
      ) : null}
    </svg>
  );
}

/** Specialists for a department, excluding the coordinator and the two checks. */
export function specialistsOf(department: ReadonlyArray<AgentKey>): AgentKey[] {
  return department.filter((k) => k !== "strategos" && k !== "metric" && k !== "guardian");
}
