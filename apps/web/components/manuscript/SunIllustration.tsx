"use client";

import { motion } from "framer-motion";

interface SunIllustrationProps {
  reducedMotion: boolean;
}

/**
 * Botanical-celestial Sun illustration in the style of a copperplate engraving.
 * Concentric circles with radiating lines and botanical leaf motifs.
 *
 * Palette:
 *   Fine detail:       #B99A70
 *   Primary engraving: #826246
 *   Deep sepia:        #4E392E
 */
export default function SunIllustration({ reducedMotion }: SunIllustrationProps) {
  const duration = reducedMotion ? 0 : 1.2;

  // Generate ray lines radiating from center
  const rays: { x1: number; y1: number; x2: number; y2: number; width: number }[] = [];
  for (let i = 0; i < 24; i++) {
    const angle = (i * 15 * Math.PI) / 180;
    const innerR = i % 2 === 0 ? 32 : 28;
    const outerR = i % 2 === 0 ? 60 : 48;
    rays.push({
      x1: 80 + Math.cos(angle) * innerR,
      y1: 80 + Math.sin(angle) * innerR,
      x2: 80 + Math.cos(angle) * outerR,
      y2: 80 + Math.sin(angle) * outerR,
      width: i % 2 === 0 ? 0.8 : 0.4,
    });
  }

  // Botanical leaf pairs at cardinal positions
  const leaves = [
    "M 80 16 C 74 10 68 8 66 14 C 64 20 72 18 80 16 Z M 80 16 C 86 10 92 8 94 14 C 96 20 88 18 80 16 Z",
    "M 80 144 C 74 150 68 152 66 146 C 64 140 72 142 80 144 Z M 80 144 C 86 150 92 152 94 146 C 96 140 88 142 80 144 Z",
    "M 16 80 C 10 74 8 68 14 66 C 20 64 18 72 16 80 Z M 16 80 C 10 86 8 92 14 94 C 20 96 18 88 16 80 Z",
    "M 144 80 C 150 74 152 68 146 66 C 140 64 142 72 144 80 Z M 144 80 C 150 86 152 92 146 94 C 140 96 142 88 144 80 Z",
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration, delay: reducedMotion ? 0 : 0.3 }}
      className="flex justify-center py-4"
    >
      <svg
        viewBox="0 0 160 160"
        className="w-40 h-40 sm:w-48 sm:h-48"
        role="img"
        aria-label="Sun illustration"
      >
        {/* Outer decorative circle */}
        <circle
          cx={80} cy={80} r={72}
          fill="none"
          stroke="#B99A70"
          strokeWidth={0.5}
          opacity={0.5}
        />

        {/* Radiating lines */}
        {rays.map((ray, i) => (
          <line
            key={i}
            x1={ray.x1} y1={ray.y1}
            x2={ray.x2} y2={ray.y2}
            stroke="#826246"
            strokeWidth={ray.width}
            strokeLinecap="round"
            opacity={i % 2 === 0 ? 0.6 : 0.4}
          />
        ))}

        {/* Middle ring */}
        <circle
          cx={80} cy={80} r={44}
          fill="none"
          stroke="#B99A70"
          strokeWidth={0.5}
          strokeDasharray="2 3"
          opacity={0.45}
        />

        {/* Sun disc — primary engraving */}
        <circle
          cx={80} cy={80} r={24}
          fill="none"
          stroke="#826246"
          strokeWidth={1.2}
          opacity={0.8}
        />
        <circle
          cx={80} cy={80} r={20}
          fill="none"
          stroke="#826246"
          strokeWidth={0.6}
          opacity={0.5}
        />
        {/* Sun face — central dot */}
        <circle cx={80} cy={80} r={4} fill="#826246" opacity={0.35} />
        <circle cx={80} cy={80} r={1.5} fill="#4E392E" opacity={0.7} />

        {/* Inner ornamental ring */}
        <circle
          cx={80} cy={80} r={14}
          fill="none"
          stroke="#B99A70"
          strokeWidth={0.4}
          opacity={0.4}
        />

        {/* Botanical leaf motifs */}
        {leaves.map((d, i) => (
          <path
            key={`leaf-${i}`}
            d={d}
            fill="#B99A70"
            fillOpacity={0.2}
            stroke="#826246"
            strokeWidth={0.6}
            opacity={0.6}
          />
        ))}

        {/* Compass-style accent dots */}
        {[0, 90, 180, 270].map((angle) => {
          const r = 66;
          const x = 80 + Math.cos((angle * Math.PI) / 180) * r;
          const y = 80 + Math.sin((angle * Math.PI) / 180) * r;
          return (
            <circle
              key={`cd-${angle}`}
              cx={x} cy={y} r={1.2}
              fill="#826246"
              opacity={0.6}
            />
          );
        })}
      </svg>
    </motion.div>
  );
}
