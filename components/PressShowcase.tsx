"use client";

import React, { useState } from "react";

// --- MOCK DATA & TYPED COMPONENTS TO RESOLVE ERRORS ---
// NOTE: These placeholders include TypeScript types to fix the build error.
// They are designed to work in your project if copy-pasted.

// Type definition to satisfy TypeScript
type Project = {
  slug: string;
  kind: string;
  title: string;
  category?: string;
  image?: string;
  location?: string;
};

// Mock data to replace JSON imports
const projects: Project[] = [
  { slug: "project-1", kind: "project", title: "Project One", category: "Web Development", image: "https://placehold.co/600x400/1a1a1a/ffffff?text=Project+1" },
  { slug: "project-2", kind: "project", title: "Project Two", category: "AI Research", image: "https://placehold.co/600x400/1a1a1a/ffffff?text=Project+2" },
  { slug: "project-3", kind: "project", title: "Project Three", category: "Design", image: "https://placehold.co/600x400/1a1a1a/ffffff?text=Project+3" },
  { slug: "photo-08", kind: "photo", title: "Cityscape", location: "Tokyo, Japan", image: "https://placehold.co/600x400/1a1a1a/ffffff?text=Photo+1" },
  { slug: "photo-12", kind: "photo", title: "Mountains", location: "Swiss Alps", image: "https://placehold.co/600x400/1a1a1a/ffffff?text=Photo+2" },
  { slug: "photo-10", kind: "photo", title: "Ocean", location: "Malibu, CA", image: "https://placehold.co/600x400/1a1a1a/ffffff?text=Photo+3" },
];
const now = { text: "Currently exploring new creative opportunities and collaborations." };

// Properly typed dummy components
const PageTransition = ({ children }: { children: React.ReactNode }) => <>{children}</>;
const Reveal = ({ children, delay }: { children: React.ReactNode; delay?: number }) => <div>{children}</div>;
const Hero = () => (
  <header className="py-20 text-center">
    <h1 className="text-5xl font-bold">Isaac</h1>
    <p className="text-xl text-gray-400 mt-2">Designer & Researcher</p>
  </header>
);
const Card = ({ item }: { item: Project }) => (
    <div className="bg-neutral-900 rounded-lg overflow-hidden h-full group">
        <img src={item.image} alt={item.title} className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105" />
        <div className="p-4">
            <h3 className="font-semibold text-lg">{item.title}</h3>
            <p className="text-sm text-gray-400">{item.category}</p>
        </div>
    </div>
);
const PhotoCard = ({ item, onClick }: { item: Project; onClick: () => void }) => (
    <div onClick={onClick} className="bg-neutral-900 rounded-lg overflow-hidden h-full cursor-pointer group">
        <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
    </div>
);
const Lightbox = ({ open, items, index, setIndex, onClose }: { open: boolean; items: any[]; index: number; setIndex: (i: number) => void; onClose: () => void; }) => {
  if (!open) return null;
  const item = items[index];
  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="relative max-w-4xl max-h-full" onClick={e => e.stopPropagation()}>
        <img src={item.src} alt={item.alt} className="max-h-[90vh] w-auto rounded-lg" />
        <p className="text-center text-white mt-2">{item.caption}</p>
        <button onClick={onClose} className="absolute -top-4 -right-4 bg-white text-black rounded-full h-8 w-8 flex items-center justify-center font-bold">&times;</button>
      </div>
    </div>
  );
};
const EdgeProgress = () => null;
const PinnedAbout = ({ compact, lines, imageName }: { compact: boolean; lines: string[]; imageName: string; }) => (
  <div className="bg-neutral-900 p-6 rounded-lg flex items-center gap-6">
      <img src="https://placehold.co/128x128/1a1a1a/ffffff?text=IA" alt="About Isaac" className="w-24 h-24 rounded-full" />
      <div>
        {lines.map((line, i) => <p key={i} className="text-lg text-gray-300">{line}</p>)}
      </div>
  </div>
);
const NowBar = ({ text }: { text: string }) => <div className="py-4 mt-12 text-center bg-neutral-900"><p>{text}</p></div>;

const PressShowcase = () => {
  const pressItems = [
    { title: "Featured in launch of ChatGPT Pulse", org: "OpenAI" },
    { title: "OpenAI Instagram spotlight on ChatGPT Study Mode", org: "OpenAI" },
  ];
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
       {pressItems.map((item, i) => (
        <Reveal key={i}>
          <div className="bg-neutral-900 p-4 rounded-lg h-full">
            <h3 className="font-semibold text-lg">{item.title}</h3>
            <p className="text-sm text-gray-400">{item.org}</p>
          </div>
        </Reveal>
      ))}
    </div>
  );
};

const Link = ({ href, children, className, prefetch }: { href: string; children: React.ReactNode; className?: string; prefetch?: boolean; }) => <a href={href} className={className}>{children}</a>;

// --- MAIN PAGE COMPONENT ---

export default function HomePage() {
  const all = projects as Project[];
  const featuredProjects = all.filter((p) => p.kind === "project").slice(0, 3);

  const featuredPhotoSlugs = ["photo-08", "photo-12", "photo-10"];
  const photos = featuredPhotoSlugs
    .map((slug) => all.find((p) => p.slug === slug))
    .filter(Boolean) as Project[];

  const gallery = photos.map((p) => ({
    src: p.image ?? "",
    alt: p.title,
    caption: p.location || p.title,
  }));

  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);

  return (
    <PageTransition>
      <EdgeProgress />
      <Hero />

      <div className="mx-auto max-w-5xl px-4">
        <div className="space-y-6 md:space-y-8">
          {/* about */}
          <PinnedAbout
            compact
            lines={[
              "designerly research at the edge of ai and policy.",
              "shipping visual explainers and field notes.",
              "based in taipei • open to collabs.",
            ]}
            imageName="about/isaac-about-card.jpg"
          />

          {/* projects */}
          <section className="m-0 p-0">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-xl leading-none">featured projects</h2>
              <Link
                href="/work/projects"
                className="link-underline text-sm text-muted hover:text-[color:var(--color-accent)]"
                prefetch
              >
                see all
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
              {featuredProjects.map((item, i) => (
                <Reveal key={item.slug} delay={i * 0.06}>
                  <div className="h-full">
                    <Card item={item} />
                  </div>
                </Reveal>
              ))}
            </div>
          </section>

          {/* in the news — FIXED */}
          <section className="m-0 p-0">
            <div className="mb-3">
              <h2 className="text-xl leading-none">in the news</h2>
            </div>
            <PressShowcase />
          </section>

          {/* photos */}
          <section className="m-0 p-0">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-xl leading-none">featured photos</h2>
              <Link
                href="/work/photos"
                className="link-underline text-sm text-muted hover:text-[color:var(--color-accent)]"
                prefetch
              >
                see all
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
              {photos.map((item, i) => (
                <Reveal key={item.slug} delay={i * 0.06}>
                  <PhotoCard
                    item={item}
                    onClick={() => {
                      setIdx(i);
                      setOpen(true);
                    }}
                  />
                </Reveal>
              ))}
            </div>
          </section>
        </div>
      </div>

      <NowBar text={now.text ?? ""} />
      <Lightbox
        open={open}
        items={gallery}
        index={idx}
        setIndex={setIdx}
        onClose={() => setOpen(false)}
      />
    </PageTransition>
  );
}
