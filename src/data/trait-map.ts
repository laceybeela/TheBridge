import type { Body, Sign, System } from "../types/placement";
import type { DimensionName } from "../types/trait";

/**
 * Raw trait data for lookup.
 * Each entry maps a (system, body, sign) → trait content.
 *
 * This is the primary data layer — editable, auditable, no logic.
 *
 * Tropical (Earth Self) = how life is experienced, the texture of lived identity
 * Sidereal (Star Self) = the archetypal force, what moves through a person
 */
export interface TraitEntry {
  label: string;
  description: string;
  keywords: string[];
  dimensions: Partial<Record<DimensionName, number>>;
}

type TraitKey = `${System}-${Body}-${Sign}`;

export const TRAIT_MAP: Partial<Record<TraitKey, TraitEntry>> = {

  // ──────────────────────────────────────────────────────────────
  // TROPICAL — THE EARTH SELF
  // How life is experienced, personality, conditioning
  // ──────────────────────────────────────────────────────────────

  // ── Tropical Sun ──────────────────────────────────────────────
  // Core identity, vitality, sense of self
  // Sun traits nudge sovereignty/expression up

  "tropical-sun-aries": {
    label: "The Spark",
    description:
      "There is an urgency to begin, to move first, to know yourself through what you dare.",
    keywords: ["impulse", "courage", "beginning"],
    dimensions: { initiation: 0.9, sovereignty: 0.5, movement: 0.4 },
  },
  "tropical-sun-taurus": {
    label: "The Root",
    description:
      "Something in you wants to stay — to build slowly, to trust what can be touched.",
    keywords: ["steadiness", "presence", "body"],
    dimensions: { stability: 0.9, embodiment: 0.6, sovereignty: 0.3 },
  },
  "tropical-sun-gemini": {
    label: "The Twin",
    description:
      "You learn yourself through conversation, through doubling, through the space between two thoughts.",
    keywords: ["curiosity", "language", "duality"],
    dimensions: { exchange: 0.9, movement: 0.5, expression: 0.3 },
  },
  "tropical-sun-cancer": {
    label: "The Keeper",
    description:
      "A pull toward enclosure — tending what's soft, remembering what others forget.",
    keywords: ["nurture", "memory", "enclosure"],
    dimensions: { nurture: 0.9, containment: 0.6, receptivity: 0.3 },
  },
  "tropical-sun-leo": {
    label: "The Flame",
    description:
      "You become yourself by being seen — not for approval, but because expression is how you know you're real.",
    keywords: ["presence", "warmth", "creation"],
    dimensions: { expression: 0.9, sovereignty: 0.7, embodiment: 0.3 },
  },
  "tropical-sun-virgo": {
    label: "The Mender",
    description:
      "You find yourself in the details — in what can be refined, in what needs tending.",
    keywords: ["care", "precision", "service"],
    dimensions: { refinement: 0.9, devotion: 0.6, embodiment: 0.3 },
  },
  "tropical-sun-libra": {
    label: "The Witness",
    description:
      "You know yourself through the other — through beauty, through balance, through what is exchanged.",
    keywords: ["relation", "beauty", "measure"],
    dimensions: { relation: 0.9, receptivity: 0.5, expression: 0.3 },
  },
  "tropical-sun-scorpio": {
    label: "The Depth",
    description:
      "Something in you refuses the surface. You find yourself where things are real, even when it costs.",
    keywords: ["intensity", "truth", "transformation"],
    dimensions: { depth: 0.9, containment: 0.6, transformation: 0.4 },
  },
  "tropical-sun-sagittarius": {
    label: "The Arrow",
    description:
      "You become yourself by reaching — toward meaning, toward horizon, toward the question behind the question.",
    keywords: ["seeking", "faith", "expansion"],
    dimensions: { seeking: 0.9, movement: 0.5, independence: 0.4 },
  },
  "tropical-sun-capricorn": {
    label: "The Architect",
    description:
      "You build yourself slowly, stone by stone. Identity is something earned, not given.",
    keywords: ["structure", "discipline", "time"],
    dimensions: { structure: 0.9, sovereignty: 0.6, containment: 0.3 },
  },
  "tropical-sun-aquarius": {
    label: "The Frequency",
    description:
      "You know yourself through the pattern you see that others don't. Something in you insists on a different order.",
    keywords: ["vision", "detachment", "systems"],
    dimensions: { vision: 0.9, independence: 0.6, exchange: 0.3 },
  },
  "tropical-sun-pisces": {
    label: "The Current",
    description:
      "You are less a fixed point than a flowing — identity dissolves and reforms, shaped by what moves through you.",
    keywords: ["permeability", "imagination", "surrender"],
    dimensions: { dissolution: 0.9, receptivity: 0.6, transformation: 0.3 },
  },

  // ── Tropical Moon ─────────────────────────────────────────────
  // Emotional inner world, needs, comfort
  // Moon traits nudge receptivity/nurture/containment up

  "tropical-moon-aries": {
    label: "The Flare",
    description:
      "Your emotions arrive fast and honest. You need to act on what you feel, or the feeling turns inward.",
    keywords: ["urgency", "directness", "release"],
    dimensions: { initiation: 0.8, movement: 0.5, independence: 0.4 },
  },
  "tropical-moon-taurus": {
    label: "The Soil",
    description:
      "You need what is steady. Comfort lives in the sensory — in what can be held, tasted, returned to.",
    keywords: ["stability", "comfort", "rhythm"],
    dimensions: { stability: 0.9, embodiment: 0.6, nurture: 0.4 },
  },
  "tropical-moon-gemini": {
    label: "The Drift",
    description:
      "Your inner world is restless and curious. You process by naming, by talking, by splitting feeling into language.",
    keywords: ["articulation", "movement", "lightness"],
    dimensions: { exchange: 0.8, movement: 0.5, receptivity: 0.3 },
  },
  "tropical-moon-cancer": {
    label: "The Shell",
    description:
      "Your emotional life is tidal — deep, retentive, protective. You feel everything and keep most of it.",
    keywords: ["safety", "memory", "tenderness"],
    dimensions: { nurture: 1.0, containment: 0.7, receptivity: 0.5 },
  },
  "tropical-moon-leo": {
    label: "The Hearth",
    description:
      "You need to be met with warmth. Your emotions are generous and want to be acknowledged, not performed but seen.",
    keywords: ["recognition", "generosity", "loyalty"],
    dimensions: { expression: 0.8, sovereignty: 0.5, devotion: 0.4 },
  },
  "tropical-moon-virgo": {
    label: "The Sieve",
    description:
      "You process feeling through usefulness — through fixing, sorting, making something better. Rest does not come easily.",
    keywords: ["analysis", "worry", "devotion"],
    dimensions: { refinement: 0.8, devotion: 0.7, containment: 0.3 },
  },
  "tropical-moon-libra": {
    label: "The Scale",
    description:
      "Your inner peace depends on harmony around you. Conflict lands in your body before your mind.",
    keywords: ["equilibrium", "grace", "avoidance"],
    dimensions: { relation: 0.8, receptivity: 0.6, refinement: 0.3 },
  },
  "tropical-moon-scorpio": {
    label: "The Well",
    description:
      "Your emotional life runs deep and does not forget. Trust is not given — it is tested and earned.",
    keywords: ["intensity", "privacy", "loyalty"],
    dimensions: { depth: 0.9, containment: 0.7, transformation: 0.4 },
  },
  "tropical-moon-sagittarius": {
    label: "The Wander",
    description:
      "You need room to feel. Emotional freedom matters more than emotional security.",
    keywords: ["expansion", "optimism", "restlessness"],
    dimensions: { seeking: 0.8, movement: 0.5, independence: 0.5 },
  },
  "tropical-moon-capricorn": {
    label: "The Vault",
    description:
      "Feelings are kept close, held in structure. You care deeply but show it through what you build, not what you say.",
    keywords: ["restraint", "responsibility", "endurance"],
    dimensions: { structure: 0.8, containment: 0.6, sovereignty: 0.4 },
  },
  "tropical-moon-aquarius": {
    label: "The Signal",
    description:
      "Your emotional life lives slightly outside the body. You observe your own feelings as much as you feel them.",
    keywords: ["distance", "clarity", "independence"],
    dimensions: { vision: 0.8, independence: 0.6, exchange: 0.3 },
  },
  "tropical-moon-pisces": {
    label: "The Soak",
    description:
      "You absorb everything. Your emotional boundaries are thin, and your inner world is vast, populated, oceanic.",
    keywords: ["empathy", "dissolving", "imagination"],
    dimensions: { dissolution: 0.9, receptivity: 0.7, nurture: 0.3 },
  },

  // ── Tropical Rising ───────────────────────────────────────────
  // How you meet the world, first approach
  // Rising traits nudge embodiment/movement up

  "tropical-rising-aries": {
    label: "The Edge",
    description:
      "You enter rooms like a question. There is something forward-moving in your presence, even at rest.",
    keywords: ["initiative", "sharpness", "directness"],
    dimensions: { initiation: 0.8, movement: 0.6, embodiment: 0.4 },
  },
  "tropical-rising-taurus": {
    label: "The Ground",
    description:
      "You arrive slowly, steadily. People feel your presence as something solid, warm, unhurried.",
    keywords: ["calm", "gravity", "ease"],
    dimensions: { stability: 0.9, embodiment: 0.7, devotion: 0.3 },
  },
  "tropical-rising-gemini": {
    label: "The Glint",
    description:
      "You meet the world with quickness — with questions, with humor, with an openness that doesn't stay still.",
    keywords: ["adaptability", "charm", "curiosity"],
    dimensions: { exchange: 0.8, movement: 0.6, relation: 0.3 },
  },
  "tropical-rising-cancer": {
    label: "The Threshold",
    description:
      "You approach the world carefully, reading the room before entering. There is a softness in how you arrive.",
    keywords: ["sensitivity", "protection", "warmth"],
    dimensions: { nurture: 0.8, containment: 0.5, embodiment: 0.4 },
  },
  "tropical-rising-leo": {
    label: "The Entrance",
    description:
      "You are noticed. Not because you demand it, but because something in your presence radiates.",
    keywords: ["magnetism", "warmth", "visibility"],
    dimensions: { expression: 0.9, sovereignty: 0.5, embodiment: 0.4 },
  },
  "tropical-rising-virgo": {
    label: "The Lens",
    description:
      "You meet the world by reading it closely. There is a precision in how you show up, a quiet attention.",
    keywords: ["observation", "modesty", "competence"],
    dimensions: { refinement: 0.8, embodiment: 0.5, devotion: 0.4 },
  },
  "tropical-rising-libra": {
    label: "The Grace",
    description:
      "You arrive in relation. The world sees someone composed, attuned, interested in what's beautiful and fair.",
    keywords: ["diplomacy", "poise", "connection"],
    dimensions: { relation: 0.9, receptivity: 0.4, embodiment: 0.3 },
  },
  "tropical-rising-scorpio": {
    label: "The Gate",
    description:
      "There is something guarded in your approach — not cold, but selective. People sense depth before you speak.",
    keywords: ["intensity", "privacy", "magnetism"],
    dimensions: { depth: 0.8, containment: 0.6, embodiment: 0.4 },
  },
  "tropical-rising-sagittarius": {
    label: "The Reach",
    description:
      "You meet the world openly, with an expansive quality. Something about you suggests movement, humor, reach.",
    keywords: ["openness", "enthusiasm", "freedom"],
    dimensions: { seeking: 0.8, movement: 0.6, embodiment: 0.3 },
  },
  "tropical-rising-capricorn": {
    label: "The Frame",
    description:
      "You arrive with composure. The world reads you as serious, capable, someone with a quiet authority.",
    keywords: ["reserve", "competence", "structure"],
    dimensions: { structure: 0.8, sovereignty: 0.5, embodiment: 0.4 },
  },
  "tropical-rising-aquarius": {
    label: "The Angle",
    description:
      "You meet the world slightly sideways. There is something unusual in your approach, a frequency others notice.",
    keywords: ["originality", "detachment", "clarity"],
    dimensions: { vision: 0.8, independence: 0.5, movement: 0.4 },
  },
  "tropical-rising-pisces": {
    label: "The Mist",
    description:
      "You arrive softly, diffusely. People project onto you easily — your presence is porous, gentle, hard to pin.",
    keywords: ["fluidity", "gentleness", "mystery"],
    dimensions: { dissolution: 0.8, receptivity: 0.6, embodiment: 0.3 },
  },

  // ──────────────────────────────────────────────────────────────
  // SIDEREAL — THE STAR SELF
  // Archetypal force, deeper trajectory, what moves through you
  // Sidereal traits weight primary dimension slightly higher
  // ──────────────────────────────────────────────────────────────

  // ── Sidereal Sun ──────────────────────────────────────────────
  // Core archetypal force, what is moving through the person

  "sidereal-sun-aries": {
    label: "The Ignition",
    description:
      "A force of beginning moves through you — not personal ambition, but something that insists on starting fires.",
    keywords: ["origin", "impulse", "initiation"],
    dimensions: { initiation: 1.0, sovereignty: 0.5, movement: 0.4 },
  },
  "sidereal-sun-taurus": {
    label: "The Anchor",
    description:
      "What moves through you is ancient, slow, and rooted. A force of preservation that resists what is not earned.",
    keywords: ["endurance", "form", "gravity"],
    dimensions: { stability: 1.0, embodiment: 0.6, devotion: 0.3 },
  },
  "sidereal-sun-gemini": {
    label: "The Messenger",
    description:
      "Something restless moves through — a need to name, to bridge, to carry between worlds.",
    keywords: ["language", "duality", "motion"],
    dimensions: { exchange: 1.0, movement: 0.5, relation: 0.3 },
  },
  "sidereal-sun-cancer": {
    label: "The Tide",
    description:
      "A lunar force moves through you — pulling toward origin, toward belonging, toward what has been lost.",
    keywords: ["return", "source", "enclosure"],
    dimensions: { nurture: 1.0, containment: 0.6, receptivity: 0.4 },
  },
  "sidereal-sun-leo": {
    label: "The Radiance",
    description:
      "A creative force insists on being expressed through you — not ego, but something that must shine or it dims.",
    keywords: ["creation", "heart", "sovereignty"],
    dimensions: { expression: 1.0, sovereignty: 0.7, embodiment: 0.3 },
  },
  "sidereal-sun-virgo": {
    label: "The Instrument",
    description:
      "A refining force works through you — something that wants to serve, to purify, to make whole.",
    keywords: ["precision", "craft", "humility"],
    dimensions: { refinement: 1.0, devotion: 0.6, embodiment: 0.3 },
  },
  "sidereal-sun-libra": {
    label: "The Measure",
    description:
      "A force of balance moves through you — weighing, mirroring, seeking the point of equilibrium.",
    keywords: ["justice", "symmetry", "relation"],
    dimensions: { relation: 1.0, receptivity: 0.5, refinement: 0.3 },
  },
  "sidereal-sun-scorpio": {
    label: "The Descent",
    description:
      "A force of depth moves through you — pulling below surfaces, insisting on what is real.",
    keywords: ["penetration", "power", "renewal"],
    dimensions: { depth: 1.0, containment: 0.6, transformation: 0.5 },
  },
  "sidereal-sun-sagittarius": {
    label: "The Trajectory",
    description:
      "A force of meaning arcs through you — always aimed beyond the immediate, toward the larger pattern.",
    keywords: ["aim", "philosophy", "fire"],
    dimensions: { seeking: 1.0, movement: 0.5, independence: 0.4 },
  },
  "sidereal-sun-capricorn": {
    label: "The Mountain",
    description:
      "A force of time and structure moves through you — something that builds, endures, and outlasts.",
    keywords: ["mastery", "patience", "legacy"],
    dimensions: { structure: 1.0, sovereignty: 0.6, containment: 0.3 },
  },
  "sidereal-sun-aquarius": {
    label: "The Circuit",
    description:
      "A force of pattern recognition moves through you — something that sees the whole system, the future shape.",
    keywords: ["innovation", "detachment", "vision"],
    dimensions: { vision: 1.0, independence: 0.6, exchange: 0.3 },
  },
  "sidereal-sun-pisces": {
    label: "The Dissolve",
    description:
      "A force of return moves through you — back toward unity, toward the oceanic, toward what is before form.",
    keywords: ["transcendence", "surrender", "source"],
    dimensions: { dissolution: 1.0, receptivity: 0.6, transformation: 0.4 },
  },

  // ── Sidereal Moon ─────────────────────────────────────────────
  // Archetypal emotional undercurrent

  "sidereal-moon-aries": {
    label: "The Impulse",
    description:
      "Beneath your emotional surface, something insists on immediacy — a deeper need to feel through action.",
    keywords: ["instinct", "rawness", "beginning"],
    dimensions: { initiation: 0.9, movement: 0.5, independence: 0.4 },
  },
  "sidereal-moon-taurus": {
    label: "The Bedrock",
    description:
      "Beneath everything, a deep need for ground. Your emotional archetype holds, stays, refuses to let go.",
    keywords: ["permanence", "sensuality", "roots"],
    dimensions: { stability: 1.0, embodiment: 0.6, containment: 0.4 },
  },
  "sidereal-moon-gemini": {
    label: "The Weave",
    description:
      "Beneath your feeling life, a deeper pattern of doubling — the archetype that holds contradiction as a gift.",
    keywords: ["multiplicity", "wit", "air"],
    dimensions: { exchange: 0.9, movement: 0.5, receptivity: 0.3 },
  },
  "sidereal-moon-cancer": {
    label: "The Womb",
    description:
      "The deepest current in your emotional life is origin itself — the pull toward source, toward being held.",
    keywords: ["belonging", "origin", "water"],
    dimensions: { nurture: 1.0, containment: 0.7, receptivity: 0.6 },
  },
  "sidereal-moon-leo": {
    label: "The Pulse",
    description:
      "Beneath your emotions, a rhythm of generosity and visibility — something that needs to give warmth to be whole.",
    keywords: ["heart", "pride", "radiance"],
    dimensions: { expression: 0.9, sovereignty: 0.5, devotion: 0.4 },
  },
  "sidereal-moon-virgo": {
    label: "The Thread",
    description:
      "The deeper emotional pattern is one of devotion through detail — love expressed as attention, as usefulness.",
    keywords: ["service", "subtlety", "care"],
    dimensions: { refinement: 0.9, devotion: 0.7, receptivity: 0.3 },
  },
  "sidereal-moon-libra": {
    label: "The Reflection",
    description:
      "The deeper emotional archetype is relation — you feel through the other, and the other feels through you.",
    keywords: ["reciprocity", "harmony", "beauty"],
    dimensions: { relation: 0.9, receptivity: 0.6, refinement: 0.3 },
  },
  "sidereal-moon-scorpio": {
    label: "The Undertow",
    description:
      "Beneath your emotional surface, something vast and uncompromising moves — the archetype of total feeling.",
    keywords: ["depth", "transformation", "power"],
    dimensions: { depth: 1.0, containment: 0.7, transformation: 0.5 },
  },
  "sidereal-moon-sagittarius": {
    label: "The Blaze",
    description:
      "Beneath the feeling life, an emotional archetype that runs toward meaning, faith, and open sky.",
    keywords: ["freedom", "belief", "expansion"],
    dimensions: { seeking: 0.9, movement: 0.5, independence: 0.5 },
  },
  "sidereal-moon-capricorn": {
    label: "The Stone",
    description:
      "The deeper emotional pattern is one of endurance — feeling held inside structure, expressed through time.",
    keywords: ["austerity", "commitment", "weight"],
    dimensions: { structure: 0.9, containment: 0.6, sovereignty: 0.4 },
  },
  "sidereal-moon-aquarius": {
    label: "The Wave",
    description:
      "Beneath your emotions, an archetype that runs collective — feeling for the system, not just the self.",
    keywords: ["detachment", "future", "frequency"],
    dimensions: { vision: 0.9, independence: 0.6, exchange: 0.3 },
  },
  "sidereal-moon-pisces": {
    label: "The Ocean",
    description:
      "The deepest emotional current is boundless — an archetype of total permeability, total return.",
    keywords: ["dissolution", "compassion", "dream"],
    dimensions: { dissolution: 1.0, receptivity: 0.7, nurture: 0.3 },
  },

  // ── Sidereal Rising ───────────────────────────────────────────
  // Archetypal approach, the deeper "how you arrive"

  "sidereal-rising-aries": {
    label: "The Strike",
    description:
      "The deeper pattern of your approach is initiatory — you arrive as a force that parts the room.",
    keywords: ["force", "beginning", "sharpness"],
    dimensions: { initiation: 0.9, movement: 0.6, embodiment: 0.4 },
  },
  "sidereal-rising-taurus": {
    label: "The Stillness",
    description:
      "The deeper pattern of your approach is presence — you arrive as something immovable, grounded in form.",
    keywords: ["gravity", "permanence", "earth"],
    dimensions: { stability: 1.0, embodiment: 0.7, devotion: 0.3 },
  },
  "sidereal-rising-gemini": {
    label: "The Crossroads",
    description:
      "The deeper pattern of your approach is multiplicity — you arrive as two things at once, the space between.",
    keywords: ["duality", "quicksilver", "air"],
    dimensions: { exchange: 0.9, movement: 0.6, relation: 0.3 },
  },
  "sidereal-rising-cancer": {
    label: "The Return",
    description:
      "The deeper pattern of your approach is homecoming — you arrive carrying something old, tender, remembered.",
    keywords: ["origin", "protection", "moonlight"],
    dimensions: { nurture: 0.9, containment: 0.5, embodiment: 0.4 },
  },
  "sidereal-rising-leo": {
    label: "The Sun",
    description:
      "The deeper pattern of your approach is sovereignty — you arrive as something central, creative, impossible to ignore.",
    keywords: ["authority", "light", "fire"],
    dimensions: { expression: 1.0, sovereignty: 0.6, embodiment: 0.4 },
  },
  "sidereal-rising-virgo": {
    label: "The Craft",
    description:
      "The deeper pattern of your approach is discernment — you arrive already reading, already refining, already serving.",
    keywords: ["precision", "humility", "earth"],
    dimensions: { refinement: 0.9, embodiment: 0.5, devotion: 0.5 },
  },
  "sidereal-rising-libra": {
    label: "The Bridge",
    description:
      "The deeper pattern of your approach is relation — you arrive as the space between things, the connecting force.",
    keywords: ["beauty", "balance", "air"],
    dimensions: { relation: 1.0, receptivity: 0.5, embodiment: 0.3 },
  },
  "sidereal-rising-scorpio": {
    label: "The Passage",
    description:
      "The deeper pattern of your approach is transformation — you arrive at the door between one thing and the next.",
    keywords: ["power", "depth", "water"],
    dimensions: { depth: 0.9, containment: 0.6, embodiment: 0.4 },
  },
  "sidereal-rising-sagittarius": {
    label: "The Horizon",
    description:
      "The deeper pattern of your approach is expansion — you arrive already aimed beyond, already reaching.",
    keywords: ["quest", "fire", "aim"],
    dimensions: { seeking: 0.9, movement: 0.6, embodiment: 0.4 },
  },
  "sidereal-rising-capricorn": {
    label: "The Summit",
    description:
      "The deeper pattern of your approach is mastery — you arrive as something that has climbed, will climb, endures.",
    keywords: ["authority", "earth", "time"],
    dimensions: { structure: 0.9, sovereignty: 0.5, embodiment: 0.4 },
  },
  "sidereal-rising-aquarius": {
    label: "The Transmission",
    description:
      "The deeper pattern of your approach is frequency — you arrive as something slightly ahead of the room.",
    keywords: ["vision", "air", "signal"],
    dimensions: { vision: 0.9, independence: 0.5, movement: 0.4 },
  },
  "sidereal-rising-pisces": {
    label: "The Veil",
    description:
      "The deeper pattern of your approach is dissolving — you arrive not quite fully here, carrying something from beyond.",
    keywords: ["water", "dream", "translucence"],
    dimensions: { dissolution: 0.9, receptivity: 0.6, embodiment: 0.3 },
  },
};

/** Build a lookup key */
export function traitKey(system: System, body: Body, sign: Sign): TraitKey {
  return `${system}-${body}-${sign}`;
}
