"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "@/lib/auth-actions";

function SignInForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/account/charts";
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setError(null);
    setLoading(true);
    formData.set("next", next);
    const result = await signIn(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-body text-sand-400 mb-1">
          Email
        </label>
        <input
          type="email"
          name="email"
          required
          className="w-full rounded-lg bg-plum-800 border border-plum-700 px-4 py-3 text-sand-100 focus:outline-none focus:ring-2 focus:ring-plum-700 font-body"
        />
      </div>

      <div>
        <label className="block text-sm font-body text-sand-400 mb-1">
          Password
        </label>
        <input
          type="password"
          name="password"
          required
          className="w-full rounded-lg bg-plum-800 border border-plum-700 px-4 py-3 text-sand-100 focus:outline-none focus:ring-2 focus:ring-plum-700 font-body"
        />
      </div>

      {error && (
        <p className="text-rose-400 text-sm font-body">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-lg bg-plum-700 text-sand-200 font-heading text-lg tracking-wide hover:bg-plum-700/80 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300"
      >
        {loading ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <Link
            href="/"
            className="font-heading text-3xl text-sand-200 font-light tracking-wide"
          >
            The Bridge
          </Link>
          <p className="mt-3 font-body text-sand-400 text-sm">
            Sign in to your account
          </p>
        </div>

        <Suspense>
          <SignInForm />
        </Suspense>

        <div className="text-center space-y-2 text-sm font-body">
          <p className="text-sand-400">
            Don&apos;t have an account?{" "}
            <Link
              href="/account/signup"
              className="text-sand-200 hover:text-sand-100 transition-colors"
            >
              Sign up
            </Link>
          </p>
          <p>
            <Link
              href="/account/forgot"
              className="text-sand-400 hover:text-sand-300 transition-colors"
            >
              Forgot your password?
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
