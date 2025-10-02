// components/ExperienceChatFab.tsx — FULL FILE
"use client";

import { useEffect, useRef, useState } from "react";

type Msg = { role: "user" | "assistant"; content: string };

export default function ExperienceChatFab() {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const panelRef = useRef<HTMLDivElement | null>(null);

  // On first open, fetch a concise summary of the page to seed the chat
  useEffect(() => {
    let did = false;
    async function seed() {
      if (did || !open || msgs.length > 0) return;
      setBusy(true);
      try {
        const r = await fetch("/api/experience-summary", { method: "POST" });
        const j = await r.json();
        const summary = j?.summary || "Here’s a concise overview of my experience.";
        setMsgs([{ role: "assistant", content: summary }]);
      } catch {
        setMsgs([{ role: "assistant", content: "I can summarize this page and answer questions about my experience." }]);
      } finally {
        setBusy(false);
      }
    }
    seed();
    return () => { did = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Click outside to close (when open)
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!open || !panelRef.current) return;
      if (!panelRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  async function send() {
    if (!input.trim()) return;
    const user = input.trim();
    setInput("");
    setMsgs(m => [...m, { role: "user", content: user }]);
    setBusy(true);
    try {
      const r = await fetch("/api/experience-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: user })
      });
      if (!r.ok) throw new Error("chat failed");
      const j = await r.json();
      const text = j?.reply || "…";
      setMsgs(m => [...m, { role: "assistant", content: text }]);
    } catch {
      setMsgs(m => [...m, { role: "assistant", content: "sorry — I couldn’t respond just now." }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      {/* FAB button */}
      <button
        onClick={() => setOpen(v => !v)}
        aria-label="summarize and chat about experience"
        className="fixed bottom-5 right-5 z-50 rounded-full border border-subtle bg-card px-4 py-2 text-sm shadow-[0_12px_30px_rgba(0,0,0,.35)] hover:border-[color:var(--color-accent)]/60"
      >
        {open ? "close" : "ask about this page"}
      </button>

      {/* Panel */}
      {open && (
        <div
          ref={panelRef}
          className="fixed bottom-16 right-5 z-50 w-[min(92vw,380px)] overflow-hidden rounded-xl border border-subtle bg-card shadow-[0_20px_60px_rgba(0,0,0,.45)] backdrop-blur"
        >
          <div className="flex items-center justify-between border-b border-subtle px-3 py-2">
            <div className="text-sm text-muted">experience assistant</div>
            <button
              onClick={() => setOpen(false)}
              className="rounded-md border border-subtle px-2 py-1 text-xs hover:border-[color:var(--color-accent)]/60"
              aria-label="close chat"
            >
              ✕
            </button>
          </div>

          <div className="max-h-[60vh] min-h-[220px] overflow-y-auto px-3 py-3 space-y-3">
            {msgs.map((m, i) => (
              <div
                key={i}
                className={`rounded-lg border border-subtle px-3 py-2 text-sm leading-6 ${
                  m.role === "assistant" ? "bg-card" : ""
                }`}
              >
                {m.content}
              </div>
            ))}
            {busy && (
              <div className="rounded-lg border border-subtle px-3 py-2 text-sm text-muted">
                thinking…
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 border-t border-subtle p-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => (e.key === "Enter" ? send() : null)}
              placeholder="ask about my experience…"
              className="flex-1 rounded-md border border-subtle bg-transparent px-3 py-2 text-sm outline-none focus:border-[color:var(--color-accent)]/60"
            />
            <button
              onClick={send}
              disabled={busy}
              className="rounded-md border border-subtle px-3 py-2 text-sm hover:border-[color:var(--color-accent)]/60 disabled:opacity-60"
            >
              send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
