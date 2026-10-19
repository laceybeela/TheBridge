"use client";

import { motion } from "framer-motion";
import type { BridgeTheme } from "@bridge/shared-types";

interface BridgeIllustrationProps {
  theme: BridgeTheme;
  reducedMotion: boolean;
}

/**
 * Symbolic illustration for the Bridge perspective.
 * Two celestial bodies (Earth/Star) connected by an arching bridge
 * with botanical and alchemical motifs expressing coexistence and dialogue.
 *
 * Palette:
 *   Fine detail:       #B99A70
 *   Primary engraving: #826246
 *   Deep sepia:        #4E392E
 */
export default function BridgeIllustration({ theme, reducedMotion }: BridgeIllustrationProps) {
  const duration = reducedMotion ? 0 : 1;

  // Category-specific accent colors (visible, not faint)
  const accents: Record<string, { stroke: string; fill: string }> = {
    divergence: { stroke: "#8B5E5E", fill: "rgba(139, 94, 94, 0.25)" },
    alignment: { stroke: "#5E7A5E", fill: "rgba(94, 122, 94, 0.25)" },
    amplification: { stroke: "#6E5E8B", fill: "rgba(110, 94, 139, 0.25)" },
  };
  const accent = accents[theme.category] ?? accents.divergence;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration, delay: reducedMotion ? 0 : 0.2 }}
      className="flex justify-center py-2"
    >
      <svg
        viewBox="0 0 280 120"
        className="w-64 sm:w-72 h-auto"
        role="img"
        aria-label={`Bridge illustration: ${theme.earth.label} and ${theme.star.label}`}
      >
        {/* Horizontal axis — the bridge itself */}
        <line
          x1={50} y1={60} x2={230} y2={60}
          stroke="#B99A70"
          strokeWidth={0.5}
          opacity={0.5}
        />

        {/* Arching bridge line */}
        <path
          d="M 50 60 Q 140 20 230 60"
          fill="none"
          stroke="#826246"
          strokeWidth={0.7}
          opacity={0.6}
        />
        {/* Lower reflection arch */}
        <path
          d="M 70 60 Q 140 85 210 60"
          fill="none"
          stroke="#B99A70"
          strokeWidth={0.4}
          strokeDasharray="3 4"
          opacity={0.4}
        />

        {/* Left circle — Earth / Tropical */}
        <circle cx={40} cy={60} r={22} fill="none" stroke="#826246" strokeWidth={0.8} opacity={0.6} />
        <circle cx={40} cy={60} r={17} fill="none" stroke="#B99A70" strokeWidth={0.4} opacity={0.4} />
        {/* Earth symbol — circle with cross */}
        <circle cx={40} cy={60} r={5} fill="none" stroke="#4E392E" strokeWidth={0.9} opacity={0.7} />
        <line x1={40} y1={54} x2={40} y2={66} stroke="#826246" strokeWidth={0.6} opacity={0.6} />
        <line x1={34} y1={60} x2={46} y2={60} stroke="#826246" strokeWidth={0.6} opacity={0.6} />

        {/* Right circle — Star / Sidereal */}
        <circle cx={240} cy={60} r={22} fill="none" stroke="#826246" strokeWidth={0.8} opacity={0.6} />
        <circle cx={240} cy={60} r={17} fill="none" stroke="#B99A70" strokeWidth={0.4} opacity={0.4} />
        {/* Star symbol — eight-pointed star */}
        {[0, 45, 90, 135].map((angle) => {
          const rad = (angle * Math.PI) / 180;
          const x1 = 240 + Math.cos(rad) * 3;
          const y1 = 60 + Math.sin(rad) * 3;
          const x2 = 240 + Math.cos(rad) * 7;
          const y2 = 60 + Math.sin(rad) * 7;
          const x3 = 240 - Math.cos(rad) * 3;
          const y3 = 60 - Math.sin(rad) * 3;
          const x4 = 240 - Math.cos(rad) * 7;
          const y4 = 60 - Math.sin(rad) * 7;
          return (
            <g key={angle}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#4E392E" strokeWidth={0.7} strokeLinecap="round" opacity={0.65} />
              <line x1={x3} y1={y3} x2={x4} y2={y4} stroke="#4E392E" strokeWidth={0.7} strokeLinecap="round" opacity={0.65} />
            </g>
          );
        })}
        <circle cx={240} cy={60} r={1.5} fill="#4E392E" opacity={0.6} />

        {/* Center point — the meeting place */}
        <circle cx={140} cy={38} r={4} fill="none" stroke={accent.stroke} strokeWidth={0.9} opacity={0.8} />
        <circle cx={140} cy={38} r={1.5} fill={accent.fill} stroke={accent.stroke} strokeWidth={0.4} opacity={0.9} />

        {/* Botanical accents — leaf pairs at the bridge midpoint */}
        <path
          d="M 134 38 C 130 34 128 30 132 30 C 136 30 134 34 134 38"
          fill="#B99A70"
          fillOpacity={0.15}
          stroke="#826246"
          strokeWidth={0.6}
          opacity={0.55}
        />
        <path
          d="M 146 38 C 150 34 152 30 148 30 C 144 30 146 34 146 38"
          fill="#B99A70"
          fillOpacity={0.15}
          stroke="#826246"
          strokeWidth={0.6}
          opacity={0.55}
        />

        {/* Connecting dotted arcs from center to each side */}
        <path
          d="M 62 60 Q 100 35 136 38"
          fill="none"
          stroke="#B99A70"
          strokeWidth={0.4}
          strokeDasharray="2 3"
          opacity={0.4}
        />
        <path
          d="M 144 38 Q 180 35 218 60"
          fill="none"
          stroke="#B99A70"
          strokeWidth={0.4}
          strokeDasharray="2 3"
          opacity={0.4}
        />

        {/* Decorative dots along the bridge arc */}
        {[80, 110, 170, 200].map((x) => {
          const t = (x - 50) / 180;
          const y = 60 - Math.sin(t * Math.PI) * 18;
          return (
            <circle
              key={`bd-${x}`}
              cx={x} cy={y}
              r={0.8}
              fill="#826246"
              opacity={0.5}
            />
          );
        })}
      </svg>
    </motion.div>
  );
}
