"use client";

export default function Footer() {
  return (
    <footer className="relative mt-16 w-screen left-1/2 -translate-x-1/2">
      {/* full-bleed animated fog band */}
      <div className="fog-footer-bleed" aria-hidden>
        <div className="fog-gradient-bleed" />
        <div className="fog-noise-bleed" />
        {/* the fade drives the transition to solid white below */}
        <div className="fog-fade-white" />
      </div>

      {/* white panel (always white, even in dark mode) */}
      <div className="footer-white-panel">
        <div className="mx-auto max-w-5xl px-4 py-8">
          <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
            <div className="text-sm text-footer-dim">
              © {new Date().getFullYear()} isaac seiler
            </div>
            <nav className="flex flex-wrap gap-6 text-sm">
              <a className="footer-link" href="/about">about</a>
              <a className="footer-link" href="/work">my work</a>
              <a
                className="footer-link"
                href={process.env.NEXT_PUBLIC_LINKEDIN_URL || "#"}
                target="_blank"
                rel="noopener noreferrer"
              >
                linkedin
              </a>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
