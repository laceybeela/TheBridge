"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { signOut } from "@/lib/auth-actions";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      {user && (
        <nav className="border-b border-plum-700/30 px-6 py-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link
                href="/"
                className="font-heading text-xl text-sand-200 font-light tracking-wide"
              >
                The Bridge
              </Link>
              <Link
                href="/account/charts"
                className="font-body text-sm text-sand-400 hover:text-sand-300 transition-colors"
              >
                My Charts
              </Link>
              <Link
                href="/account/profile"
                className="font-body text-sm text-sand-400 hover:text-sand-300 transition-colors"
              >
                Profiles
              </Link>
            </div>
            <form action={signOut}>
              <button
                type="submit"
                className="font-body text-sm text-sand-400 hover:text-sand-300 transition-colors"
              >
                Sign Out
              </button>
            </form>
          </div>
        </nav>
      )}
      {children}
    </div>
  );
}
