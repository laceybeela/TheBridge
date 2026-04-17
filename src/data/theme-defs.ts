import type { Body } from "../types/placement";
import type { DimensionName } from "../types/trait";
import type { ThemeCategory } from "../types/theme";
import type { Trait } from "../types/trait";

/**
 * Theme definition: a named archetypal pattern with detection rules
 * and body-specific prose templates.
 */
export interface ThemeDef {
  id: string;
  name: string;
  category: ThemeCategory;
  /** For divergence: [dimA, dimB] that oppose. For alignment: shared dims. For amplification: associated dims. */
  triggerDims: DimensionName[];
  prose: Record<Body, (earth: Trait, star: Trait) => string>;
}

// ── Divergence Themes (10) ─────────────────────────────────────
// Earth and star dimensions oppose

const theTautWire: ThemeDef = {
  id: "the-taut-wire",
  name: "The Taut Wire",
  category: "divergence",
  triggerDims: ["stability", "movement"],
  prose: {
    sun: (earth, star) =>
      `At the center of your identity, two forces pull in opposite directions. ` +
      `${earth.label} wants to hold still, to ground, to know itself through what endures. ` +
      `But ${star.label} insists on motion, on the next thing, on becoming through departure. ` +
      `You live between the anchor and the wind, and something in you is always taut with the distance between them.`,
    moon: (earth, star) =>
      `Your emotional life is strung between two needs that cannot both be met at once. ` +
      `${earth.label} craves ground, return, the comfort of what stays. ` +
      `${star.label} pulls toward open space, toward emotional range and restlessness. ` +
      `The wire between them hums with a feeling you can never quite name.`,
    rising: (earth, star) =>
      `The way you meet the world carries an internal contradiction. ` +
      `${earth.label} arrives with steadiness, with gravity. ` +
      `But ${star.label} arrives reaching, already leaving. ` +
      `People sense both the rootedness and the restlessness and are drawn to the tension between them.`,
  },
};

const theClosedDoor: ThemeDef = {
  id: "the-closed-door",
  name: "The Closed Door",
  category: "divergence",
  triggerDims: ["containment", "expression"],
  prose: {
    sun: (earth, star) =>
      `Something in your identity wants to be held back while something else insists on being seen. ` +
      `${earth.label} builds walls, protects what is interior, guards the self. ` +
      `${star.label} demands expression, radiance, the act of being witnessed. ` +
      `The door between private and public swings both ways, and you are always deciding which side to stand on.`,
    moon: (earth, star) =>
      `Your emotional instincts are split between holding in and letting out. ` +
      `${earth.label} keeps feelings enclosed, protected, close to the chest. ` +
      `${star.label} needs to express them, to give them form and warmth. ` +
      `This inner negotiation gives your emotional life a complexity that others can sense but rarely understand.`,
    rising: (earth, star) =>
      `Your arrival carries a quality of withholding and revealing at once. ` +
      `${earth.label} approaches the world guardedly, selectively. ` +
      `But ${star.label} approaches with brightness, with an impulse to be seen. ` +
      `People sense the door and the light behind it simultaneously.`,
  },
};

const theTwoSpeeds: ThemeDef = {
  id: "the-two-speeds",
  name: "The Two Speeds",
  category: "divergence",
  triggerDims: ["initiation", "refinement"],
  prose: {
    sun: (earth, star) =>
      `Your sense of self operates at two speeds that rarely agree. ` +
      `${earth.label} wants to begin, to move before the picture is complete. ` +
      `${star.label} wants to refine, to serve, to get it right before anything starts. ` +
      `The gap between impulse and precision is where your identity does its real work.`,
    moon: (earth, star) =>
      `Emotionally, you are pulled between the urge to act immediately and the need to process carefully. ` +
      `${earth.label} feels first and sorts later. ` +
      `${star.label} holds back, watches, refines the feeling before releasing it. ` +
      `This gives your inner life a rhythm of urgency and restraint.`,
    rising: (earth, star) =>
      `You arrive in two tempos. ` +
      `${earth.label} enters fast, direct, already in motion. ` +
      `${star.label} arrives carefully, reading the room, adjusting. ` +
      `The two speeds make your presence feel both bold and considered.`,
  },
};

