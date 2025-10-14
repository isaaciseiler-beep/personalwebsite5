// app/layout.tsx — FULL FILE REPLACEMENT (adds SearchProvider, keeps your structure)
import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import RouteProgress from "@/components/RouteProgress";
import ScrollProgress from "@/components/ScrollProgress";
import ThemeScript from "@/components/ThemeScript";
import Splash from "@/components/Splash";
import AppRootStyles from "@/components/AppRootStyles";
import SearchProvider from "@/providers/SearchProvider";
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
    type: "website",
  },
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark">
      <head>
        <ThemeScript />
        <link
          rel="preconnect"
          href="https://pub-41d52824b0bb4f44898c39e1c3c63cb8.r2.dev"
          crossOrigin=""
        />
      </head>
      <body className="min-h-dvh bg-[var(--color-bg)] text-[var(--color-fg)] selection:bg-[color:var(--color-accent)]/20 selection:text-[var(--color-fg)]">
        <Splash
          preloadUrls={preloadUrls}
          logoDark="/logo-light.png"
          logoLight="/logo-dark.png"
          maxDurationMs={2400}
          revealTargetId="app-root"
        />
        <AppRootStyles />

        <SearchProvider>
          <RouteProgress />
          <ScrollProgress />
          <Nav />

          <div id="app-root" className="app-root">
            <main id="content" className="mx-auto max-w-5xl px-4 py-10">
              {children}
            </main>
            <div className="mx-auto max-w-5xl px-4">
              <Footer />
            </div>
          </div>
        </SearchProvider>
      </body>
    </html>
  );
}
