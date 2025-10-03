"use client";

import { useEffect, useRef, useState } from "react";

type Msg = { role: "user" | "assistant"; content: string };

export default function ExperienceChatFab() {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const panelRef = useRef<HTMLDivElement | null>(null);

  // seed with summary on first open
  useEffect(() => {
    let seeded = false;
    async function seed() {
      if (seeded || !open || msgs.length > 0) return;
      try {
        setBusy(true);
        const r = await fetch("/api/experience-summary", { method: "POST" });
        const j = await r.json();
        setMsgs([{ role: "assistant", content: j?.summary || "Here’s a concise overview of my experience." }]);
      } catch {
        setMsgs([{ role: "assistant", content: "I can summarize this page and answer questions about my experience." }]);
      } finally {
        setBusy(false);
      }
    }
    seed();
    return () => {
      seeded = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // click outside to close
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
    const text = input.trim();
    setInput("");
    setMsgs(m => [...m, { role: "user", content: text }]);
    setBusy(true);
    try {
      const r = await fetch("/api/experience-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text })
      });
      const j = await r.json();
      const reply = j?.reply || "…";
      setMsgs(m => [...m, { role: "assistant", content: reply }]);
    } catch {
      setMsgs(m => [...m, { role: "assistant", content: "sorry — I couldn’t respond just now." }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      {/* Floating icon (chat bubble) */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen(v => !v);
        }}
        aria-label="summarize and chat about experience"
        className="fixed bottom-5 right-5 z-50 h-12 w-12 rounded-full border border-subtle shadow-[0_12px_30px_rgba(0,0,0,.35)] hover:border-[color:var(--color-accent)]/60"
        style={{
          background: "var(--color-bg)",
          opacity: 0.85, // less transparent, more readable
          backdropFilter: "blur(10px) saturate(140%)",
          WebkitBackdropFilter: "blur(10px) saturate(140%)"
        }}
      >
        {/* chat icon (stylistically consistent, minimal) */}
        <svg viewBox="0 0 24 24" width="20" height="20" className="mx-auto" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M21 12a7 7 0 0 1-7 7H9l-5 3 2-4A7 7 0 1 1 21 12Z"/>
          <path d="M8 12h8M8 9h8M8 15h5"/>
        </svg>
      </button>

      {/* Expandable chat panel */}
      {open && (
        <div
          ref={panelRef}
          className="fixed bottom-16 right-5 z-50 w-[min(92vw,420px)] overflow-hidden rounded-xl border border-subtle shadow-[0_20px_60px_rgba(0,0,0,.45)]"
          style={{
            background: "var(--color-bg)",
            opacity: 0.9,
            backdropFilter: "blur(12px) saturate(160%)",
            WebkitBackdropFilter: "blur(12px) saturate(160%)",
            transition: "transform 180ms cubic-bezier(.2,0,0,1), opacity 180ms cubic-bezier(.2,0,0,1)",
            transform: "translateY(0)"
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between border-b border-subtle px-3 py-2">
            <div className="text-sm text-muted">experience assistant</div>
            {/* close = x */}
            <button
              onClick={() => setOpen(false)}
              className="rounded-md border border-subtle px-2 py-1 text-xs hover:border-[color:var(--color-accent)]/60"
              aria-label="close chat"
            >
              ×
            </button>
          </div>

          {/* chat area */}
          <div className="max-h-[60vh] min-h-[260px] overflow-y-auto px-3 py-3 space-y-3">
            {msgs.map((m, i) => (
              <div key={i} className={`flex ${m.role === "assistant" ? "justify-start" : "justify-end"}`}>
                <div
                  className={`rounded-2xl px-3 py-2 text-sm leading-6 border ${
                    m.role === "assistant"
                      ? "bg-card border-subtle"
                      : "border-[color:var(--color-accent)]/40"
                  }`}
                  style={m.role === "user" ? { background: "transparent" } : {}}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {busy && (
              <div className="flex justify-start">
                <div className="rounded-2xl border border-subtle bg-card px-3 py-2">
                  <span className="inline-flex gap-1">
                    <span className="dot" />
                    <span className="dot" style={{ animationDelay: "120ms" }} />
                    <span className="dot" style={{ animationDelay: "240ms" }} />
                  </span>
                </div>
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

      {/* typing indicator styles */}
      <style jsx>{`
        .dot {
          width: 6px;
          height: 6px;
          border-radius: 9999px;
          background: currentColor;
          opacity: 0.5;
          animation: pulse 900ms infinite ease-in-out;
          display: inline-block;
        }
        @keyframes pulse {
          0%, 100% { transform: translateY(0); opacity: 0.5; }
          50%     { transform: translateY(-3px); opacity: 1; }
        }
      `}</style>
    </>
  );
}
