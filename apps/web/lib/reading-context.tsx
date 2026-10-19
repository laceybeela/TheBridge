"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { Reading, BirthChart, ReadingWithCharts } from "@bridge/shared-types";

const STORAGE_KEY = "bridge-reading";
const BIRTH_DATA_KEY = "bridge-birth-data";
const CHARTS_KEY = "bridge-charts";

export interface BirthDataContext {
  date: string;
  time: string;
  latitude: number;
  longitude: number;
  locationLabel: string;
}

interface ReadingContextValue {
  reading: Reading | null;
  charts: BirthChart | null;
  birthData: BirthDataContext | null;
  setReading: (result: ReadingWithCharts, birthData?: BirthDataContext) => void;
  clearReading: () => void;
}

const ReadingContext = createContext<ReadingContextValue | null>(null);

export function ReadingProvider({ children }: { children: ReactNode }) {
  const [reading, setReadingState] = useState<Reading | null>(null);
  const [charts, setChartsState] = useState<BirthChart | null>(null);
  const [birthData, setBirthDataState] = useState<BirthDataContext | null>(null);

  // Hydrate from sessionStorage on mount
  useEffect(() => {
    try {
      const storedReading = sessionStorage.getItem(STORAGE_KEY);
      if (storedReading) {
        setReadingState(JSON.parse(storedReading));
      }
      const storedCharts = sessionStorage.getItem(CHARTS_KEY);
      if (storedCharts) {
        setChartsState(JSON.parse(storedCharts));
      }
      const storedBirth = sessionStorage.getItem(BIRTH_DATA_KEY);
      if (storedBirth) {
        setBirthDataState(JSON.parse(storedBirth));
      }
    } catch {
      // sessionStorage unavailable or corrupt data
    }
  }, []);

  const setReading = useCallback((result: ReadingWithCharts, bd?: BirthDataContext) => {
    setReadingState(result.reading);
    setChartsState(result.charts);
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(result.reading));
      sessionStorage.setItem(CHARTS_KEY, JSON.stringify(result.charts));
    } catch {
      // sessionStorage full or unavailable
    }
    if (bd) {
      setBirthDataState(bd);
      try {
        sessionStorage.setItem(BIRTH_DATA_KEY, JSON.stringify(bd));
      } catch {
        // ignore
      }
    }
  }, []);

  const clearReading = useCallback(() => {
    setReadingState(null);
    setChartsState(null);
    setBirthDataState(null);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem(BIRTH_DATA_KEY);
      sessionStorage.removeItem(CHARTS_KEY);
    } catch {
      // ignore
    }
  }, []);

  return (
    <ReadingContext.Provider value={{ reading, charts, birthData, setReading, clearReading }}>
      {children}
    </ReadingContext.Provider>
  );
}

export function useReading() {
  const ctx = useContext(ReadingContext);
  if (!ctx) {
    throw new Error("useReading must be used within ReadingProvider");
  }
  return ctx;
}
