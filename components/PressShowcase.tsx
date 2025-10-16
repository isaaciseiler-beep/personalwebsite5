// components/PressShowcase.tsx — FULL REPLACEMENT
"use client";

import Image from "next/image";
import CardMotion from "@/components/CardMotion";

export type Pill = { href: string; label: string };

type PressItem = {
  title: string;
  href: string;
  source?: string;
  image?: string;
};

const pressItems: PressItem[] = [
  { title: "Featured in launch of ChatGPT Pulse", href: "https://openai.com/index/introducing-chatgpt-pulse/", source: "OpenAI", image: `${process.env.NEXT_PUBLIC_CDN_BASE ?? ""}/press/pulse.jpg` },
  { title: "OpenAI Instagram spotlight on ChatGPT Study Mode", href: "https://www.instagram.com/chatgpt/reel/DNyG5VvXEZM/", source: "OpenAI", image: `${process.env.NEXT_PUBLIC_CDN_BASE ?? ""}/press/study-mode.jpg` },
  { title: "WashU Rhodes Scholar finalist", href: "https://source.wustl.edu/2024/11/seniors-darden-seiler-were-rhodes-scholars-finalists/", source: "Rhodes Trust", image: `${process.env.NEXT_PUBLIC_CDN_BASE ?? ""}/press/rhodes.jpg` },
  { title: "Co-published Book on Education Uses of ChatGPT", href: "https://chatgpt.com/100chats-project", source: "OpenAI", image: `${process.env.NEXT_PUBLIC_CDN_BASE ?? ""}/press/100chats.jpg` },
  { title: "Awarded 2024 Michigan Truman Scholarship", href: "https://artsci.washu.edu/ampersand/junior-seiler-awarded-truman-scholarship", source: "Washington University", image: `${process.env.NEXT_PUBLIC_CDN_BASE ?? ""}/press/truman.jpg` },
  { title: "Awarded 2025 Fulbright to Taiwan", href: "https://source.wustl.edu/2025/06/several-alumni-earn-fulbright-awards/", source: "Washington University", image: `${process.env.NEXT_PUBLIC_CDN_BASE ?? ""}/press/fulbright.jpg` },
  { title: "University profile", href: "https://artsci.wustl.edu/ampersand/isaac-seiler-setting-his-sights-high", source: "Washington University", image: `${process.env.NEXT_PUBLIC_CDN_BASE ?? ""}/press/wustl.jpg` },
];

/** Canonical pills export (label + href) */
export const PILLS: Pill[] = pressItems.map(({ href, title }) => ({ href, label: title }));

export default function PressShowcase() {
  return (
    <section className="mx-auto mt-4 max-w-6xl px-4">
      <h2 className="mb-4 text-xl font-normal text-neutral-100 md:text-2xl">in the news</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {pressItems.map((item, i) => (
          <CardMotion key={i} maxTiltDeg={5} scale={1.02} className="rounded-2xl">
            <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="card-focusable group relative flex min-h-[170px] items-stretch overflow-hidden rounded-2xl border border-neutral-800/70 bg-neutral-950/80 text-left text-neutral-100 shadow-[0_0_20px_rgba(0,0,0,0.25)] backdrop-blur-md transition-transform duration-300"
            >
              <div className="flex min-w-0 flex-[0_0_67%] flex-col justify-center gap-1 p-5">
                <h3 className="text-[1.05rem] leading-snug tracking-tight">
                  <span className="bg-[linear-gradient(white,white)] bg-[length:0%_2px] bg-left-bottom bg-no-repeat transition-[background-size,transform] duration-300 group-hover:bg-[length:100%_2px]">
                    {item.title}
                  </span>
                </h3>
                {item.source && <p className="text-sm text-neutral-400">{item.source}</p>}
              </div>
              <div className="pointer-events-none relative flex-[0_0_33%] select-none">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    sizes="(min-width:1024px) 33vw, (min-width:640px) 33vw, 100vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-neutral-800" />
                )}
              </div>
            </a>
          </CardMotion>
        ))}
      </div>
    </section>
  );
}
