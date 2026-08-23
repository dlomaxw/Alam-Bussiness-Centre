"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function CrmError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[crm]", error);
  }, [error]);

  const forbidden = error.message === "FORBIDDEN";
  const signedOut = error.message === "UNAUTHENTICATED";

  return (
    <div className="mx-auto max-w-lg rounded-2xl border border-line bg-white p-8 text-center">
      <h1 className="font-display text-3xl text-ink">
        {forbidden
          ? "Not permitted"
          : signedOut
            ? "Your session has ended"
            : "Something went wrong"}
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-ink/65">
        {forbidden
          ? "Your role does not have access to that action. Ask a Super Administrator if you need it."
          : signedOut
            ? "Sign in again to continue."
            : "The action could not be completed. Try again, and if it keeps happening check the server logs."}
      </p>
      <div className="mt-6 flex justify-center gap-3">
        {signedOut ? (
          <Link
            href="/crm/login"
            className="min-h-10 rounded-full bg-red px-5 py-2.5 text-sm font-medium text-white"
          >
            Sign in
          </Link>
        ) : (
          <button
            type="button"
            onClick={reset}
            className="min-h-10 rounded-full bg-red px-5 py-2.5 text-sm font-medium text-white"
          >
            Try again
          </button>
        )}
        <Link
          href="/crm"
          className="min-h-10 rounded-full border border-line px-5 py-2.5 text-sm font-medium text-ink"
        >
          Dashboard
        </Link>
      </div>
    </div>
  );
}
