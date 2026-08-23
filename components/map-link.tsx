"use client";

import { track } from "@/lib/analytics";

export function MapLink({ query }: { query: string }) {
  return (
    <a
      href={`https://www.google.com/maps/search/?api=1&query=${query}`}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track("map_opened")}
      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-ink-soft"
    >
      Open in Google Maps
      <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" aria-hidden>
        <path
          d="M7 13 13 7m0 0H8m5 0v5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </a>
  );
}
