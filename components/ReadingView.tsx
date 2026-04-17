import type { Reading } from "@engine/index";
import SectionCard from "./SectionCard";
import FadeIn from "./FadeIn";

interface ReadingViewProps {
  reading: Reading;
}

export default function ReadingView({ reading }: ReadingViewProps) {
  return (
    <div className="max-w-2xl mx-auto px-6 py-20 space-y-16">
      {/* Title — one line per body */}
      <FadeIn>
        <h1 className="font-heading text-4xl sm:text-5xl text-sand-200 font-light text-center leading-snug">
          {reading.title.map((line, i) => (
            <span key={i} className="block">
              {line}
            </span>
          ))}
        </h1>
      </FadeIn>

      {/* Introduction */}
      <FadeIn delay={0.1}>
        <div className="space-y-4">
          {reading.introduction.split("\n\n").map((p, i) => (
            <p
              key={i}
              className="font-body text-sand-300 leading-relaxed text-[15px] text-center"
            >
              {p}
            </p>
          ))}
        </div>
      </FadeIn>

      {/* Sections */}
      <div className="space-y-12">
        {reading.sections.map((section, i) => (
          <SectionCard key={section.heading} section={section} index={i} />
        ))}
      </div>

      {/* Closing */}
      <FadeIn delay={0.2}>
        <div className="border-t border-plum-700/30 pt-12 space-y-4">
          {reading.closing.split("\n\n").map((p, i) => (
            <p
              key={i}
              className="font-heading text-lg sm:text-xl text-sand-400 font-light text-center leading-relaxed"
            >
              {p}
            </p>
          ))}
        </div>
      </FadeIn>

      {/* Back link */}
      <FadeIn delay={0.3}>
        <div className="text-center pt-8">
          <a
            href="/"
            className="font-heading text-sand-400/60 text-sm hover:text-sand-300 transition-colors"
          >
            Cast another reading
          </a>
        </div>
      </FadeIn>
    </div>
  );
}
