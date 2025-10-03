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
      <div ref={shellRef} className={`chat-shell ${open ? "open" : "closed"}`}>
        <button
          className={`pill ${open ? "to-x" : ""}`}
          aria-label={open ? "close chat" : "Ask ChatGPT"}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="pill-label">Ask ChatGPT</span>
          <span className="pill-x" aria-hidden>
            <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="1.8" fill="none">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </span>
        </button>

        {/* chat panel */}
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
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="1.8" fill="none">
                <path d="M12 5v14M12 5l6 6M12 5L6 11" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .chat-shell {
          position: fixed;
          left: 50%;
          bottom: 16px;
          transform: translateX(-50%);
          z-index: 60;
          transition: all 400ms cubic-bezier(.2, .7, 0, 1);
        }

        .pill {
          white-space: nowrap;
          background: #fff;
          color: #0b0b0c;
          border-radius: 9999px;
          padding: 10px 20px;
          border: 1px solid #ccc;
          font-size: 0.9rem;
          transition: all 300ms ease;
          position: relative;
          z-index: 65; /* stays on top */
        }

        .pill-label { display: inline; }
        .pill-x { display: none; }

        .open .pill {
          position: absolute;
          top: 10px; right: 10px;
          height: 28px; width: 28px;
          padding: 0;
          border-radius: 8px;
          display: grid; place-items: center;
        }
        .open .pill-label { display: none; }
        .open .pill-x { display: inline-block; }

        .panel {
          background: rgba(0,0,0,0.82);
          backdrop-filter: blur(14px) saturate(160%);
          -webkit-backdrop-filter: blur(14px) saturate(160%);
          border-radius: 16px;
          border: 1px solid #333;
          height: 0;
          width: 0;
          opacity: 0;
          overflow: hidden;
          transition: all 420ms cubic-bezier(.2, .7, 0, 1);
        }
        .open .panel {
          width: min(92vw, 540px);
          height: min(56vh, 420px);
          opacity: 1;
        }

        .scroll {
          height: calc(100% - 56px);
          overflow-y: auto;
          padding: 10px 12px;
          display: flex; flex-direction: column; gap: 10px;
        }
        .row { display: flex; }
        .left { justify-content: flex-start; }
        .right { justify-content: flex-end; }

        .bubble {
          max-width: 80%;
          border-radius: 18px;
          padding: 8px 12px;
          font-size: 0.92rem;
          border: 1px solid #444;
          color: #e7e7ea;
        }
        .assistant { background: #222; }
        .user { background: transparent; border-color: #0ea5e9; }

        .input {
          display: flex; gap: 8px; align-items: center;
          border-top: 1px solid #333;
          padding: 8px;
        }
        .input input {
          flex: 1;
          background: transparent;
          border: 1px solid #444;
          border-radius: 10px;
          padding: 10px 12px;
          color: #e7e7ea;
        }
        .send {
          height: 36px; width: 36px;
          border: 1px solid #444;
          border-radius: 10px;
          display: grid; place-items: center;
          background: transparent;
          color: #e7e7ea;
        }

        .dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #e7e7ea;
          animation: pulse 900ms infinite ease-in-out;
          display: inline-block; opacity: 0.5;
        }
        @keyframes pulse {
          0%,100% { transform: translateY(0); opacity: .5; }
          50% { transform: translateY(-3px); opacity: 1; }
        }
      `}</style>
    </>
  );
}
