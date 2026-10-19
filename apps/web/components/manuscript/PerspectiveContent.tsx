"use client";

import type { Trait, Placement, BridgeTheme } from "@bridge/shared-types";
import { SIGN_NAMES } from "@/components/observatory/geometry";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import BridgeIllustration from "./BridgeIllustration";
import type { Perspective } from "./PerspectiveSelector";

interface TraitPerspectiveProps {
  perspective: "tropical" | "sidereal";
  trait: Trait;
  placement: Placement;
}

function TraitPerspective({ perspective, trait, placement }: TraitPerspectiveProps) {
  const signName = SIGN_NAMES[placement.sign];
  const label = perspective === "tropical" ? "Earth Sky" : "Star Sky";

  return (
    <div className="space-y-6 text-center max-w-lg mx-auto">
      <p className="font-heading text-xs tracking-[0.25em] uppercase text-[#A89478]/60">
        {label}
      </p>
      <h3 className="font-heading text-3xl sm:text-4xl text-[#4A3B2E] font-light">
        {trait.label}
      </h3>
      <p className="font-heading text-sm text-[#7A6B5A] tracking-wide">
        Sun in {signName} at {Math.round(placement.degree)}°
      </p>

      {/* Thin decorative rule */}
      <div className="mx-auto w-16 border-t border-[#A89478]/20" />

      <p className="font-body text-[15px] text-[#5C4A3A] leading-[1.9]">
        {trait.description}
      </p>
      {trait.keywords.length > 0 && (
        <p className="font-body text-sm text-[#A89478]/80 italic tracking-wide">
          {trait.keywords.join(" \u00B7 ")}
        </p>
      )}
    </div>
  );
}

interface BridgePerspectiveProps {
  theme: BridgeTheme;
  reducedMotion: boolean;
}

function BridgePerspective({ theme, reducedMotion }: BridgePerspectiveProps) {
  const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
    divergence: { bg: "rgba(180, 100, 100, 0.08)", text: "#8B5E5E", border: "rgba(180, 100, 100, 0.2)" },
    alignment: { bg: "rgba(100, 140, 100, 0.08)", text: "#5E7A5E", border: "rgba(100, 140, 100, 0.2)" },
    amplification: { bg: "rgba(120, 100, 150, 0.08)", text: "#6E5E8B", border: "rgba(120, 100, 150, 0.2)" },
  };

  const cc = categoryColors[theme.category] ?? categoryColors.divergence;

  return (
    <div className="space-y-8 text-center max-w-lg mx-auto">
      <div className="space-y-4">
        <h3 className="font-heading text-3xl sm:text-4xl text-[#4A3B2E] font-light">
          {theme.name}
        </h3>
        <span
          className="inline-block px-3 py-0.5 rounded-full text-xs font-heading tracking-widest uppercase"
          style={{ background: cc.bg, color: cc.text, border: `1px solid ${cc.border}` }}
        >
          {theme.category}
        </span>
      </div>

      <BridgeIllustration theme={theme} reducedMotion={reducedMotion} />

      <div className="mx-auto w-16 border-t border-[#A89478]/20" />

      <p className="font-body text-[15px] text-[#5C4A3A] leading-[1.9]">
        {theme.description}
      </p>

      {/* Earth / Star trait pair */}
      <div className="border-t border-[#A89478]/15 pt-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div className="space-y-2">
          <p className="font-heading text-xs tracking-[0.25em] uppercase text-[#A89478]/60">
            Earth Trait
          </p>
          <p className="font-heading text-xl text-[#4A3B2E] font-light">
            {theme.earth.label}
          </p>
          <p className="font-body text-sm text-[#7A6B5A]">
            {theme.earth.source.sign.charAt(0).toUpperCase() + theme.earth.source.sign.slice(1)}
          </p>
        </div>
        <div className="space-y-2">
          <p className="font-heading text-xs tracking-[0.25em] uppercase text-[#A89478]/60">
            Star Trait
          </p>
          <p className="font-heading text-xl text-[#4A3B2E] font-light">
            {theme.star.label}
          </p>
          <p className="font-body text-sm text-[#7A6B5A]">
            {theme.star.source.sign.charAt(0).toUpperCase() + theme.star.source.sign.slice(1)}
          </p>
        </div>
      </div>
    </div>
  );
}

interface PerspectiveContentProps {
  perspective: Perspective;
  earthTrait: Trait | undefined;
  starTrait: Trait | undefined;
  earthPlacement: Placement | undefined;
  starPlacement: Placement | undefined;
  sunTheme: BridgeTheme | undefined;
}

export default function PerspectiveContent({
  perspective,
  earthTrait,
  starTrait,
  earthPlacement,
  starPlacement,
  sunTheme,
}: PerspectiveContentProps) {
  const reducedMotion = useReducedMotion();

  if (perspective === "tropical" && earthTrait && earthPlacement) {
    return <TraitPerspective perspective="tropical" trait={earthTrait} placement={earthPlacement} />;
  }

  if (perspective === "sidereal" && starTrait && starPlacement) {
    return <TraitPerspective perspective="sidereal" trait={starTrait} placement={starPlacement} />;
  }

  if (perspective === "bridge" && sunTheme) {
    return <BridgePerspective theme={sunTheme} reducedMotion={reducedMotion} />;
  }

  return (
    <p className="font-body text-sm text-[#A89478]/60 text-center">
      No data available for this perspective.
    </p>
  );
}
