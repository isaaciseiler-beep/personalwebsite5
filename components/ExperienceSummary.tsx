// components/ExperienceSummary.tsx — FULL FILE
"use client";

import { useState } from "react";

export default function ExperienceSummary() {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSummarize() {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/experience-summary", { method: "POST" });
      if (!res.ok) throw new Error("request failed");
      const data = await res.json();
      setSummary(data.summary);
    } catch (e) {
      setError("unable to summarize right now.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-subtle bg-card p-4 md:p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm text-muted">summarize this page</div>
        <button
          onClick={handleSummarize}
          disabled={loading}
          className="rounded-xl border border-subtle px-3 py-1.5 text-sm hover:border-[color:var(--color-accent)]/60 disabled:opacity-60"
        >
          {loading ? "summarizing…" : "summarize"}
        </button>
      </div>
      {error && <div className="mt-3 text-sm text-muted">{error}</div>}
      {summary && (
        <div className="mt-3 text-sm leading-6 text-[color:var(--color-fg)]">
          {summary}
        </div>
      )}
    </div>
  );
}
