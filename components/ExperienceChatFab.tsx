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
      {/* morphing shell (button → panel) */}
      <div ref={shellRef} className={`chat-shell ${open ? "open" : "closed"}`}>
        {/* floating pill (always animates while closed) */}
        <button
          className={`pill ${open ? "to-x" : ""}`}
          aria-label={open ? "close chat" : "Ask ChatGPT"}
          onClick={() => setOpen((v) => !v)}
        >
          {/* keep on one line */}
          <span className="pill-label">Ask ChatGPT</span>
          {/* black X icon */}
          <span className="pill-x" aria-hidden>
            <svg viewBox="0 0 24 24" width="14" height="14" stroke="#0b0b0c" strokeWidth="1.8" fill="none">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </span>
        </button>

        {/* dark, blurred panel that emerges from the pill */}
        <div className="panel" aria-hidden={!open}>
          {/* header space so chat starts below X */}
          <div className="panel-header" />

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
            {/* input height matches arrow button */}
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => (e.key === "Enter" ? send() : null)}
              placeholder="ask about my experience…"
              aria-label="Message"
            />
            <button className="send" onClick={send} disabled={busy} aria-label="Send">
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
          transform: translateX(-50%);
          z-index: 60;
          transition:
            width 360ms cubic-bezier(.2,.7,0,1),
            height 360ms cubic-bezier(.2,.7,0,1),
            border-radius 360ms cubic-bezier(.2,.7,0,1),
            transform 320ms cubic-bezier(.2,.7,0,1),
            opacity 200ms ease;
        }
        .chat-shell.closed { width: auto; height: 48px; }
        .chat-shell.open {
          width: min(92vw, 540px);
          height: min(52vh, 400px); /* shorter popup */
          border-radius: 16px;
        }

        /* white pill with active float */
        .pill {
          white-space: nowrap;
          background: #ffffff;
          color: #0b0b0c;
          border-radius: 9999px;
          padding: 10px 20px;
          border: 1px solid var(--color-border);
          font-size: 0.9rem;
          position: absolute;
          left: 50%;
          bottom: 0;
          transform: translate(-50%, 0);
          transition:
            transform 320ms cubic-bezier(.2,.7,0,1),
            border-color 160ms ease,
            background 160ms ease,
            color 160ms ease,
            width 320ms cubic-bezier(.2,.7,0,1),
            height 320ms cubic-bezier(.2,.7,0,1);
          animation: floaty 4.2s ease-in-out infinite;
          z-index: 65; /* above panel */
        }
        .pill:hover { transform: translate(-50%, -1px); }

        /* morph to X in panel header */
        .open .pill {
          top: 10px; right: 10px; left: auto; bottom: auto;
          height: 30px; width: 30px; padding: 0;
          border-radius: 8px;
          transform: translate(0, 0);
          animation: none;
        }
        .pill-label { display: inline-block; }
        .pill-x { display: none; }
        .open .pill-label { display: none; }
        .open .pill-x { display: inline-block; }

        /* dark blurred panel; no blue accents anywhere */
        .panel {
          position: absolute;
          inset: 0;
          border-radius: 16px;
          border: 1px solid var(--color-border);
          background: rgba(0,0,0,0.82);
          color: #e7e7ea;
          backdrop-filter: blur(14px) saturate(160%);
          -webkit-backdrop-filter: blur(14px) saturate(160%);
          overflow: hidden;
          opacity: 0;
          pointer-events: none;
          transform-origin: bottom center;
          transform: translateY(6px) scale(0.98);
          transition:
            opacity 240ms ease,
            transform 360ms cubic-bezier(.2,.7,0,1);
        }
        .open .panel { opacity: 1; pointer-events: auto; transform: translateY(0) scale(1); }

        /* header spacer (chat starts below X) */
        .panel-header { height: 48px; } /* space for the X */

        .scroll {
          height: calc(100% - 48px - 56px); /* minus header + input */
          overflow-y: auto;
          padding: 10px 12px;
          display: flex; flex-direction: column; gap: 10px;
        }
        .row { display: flex; }
        .row.left { justify-content: flex-start; }
        .row.right { justify-content: flex-end; }

        .bubble {
          max-width: 80%;
          border-radius: 18px;
          padding: 10px 14px;
          font-size: 0.94rem;
          line-height: 1.5;
          border: 1px solid var(--color-border);
          color: #e7e7ea;
        }
        .assistant { background: var(--color-card); }
        .user { background: transparent; border-color: var(--color-border); }

        .input {
          position: absolute;
          left: 0; right: 0; bottom: 0;
          display: flex; gap: 8px; align-items: center;
          border-top: 1px solid var(--color-border);
          padding: 8px;
          background: rgba(0,0,0,0.82);
          backdrop-filter: blur(14px) saturate(160%);
          -webkit-backdrop-filter: blur(14px) saturate(160%);
        }
        .input input {
          flex: 1;
          height: 36px; /* same height as arrow */
          background: transparent;
          color: #e7e7ea;
          border: 1px solid var(--color-border);
          border-radius: 10px;
          padding: 0 12px;
          outline: none;
          transition: border-color 150ms ease;
        }
        /* neutral focus — no blue */
        .input input:focus { border-color: var(--color-border); }

        .send {
          height: 36px; width: 36px;
          border: 1px solid var(--color-border);
          border-radius: 10px;
          background: transparent; color: #e7e7ea;
          display: grid; place-items: center;
          transition: transform 100ms ease, border-color 150ms ease;
        }
        .send:hover { transform: translateY(-1px); }
        .send:disabled { opacity: .5; transform: none; }

        /* passive float (closed) */
        @keyframes floaty {
          0%, 100% { transform: translate(-50%, 0); }
          50%     { transform: translate(-50%, -6px); }
        }
      `}</style>
    </>
  );
}
