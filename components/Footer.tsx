// components/Footer.tsx
import Link from "next/link";
import { getRepoMeta } from "@/lib/github";
import FooterReveal from "./FooterReveal";
import FooterFX from "./FooterFX";
import EmailButton from "./EmailButton";

export default async function Footer() {
  const meta = await getRepoMeta();
  const year = new Date().getFullYear();
  const shortSha = meta.sha ? meta.sha.slice(0, 7) : "dev";

  return (
    <footer id="site-footer" className="relative mx-auto w-full max-w-6xl px-4 pb-10 pt-12">
      <FooterFX />

      <div className="relative z-10">
        <div className="flex items-center gap-4">
          <div data-no-fx>
            <EmailButton />
          </div>

          <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm" data-no-fx>
            <Link href="/#work" className="hover:underline underline-offset-4">Work</Link>
            <Link href="/photos" className="hover:underline underline-offset-4">Photos</Link>
            <Link href="/press" className="hover:underline underline-offset-4">Press</Link>
            <Link href="/#about" className="hover:underline underline-offset-4">About</Link>
            <Link href="https://www.linkedin.com/in/isaaciseiler" target="_blank" rel="noopener noreferrer" className="hover:underline underline-offset-4">LinkedIn</Link>
          </nav>

          <FooterReveal
            repoUrl="https://github.com/isaaciseiler-beep/personalwebsite5"
            gitUrl={meta.url}
            stars={meta.stars}
            shortSha={shortSha}
          />
        </div>

        <div className="mt-6 text-sm text-[var(--color-muted)]">© {year} Isaac Seiler</div>
      </div>
    </footer>
  );
}
