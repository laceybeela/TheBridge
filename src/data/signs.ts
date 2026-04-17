import type { Element, Modality, Sign } from "../types/placement";

export interface SignInfo {
  sign: Sign;
  element: Element;
  modality: Modality;
  symbol: string; // brief archetypal keyword
}

export const SIGNS: Record<Sign, SignInfo> = {
  aries: { sign: "aries", element: "fire", modality: "cardinal", symbol: "initiation" },
  taurus: { sign: "taurus", element: "earth", modality: "fixed", symbol: "embodiment" },
  gemini: { sign: "gemini", element: "air", modality: "mutable", symbol: "exchange" },
  cancer: { sign: "cancer", element: "water", modality: "cardinal", symbol: "enclosure" },
  leo: { sign: "leo", element: "fire", modality: "fixed", symbol: "expression" },
  virgo: { sign: "virgo", element: "earth", modality: "mutable", symbol: "discernment" },
  libra: { sign: "libra", element: "air", modality: "cardinal", symbol: "relation" },
  scorpio: { sign: "scorpio", element: "water", modality: "fixed", symbol: "depth" },
  sagittarius: { sign: "sagittarius", element: "fire", modality: "mutable", symbol: "seeking" },
  capricorn: { sign: "capricorn", element: "earth", modality: "cardinal", symbol: "structure" },
  aquarius: { sign: "aquarius", element: "air", modality: "fixed", symbol: "pattern" },
  pisces: { sign: "pisces", element: "water", modality: "mutable", symbol: "dissolving" },
};

/** Quick lookups */
export function getElement(sign: Sign): Element {
  return SIGNS[sign].element;
}

export function getModality(sign: Sign): Modality {
  return SIGNS[sign].modality;
}
