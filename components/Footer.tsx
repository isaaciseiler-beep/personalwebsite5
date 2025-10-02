"use client";

export default function Footer() {
  return (
    <footer className="relative mt-16 w-screen left-1/2 -translate-x-1/2">
      {/* full-bleed animated fog field */}
      <div className="fog-stage" aria-hidden>
        {/* black cap so it starts from true black */}
        <div className="fog-black-cap" />
        {/* rainbow fog layers (subtle) */}
        <div className="fog-layer fog-hue fog-drift-up" />
        <div className="fog-layer fog-hue2 fog-drift-down" />
        {/* grain to break banding */}
        <div className="fog-grain" />
        {/* long, soft fade to pure white */}
        <div className="fog-to-white" />
      </div>

      {/* white content panel (always pure white) */}
      <div className="footer-white">
        <div className="mx-auto max-w-5xl px-4 py-8">
          <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
            <div className="text-sm text-footer-dim">© {new Date().getFullYear()} isaac seiler</div>
            <nav className="flex flex-wrap gap-6 text-sm">
              <a className="footer-link" href="/about">about</a>
              <a className="footer-link" href="/work">my work</a>
              <a className="footer-link" href={process.env.NEXT_PUBLIC_LINKEDIN_URL || "#"} target="_blank" rel="noopener noreferrer">linkedin</a>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
