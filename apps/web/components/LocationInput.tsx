"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { geocodeCity, type GeoResult } from "@/lib/geocode";

interface LocationInputProps {
  onSelect: (result: GeoResult) => void;
  selected: GeoResult | null;
}

export default function LocationInput({ onSelect, selected }: LocationInputProps) {
  const [query, setQuery] = useState(selected?.displayName ?? "");
  const [results, setResults] = useState<GeoResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const search = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }
    setLoading(true);
    const data = await geocodeCity(q);
    setResults(data);
    setOpen(data.length > 0);
    setLoading(false);
  }, []);

  const handleChange = (value: string) => {
    setQuery(value);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => search(value), 300);
  };

  const handleSelect = (result: GeoResult) => {
    setQuery(result.displayName);
    setOpen(false);
    onSelect(result);
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <label className="block text-sm font-body text-sand-400 mb-1">
        Birth Location
      </label>
      <input
        type="text"
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Search for a city..."
        required
        className="w-full rounded-lg bg-plum-800 border border-plum-700 px-4 py-3 text-sand-100 placeholder:text-sand-400/50 focus:outline-none focus:ring-2 focus:ring-plum-700 font-body"
      />
      {loading && (
        <div className="absolute right-3 top-9 text-sand-400 text-xs">
          searching...
        </div>
      )}
      {open && results.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full rounded-lg bg-plum-800 border border-plum-700 shadow-lg max-h-60 overflow-auto">
          {results.map((r, i) => (
            <li key={i}>
              <button
                type="button"
                onClick={() => handleSelect(r)}
                className="w-full text-left px-4 py-2.5 text-sm text-sand-300 hover:bg-plum-700/50 transition-colors font-body"
              >
                {r.displayName}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
