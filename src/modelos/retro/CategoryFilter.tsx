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
              "shrink-0 rounded-full border-2 px-5 py-2 text-sm font-bold uppercase tracking-wider transition-colors",
              selected
                ? "border-brown bg-primary text-primary-foreground shadow-glow"
                : "border-brown/40 bg-card text-foreground hover:border-brown hover:bg-secondary",
            )}
          >
            {c.label}
          </button>
        );
      })}
    </div>
  );
}
