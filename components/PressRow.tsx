// components/PressRow.tsx — FULL FILE
import Image from "next/image";

type Press = { name: string; url?: string; logo?: string };

export default function PressRow({ items }: { items: Press[] }) {
  if (!items?.length) return null;
  return (
    <section className="mx-auto mt-10 max-w-5xl px-4">
      <div className="text-sm text-muted mb-3">featured in</div>
      <div className="flex flex-wrap items-center gap-6 opacity-70">
        {items.map((p) =>
          p.url ? (
            <a key={p.name} href={p.url} target="_blank" className="hover:opacity-100">
              {p.logo ? (
                <Image src={p.logo} alt={p.name} width={96} height={28} className="object-contain" />
              ) : (
                <span>{p.name}</span>
              )}
            </a>
          ) : p.logo ? (
            <Image key={p.name} src={p.logo} alt={p.name} width={96} height={28} className="object-contain" />
          ) : (
            <span key={p.name}>{p.name}</span>
          )
        )}
      </div>
    </section>
  );
}
