import type { BridgeTheme } from "./theme";
import type { TraitProfile } from "./trait";

/** One section of the final reading */
export interface ReadingSection {
  heading: string; // e.g. "The Earth Self"
  body: string; // the poetic prose
  themes: BridgeTheme[]; // themes woven into this section
}

/** The complete reading output */
export interface Reading {
  title: string[]; // one line per body
  introduction: string; // opening paragraph
  sections: ReadingSection[]; // 3-5 sections
  closing: string; // final reflection
  traits: TraitProfile; // attached for reference/UI
}
