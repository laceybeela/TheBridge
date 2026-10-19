"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useReading } from "@/lib/reading-context";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import ReadingView from "@/components/ReadingView";
import AuthNav from "@/components/AuthNav";
import CelestialObservatory from "@/components/observatory/CelestialObservatory";
import SunManuscript from "@/components/manuscript/SunManuscript";

type ViewMode = "observatory" | "manuscript" | "reading";

export default function ReadingPage() {
  const { reading, charts } = useReading();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const reducedMotion = useReducedMotion();
  const duration = reducedMotion ? 0 : 0.5;

  // Default to observatory when charts available, otherwise fall back to reading
  const [viewMode, setViewMode] = useState<ViewMode>("observatory");

  useEffect(() => {
    setMounted(true);
  }, []);

  // Wait for hydration from sessionStorage before redirecting
  useEffect(() => {
    if (mounted && !reading) {
      const timeout = setTimeout(() => {
        if (!reading) {
          router.replace("/");
        }
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [mounted, reading, router]);

  if (!mounted || !reading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-heading text-xl text-sand-400 font-light">
          Loading...
        </p>
      </div>
    );
  }

  // Extract themes from reading sections for manuscript
  const allThemes = reading.sections.flatMap((s) => s.themes);

  // Determine effective view mode: fall back to reading if no charts
  const effectiveMode = !charts && viewMode !== "reading" ? "reading" : viewMode;

  // Whether we're in the manuscript (parchment bg) or dark observatory
  const isManuscript = effectiveMode === "manuscript";

  return (
    <>
      {/* Auth nav — adjust contrast based on background */}
      <div className="fixed top-0 right-0 p-6 z-10">
        <AuthNav />
      </div>

      {/* View toggle (only when charts available and not in manuscript) */}
      {charts && effectiveMode !== "manuscript" && (
        <div className="fixed top-0 left-0 right-0 flex justify-center pt-6 z-10 pointer-events-none">
          <div className="pointer-events-auto flex gap-1 rounded-full bg-plum-800/80 backdrop-blur-sm border border-plum-700/30 p-1">
            <button
              onClick={() => setViewMode("observatory")}
              className={`
                px-4 py-1.5 rounded-full text-xs font-heading tracking-wide transition-all duration-200
                ${effectiveMode === "observatory"
                  ? "bg-plum-700/70 text-sand-200 shadow-sm"
                  : "text-sand-300/70 hover:text-sand-200"
                }
              `}
            >
              Observatory
            </button>
            <button
              onClick={() => setViewMode("reading")}
              className={`
                px-4 py-1.5 rounded-full text-xs font-heading tracking-wide transition-all duration-200
                ${effectiveMode === "reading"
                  ? "bg-plum-700/70 text-sand-200 shadow-sm"
                  : "text-sand-300/70 hover:text-sand-200"
                }
              `}
            >
              Full Reading
            </button>
          </div>
        </div>
      )}

      {/* View content */}
      <AnimatePresence mode="wait">
        {effectiveMode === "observatory" && charts && (
          <motion.div
            key="observatory"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration }}
          >
            <CelestialObservatory
              charts={charts}
              traits={reading.traits}
              themes={allThemes}
              onSunSelect={() => setViewMode("manuscript")}
            />
          </motion.div>
        )}

        {effectiveMode === "manuscript" && charts && (
          <motion.div
            key="manuscript"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.6 }}
          >
            <SunManuscript
              charts={charts}
              traits={reading.traits}
              themes={allThemes}
              onBack={() => setViewMode("observatory")}
            />
          </motion.div>
        )}

        {effectiveMode === "reading" && (
          <motion.div
            key="reading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration }}
          >
            <ReadingView reading={reading} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
