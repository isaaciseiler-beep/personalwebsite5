// components/Pressable.tsx — NEW (use for Home/Experience/Contact buttons)
"use client";

import { useRef } from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { asDiv?: boolean };

export default function Pressable({ asDiv, className = "", children, ...rest }: Props) {
  const ref = useRef<HTMLButtonElement | HTMLDivElement>(null);

  // simple ripple without tint; uses currentColor alpha
  const onPointerDown = (e: React.PointerEvent) => {
    const el = ref.current as HTMLElement | null;
    if (!el) return;
    const r = document.createElement("span");
    const rect = el.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    r.className = "pressable-ripple";
    r.style.width = r.style.height = `${size}px`;
    r.style.left = `${e.clientX - rect.left - size / 2}px`;
    r.style.top = `${e.clientY - rect.top - size / 2}px`;
    el.appendChild(r);
    setTimeout(() => r.remove(), 450);
  };

  const Cmp: any = asDiv ? "div" : "button";
  return (
    <Cmp
      ref={ref as any}
      onPointerDown={onPointerDown}
      className={`pressable ${className}`}
      {...rest}
    >
      {children}
    </Cmp>
  );
}
