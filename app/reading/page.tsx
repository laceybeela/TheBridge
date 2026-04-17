"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useReading } from "@/lib/reading-context";
import ReadingView from "@/components/ReadingView";

export default function ReadingPage() {
  const { reading } = useReading();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Wait for hydration from sessionStorage before redirecting
  useEffect(() => {
    if (mounted && !reading) {
      // Give a tick for sessionStorage hydration in the provider
      const timeout = setTimeout(() => {
        if (!reading) {
          router.replace("/");
        }
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [mounted, reading, router]);

  if (!mounted || !reading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-heading text-xl text-sand-400 font-light">
          Loading...
        </p>
      </div>
    );
  }

  return <ReadingView reading={reading} />;
}
