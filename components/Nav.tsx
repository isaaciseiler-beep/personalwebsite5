"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export function Nav() {
  const [open, setOpen] = useState(false);
  const linkedin = process.env.NEXT_PUBLIC_LINKEDIN_URL || "#";

  const NavLinks = () => (
    <ul className="flex flex-col md:flex-row gap-6 md:gap-4 items-start md:items-center">
      <li><Link href="/about" className="link-underline hover:text-accent">about</Link></li>
      <li><Link href="/work" className="link-underline hover:text-accent">work</Link></li>
      <li>
        <a href={linkedin} target="_blank" rel="noopener noreferrer" className="link-underline hover:text-accent" aria-label="linkedin">
          linkedin
        </a>
      </li>
    </ul>
  );

  return (
    <header className="sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-black/30">
      <div className="flex items-center justify-between border-b border-subtle py-4">
        <Link href="/" className="font-semibold tracking-tight text-lg">isaac</Link>
        <nav className="hidden md:block"><NavLinks /></nav>
        <button className="md:hidden rounded-xl border border-subtle p-2" aria-label="toggle menu" aria-expanded={open} onClick={() => setOpen(v => !v)}>
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>
      {open && (<div className="md:hidden border-b border-subtle py-4"><NavLinks /></div>)}
    </header>
  );
}