const theSplitLens: ThemeDef = {
  id: "the-split-lens",
  name: "The Split Lens",
  category: "divergence",
  triggerDims: ["vision", "embodiment"],
  prose: {
    sun: (earth, star) =>
      `Your identity is torn between the abstract and the physical. ` +
      `${earth.label} sees patterns, systems, the architecture of things. ` +
      `${star.label} insists on the body, on sensation, on what can be touched. ` +
      `You live between blueprint and material, and your sense of self shifts depending on which lens you are looking through.`,
    moon: (earth, star) =>
      `Your emotional life is divided between the conceptual and the sensory. ` +
      `${earth.label} processes feeling through ideas, through detachment, through pattern. ` +
      `${star.label} processes it through the body, through holding, through texture. ` +
      `Neither mode alone tells the full story of what you feel.`,
    rising: (earth, star) =>
      `People experience you through two different registers. ` +
      `${earth.label} arrives in the mind, in observation, in a quality of seeing. ` +
      `${star.label} arrives in the body, in physical presence, in groundedness. ` +
      `Your approach oscillates between the cerebral and the tangible.`,
  },
};

const theUndertow: ThemeDef = {
  id: "the-undertow",
  name: "The Undertow",
  category: "divergence",
  triggerDims: ["depth", "exchange"],
  prose: {
    sun: (earth, star) =>
      `Your identity holds a pull between surfaces and depths. ` +
      `${earth.label} insists on what lies beneath, on truth that costs something to reach. ` +
      `${star.label} wants to name, to bridge, to move between things lightly. ` +
      `You are drawn downward even as something in you wants to stay in conversation with the world above.`,
    moon: (earth, star) =>
      `Emotionally, you are caught between going deep and staying light. ` +
      `${earth.label} feels everything at full weight, holding nothing at a distance. ` +
      `${star.label} wants to articulate, to make the feeling speakable. ` +
      `The undertow is what happens when depth resists being put into words.`,
    rising: (earth, star) =>
      `Your presence carries an undertow. ` +
      `${earth.label} meets the world with intensity, with a gaze that goes beneath. ` +
      `${star.label} meets it with quickness, with language, with an impulse to connect. ` +
      `People sense the depth pulling just beneath the surface ease.`,
  },
};

const theUnevenKeel: ThemeDef = {
  id: "the-uneven-keel",
  name: "The Uneven Keel",
  category: "divergence",
  triggerDims: ["independence", "relation"],
  prose: {
    sun: (earth, star) =>
      `Your sense of self tilts between self-reliance and the pull toward others. ` +
      `${earth.label} needs autonomy, the freedom to define itself alone. ` +
      `${star.label} finds meaning through connection, through the mirror of relation. ` +
      `You never quite settle into solitude or partnership. The keel is always adjusting.`,
    moon: (earth, star) =>
      `Your emotional needs lean two ways at once. ` +
      `${earth.label} needs space, independence, room to feel on its own terms. ` +
      `${star.label} needs the other, the exchange, the emotional reciprocity. ` +
      `What steadies you emotionally is always shifting between closeness and distance.`,
    rising: (earth, star) =>
      `You arrive in the world both independently and in relation. ` +
      `${earth.label} enters alone, self-contained, needing no introduction. ` +
      `${star.label} enters already attuned to the room, already connecting. ` +
      `The uneven keel of your presence makes you both magnetic and hard to hold.`,
  },
};

const theLongFuse: ThemeDef = {
  id: "the-long-fuse",
  name: "The Long Fuse",
  category: "divergence",
  triggerDims: ["structure", "dissolution"],
  prose: {
    sun: (earth, star) =>
      `Your identity is caught between the need to build and the pull to dissolve. ` +
      `${earth.label} wants form, mastery, a self constructed through time. ` +
      `${star.label} wants to surrender form, to return to something less defined. ` +
      `The fuse between discipline and release is long, but it burns in both directions.`,
    moon: (earth, star) =>
      `Emotionally, you live between containment and overflow. ` +
      `${earth.label} holds feelings inside structure, inside responsibility. ` +
      `${star.label} dissolves those same structures, flooding what was carefully built. ` +
      `Your inner life has a slow rhythm of building and letting go that never fully resolves.`,
    rising: (earth, star) =>
      `Your approach to the world carries both composure and surrender. ` +
      `${earth.label} arrives with authority, with a built quality. ` +
      `${star.label} arrives diffusely, softly, without hard edges. ` +
      `People sense the structure and the dissolution happening at once, and it gives your presence a quiet power.`,
  },
};

