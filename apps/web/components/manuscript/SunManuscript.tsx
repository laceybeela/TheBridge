"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { BirthChart, TraitProfile, BridgeTheme } from "@bridge/shared-types";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import ManuscriptHeader from "./ManuscriptHeader";
import PerspectiveSelector, { type Perspective } from "./PerspectiveSelector";
import PerspectiveContent from "./PerspectiveContent";

interface SunManuscriptProps {
  charts: BirthChart;
  traits: TraitProfile;
  themes: BridgeTheme[];
  onBack: () => void;
}

/**
 * Ornamental rule matching the header style, used as a closing flourish.
 */
function ClosingOrnament() {
  return (
    <svg viewBox="0 0 120 12" className="w-32 h-3 mx-auto" aria-hidden="true">
      <line x1={5} y1={6} x2={52} y2={6} stroke="#B99A70" strokeWidth={0.5} opacity={0.6} />
      <circle cx={60} cy={6} r={2} fill="none" stroke="#826246" strokeWidth={0.5} opacity={0.65} />
      <circle cx={60} cy={6} r={0.8} fill="#B99A70" opacity={0.5} />
      <line x1={68} y1={6} x2={115} y2={6} stroke="#B99A70" strokeWidth={0.5} opacity={0.6} />
    </svg>
  );
}

export default function SunManuscript({
  charts,
  traits,
  themes,
  onBack,
}: SunManuscriptProps) {
  const [perspective, setPerspective] = useState<Perspective>("tropical");
  const reducedMotion = useReducedMotion();
  const duration = reducedMotion ? 0 : 0.35;

  // Extract Sun data from each perspective
  const earthTrait = traits.earth.find((t) => t.source.body === "sun");
  const starTrait = traits.star.find((t) => t.source.body === "sun");
  const earthPlacement = charts.tropical.placements.find((p) => p.body === "sun");
  const starPlacement = charts.sidereal.placements.find((p) => p.body === "sun");
  const sunTheme = themes.find((t) => t.body === "sun");

  return (
    <>
      {/* Warm parchment background — covers the full viewport */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(180deg, #F0E8D8 0%, #EDE4D0 40%, #E8DCCA 100%)",
        }}
      />

      {/* Subtle paper texture overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative max-w-2xl mx-auto px-6 sm:px-10 py-16 sm:py-20 space-y-10">
        <ManuscriptHeader onBack={onBack} reducedMotion={reducedMotion} />

        <PerspectiveSelector active={perspective} onSelect={setPerspective} />

        <AnimatePresence mode="wait">
          <motion.div
            key={perspective}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration }}
            className="min-h-[220px]"
          >
            <PerspectiveContent
              perspective={perspective}
              earthTrait={earthTrait}
              starTrait={starTrait}
              earthPlacement={earthPlacement}
              starPlacement={starPlacement}
              sunTheme={sunTheme}
            />
          </motion.div>
        </AnimatePresence>

        {/* Closing ornament + return */}
        <div className="space-y-8 pt-6">
          <ClosingOrnament />
          <div className="text-center">
            <button
              onClick={onBack}
              className="font-heading text-[#826246] text-sm hover:text-[#4E392E] transition-colors tracking-wide"
            >
              &larr; Return to Observatory
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
