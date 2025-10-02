"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<"light"|"dark">("dark");

  useEffect(() => {
    setMounted(true);
    const attr = document.documentElement.getAttribute("data-theme");
    setTheme(attr === "light" ? "light" : "dark");
  }, []);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    document.documentElement.style.colorScheme = next;
    try { localStorage.setItem("theme", next); } catch {}
  }

  if (!mounted) {
    // avoid mismatches
    return (
      <button
        className="rounded-xl border border-subtle p-2"
        aria-label="toggle theme"
      >
        <Moon size={16} />
      </button>
    );
  }

  return (
    <button
      onClick={toggle}
      className="rounded-xl border border-subtle p-2 hover:border-accent/60"
      aria-label="toggle theme"
    >
      {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