const theBorrowedSkin: ThemeDef = {
  id: "the-borrowed-skin",
  name: "The Borrowed Skin",
  category: "divergence",
  triggerDims: ["sovereignty", "receptivity"],
  prose: {
    sun: (earth, star) =>
      `Your identity wears something that does not quite belong to it. ` +
      `${earth.label} takes up space, claims authority, insists on being itself. ` +
      `${star.label} opens to influence, absorbs what is around it, lets boundaries soften. ` +
      `You move between commanding and yielding, and neither skin fits perfectly.`,
    moon: (earth, star) =>
      `Your emotional life oscillates between self-possession and openness to everything. ` +
      `${earth.label} knows what it needs and refuses to be moved. ` +
      `${star.label} absorbs, mirrors, feels what is not even its own. ` +
      `The borrowed skin is what you wear when you are not sure whose feeling you are carrying.`,
    rising: (earth, star) =>
      `Your presence shifts between authority and permeability. ` +
      `${earth.label} arrives with a quality of sovereignty, of taking up space. ` +
      `${star.label} arrives open, porous, receiving the room before it offers anything back. ` +
      `People are not sure whether they are being met or absorbed.`,
  },
};

const theOpenWound: ThemeDef = {
  id: "the-open-wound",
  name: "The Open Wound",
  category: "divergence",
  triggerDims: ["transformation", "stability"],
  prose: {
    sun: (earth, star) =>
      `Something in your identity is always in the process of changing, ` +
      `even as another part wants nothing more than to stay the same. ` +
      `${earth.label} insists on renewal, on shedding what no longer serves. ` +
      `${star.label} insists on ground, on permanence. ` +
      `The wound is not a failure. It is the place where the old self and the new one meet.`,
    moon: (earth, star) =>
      `Your emotional life carries a wound that refuses to close cleanly. ` +
      `${earth.label} needs to transform, to let the feeling evolve. ` +
      `${star.label} needs the feeling to hold, to remain what it was. ` +
      `The result is an emotional depth that comes from living in the space between change and permanence.`,
    rising: (earth, star) =>
      `Your presence carries both transformation and stillness. ` +
      `${earth.label} arrives as something in motion, in process. ` +
      `${star.label} arrives rooted, unmoved. ` +
      `People sense that you are simultaneously becoming and staying, and the contradiction gives your arrival gravity.`,
  },
};

const theDoubleBind: ThemeDef = {
  id: "the-double-bind",
  name: "The Double Bind",
  category: "divergence",
  triggerDims: ["nurture", "seeking"],
  prose: {
    sun: (earth, star) =>
      `Your sense of self is pulled between home and horizon. ` +
      `${earth.label} wants to tend, to enclose, to hold what matters close. ` +
      `${star.label} wants to reach, to aim beyond, to find meaning past the threshold. ` +
      `You cannot fully stay and you cannot fully go, and that bind shapes everything.`,
    moon: (earth, star) =>
      `Emotionally, you are bound in two directions. ` +
      `${earth.label} needs safety, enclosure, the comfort of what is known. ` +
      `${star.label} needs expansion, the open feeling, the freedom to not know. ` +
      `Neither need cancels the other. You carry both, and your emotional life is richer for the difficulty.`,
    rising: (earth, star) =>
      `You meet the world as someone both sheltering and seeking. ` +
      `${earth.label} approaches with care, with attention to what needs protecting. ` +
      `${star.label} approaches with openness, already reaching past the immediate. ` +
      `The double bind of your presence makes you feel both safe and vast to others.`,
  },
};

// ── Alignment Themes (5) ───────────────────────────────────────
// Both sides share strong dimensions

const theDeepRoot: ThemeDef = {
  id: "the-deep-root",
  name: "The Deep Root",
  category: "alignment",
  triggerDims: ["stability", "containment"],
  prose: {
    sun: (earth, star) =>
      `Both sides of your identity agree on one thing: something must be held. ` +
      `${earth.label} and ${star.label} share a gravity, a groundedness that does not need to be earned ` +
      `because it was always there. You know yourself through what endures, and both skies confirm it.`,
    moon: (earth, star) =>
      `Your emotional instincts run deep and steady from both directions. ` +
      `${earth.label} and ${star.label} both want ground beneath the feeling. ` +
      `Where others waver, you hold. This is not rigidity. ` +
      `It is the kind of emotional certainty that others lean into without knowing why.`,
    rising: (earth, star) =>
      `Your presence is rooted from both sides. ` +
      `${earth.label} and ${star.label} arrive with the same quality of stillness. ` +
      `People feel held by you before you say a word. ` +
      `The deep root of your approach gives others permission to settle.`,
  },
};

