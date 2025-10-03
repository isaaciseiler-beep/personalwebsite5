// components/AppRootStyles.tsx — NEW FILE (Client Component)
"use client";

export default function AppRootStyles() {
  return (
    <style jsx global>{`
      .app-root {
        opacity: 0;
        filter: blur(12px);
        transform: translateY(6px);
        transition:
          opacity 520ms cubic-bezier(.2,0,0,1),
          filter 560ms cubic-bezier(.2,0,0,1),
          transform 520ms cubic-bezier(.2,0,0,1);
      }
      .app-root.ready {
        opacity: 1;
        filter: blur(0);
        transform: translateY(0);
      }
    `}</style>
  );
}
