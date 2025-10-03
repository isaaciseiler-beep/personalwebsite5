"use client";

import { useEffect, useRef, useState } from "react";

type Msg = { role: "user" | "assistant"; content: string };

export default function ExperienceChatFab() {
  const [open, setOpen] = useState(false);       // panel state
  const [closing, setClosing] = useState(false); // drive reverse animation
  const [busy, setBusy] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const shellRef = useRef<HTMLDivElement | null>(null);
  const streamTimer = useRef<number | null>(null);

  const DUR = 360; // ms, keep in sync with CSS transitions

  // Outside click → close (with reverse morph)
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!(open || closing) || !shellRef.current) return;
      if (!shellRef.current.contains(e.target as Node)) handleClose();
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open, closing]);

  // Lock scroll while open OR closing (so it doesn't jump during reverse)
  useEffect(() => {
    const lock = open || closing;
    if (!lock) return;
    const prevHtml = document.documentElement.style.overflow;
    const prevBody = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prevHtml;
      document.body.style.overflow = prevBody;
    };
  }, [open, closing]);

  function handleOpen() {
    setClosing(false);
    setOpen(true);
  }

  function handleClose() {
    // stop streaming if any
    if (streamTimer.current) {
      window.clearInterval(streamTimer.current);
      streamTimer.current = null;
    }
    // trigger reverse morph
    setClosing(true);
    setOpen(false);
    // after animation finishes, clear closing
    window.setTimeout(() => setClosing(false), DUR + 40);
  }

  async function send() {
    if (!input.trim() || busy) return;
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
      const reply: string = j?.reply || "…";

      // streaming / typewriter effect
      let i = 0;
      setMsgs((m) => [...m, { role: "assistant", content: "" }]);
      streamTimer.current = window.setInterval(() => {
        i += Math.max(1, Math.floor(reply.length / 120));
        const slice = reply.slice(0, i);
        setMsgs((m) => {
          const copy = m.slice();
          const last = copy[copy.length - 1];
          if (last && last.role === "assistant") {
            copy[copy.length - 1] = { ...last, content: slice };
          }
          return copy;
        });
        if (i >= reply.length) {
          if (streamTimer.current) {
            window.clearInterval(streamTimer.current);
            streamTimer.current = null;
          }
          setBusy(false);
        }
      }, 15);
    } catch {
      setMsgs((m) => [...m, { role: "assistant", content: "sorry — I couldn’t respond just now." }]);
      setBusy(false);
    }
  }

  return (
    <>
      {/* blurred/dim backdrop (stays while closing for smooth reverse) */}
      {(open || closing) && (
        <button
          aria-label="close chat"
          className={`backdrop ${open ? "visible" : closing ? "closing" : ""}`}
          onClick={handleClose}
        />
      )}

      {/* morphing shell */}
      <div
        ref={shellRef}
        className={`chat-shell ${open ? "open" : ""} ${closing ? "closing" : ""}`}
        aria-live="polite"
      >
        {/* floating pill (white). Becomes centered black X when open */}
        <button
          className={`pill ${open ? "to-x" : ""}`}
          aria-label={open ? "close chat" : "Ask ChatGPT"}
          onClick={() => (open ? handleClose() : handleOpen())}
        >
          <span className="pill-label">Ask ChatGPT</span>
          <span className="pill-x" aria-hidden>
            <svg
              viewBox="0 0 24 24"
              width="14"
              height="14"
              stroke="#0b0b0c"
              strokeWidth="1.8"
              fill="none"
            >
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </span>
        </button>

        {/* panel (dark, blurred) — emerges from the pill; reverses back on close */}
        <div className="panel" aria-hidden={!open && !closing}>
          <div className="panel-header" /> {/* keep chat below X area */}

          <div className="scroll">
            {msgs.map((m, i) => (
              <div key={i} className={`row ${m.role === "assistant" ? "left" : "right"}`}>
                <div className={`bubble ${m.role}`}>{m.content}</div>
              </div>
            ))}
            {busy && msgs.length === 0 && (
              <div className="row left">
                <div className="bubble assistant skeleton">
                  <div className="sk sk1" />
                  <div className="sk sk2" />
                  <div className="sk sk3" />
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
            <button className="send" onClick={send} disabled={busy} aria-label="Send" title="Send">
              {/* up arrow */}
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="1.8" fill="none">
                <path d="M12 5v14M12 5l6 6M12 5L6 11" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* Backdrop with smooth fade both ways */
        .backdrop {
          position: fixed;
          inset: 0;
          z-index: 50;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          background: linear-gradient(to bottom, rgba(0,0,0,.14), rgba(0,0,0,.22));
          opacity: 0;
          transition: opacity ${DUR}ms cubic-bezier(.2,.7,0,1);
        }
        .backdrop.visible { opacity: 1; }
        .backdrop.closing { opacity: 0; }

        /* Shell placement & morph */
        .chat-shell {
          position: fixed;
          left: 50%;
          bottom: 16px;
          transform: translateX(-50%);
          z-index: 60;
          transition:
            width ${DUR}ms cubic-bezier(.2,.7,0,1),
            height ${DUR}ms cubic-bezier(.2,.7,0,1),
            border-radius ${DUR}ms cubic-bezier(.2,.7,0,1),
            transform 320ms cubic-bezier(.2,.7,0,1),
            opacity 200ms ease;
        }
        .chat-shell:not(.open) { width: auto; height: 48px; }
        .chat-shell.open {
          width: min(92vw, 540px);
          height: min(52vh, 400px);
          border-radius: 16px;
        }

        /* Floating white pill (one line). Smooth reverse on close. */
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
            transform ${DUR}ms cubic-bezier(.2,.7,0,1),
            width ${DUR}ms cubic-bezier(.2,.7,0,1),
            height ${DUR}ms cubic-bezier(.2,.7,0,1),
            border-radius ${DUR}ms cubic-bezier(.2,.7,0,1),
            opacity 200ms ease;
          animation: floaty 4.2s ease-in-out infinite;
          z-index: 70;
          display: inline-flex; align-items: center; justify-content: center; gap: 8px;
        }
        .pill:hover { transform: translate(-50%, -1px); }
        .chat-shell.open .pill {
          top: 10px; right: 10px; left: auto; bottom: auto;
          height: 30px; width: 30px; padding: 0;
          border-radius: 8px;
          transform: translate(0, 0);
          animation: none;
        }
        .pill-label { display: inline-block; }
        .pill-x { display: none; line-height: 0; }
        .chat-shell.open .pill-label { display: none; }
        .chat-shell.open .pill-x { display: grid; place-items: center; }

        /* Panel (dark, blurred). Morphs in and out. */
        .panel {
          position: absolute; inset: 0;
          border-radius: 16px;
          border: 1px solid var(--color-border);
          background: rgba(0,0,0,0.82);
          color: #e7e7ea;
          backdrop-filter: blur(14px) saturate(160%);
          -webkit-backdrop-filter: blur(14px) saturate(160%);
          overflow: hidden;
          opacity: 0; pointer-events: none;
          transform-origin: bottom center;
          transform: translateY(6px) scale(0.98);
          transition:
            opacity ${DUR - 120}ms ease,
            transform ${DUR}ms cubic-bezier(.2,.7,0,1);
        }
        .chat-shell.open .panel,
        .chat-shell.closing .panel {
          opacity: 1; pointer-events: auto; transform: translateY(0) scale(1);
        }
        .chat-shell.closing .panel { opacity: 0; transform: translateY(6px) scale(0.98); }

        /* Header spacer (chat starts below X) */
        .panel-header { height: 48px; }

        .scroll {
          height: calc(100% - 48px - 56px);
          overflow-y: auto;
          padding: 10px 12px;
          display: flex; flex-direction: column; gap: 10px;
          scroll-behavior: smooth;
        }
        .row { display: flex; }
        .row.left { justify-content: flex-start; }
        .row.right { justify-content: flex-end; }

        .bubble {
          max-width: 80%;
          border-radius: 18px;
          padding: 10px 14px;
          font-size: 0.94rem; line-height: 1.5;
          border: 1px solid var(--color-border);
          color: #e7e7ea;
        }
        .assistant { background: var(--color-card); }
        .user { background: transparent; border-color: var(--color-border); }

        /* Skeleton loading & shimmer */
        .skeleton .sk {
          height: 10px; border-radius: 9999px;
          background: linear-gradient(90deg, rgba(255,255,255,.08), rgba(255,255,255,.18), rgba(255,255,255,.08));
          background-size: 200% 100%;
          animation: shimmer 1200ms linear infinite;
          margin: 6px 0;
        }
        .skeleton .sk1 { width: 72%; }
        .skeleton .sk2 { width: 92%; }
        .skeleton .sk3 { width: 56%; }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

        .input {
          position: absolute; left: 0; right: 0; bottom: 0;
          display: flex; gap: 8px; align-items: center;
          border-top: 1px solid var(--color-border);
          padding: 8px;
          background: rgba(0,0,0,0.82);
          backdrop-filter: blur(14px) saturate(160%);
          -webkit-backdrop-filter: blur(14px) saturate(160%);
        }
        .input input {
          flex: 1; height: 36px; background: transparent;
          color: #e7e7ea; border: 1px solid var(--color-border);
          border-radius: 10px; padding: 0 12px; outline: none;
          transition: border-color 150ms ease;
        }
        .input input:focus { border-color: var(--color-border); }
        .send {
          height: 36px; width: 36px; border: 1px solid var(--color-border);
          border-radius: 10px; background: transparent; color: #e7e7ea;
          display: grid; place-items: center;
          transition: transform 100ms ease, border-color 150ms ease;
        }
        .send:hover { transform: translateY(-1px); }
        .send:disabled { opacity: .5; transform: none; }

        /* float animation when closed */
        @keyframes floaty {
          0%, 100% { transform: translate(-50%, 0); }
          50% { transform: translate(-50%, -6px); }
        }
      `}</style>
    </>
  );
}
