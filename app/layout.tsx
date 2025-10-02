import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import RouteProgress from "@/components/RouteProgress";
import ScrollProgress from "@/components/ScrollProgress";

export const metadata: Metadata = {
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
      <body className="min-h-dvh bg-bg text-fg selection:bg-accent/20 selection:text-fg">
        {/* progress indicators */}
        <RouteProgress />
        <ScrollProgress />

        {/* full-width header */}
        <Nav />

        {/* main content container */}
        <main id="content" className="mx-auto max-w-5xl px-4 py-10">
          {children}
        </main>

        <div className="mx-auto max-w-5xl px-4">
          <Footer />
        </div>
      </body>
    </html>
  );
}
