// components/EmailButton.tsx
"use client";

import { Mail } from "lucide-react";

type Props = { className?: string };

export default function EmailButton({ className }: Props) {
  // Simple obfuscation: assembled on click
  const user = "isaaciseiler";
  const host = "gmail.com";

  const onClick = () => {
    const addr = `${user}@${host}`;
    const subject = encodeURIComponent("Hello Isaac");
    const body = encodeURIComponent("");
    window.location.href = `mailto:${addr}?subject=${subject}&body=${body}`;
  };

  return (
    <button
      onClick={onClick}
      className={
        className ??
        "inline-flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-2 text-sm"
      }
      aria-label="Email Isaac"
    >
      <Mail className="h-4 w-4" aria-hidden />
      <span>Email</span>
    </button>
  );
}
