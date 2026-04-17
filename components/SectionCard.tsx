import type { ReadingSection } from "@engine/index";
import TraitPill from "./TraitPill";
import ThemeBadge from "./ThemeBadge";
import FadeIn from "./FadeIn";

interface SectionCardProps {
  section: ReadingSection;
  index: number;
}

export default function SectionCard({ section, index }: SectionCardProps) {
  return (
    <FadeIn delay={index * 0.15}>
      <article className="rounded-2xl bg-plum-800/60 border border-plum-700/30 p-8 sm:p-10 backdrop-blur-sm">
        {/* Heading */}
        <h3 className="font-heading text-2xl sm:text-3xl text-sand-200 font-light mb-6">
          {section.heading}
        </h3>

        {/* Theme badges and trait pills (only when themes are present) */}
        {section.themes.map((theme) => (
          <div key={theme.id + theme.body} className="mb-6">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <ThemeBadge category={theme.category} name={theme.name} />
              <TraitPill trait={theme.earth} />
              <TraitPill trait={theme.star} />
            </div>
          </div>
        ))}

        {/* Body prose */}
        <div className="space-y-4">
          {section.body.split("\n\n").map((paragraph, i) => (
            <p
              key={i}
              className="font-body text-sand-300 leading-relaxed text-[15px]"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </article>
    </FadeIn>
  );
}
