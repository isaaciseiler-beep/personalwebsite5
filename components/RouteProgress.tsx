"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function RouteProgress() {
  const path = usePathname();
  const [w, setW] = useState(0);

  useEffect(() => {
    // start
    setW(0);
    const t1 = setTimeout(() => setW(0.6), 50);
    const t2 = setTimeout(() => setW(0.9), 300);
    const t3 = setTimeout(() => setW(1), 700);
    // complete then hide
    const t4 = setTimeout(() => setW(0), 1100);
    return () => [t1, t2, t3, t4].forEach(clearTimeout);
  }, [path]);

  return (
    <div
      className="route-progress"
      style={{ width: `${w * 100}%`, transition: "width 300ms cubic-bezier(0.2,0,0,1), opacity 300ms", opacity: w ? 1 : 0 }}
    />
  );
}
