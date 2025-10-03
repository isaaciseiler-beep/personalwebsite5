// app/layout.tsx — FULL REPLACEMENT
import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/Nav";
import Footer from "@/components/Footer";
import RouteProgress from "@/components/RouteProgress";
import ScrollProgress from "@/components/ScrollProgress";
import ThemeScript from "@/components/ThemeScript";
import Splash from "@/components/Splash";
import projects from "@/data/projects.json";

const preloadUrls = (projects as Array<any>)
  .filter((p) => p.kind === "photo" && typeof p.image === "string")
  .slice(0, 6)
  .map((p) => p.image);

export const metadata: Metadata = {
  metadataBase: new URL("https://personalwebsite5.vercel.app"),
  title: { default: "isaac seiler — portfolio", template: "isaac seiler — %s" },
  description: "simple, modern, slightly quirky portfolio by isaac seiler.",
  openGraph: {
    title: "isaac seiler — portfolio",
    description: "simple, modern, slightly quirky portfolio.",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
    type: "website"
  },
  icons: { icon: "/favicon.svg" }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark">
      <head>
        <ThemeScript />
        <link rel="preconnect" href="https://pub-41d52824b0bb4f44898c39e1c3c63cb8.r2.dev" crossOrigin="" />
      </head>
      <body className="min-h-dvh bg-[var(--color-bg)] text-[var(--color-fg)] selection:bg-[color:var(--color-accent)]/20 selection:text-[var(--color-fg)]">
        {/* cinematic splash blocks interaction, then reveals app-root */}
        <Splash
          preloadUrls={preloadUrls}
          wordmarkDark="/isaacseiler-darkmode.png"
          wordmarkLight="/isaacseiler-lightmode.png"
          maxDurationMs={2400}
          revealTargetId="app-root"
        />

        <RouteProgress />
        <ScrollProgress />
        <Nav />

        {/* this container is blurred/hidden until Splash finishes */}
        <div id="app-root" className="app-root">
          <main id="content" className="mx-auto max-w-5xl px-4 py-10">
            {children}
          </main>
          <div className="mx-auto max-w-5xl px-4">
            <Footer />
          </div>
        </div>

        {/* minimal global to handle reveal */}
        <style jsx global>{`
          .app-root {
            opacity: 0;
            filter: blur(12px);
            transform: translateY(6px);
            transition:
              opacity 520ms cubic-bezier(.2,0,0,1),
              filter 560ms cubic-bezier(.2,0,0,1),
              transform 520ms cubic-bezier(.2,0,0,1);
          }
          .app-root.ready {
            opacity: 1;
            filter: blur(0);
            transform: translateY(0);
          }
        `}</style>
      </body>
    </html>
  );
}
