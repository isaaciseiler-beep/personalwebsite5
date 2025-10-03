// components/ExperienceChatFab.tsx — FULL REPLACEMENT
// Bottom-center “Ask ChatGPT” pill that morphs fluidly into a compact, dark,
// blurred chat panel. No shadows. Button becomes the X and back. Super smooth.

"use client";

import { useEffect, useRef, useState } from "react";

type Msg = { role: "user" | "assistant"; content: string };

export default function ExperienceChatFab() {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const shellRef = useRef<HTMLDivElement | null>(null);

  // close on outside click
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
        body: JSON.stringify({ message: text })
      });
      const j = await r.json();
      const reply = j?.reply || "…";
      setMsgs((m) => [...m, { role: "assistant", content: reply }]);
    } catch {
      setMsgs((m) => [...m, { role: "assistant", content: "sorry — I couldn’t respond just now." }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      {/* backdrop: soft blur/dim behind panel */}
      {open && (
        <button
          aria-label="close chat"
          className="fixed inset-0 z-40 cursor-default"
          onClick={() => setOpen(false)}
          style={{
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            background:
              "linear-gradient(to bottom, rgba(0,0,0,.15), rgba(0,0,0,.22))"
          }}
        />
      )}

      {/* morphing shell (button → panel) */}
      <div
        ref={shellRef}
        className={`chat-shell ${open ? "open" : "closed"}`}
        aria-live="polite"
      >
        {/* the white pill that becomes the X */}
        <button
          className={`pill ${open ? "to-x" : ""}`}
          aria-label={open ? "close chat" : "Ask ChatGPT about this page"}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="pill-label">Ask ChatGPT</span>
          <span className="pill-x" aria-hidden>
            <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="1.8" fill="none">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </span>
        </button>

        {/* chat body (emerges from the pill) */}
        <div className="panel" aria-hidden={!open}>
          <div className="scroll">
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

          <div className="input">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => (e.key === "Enter" ? send() : null)}
              placeholder="ask about my experience…"
              aria-label="Message"
            />
            <button className="send" onClick={send} disabled={busy} aria-label="Send">
              {/* up arrow */}
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="1.8" fill="none">
                <path d="M12 5v14M12 5l6 6M12 5L6 11" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* container at bottom center */
        .chat-shell {
          position: fixed;
          left: 50%;
          bottom: 16px;
          transform: translateX(-50%) translateY(0);
          z-index: 50;
          width: auto;
          border-radius: 9999px;
          /* smooth, watery expansion */
          transition:
            width 320ms cubic-bezier(.2, .7, 0, 1),
            height 320ms cubic-bezier(.2, .7, 0, 1),
            border-radius 320ms cubic-bezier(.2, .7, 0, 1),
            transform 280ms cubic-bezier(.2, .7, 0, 1),
            opacity 200ms ease;
        }
        .chat-shell.closed { width: auto; height: 48px; }
        .chat-shell.open {
          width: min(92vw, 560px);
          height: min(56vh, 440px); /* shorter */
          border-radius: 16px;
        }

        /* THEME-AWARE: dark popup, white button (dark mode) / black popup, white button (light mode) */
        .panel,
        .input {
          background: rgba(0,0,0,0.78);
          color: #e7e7ea;
          backdrop-filter: blur(14px) saturate(160%);
          -webkit-backdrop-filter: blur(14px) saturate(160%);
        }
        :global([data-theme="light"]) .panel,
        :global([data-theme="light"]) .input {
          background: rgba(0,0,0,0.82);
          color: #0b0b0c;
        }

        /* pill (white) that morphs into the close button location */
        .pill {
          position: absolute;
          left: 50%;
          bottom: 0;
          transform: translate(-50%, 0);
          height: 48px;
          padding: 0 18px;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          border-radius: 9999px;
          border: 1px solid var(--color-border);
          background: #ffffff;           /* keep white */
          color: #0b0b0c;
          cursor: pointer;
          transition:
            transform 280ms cubic-bezier(.2, .7, 0, 1),
            border-color 160ms ease,
            background 160ms ease,
            color 160ms ease,
            opacity 160ms ease;
          /* remove shadow per request */
          box-shadow: none;
        }
        .pill:hover { transform: translate(-50%, -1px); }

        /* When open, move pill to panel’s top-right and turn into the X */
        .open .pill {
          right: 12px;
          left: auto;
          bottom: auto;
          top: 10px;
          transform: translate(0, 0);
          height: 30px;
          width: 30px;
          padding: 0;
          border-radius: 8px;
          display: grid;
          place-items: center;
        }
        .pill-label { display: inline-block; }
        .pill-x { display: none; }
        .open .pill-label { display: none; }
        .open .pill-x { display: inline-block; }

        /* panel that emerges from the pill */
        .panel {
          position: absolute;
          inset: 0;
          border-radius: 16px;
          border: 1px solid var(--color-border);
          overflow: hidden;
          opacity: 0;
          pointer-events: none;
          transform-origin: bottom center;
          transform: translateY(6px) scale(0.98);
          transition:
            opacity 220ms ease,
            transform 320ms cubic-bezier(.2, .7, 0, 1);
        }
        .open .panel {
          opacity: 1;
          pointer-events: auto;
          transform: translateY(0) scale(1);
        }

        .scroll {
          height: calc(100% - 56px);
          overflow-y: auto;
          padding: 10px 12px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .row { display: flex; }
        .row.left { justify-content: flex-start; }
        .row.right { justify-content: flex-end; }

        .bubble {
          max-width: 80%;
          border-radius: 18px;
          padding: 8px 12px;
          line-height: 1.5;
          font-size: 0.92rem;
          word-break: break-word;
          border: 1px solid var(--color-border);
        }
        .assistant { background: var(--color-card); }
        .user { background: transparent; border-color: color-mix(in oklab, var(--color-accent) 42%, transparent); }

        .input {
          position: absolute;
          left: 0; right: 0; bottom: 0;
          display: flex; gap: 8px; align-items: center;
          border-top: 1px solid var(--color-border);
          padding: 8px;
        }
        .input input {
          flex: 1;
          background: transparent;
          color: inherit;
          border: 1px solid var(--color-border);
          border-radius: 10px;
          padding: 10px 12px;
          outline: none;
          transition: border-color 150ms ease;
        }
        .input input:focus { border-color: color-mix(in oklab, var(--color-accent) 60%, transparent); }

        .send {
          height: 36px; width: 36px;
          display: grid; place-items: center;
          border: 1px solid var(--color-border);
          border-radius: 10px;
          background: transparent;
          color: inherit;
          transition: border-color 150ms ease, transform 100ms ease;
        }
        .send:hover { transform: translateY(-1px); border-color: color-mix(in oklab, var(--color-accent) 60%, transparent); }
        .send:disabled { opacity: .5; transform: none; }

        /* watery soft float while closed; no shadow */
        @keyframes floaty {
          0%, 100% { transform: translate(-50%, 0); }
          50% { transform: translate(-50%, -6px); }
        }
        .chat-shell.closed { animation: floaty 4.2s ease-in-out infinite; }

        /* typing dots */
        .dot {
          width: 6px; height: 6px; border-radius: 9999px;
          background: currentColor; opacity: .5; display: inline-block;
          animation: pulse 900ms infinite ease-in-out;
        }
        @keyframes pulse {
          0%,100% { transform: translateY(0); opacity: .5; }
          50%     { transform: translateY(-3px); opacity: 1; }
        }
      `}</style>
    </>
  );
}
