"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { Reading } from "@engine/index";

const STORAGE_KEY = "bridge-reading";

interface ReadingContextValue {
  reading: Reading | null;
  setReading: (reading: Reading) => void;
  clearReading: () => void;
}

const ReadingContext = createContext<ReadingContextValue | null>(null);

export function ReadingProvider({ children }: { children: ReactNode }) {
  const [reading, setReadingState] = useState<Reading | null>(null);

  // Hydrate from sessionStorage on mount
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        setReadingState(JSON.parse(stored));
      }
    } catch {
      // sessionStorage unavailable or corrupt data
    }
  }, []);

  const setReading = useCallback((r: Reading) => {
    setReadingState(r);
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(r));
    } catch {
      // sessionStorage full or unavailable
    }
  }, []);

  const clearReading = useCallback(() => {
    setReadingState(null);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  return (
    <ReadingContext.Provider value={{ reading, setReading, clearReading }}>
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
