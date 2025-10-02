// app/api/experience-chat/route.ts — FULL FILE
import { NextResponse } from "next/server";
import timeline from "@/data/timeline.json";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const input = (timeline as Array<{ dates: string; role: string; org?: string; summary?: string }>)
      .map((e) => `${e.dates} — ${e.role}${e.org ? `, ${e.org}` : ""}${e.summary ? `: ${e.summary}` : ""}`)
      .join("\n");

    const sys =
      "You are an assistant that answers questions about the user's professional experience. Base answers ONLY on the provided timeline text. Be concise, specific, and recruiter-friendly. If asked for something not present, say you don’t have that detail.";

    const body = {
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: sys },
        { role: "user", content: `Timeline:\n${input}\n\nQuestion: ${message}` }
      ],
      temperature: 0.2
    };

    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    if (!resp.ok) return NextResponse.json({ reply: "error" }, { status: 500 });
    const json = await resp.json();
    const reply = json?.choices?.[0]?.message?.content ?? "…";
    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json({ reply: "error" }, { status: 500 });
  }
}
