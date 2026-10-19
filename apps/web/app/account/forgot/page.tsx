"use client";

import { useState } from "react";
import Link from "next/link";
import { resetPassword } from "@/lib/auth-actions";

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setError(null);
    setSuccess(null);
    setLoading(true);
    const result = await resetPassword(formData);
    if (result?.error) {
      setError(result.error);
    }
    if (result?.success) {
      setSuccess(result.success);
    }
    setLoading(false);
  }

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
            Reset your password
          </p>
        </div>

        {success ? (
          <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-4">
            <p className="text-emerald-300 text-sm font-body text-center">
              {success}
            </p>
          </div>
        ) : (
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

            {error && (
              <p className="text-rose-400 text-sm font-body">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-plum-700 text-sand-200 font-heading text-lg tracking-wide hover:bg-plum-700/80 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        )}

        <div className="text-center text-sm font-body">
          <Link
            href="/account/signin"
            className="text-sand-400 hover:text-sand-300 transition-colors"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
