"use client";

import type { System } from "@bridge/shared-types";

interface SkyToggleProps {
  activeSystem: System;
  onToggle: (system: System) => void;
}

const LABELS: Record<System, string> = {
  tropical: "Earth Sky",
  sidereal: "Star Sky",
};

export default function SkyToggle({ activeSystem, onToggle }: SkyToggleProps) {
  return (
    <div className="flex justify-center gap-1 rounded-full bg-plum-800/70 border border-plum-700/30 p-1">
      {(["tropical", "sidereal"] as const).map((system) => (
        <button
          key={system}
          onClick={() => onToggle(system)}
          aria-pressed={activeSystem === system}
          className={`
            px-5 py-1.5 rounded-full text-sm font-heading tracking-wide transition-all duration-200
            ${activeSystem === system
              ? "bg-plum-700/70 text-sand-200 shadow-sm"
              : "text-sand-300/70 hover:text-sand-200"
            }
          `}
        >
          {LABELS[system]}
        </button>
      ))}
    </div>
  );
}
