"use client";

type Props = { value: "all" | "project" | "photo"; onChange: (val: "all" | "project" | "photo") => void; };

const options: Array<{ label: string; value: "all" | "project" | "photo" }> = [
  { label: "all", value: "all" },
  { label: "projects", value: "project" },
  { label: "photos", value: "photo" }
];

export function FilterPills({ value, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`rounded-full border px-3 py-1 text-sm transition-colors ${
            value === opt.value ? "border-accent/60 bg-accent/10 text-fg" : "border-subtle text-muted hover:text-fg"
          }`}
          aria-pressed={value === opt.value}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

