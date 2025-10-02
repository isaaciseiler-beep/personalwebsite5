import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import RouteProgress from "@/components/RouteProgress";
import ScrollProgress from "@/components/ScrollProgress";
import ThemeScript from "@/components/ThemeScript";

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
    <html lang="en">
      <head>
        {/* theme before paint to avoid FOUC */}
        <ThemeScript />
      </head>
      <body className="min-h-dvh bg-[var(--color-bg)] text-[var(--color-fg)] selection:bg-[color:var(--color-accent)]/20 selection:text-[var(--color-fg)]">
        {/* route + scroll progress */}
        <RouteProgress />
        <ScrollProgress />

        {/* fixed translucent navbar (imported component controls styling) */}
        <Nav />

        {/* main content */}
        <main id="content" className="mx-auto max-w-5xl px-4 py-10">
          {children}
        </main>

        {/* footer in container */}
        <div className="mx-auto max-w-5xl px-4">
          <Footer />
        </div>
      </body>
    </html>
  );
}
