// components/NowBar.tsx — FULL FILE
export default function NowBar({ text }: { text: string }) {
  if (!text) return null;
  return (
    <section className="mx-auto mt-10 max-w-5xl px-4">
      <div className="rounded-xl border border-subtle bg-card px-4 py-3 text-sm">
        <span className="mr-2 rounded-full bg-[color:var(--color-accent)]/30 px-2 py-[2px] text-xs">
          now
        </span>
        {text}
      </div>
    </section>
  );
}
