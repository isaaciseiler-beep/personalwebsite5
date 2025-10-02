"use client";

type Props = {
  options: string[];
  selected: string[];
  onChange: (next: string[]) => void;
  label?: string;
};

export default function TagFilter({ options, selected, onChange, label }: Props) {
  const toggle = (t: string) =>
    onChange(selected.includes(t) ? selected.filter(x => x !== t) : [...selected, t]);
  const clear = () => onChange([]);

  return (
    <div className="flex flex-wrap items-center gap-2">
      {label && <span className="text-sm text-muted mr-1">{label}</span>}
      {options.map(opt => (
        <button
          key={opt}
          onClick={() => toggle(opt)}
          className={`rounded-full border px-3 py-1 text-sm transition-colors ${
            selected.includes(opt)
              ? "border-accent/60 bg-accent/10 text-fg"
              : "border-subtle text-muted hover:text-fg"
          }`}
          aria-pressed={selected.includes(opt)}
        >
          {opt}
        </button>
      ))}
      {selected.length > 0 && (
        <button onClick={clear} className="ml-2 text-sm text-muted hover:text-fg underline">
          clear
        </button>
      )}
    </div>
  );
}
