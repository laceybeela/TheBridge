"use client";

import {
  describeArc,
  polarToCartesian,
  SIGN_PATHS,
  CONSTELLATION_STARS,
  type WheelSegment,
} from "./geometry";

interface ZodiacSegmentProps {
  segment: WheelSegment;
  index: number;
  cx: number;
  cy: number;
  innerRadius: number;
  outerRadius: number;
  labelRadius: number;
  isActive: boolean;
}

export default function ZodiacSegment({
  segment,
  index,
  cx,
  cy,
  innerRadius,
  outerRadius,
  labelRadius,
  isActive,
}: ZodiacSegmentProps) {
  const endAngle = segment.startAngle + segment.width;
  const midAngle = segment.startAngle + segment.width / 2;
  const labelPos = polarToCartesian(cx, cy, labelRadius, midAngle);

  const path = describeArc(cx, cy, innerRadius, outerRadius, segment.startAngle, endAngle);

  // Deeper, richer fills with more contrast
  const fill = isActive
    ? "rgba(74, 45, 92, 0.45)"
    : index % 2 === 0
      ? "rgba(38, 22, 46, 0.7)"
      : "rgba(30, 17, 38, 0.5)";

  // Glyph scaling — shrink for narrow segments
  const glyphScale = segment.width < 14 ? 0.5 : segment.width < 20 ? 0.65 : 0.8;

  // Constellation stars within this segment
  const stars = CONSTELLATION_STARS[segment.sign] ?? [];

  return (
    <g>
      {/* Segment arc */}
      <path
        d={path}
        fill={fill}
        stroke="rgba(74, 45, 92, 0.4)"
        strokeWidth={0.5}
      />

      {/* Constellation star dots and connecting lines */}
      {stars.length > 1 && (
        <polyline
          points={stars
            .map((s) => {
              const a = segment.startAngle + s.angleOffset * segment.width;
              const r = innerRadius + s.radialPos * (outerRadius - innerRadius);
              const p = polarToCartesian(cx, cy, r, a);
              return `${p.x},${p.y}`;
            })
            .join(" ")}
          fill="none"
          stroke="rgba(196, 179, 148, 0.08)"
          strokeWidth={0.5}
        />
      )}
      {stars.map((star, i) => {
        const a = segment.startAngle + star.angleOffset * segment.width;
        const r = innerRadius + star.radialPos * (outerRadius - innerRadius);
        const p = polarToCartesian(cx, cy, r, a);
        return (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={star.size * 0.6}
            fill="rgba(196, 179, 148, 0.15)"
            opacity={star.brightness * 0.5}
          />
        );
      })}

      {/* Sign glyph as SVG path (engraved line-art) */}
      <g
        transform={`translate(${labelPos.x}, ${labelPos.y}) scale(${glyphScale}) rotate(0)`}
      >
        <path
          d={SIGN_PATHS[segment.sign]}
          fill="none"
          stroke={isActive ? "rgba(212, 167, 106, 0.7)" : "rgba(196, 179, 148, 0.5)"}
          strokeWidth={1.2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </g>
  );
}
