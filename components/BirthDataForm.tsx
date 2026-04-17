"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import LocationInput from "./LocationInput";
import ReadingLoader from "./ReadingLoader";
import { createReading } from "@/lib/actions";
import { useReading } from "@/lib/reading-context";
import type { GeoResult } from "@/lib/geocode";

export default function BirthDataForm() {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState<GeoResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setReading } = useReading();
  const router = useRouter();

  const canSubmit = date && time && location && !loading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || !location) return;

    setError(null);
    setLoading(true);

    const minDelay = new Promise((r) => setTimeout(r, 4500));

    try {
      const [reading] = await Promise.all([
        createReading({
          date,
          time,
          latitude: location.latitude,
          longitude: location.longitude,
        }),
        minDelay,
      ]);

      setReading(reading);
      router.push("/reading");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  };

  if (loading) {
    return <ReadingLoader />;
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full max-w-md mx-auto space-y-6"
    >
      <div>
        <label className="block text-sm font-body text-sand-400 mb-1">
          Birth Date
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="w-full rounded-lg bg-plum-800 border border-plum-700 px-4 py-3 text-sand-100 focus:outline-none focus:ring-2 focus:ring-plum-700 font-body"
        />
      </div>

      <div>
        <label className="block text-sm font-body text-sand-400 mb-1">
          Birth Time
        </label>
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
          className="w-full rounded-lg bg-plum-800 border border-plum-700 px-4 py-3 text-sand-100 focus:outline-none focus:ring-2 focus:ring-plum-700 font-body"
        />
      </div>

      <LocationInput onSelect={setLocation} selected={location} />

      {error && (
        <p className="text-rose-400 text-sm font-body">{error}</p>
      )}

      <button
        type="submit"
        disabled={!canSubmit}
        className="w-full py-3 rounded-lg bg-plum-700 text-sand-200 font-heading text-lg tracking-wide hover:bg-plum-700/80 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300"
      >
        Cast Your Reading
      </button>
    </motion.form>
  );
}
