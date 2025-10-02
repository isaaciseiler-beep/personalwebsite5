// app/api/experience-summary/route.ts — FULL FILE
import { NextResponse } from "next/server";
import timeline from "@/data/timeline.json";

export const runtime = "edge";

export async function POST() {
  const input = (timeline as Array<{ dates: string; role: string; org?: string; summary?: string }>)
    .map((e) => `${e.dates} — ${e.role}${e.org ? `, ${e.org}` : ""}${e.summary ? `: ${e.summary}` : ""}`)
    .join("\n");

  const body = {
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "Summarize the user's professional experience in 3–5 crisp bullet points. Plain text only. Avoid fluff. Keep concrete achievements, scope, and recognitions. 600 characters max."
      },
      { role: "user", content: input }
    ],
    temperature: 0.3,
  };

  const resp = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  if (!resp.ok) {
    return NextResponse.json({ summary: null }, { status: 500 });
  }
  const json = await resp.json();
  const text = json?.choices?.[0]?.message?.content ?? "";
  return NextResponse.json({ summary: text });
}
