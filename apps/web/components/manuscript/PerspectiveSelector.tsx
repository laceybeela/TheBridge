"use client";

export type Perspective = "tropical" | "bridge" | "sidereal";

interface PerspectiveSelectorProps {
  active: Perspective;
  onSelect: (perspective: Perspective) => void;
}

const LABELS: Record<Perspective, string> = {
  tropical: "Tropical",
  bridge: "The Bridge",
  sidereal: "True Sidereal",
};

export default function PerspectiveSelector({
  active,
  onSelect,
}: PerspectiveSelectorProps) {
  return (
    <div className="flex justify-center gap-8">
      {(["tropical", "bridge", "sidereal"] as const).map((p) => (
        <button
          key={p}
          onClick={() => onSelect(p)}
          className={`
            font-heading text-sm tracking-wide pb-1.5 transition-all duration-200
            ${active === p
              ? "text-[#5C4A3A] border-b border-[#A89478]/50"
              : "text-[#A89478]/70 hover:text-[#5C4A3A]/80"
            }
          `}
        >
          {LABELS[p]}
        </button>
      ))}
    </div>
  );
}
