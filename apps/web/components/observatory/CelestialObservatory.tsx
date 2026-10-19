"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { BirthChart, System, TraitProfile, BridgeTheme } from "@bridge/shared-types";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import ZodiacWheel from "./ZodiacWheel";
import SkyToggle from "./SkyToggle";
import { SIGN_NAMES } from "./geometry";

interface CelestialObservatoryProps {
  charts: BirthChart;
  traits: TraitProfile;
  themes: BridgeTheme[];
  onSunSelect: () => void;
}

export default function CelestialObservatory({
  charts,
  traits,
  themes,
  onSunSelect,
}: CelestialObservatoryProps) {
  const [activeSystem, setActiveSystem] = useState<System>("tropical");
  const reducedMotion = useReducedMotion();

  const chart = activeSystem === "tropical" ? charts.tropical : charts.sidereal;
  const duration = reducedMotion ? 0 : 0.5;

  // Build placement summary from active chart
  const summary = chart.placements
    .map((p) => {
      const bodyLabel = p.body === "rising"
        ? "Rising"
        : p.body.charAt(0).toUpperCase() + p.body.slice(1);
      return `${bodyLabel} in ${SIGN_NAMES[p.sign]}`;
    })
    .join(" \u00B7 ");

  return (
    <div className="flex flex-col items-center gap-6 sm:gap-10 px-4 py-16 sm:py-20 min-h-screen">
      {/* Title */}
      <div className="text-center space-y-3">
        <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl text-sand-200 font-light tracking-wide">
          Your Two Skies
        </h2>
        <p className="font-body text-sm text-sand-300/70 max-w-xs mx-auto leading-relaxed">
          The sky as seen from Earth, and as it truly is among the stars
        </p>
      </div>

      {/* Toggle */}
      <SkyToggle activeSystem={activeSystem} onToggle={setActiveSystem} />

      {/* Wheel with crossfade */}
      <div className="relative py-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSystem}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration, ease: "easeOut" }}
          >
            <ZodiacWheel
              chart={chart}
              system={activeSystem}
              onSunSelect={onSunSelect}
              reducedMotion={reducedMotion}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Placement summary */}
      <p className="font-heading text-sm sm:text-base text-sand-300/80 text-center tracking-wider font-light">
        {summary}
      </p>

      {/* Sun interaction affordance */}
      <p className="font-body text-xs text-sand-400/50 text-center tracking-wide">
        Tap the Sun to open its chapter
      </p>
    </div>
  );
}