const theBrightThread: ThemeDef = {
  id: "the-bright-thread",
  name: "The Bright Thread",
  category: "alignment",
  triggerDims: ["expression", "sovereignty"],
  prose: {
    sun: (earth, star) =>
      `Both skies agree: you are meant to be visible. ` +
      `${earth.label} and ${star.label} carry the same bright thread of self-possession. ` +
      `What you experience as identity and what moves through you both insist on expression, on being witnessed. ` +
      `This alignment is rare. It means your presence is not a performance but a fact.`,
    moon: (earth, star) =>
      `Emotionally, both layers of your feeling life share a generosity, a warmth that radiates. ` +
      `${earth.label} and ${star.label} agree on the need to express, to give, to be met with recognition. ` +
      `Your emotional life has a brightness that does not dim easily.`,
    rising: (earth, star) =>
      `Your approach to the world carries a doubled radiance. ` +
      `${earth.label} and ${star.label} both arrive with presence, with authority, with creative force. ` +
      `People notice you not because you try but because both layers of your arrival are luminous.`,
  },
};

const theOpenChannel: ThemeDef = {
  id: "the-open-channel",
  name: "The Open Channel",
  category: "alignment",
  triggerDims: ["receptivity", "dissolution"],
  prose: {
    sun: (earth, star) =>
      `Both sides of your identity are unusually open. ` +
      `${earth.label} and ${star.label} share a permeability, a willingness to dissolve boundaries. ` +
      `You do not so much define yourself as let yourself be defined by what moves through you. ` +
      `This openness is a gift and a responsibility.`,
    moon: (earth, star) =>
      `Your emotional life is an open channel from both directions. ` +
      `${earth.label} and ${star.label} both absorb, both feel beyond the edges of the self. ` +
      `There is a rare emotional porosity here. You feel not just your own life but the weather of everything around you.`,
    rising: (earth, star) =>
      `Your approach to the world is gentle from both sides. ` +
      `${earth.label} and ${star.label} both arrive with softness, with receptivity. ` +
      `People project onto you easily, and you receive it without resistance. ` +
      `The open channel of your presence makes others feel they are being truly met.`,
  },
};

const theSharedCompass: ThemeDef = {
  id: "the-shared-compass",
  name: "The Shared Compass",
  category: "alignment",
  triggerDims: ["seeking", "vision"],
  prose: {
    sun: (earth, star) =>
      `Both skies point the same way. ` +
      `${earth.label} and ${star.label} share a drive toward meaning, toward the larger picture. ` +
      `Your sense of self is oriented by a compass that does not waver. ` +
      `Where others question direction, you feel the pull clearly.`,
    moon: (earth, star) =>
      `Emotionally, both layers of your life want the same thing: the horizon. ` +
      `${earth.label} and ${star.label} share a restlessness for meaning, a refusal to settle for the obvious. ` +
      `Your emotional compass points toward expansion, and both skies agree on the bearing.`,
    rising: (earth, star) =>
      `Your approach to the world carries a shared sense of direction. ` +
      `${earth.label} and ${star.label} both arrive with forward motion, with a quality of aim. ` +
      `People sense in your presence something that knows where it is going.`,
  },
};

const theQuietCraft: ThemeDef = {
  id: "the-quiet-craft",
  name: "The Quiet Craft",
  category: "alignment",
  triggerDims: ["refinement", "devotion"],
  prose: {
    sun: (earth, star) =>
      `Both sides of your identity share a devotion to craft, to getting it right. ` +
      `${earth.label} and ${star.label} carry the same attention to detail, the same impulse to serve. ` +
      `Your sense of self is built in the small acts of care that others overlook.`,
    moon: (earth, star) =>
      `Your emotional life is organized around devotion from both directions. ` +
      `${earth.label} and ${star.label} both express love through attention, through usefulness, through quiet acts. ` +
      `There is a craftsmanship to your feeling life that is easy to miss and impossible to fake.`,
    rising: (earth, star) =>
      `Your approach to the world is precise from both sides. ` +
      `${earth.label} and ${star.label} both arrive with care, with a quality of service. ` +
      `People experience your presence as attentive, considered, never careless.`,
  },
};

