import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "isaac seiler — portfolio",
  description: "simple, modern, and slightly quirky portfolio by isaac seiler.",
  metadataBase: new URL("https://example.com"),
  openGraph: {
    title: "isaac seiler — portfolio",
    description: "simple, modern, slightly quirky portfolio.",
    url: "https://example.com",
    siteName: "isaac seiler",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
    type: "website",
  },
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh bg-bg text-fg selection:bg-accent/20 selection:text-fg">
        {/* nav now includes full-width gradient background */}
        <Nav />
        <main className="mx-auto max-w-5xl px-4 py-10">{children}</main>
        <div className="mx-auto max-w-5xl px-4">
          <Footer />
        </div>
      </body>
    </html>
  );
}
