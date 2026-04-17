"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const phases = [
  "Casting your charts...",
  "Reading the bridge...",
  "Something is taking shape...",
];

const PHASE_DURATION = 1500; // ms per phase

export default function ReadingLoader() {
  const [phaseIndex, setPhaseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhaseIndex((prev) => {
        if (prev < phases.length - 1) return prev + 1;
        return prev;
      });
    }, PHASE_DURATION);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6">
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          background: [
            "radial-gradient(ellipse at 50% 50%, rgba(74,45,92,0.15) 0%, transparent 70%)",
            "radial-gradient(ellipse at 40% 60%, rgba(74,45,92,0.25) 0%, transparent 70%)",
            "radial-gradient(ellipse at 60% 40%, rgba(74,45,92,0.15) 0%, transparent 70%)",
          ],
        }}
        transition={{ duration: 4.5, ease: "easeInOut", repeat: Infinity }}
      />

      <div className="relative h-16 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={phaseIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="font-heading text-2xl sm:text-3xl text-sand-300 font-light text-center"
          >
            {phases[phaseIndex]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Subtle pulsing dots */}
      <div className="flex gap-2 mt-8">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-sand-400/40"
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  );
}