// ── Amplification Themes (3) ───────────────────────────────────
// Echo placements (same sign in both systems)

const theDoubledFlame: ThemeDef = {
  id: "the-doubled-flame",
  name: "The Doubled Flame",
  category: "amplification",
  triggerDims: ["initiation", "expression", "seeking"],
  prose: {
    sun: (earth, star) =>
      `Both skies light the same fire in your identity. ` +
      `${earth.label} and ${star.label} occupy the same sign, and what you live and what lives through you are undivided. ` +
      `This is amplification at the level of who you are. ` +
      `The flame burns with twice the depth, and the responsibility is to carry it without burning down what is around you.`,
    moon: (earth, star) =>
      `Both skies agree on the fire in your emotional life. ` +
      `${earth.label} and ${star.label} share the same sign, and your emotional instincts are doubled in intensity. ` +
      `What you feel, you feel completely. There is no gap between the need and the force behind it.`,
    rising: (earth, star) =>
      `Both skies dress your arrival in the same bright element. ` +
      `${earth.label} and ${star.label} share the same sign at your rising, and your presence is undivided. ` +
      `People feel the full force of your approach because nothing in it is working against itself.`,
  },
};

const theStillWater: ThemeDef = {
  id: "the-still-water",
  name: "The Still Water",
  category: "amplification",
  triggerDims: ["stability", "nurture", "depth", "containment", "embodiment", "refinement", "devotion"],
  prose: {
    sun: (earth, star) =>
      `Both skies settle into the same still place in your identity. ` +
      `${earth.label} and ${star.label} occupy the same sign, and there is no split between what you are and what moves through you. ` +
      `This is a deep pool, not a river. The stillness here is not absence but fullness.`,
    moon: (earth, star) =>
      `Both skies agree on the depth of your emotional life. ` +
      `${earth.label} and ${star.label} share the same sign, and your inner world is undivided. ` +
      `What comforts you at the surface comforts you all the way down. ` +
      `This is rare: a place where the inner life does not argue with itself.`,
    rising: (earth, star) =>
      `Both skies give your arrival the same quiet weight. ` +
      `${earth.label} and ${star.label} share the same sign, and your presence carries a doubled stillness. ` +
      `People feel your groundedness before you speak, and what they sense is what is actually there.`,
  },
};

const theClearSignal: ThemeDef = {
  id: "the-clear-signal",
  name: "The Clear Signal",
  category: "amplification",
  triggerDims: ["vision", "exchange", "independence", "relation"],
  prose: {
    sun: (earth, star) =>
      `Both skies transmit the same signal through your identity. ` +
      `${earth.label} and ${star.label} occupy the same sign, and your sense of self rings clear. ` +
      `There is no distortion between lived experience and deeper archetype. ` +
      `What you know about yourself, you know with unusual certainty.`,
    moon: (earth, star) =>
      `Both skies tune your emotional life to the same frequency. ` +
      `${earth.label} and ${star.label} share the same sign, and what you need emotionally is unmistakable. ` +
      `You know what you feel with a clarity that others find either grounding or unnerving.`,
    rising: (earth, star) =>
      `Both skies align your approach into a single clear signal. ` +
      `${earth.label} and ${star.label} share the same sign, and your presence carries no contradiction. ` +
      `There is no gap between the mask and what is behind it. What people meet when they meet you is, simply, you.`,
  },
};

// ── All Themes ─────────────────────────────────────────────────

export const DIVERGENCE_THEMES: ThemeDef[] = [
  theTautWire,
  theClosedDoor,
  theTwoSpeeds,
  theSplitLens,
  theUndertow,
  theUnevenKeel,
  theLongFuse,
  theBorrowedSkin,
  theOpenWound,
  theDoubleBind,
];

export const ALIGNMENT_THEMES: ThemeDef[] = [
  theDeepRoot,
  theBrightThread,
  theOpenChannel,
  theSharedCompass,
  theQuietCraft,
];

export const AMPLIFICATION_THEMES: ThemeDef[] = [
  theDoubledFlame,
  theStillWater,
  theClearSignal,
];

export const ALL_THEMES: ThemeDef[] = [
  ...DIVERGENCE_THEMES,
  ...ALIGNMENT_THEMES,
  ...AMPLIFICATION_THEMES,
];
