import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { cormorant, inter } from "./fonts";
import { AuthProvider } from "@/lib/auth-context";
import { ReadingProvider } from "@/lib/reading-context";
import { createClient } from "@/lib/supabase/server";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Bridge",
  description: "A poetic astrology reading bridging your Earth self and Star self.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let user = null;
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch {
    // Supabase not configured — app works without it
  }

  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="font-body antialiased min-h-screen">
        <AuthProvider initialUser={user}>
          <ReadingProvider>{children}</ReadingProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
