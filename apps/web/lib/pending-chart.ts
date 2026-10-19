import type { Reading } from "@bridge/shared-types";
import type { BirthDataContext } from "./reading-context";

const STORAGE_KEY = "bridge-pending-save";

export interface PendingChart {
  reading: Reading;
  birthData: BirthDataContext;
}

export function storePendingChart(data: PendingChart): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // sessionStorage full or unavailable
  }
}

export function getPendingChart(): PendingChart | null {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // ignore
  }
  return null;
}

export function clearPendingChart(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
