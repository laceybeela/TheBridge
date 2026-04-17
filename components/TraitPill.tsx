import type { Trait } from "@engine/index";

interface TraitPillProps {
  trait: Trait;
}

export default function TraitPill({ trait }: TraitPillProps) {
  const isEarth = trait.layer === "earth";

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-heading ${
        isEarth
          ? "bg-sand-400/10 text-sand-200 border border-sand-400/20"
          : "bg-plum-700/30 text-sand-300 border border-plum-700/40"
      }`}
    >
      <span className="text-xs uppercase tracking-wider text-sand-400 font-body font-medium">
        {isEarth ? "Earth" : "Star"}
      </span>
      <span className="font-light">{trait.label}</span>
    </div>
  );
}
