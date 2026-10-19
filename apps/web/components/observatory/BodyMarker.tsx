"use client";

import type { Placement } from "@bridge/shared-types";
import { polarToCartesian, SIGN_NAMES } from "./geometry";

interface BodyMarkerProps {
  placement: Placement;
  angle: number;
  cx: number;
  cy: number;
  radius: number;
  onSelect?: () => void;
  reducedMotion: boolean;
}

const BODY_COLORS: Record<string, { main: string; glow: string }> = {
  sun: { main: "#D4A76A", glow: "#D4A76A" },
  moon: { main: "#C4B394", glow: "#E8DCC8" },
  rising: { main: "#A98ABF", glow: "#8B6E9E" },
};

/** SVG path for the Sun — radiant circle with short rays */
function SunSymbol({ color }: { color: string }) {
  return (
    <g>
      <circle cx={0} cy={0} r={4} fill="none" stroke={color} strokeWidth={1.3} />
      <circle cx={0} cy={0} r={1} fill={color} />
      {/* Cardinal rays */}
      <line x1={0} y1={-5.5} x2={0} y2={-7} stroke={color} strokeWidth={1} strokeLinecap="round" />
      <line x1={0} y1={5.5} x2={0} y2={7} stroke={color} strokeWidth={1} strokeLinecap="round" />
      <line x1={-5.5} y1={0} x2={-7} y2={0} stroke={color} strokeWidth={1} strokeLinecap="round" />
      <line x1={5.5} y1={0} x2={7} y2={0} stroke={color} strokeWidth={1} strokeLinecap="round" />
      {/* Diagonal rays */}
      <line x1={-3.9} y1={-3.9} x2={-5} y2={-5} stroke={color} strokeWidth={0.7} strokeLinecap="round" />
      <line x1={3.9} y1={-3.9} x2={5} y2={-5} stroke={color} strokeWidth={0.7} strokeLinecap="round" />
      <line x1={-3.9} y1={3.9} x2={-5} y2={5} stroke={color} strokeWidth={0.7} strokeLinecap="round" />
      <line x1={3.9} y1={3.9} x2={5} y2={5} stroke={color} strokeWidth={0.7} strokeLinecap="round" />
    </g>
  );
}

/** SVG path for the Moon — crescent */
function MoonSymbol({ color }: { color: string }) {
  return (
    <g>
      <path
        d="M 2 -5 A 5 5 0 1 0 2 5 A 3.5 3.5 0 1 1 2 -5"
        fill="none"
        stroke={color}
        strokeWidth={1.2}
        strokeLinecap="round"
      />
    </g>
  );
}

/** SVG path for Rising — upward arrow with horizon */
function RisingSymbol({ color }: { color: string }) {
  return (
    <g>
      <line x1={-5} y1={3} x2={5} y2={3} stroke={color} strokeWidth={1} strokeLinecap="round" />
      <line x1={0} y1={3} x2={0} y2={-5} stroke={color} strokeWidth={1.2} strokeLinecap="round" />
      <polyline
        points="-3,-2 0,-5 3,-2"
        fill="none"
        stroke={color}
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  );
}

export default function BodyMarker({
  placement,
  angle,
  cx,
  cy,
  radius,
  onSelect,
  reducedMotion,
}: BodyMarkerProps) {
  const pos = polarToCartesian(cx, cy, radius, angle);
  const colors = BODY_COLORS[placement.body] ?? BODY_COLORS.moon;
  const isSun = placement.body === "sun";
  const label = `${placement.body === "rising" ? "Rising" : placement.body.charAt(0).toUpperCase() + placement.body.slice(1)} in ${SIGN_NAMES[placement.sign]} at ${Math.round(placement.degree)}°`;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isSun && onSelect && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      onSelect();
    }
  };

  const markerScale = isSun ? 1.4 : 1.1;

  return (
    <g
      role={isSun ? "button" : undefined}
      tabIndex={isSun ? 0 : undefined}
      aria-label={label}
      onClick={isSun ? onSelect : undefined}
      onKeyDown={isSun ? handleKeyDown : undefined}
      style={{ cursor: isSun ? "pointer" : "default" }}
    >
      {/* Glow background for sun */}
      {isSun && (
        <circle
          cx={pos.x}
          cy={pos.y}
          r={18}
          fill="url(#sun-radial-glow)"
          opacity={0.6}
          className={!reducedMotion ? "sun-glow-bg" : ""}
        />
      )}

      {/* Background disc */}
      <circle
        cx={pos.x}
        cy={pos.y}
        r={isSun ? 15 : 11}
        fill="rgba(26, 16, 37, 0.8)"
        stroke={colors.main}
        strokeWidth={isSun ? 1 : 0.5}
        strokeOpacity={isSun ? 0.6 : 0.3}
      />

      {/* Body symbol */}
      <g
        transform={`translate(${pos.x}, ${pos.y}) scale(${markerScale})`}
        opacity={isSun ? 1 : 0.65}
        style={{ pointerEvents: "none" }}
      >
        {placement.body === "sun" && <SunSymbol color={colors.main} />}
        {placement.body === "moon" && <MoonSymbol color={colors.main} />}
        {placement.body === "rising" && <RisingSymbol color={colors.main} />}
      </g>
    </g>
  );
}
