import { NextResponse } from "next/server";
import timeline from "@/data/timeline.json";

export const runtime = "edge";

type TLItem = {
  dates: string;
  role: string;
  org?: string;
  summary?: string;
  href?: string | null;
  link?: string | null;
  linkText?: string | null;
};

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { reply: "OpenAI API key is not configured on the server." },
        { status: 500 }
      );
    }

    // Compact, factual context from the site only
    const input = (timeline as TLItem[])
      .map((e) =>
        [
          e.dates?.trim(),
          e.role?.trim(),
          e.org ? ` — ${e.org.trim()}` : "",
          e.summary ? ` :: ${e.summary.trim()}` : "",
        ].join("")
      )
      .join("\n");

    // System rules
    const sys = [
      "You are the on-site assistant for Isaac Seiler’s portfolio.",
      "SCOPE: Only answer questions about Isaac, his experience/education/skills, or content present on this website. If the question is outside scope, reply briefly that you only answer questions about Isaac or this site, and invite a relevant question.",
      "SOURCE OF TRUTH: Use ONLY the provided timeline text as factual grounding. Do not invent or speculate. If information is not present, say you don’t have that detail.",
      "VOICE: Speak in your own neutral voice (third person), referring to Isaac as “he.” Do not write as Isaac.",
      "STYLE: Optimistic, recruiter-friendly, concise. You may paraphrase, condense, and synthesize resume points for clarity. No hype.",
      "FORMAT: Prefer 1–3 short bullet points OR 1–2 tight sentences.",
      "STRICTNESS: If out of scope, reply: “I only answer questions about Isaac’s experience and what’s on this site.”",
    ].join("\n");

    const userContent =
      `TIMELINE (ground truth; one per line):\n${input}\n\n` +
      `QUESTION:\n${String(message ?? "").slice(0, 2000)}\n\n` +
      "RESPONSE RULES:\n" +
      "- Keep it short. Paraphrase where useful.\n" +
      "- If a detail is missing, say “I don’t have that detail here.”\n" +
      "- Out of scope → the strict refusal line above.";

    const body = {
      model: "gpt-4o-mini",
      temperature: 0.2,
      max_tokens: 220,
      messages: [
        { role: "system", content: sys },
        { role: "user", content: userContent },
      ],
    };

    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!resp.ok) {
      const details = await resp.text().catch(() => "");
      return NextResponse.json(
        { reply: `upstream error (${resp.status})${details ? ` – ${details}` : ""}` },
        { status: 500 }
      );
    }

    const json = await resp.json();
    const reply: string = json?.choices?.[0]?.message?.content ?? "I don’t have that detail here.";
    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json({ reply: "server error" }, { status: 500 });
  }
}
