import type { Metadata } from "next";
import { cormorant, inter } from "./fonts";
import { ReadingProvider } from "@/lib/reading-context";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Bridge",
  description: "A poetic astrology reading bridging your Earth self and Star self.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="font-body antialiased min-h-screen">
        <ReadingProvider>{children}</ReadingProvider>
      </body>
    </html>
  );
}
