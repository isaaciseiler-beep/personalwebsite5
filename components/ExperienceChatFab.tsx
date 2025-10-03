"use client";

import { useEffect, useRef, useState } from "react";

type Msg = { role: "user" | "assistant"; content: string };

export default function ExperienceChatFab() {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const shellRef = useRef<HTMLDivElement | null>(null);
  const streamTimer = useRef<number | null>(null);

  // Outside click closes
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!open || !shellRef.current) return;
      if (!shellRef.current.contains(e.target as Node)) handleClose();
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Scroll lock when open
  useEffect(() => {
    if (!open) return;
    const prev = document.documentElement.style.overflow;
    const prevBody = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prev;
      document.body.style.overflow = prevBody;
    };
  }, [open]);

  function handleClose() {
    setOpen(false);
    if (streamTimer.current) {
      window.clearInterval(streamTimer.current);
      streamTimer.current = null;
    }
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

      // Streaming / typewriter effect
      let i = 0;
      setMsgs((m) => [...m, { role: "assistant", content: "" }]);
      streamTimer.current = window.setInterval(() => {
        i += Math.max(1, Math.floor(reply.length / 120)); // faster on long texts
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
      {/* Blurred/dim backdrop (click to close) */}
      {open && (
        <button
          aria-label="close chat"
          className="fixed inset-0 z-50 cursor-default transition-opacity duration-200"
          onClick={handleClose}
          style={{
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            background: "linear-gradient(to bottom, rgba(0,0,0,.14), rgba(0,0,0,.22))"
          }}
        />
      )}

      {/* Morphing shell (bottom center) */}
      <div ref={shellRef} className={`chat-shell ${open ? "open" : "closed"}`}>

        {/* White pill → morphs to black X (centered) */}
        <button
          className={`pill ${open ? "to-x" : ""}`}
          aria-label={open ? "close chat" : "Ask ChatGPT"}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="pill-label">Ask ChatGPT</span>
          <span className="pill-x" aria-hidden>
            <svg viewBox="0 0 24 24" width="14" height="14" stroke="#0b0b0c" strokeWidth="1.8" fill="none">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </span>
        </button>

        {/* Panel (compact, dark, blurred) — emerges from pill, below the X area */}
        <div className="panel" aria-hidden={!open}>
          <div className="panel-header" /> {/* spacer so chat starts below close button */}

          <div className="scroll">
            {msgs.map((m, i) => (
              <div key={i} className={`row ${m.role === "assistant" ? "left" : "right"}`}>
                <div className={`bubble ${m.role}`}>{m.content}</div>
              </div>
            ))}
            {busy && msgs.length === 0 && (
              <div className="row left">
                <div className="bubble assistant skeleton">
                  <div className="sk sk1" /><div className="sk sk2" /><div className="sk sk3" />
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
        /* --- Shell placement & liquid morph --- */
        .chat-shell {
          position: fixed;
          left: 50%;
          bottom: 16px;
          transform: translateX(-50%);
          z-index: 60; /* panel above backdrop (50), pill above panel content via local z */
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
          height: min(52vh, 400px);
          border-radius: 16px;
        }

        /* --- Floating white pill --- */
        .pill {
          white-space: nowrap;  /* keep on one line */
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
            width 320ms cubic-bezier(.2,.7,0,1),
            height 320ms cubic-bezier(.2,.7,0,1),
            border-radius 320ms cubic-bezier(.2,.7,0,1),
            opacity 200ms ease;
          animation: floaty 4.2s ease-in-out infinite;
          z-index: 70; /* on top so X is never behind */
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .pill:hover { transform: translate(-50%, -1px); }

        /* morph to perfectly centered X button */
        .open .pill {
          top: 10px; right: 10px; left: auto; bottom: auto;
          height: 30px; width: 30px; padding: 0;
          border-radius: 8px;
          transform: translate(0, 0);
          animation: none;
        }
        .pill-label { display: inline-block; }
        .pill-x { display: none; line-height: 0; }
        .open .pill-label { display: none; }
        .open .pill-x { display: grid; place-items: center; }

        /* --- Panel (dark, blurred, compact) --- */
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

        /* Chat begins below X area */
        .panel-header { height: 48px; }

        .scroll {
          height: calc(100% - 48px - 56px); /* header + input */
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
          font-size: 0.94rem;
          line-height: 1.5;
          border: 1px solid var(--color-border);
          color: #e7e7ea;
        }
        .assistant { background: var(--color-card); }
        .user { background: transparent; border-color: var(--color-border); }

        /* skeleton loading (when first busy) */
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
        @keyframes shimmer {
          0% { background-position: 0% 0; }
          100% { background-position: -200% 0; }
        }

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
          flex: 1;
          height: 36px; /* match arrow button */
          background: transparent;
          color: #e7e7ea;
          border: 1px solid var(--color-border);
          border-radius: 10px;
          padding: 0 12px;
          outline: none;
          transition: border-color 150ms ease;
        }
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

        /* Smooth floating when closed */
        @keyframes floaty { 0%,100% { transform: translate(-50%, 0); } 50% { transform: translate(-50%, -6px); } }
        .chat-shell.closed .pill { animation: floaty 4.2s ease-in-out infinite; }
      `}</style>
    </>
  );
}
