"use client";

export default function Footer() {
  return (
    <footer className="bg-[var(--color-bg)] text-[var(--color-fg)]">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
          <div className="text-sm text-muted">
            © {new Date().getFullYear()} isaac seiler
          </div>
          <nav className="flex flex-wrap gap-6 text-sm">
            <a className="link-underline hover:text-[color:var(--color-accent)]" href="/about">about</a>
            <a className="link-underline hover:text-[color:var(--color-accent)]" href="/work">my work</a>
            <a
              className="link-underline hover:text-[color:var(--color-accent)]"
              href={process.env.NEXT_PUBLIC_LINKEDIN_URL || "#"}
              target="_blank"
              rel="noopener noreferrer"
            >
              linkedin
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
