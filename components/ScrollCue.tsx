"use client";
import { m } from "framer-motion";

export default function ScrollCue() {
  return (
    <div className="mt-10 flex justify-center">
      <m.div
        initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
        className="text-sm text-muted"
        aria-hidden
      >
        ↓ scroll
      </m.div>
    </div>
  );
}
