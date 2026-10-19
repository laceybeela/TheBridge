"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { signOut } from "@/lib/auth-actions";

export default function AuthNav() {
  const { user } = useAuth();

  if (!user) {
    return (
      <Link
        href="/account/signin"
        className="font-body text-sm text-sand-400 hover:text-sand-300 transition-colors"
      >
        Sign In
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <Link
        href="/account/charts"
        className="font-body text-sm text-sand-400 hover:text-sand-300 transition-colors"
      >
        My Charts
      </Link>
      <form action={signOut}>
        <button
          type="submit"
          className="font-body text-sm text-sand-400 hover:text-sand-300 transition-colors"
        >
          Sign Out
        </button>
      </form>
    </div>
  );
}
