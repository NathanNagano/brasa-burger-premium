import type { Category, CategoryId } from "@/data/products";
import { cn } from "@/lib/utils";

interface Props {
  categories: Category[];
  active: CategoryId | "todos";
  onChange: (id: CategoryId | "todos") => void;
}

export function CategoryFilter({ categories, active, onChange }: Props) {
  const all = [{ id: "todos" as const, label: "Todos" }, ...categories];
  return (
    <div role="group" aria-label="Filtrar por categoria" className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-2 md:mx-0 md:flex-wrap md:px-0">
      {all.map((c) => {
        const selected = c.id === active;
        return (
          <button
            key={c.id}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(c.id)}
            className={cn(
              "shrink-0 rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors",
              selected
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-surface text-cream/80 hover:border-primary/60 hover:text-cream",
            )}
          >
            {c.label}
          </button>
        );
      })}
    </div>
  );
}
