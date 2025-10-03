// components/ExperienceChatFab.tsx — FULL REPLACEMENT
// Pill morphs into an elegant bottom-center chat. Theme-aware translucency:
// in DARK mode → WHITE glass; in LIGHT mode → BLACK glass.
// Adds a subtle “blur shadow” halo. No auto-summarize on open.

"use client";

import { useEffect, useRef, useState } from "react";

type Msg = { role: "user" | "assistant"; content: string };

export default function ExperienceChatFab() {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const shellRef = useRef<HTMLDivElement | null>(null);

  // click outside to close
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!open || !shellRef.current) return;
      if (!shellRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  async function send() {
    if (!input.trim()) return;
    const text = input.trim();
    setInput("");
    setMsgs((m) => [...m, { role: "user", content: text }]);
    setBusy(true);
    try {
      const r = await fetch("/api/experience-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const j = await r.json();
      const reply = j?.reply || "…";
      setMsgs((m) => [...m, { role: "assistant", content: reply }]);
    } catch {
      setMsgs((m) => [
        ...m,
        { role: "assistant", content: "sorry — I couldn’t respond just now." },
      ]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      {/* Morphing shell + blur-shadow halo */}
      <div ref={shellRef} className={`chat-shell ${open ? "open" : "closed"}`} aria-live="polite">
        {/* blur shadow halo behind */}
        <div className="blur-shadow" aria-hidden />

        {/* header / trigger area */}
        <div className="chat-head">
          {!open ? (
            <button
              className="chat-trigger"
              onClick={() => setOpen(true)}
              aria-label="Ask ChatGPT about this page"
              title="Ask ChatGPT"
            >
              <span className="trigger-label">Ask ChatGPT</span>
            </button>
          ) : (
            <button
              className="chat-close"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              title="Close"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="1.8" fill="none">
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>

        {/* body */}
        <div className="chat-body" aria-hidden={!open}>
          <div className="chat-scroll">
            {msgs.map((m, i) => (
              <div key={i} className={`row ${m.role === "assistant" ? "left" : "right"}`}>
                <div className={`bubble ${m.role}`}>{m.content}</div>
              </div>
            ))}

            {busy && (
              <div className="row left">
                <div className="bubble assistant">
                  <span className="dots">
                    <span className="dot" />
                    <span className="dot" style={{ animationDelay: "120ms" }} />
                    <span className="dot" style={{ animationDelay: "240ms" }} />
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="chat-input">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => (e.key === "Enter" ? send() : null)}
              placeholder="ask about my experience…"
              aria-label="Message"
            />
            <button onClick={send} disabled={busy} aria-label="Send" title="Send" className="send">
              {/* Up arrow */}
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="1.8" fill="none">
                <path d="M12 5v14M12 5l6 6M12 5L6 11" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* shell position: bottom center */
        .chat-shell {
          position: fixed;
          left: 50%;
          bottom: 16px;
          transform: translateX(-50%);
          z-index: 50;
          border: 1px solid var(--color-border);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
          overflow: hidden;
          transition:
            width 220ms cubic-bezier(.2,0,0,1),
            height 220ms cubic-bezier(.2,0,0,1),
            border-radius 220ms cubic-bezier(.2,0,0,1),
            transform 220ms cubic-bezier(.2,0,0,1),
            opacity 180ms ease;
        }
        .chat-shell.closed {
          width: auto;
          height: 44px;
          border-radius: 9999px;
          animation: floaty 4.2s ease-in-out infinite;
        }
        .chat-shell.open {
          width: min(92vw, 560px);
          height: min(72vh, 580px);
          border-radius: 14px;
          animation: none;
        }

        /* THEME-AWARE TRANSLUCENCY (white glass in dark mode, black glass in light mode) */
        /* default (light) */
        .chat-shell,
        .chat-trigger,
        .chat-close {
          background: rgba(0, 0, 0, 0.82);
          color: var(--color-fg);
          backdrop-filter: blur(14px) saturate(160%);
          -webkit-backdrop-filter: blur(14px) saturate(160%);
        }
        /* dark theme override (white glass) */
        :global([data-theme="dark"]) .chat-shell,
        :global([data-theme="dark"]) .chat-trigger,
        :global([data-theme="dark"]) .chat-close {
          background: rgba(255, 255, 255, 0.88);
          color: #0b0b0c;
        }
        /* blur-shadow halo (theme-aware) */
        .blur-shadow {
          position: absolute;
          inset: -14px;
          border-radius: inherit;
          filter: blur(24px);
          opacity: 0.65;
          pointer-events: none;
        }
        .chat-shell:not(:global([data-theme="dark"]) .chat-shell) .blur-shadow { background: rgba(0,0,0,0.4); }
        :global([data-theme="light"]) .chat-shell .blur-shadow { background: rgba(0,0,0,0.4); }
        :global([data-theme="dark"]) .chat-shell .blur-shadow { background: rgba(255,255,255,0.5); }

        /* header / trigger */
        .chat-head {
          display: flex; align-items: center; justify-content: center;
          height: 44px; padding: 0 10px; position: relative;
          border-bottom: 1px solid var(--color-border);
        }
        .closed .chat-head { border-bottom: none; }

        .chat-trigger {
          display: inline-flex; align-items: center; gap: 8px;
          height: 36px; padding: 0 14px;
          border-radius: 9999px;
          border: 1px solid var(--color-border);
          cursor: pointer;
          transition: border-color 150ms ease, transform 150ms ease, background 150ms ease;
        }
        .chat-trigger:hover { border-color: color-mix(in oklab, var(--color-accent) 60%, transparent); transform: translateY(-1px); }
        .trigger-label { font-size: 0.9rem; }

        .chat-close {
          position: absolute; top: 8px; right: 8px;
          height: 28px; width: 28px; border-radius: 8px;
          display: grid; place-items: center;
          border: 1px solid var(--color-border);
          cursor: pointer;
          transition: border-color 150ms ease, background 150ms ease;
        }
        .chat-close:hover { border-color: color-mix(in oklab, var(--color-accent) 60%, transparent); }

        /* body */
        .chat-body {
          display: grid; grid-template-rows: 1fr auto;
          height: calc(100% - 44px);
          opacity: 0; pointer-events: none;
          transition: opacity 160ms ease 80ms;
        }
        .open .chat-body { opacity: 1; pointer-events: auto; }

        .chat-scroll {
          overflow-y: auto; padding: 12px;
          display: flex; flex-direction: column; gap: 10px;
          scroll-behavior: smooth;
        }
        .row { display: flex; }
        .row.left { justify-content: flex-start; }
        .row.right { justify-content: flex-end; }
        .bubble {
          max-width: 80%;
          border: 1px solid var(--color-border);
          border-radius: 18px;
          padding: 8px 12px;
          line-height: 1.5;
          font-size: 0.92rem;
          word-break: break-word;
        }
        .assistant { background: var(--color-card); }
        .user { background: transparent; border-color: color-mix(in oklab, var(--color-accent) 40%, transparent); }

        .chat-input {
          display: flex; gap: 8px; align-items: center;
          border-top: 1px solid var(--color-border);
          padding: 8px;
          background: inherit;
          backdrop-filter: inherit;
          -webkit-backdrop-filter: inherit;
        }
        .chat-input input {
          flex: 1; background: transparent; color: currentColor;
          border: 1px solid var(--color-border);
          border-radius: 10px; padding: 10px 12px; outline: none;
          transition: border-color 150ms ease;
        }
        .chat-input input:focus { border-color: color-mix(in oklab, var(--color-accent) 60%, transparent); }

        .send {
          height: 36px; width: 36px; display: grid; place-items: center;
          border: 1px solid var(--color-border); border-radius: 10px;
          background: transparent; color: currentColor;
          transition: border-color 150ms ease, transform 100ms ease;
        }
        .send:hover { border-color: color-mix(in oklab, var(--color-accent) 60%, transparent); transform: translateY(-1px); }
        .send:disabled { opacity: 0.5; transform: none; }

        /* passive float (closed) */
        @keyframes floaty { 0%,100% { transform: translate(-50%, 0); } 50% { transform: translate(-50%, -6px); } }
        .chat-shell.closed { animation: floaty 4.2s ease-in-out infinite; }

        /* typing dots */
        .dot { width: 6px; height: 6px; border-radius: 9999px; background: currentColor; opacity: .5; display: inline-block; animation: pulse 900ms infinite ease-in-out; }
        @keyframes pulse { 0%,100% { transform: translateY(0); opacity: .5; } 50% { transform: translateY(-3px); opacity: 1; } }
      `}</style>
    </>
  );
}
