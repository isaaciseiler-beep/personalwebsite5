"use client";

export default function Footer() {
  return (
    <footer className="relative mt-16 w-screen left-1/2 -translate-x-1/2">
      {/* WIND-FOG FIELD (full-bleed, animated) */}
      <div className="windfog" aria-hidden>
        <svg className="windfog-svg" viewBox="0 0 1200 300" preserveAspectRatio="none">
          <defs>
            {/* procedural wind field */}
            <filter id="windFogFilter">
              {/* large-scale flow */}
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.004 0.015"
                numOctaves={3}
                seed={8}
                result="turb1"
              >
                <animate attributeName="baseFrequency" dur="14s" values="0.004 0.015;0.006 0.02;0.004 0.015" repeatCount="indefinite" />
                <animate attributeName="seed" dur="12s" values="8;13;8" repeatCount="indefinite" />
              </feTurbulence>

              {/* small gusts */}
              <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves={2} seed={3} result="turb2">
                <animate attributeName="baseFrequency" dur="6s" values="0.02;0.03;0.02" repeatCount="indefinite" />
                <animate attributeName="seed" dur="8s" values="3;9;3" repeatCount="indefinite" />
              </feTurbulence>

              <feBlend in="turb1" in2="turb2" mode="screen" result="turb" />
              <feDisplacementMap
                in="SourceGraphic"
                in2="turb"
                scale={40}
                xChannelSelector="R"
                yChannelSelector="G"
              >
                <animate attributeName="scale" dur="8s" values="36;48;36" repeatCount="indefinite" />
              </feDisplacementMap>

              {/* soften */}
              <feGaussianBlur stdDeviation={12} />
            </filter>

            {/* horizontal wind translation */}
            <linearGradient id="fogStripe" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#000000" />
              <stop offset="12%" stopColor="#000000" />
              <stop offset="20%" stopColor="#33212f" />
              <stop offset="40%" stopColor="#2d3a58" />
              <stop offset="60%" stopColor="#1f4a39" />
              <stop offset="80%" stopColor="#3a2a4c" />
              <stop offset="100%" stopColor="#000000" />
            </linearGradient>

            {/* fade to pure white */}
            <linearGradient id="toWhite" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(255,255,255,0)" />
              <stop offset="70%" stopColor="rgba(255,255,255,0.35)" />
              <stop offset="100%" stopColor="#ffffff" />
            </linearGradient>

            <mask id="whiteMask">
              <rect x="0" y="0" width="1200" height="300" fill="url(#toWhite)" />
            </mask>
          </defs>

          {/* black top to merge with page */}
          <rect x="0" y="0" width="1200" height="300" fill="#000" />

          {/* moving colored fog stripe filtered by wind */}
          <g filter="url(#windFogFilter)">
            <rect id="stripe" x="-2400" y="0" width="3600" height="220" fill="url(#fogStripe)" opacity="0.55">
              <animate attributeName="x" dur="20s" values="-2400;0;-2400" repeatCount="indefinite" />
            </rect>
          </g>

          {/* long, smooth fade to white at bottom */}
          <rect x="0" y="0" width="1200" height="300" fill="white" mask="url(#whiteMask)" />
        </svg>
      </div>

      {/* white footer panel */}
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
