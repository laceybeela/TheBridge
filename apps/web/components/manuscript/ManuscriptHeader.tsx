"use client";

import SunIllustration from "./SunIllustration";

interface ManuscriptHeaderProps {
  onBack: () => void;
  reducedMotion: boolean;
}

/**
 * Ornamental flourish — horizontal rule with a diamond accent.
 *
 * Palette:
 *   Fine detail:       #B99A70
 *   Primary engraving: #826246
 */
function OrnamentalRule() {
  return (
    <svg viewBox="0 0 200 12" className="w-48 sm:w-56 h-3 mx-auto" aria-hidden="true">
      {/* Left line */}
      <line x1={10} y1={6} x2={90} y2={6} stroke="#B99A70" strokeWidth={0.5} opacity={0.6} />
      {/* Center diamond */}
      <polygon points="100,2 104,6 100,10 96,6" fill="none" stroke="#826246" strokeWidth={0.5} opacity={0.7} />
      <polygon points="100,4 102,6 100,8 98,6" fill="#B99A70" opacity={0.4} />
      {/* Right line */}
      <line x1={110} y1={6} x2={190} y2={6} stroke="#B99A70" strokeWidth={0.5} opacity={0.6} />
    </svg>
  );
}

export default function ManuscriptHeader({ onBack, reducedMotion }: ManuscriptHeaderProps) {
  return (
    <div className="space-y-6 text-center">
      <div className="text-left">
        <button
          onClick={onBack}
          className="font-body text-sm text-[#826246] hover:text-[#4E392E] transition-colors"
        >
          &larr; Return to Observatory
        </button>
      </div>

      <OrnamentalRule />

      <p className="font-heading text-xs tracking-[0.3em] uppercase text-[#826246]/80">
        Chapter One
      </p>

      <h2 className="font-heading text-4xl sm:text-5xl text-[#4E392E] font-light tracking-wide">
        The Sun
      </h2>

      <OrnamentalRule />

      <SunIllustration reducedMotion={reducedMotion} />
    </div>
  );
}
