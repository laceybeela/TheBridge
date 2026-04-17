import type { ThemeCategory } from "@engine/index";

interface ThemeBadgeProps {
  category: ThemeCategory;
  name: string;
}

const categoryConfig: Record<ThemeCategory, { classes: string }> = {
  divergence: {
    classes: "bg-rose-500/10 text-rose-300 border-rose-500/20",
  },
  alignment: {
    classes: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
  },
  amplification: {
    classes: "bg-violet-500/10 text-violet-300 border-violet-500/20",
  },
};

export default function ThemeBadge({ category, name }: ThemeBadgeProps) {
  const config = categoryConfig[category];

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-body font-medium tracking-wide ${config.classes}`}
    >
      {name}
    </span>
  );
}
