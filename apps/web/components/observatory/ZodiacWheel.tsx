"use client";

import { useMemo } from "react";
import type { Chart, System } from "@bridge/shared-types";
import { getSegments, placementAngle, generateTicks, generateStarfield, polarToCartesian } from "./geometry";
import ZodiacSegment from "./ZodiacSegment";
import BodyMarker from "./BodyMarker";

interface ZodiacWheelProps {
  chart: Chart;
  system: System;
  onSunSelect: () => void;
  reducedMotion: boolean;
}

const CX = 200;
const CY = 200;

// Ring radii — multiple concentric layers for engraved appearance
const OUTERMOST_RIM = 195;
const OUTER_RING = 190;
const SEGMENT_OUTER = 175;
const SEGMENT_INNER = 125;
const LABEL_RADIUS = 150;
const INNER_RING = 120;
const TICK_RING_OUTER = 118;
const TICK_RING_INNER = 112;
const BODY_RADIUS = 98;
const INNER_DECORATIVE = 88;
const INNERMOST_RIM = 82;

const GOLD = "rgba(196, 179, 148,";
const GOLD_WARM = "rgba(212, 167, 106,";

export default function ZodiacWheel({
  chart,
  system,
  onSunSelect,
  reducedMotion,
}: ZodiacWheelProps) {
  const segments = getSegments(system);
  const activeSigns = new Set(chart.placements.map((p) => p.sign));

  // Degree tick marks — 36 major (every 10°), fine ticks at segment boundaries
  const majorTicks = useMemo(() => generateTicks(CX, CY, TICK_RING_INNER, TICK_RING_OUTER, 36), []);
  const segmentBoundaryTicks = useMemo(() => {
    return segments.map((s) => {
      const p1 = polarToCartesian(CX, CY, SEGMENT_INNER, s.startAngle);
      const p2 = polarToCartesian(CX, CY, SEGMENT_OUTER, s.startAngle);
      return { x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y };
    });
  }, [segments]);

  // Decorative starfield surrounding the wheel
  const starfield = useMemo(() => generateStarfield(CX, CY, OUTERMOST_RIM + 2, 200, 60, 42), []);

  const placementLabel = chart.placements
    .map((p) => `${p.body === "rising" ? "Rising" : p.body.charAt(0).toUpperCase() + p.body.slice(1)} in ${p.sign.charAt(0).toUpperCase() + p.sign.slice(1)} at ${Math.round(p.degree)}°`)
    .join(", ");

  return (
    <svg
      viewBox="0 0 400 400"
      role="img"
      aria-label={`${system === "tropical" ? "Earth Sky" : "Star Sky"} zodiac wheel: ${placementLabel}`}
      className="w-[min(90vw,420px)] sm:w-[min(70vw,540px)] lg:w-[560px] h-auto"
    >
      <defs>
        {/* Sun radial glow gradient */}
        <radialGradient id="sun-radial-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#D4A76A" stopOpacity={0.3} />
          <stop offset="100%" stopColor="#D4A76A" stopOpacity={0} />
        </radialGradient>
        {/* Subtle inner shadow for depth */}
        <radialGradient id="center-shadow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1a1025" stopOpacity={0.9} />
          <stop offset="70%" stopColor="#1a1025" stopOpacity={0.4} />
          <stop offset="100%" stopColor="#1a1025" stopOpacity={0} />
        </radialGradient>
      </defs>

      {/* Starfield — scattered dots outside the wheel */}
      {starfield.map((star, i) => (
        <circle
          key={`sf-${i}`}
          cx={star.x}
          cy={star.y}
          r={star.r}
          fill={`${GOLD}${star.opacity})`}
        />
      ))}

      {/* Outermost decorative rim — finest line */}
      <circle
        cx={CX} cy={CY} r={OUTERMOST_RIM}
        fill="none"
        stroke={`${GOLD}0.2)`}
        strokeWidth={0.3}
      />

      {/* Outer ring — antique gold */}
      <circle
        cx={CX} cy={CY} r={OUTER_RING}
        fill="none"
        stroke={`${GOLD}0.35)`}
        strokeWidth={0.8}
      />

      {/* Zodiac segments */}
      {segments.map((segment, i) => (
        <ZodiacSegment
          key={segment.sign}
          segment={segment}
          index={i}
          cx={CX}
          cy={CY}
          innerRadius={SEGMENT_INNER}
          outerRadius={SEGMENT_OUTER}
          labelRadius={LABEL_RADIUS}
          isActive={activeSigns.has(segment.sign)}
        />
      ))}

      {/* Segment boundary lines — extend through the segment ring */}
      {segmentBoundaryTicks.map((tick, i) => (
        <line
          key={`sb-${i}`}
          x1={tick.x1} y1={tick.y1}
          x2={tick.x2} y2={tick.y2}
          stroke={`${GOLD}0.15)`}
          strokeWidth={0.5}
        />
      ))}

      {/* Inner ring — segment border */}
      <circle
        cx={CX} cy={CY} r={INNER_RING}
        fill="none"
        stroke={`${GOLD}0.3)`}
        strokeWidth={0.6}
      />

      {/* Degree tick ring */}
      {majorTicks.map((tick, i) => (
        <line
          key={`mt-${i}`}
          x1={tick.x1} y1={tick.y1}
          x2={tick.x2} y2={tick.y2}
          stroke={`${GOLD}0.18)`}
          strokeWidth={i % 3 === 0 ? 0.7 : 0.3}
        />
      ))}

      {/* Inner decorative ring */}
      <circle
        cx={CX} cy={CY} r={INNER_DECORATIVE}
        fill="none"
        stroke={`${GOLD}0.25)`}
        strokeWidth={0.5}
      />

      {/* Innermost rim — finest decorative circle */}
      <circle
        cx={CX} cy={CY} r={INNERMOST_RIM}
        fill="none"
        stroke={`${GOLD}0.15)`}
        strokeWidth={0.3}
      />

      {/* Center depth gradient */}
      <circle
        cx={CX} cy={CY} r={INNERMOST_RIM}
        fill="url(#center-shadow)"
      />

      {/* Body markers */}
      {chart.placements.map((placement) => (
        <BodyMarker
          key={placement.body}
          placement={placement}
          angle={placementAngle(placement, system)}
          cx={CX}
          cy={CY}
          radius={BODY_RADIUS}
          onSelect={placement.body === "sun" ? onSunSelect : undefined}
          reducedMotion={reducedMotion}
        />
      ))}

      {/* Sun pulse animation */}
      {!reducedMotion && (
        <style>{`
          .sun-glow-bg {
            animation: sun-breathe 3s ease-in-out infinite;
          }
          @keyframes sun-breathe {
            0%, 100% { opacity: 0.4; }
            50% { opacity: 0.7; }
          }
        `}</style>
      )}
    </svg>
  );
}
