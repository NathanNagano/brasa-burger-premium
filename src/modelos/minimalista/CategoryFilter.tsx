import type { Category, CategoryId } from "@/data/products";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface Props {
  categories: Category[];
  active: CategoryId | "todos";
  onChange: (id: CategoryId | "todos") => void;
}

export function CategoryFilter({ categories, active, onChange }: Props) {
  const all = [{ id: "todos" as const, label: "Todos" }, ...categories];
  return (
    <div role="group" aria-label="Filtrar por categoria" className="flex gap-1 overflow-x-auto border-b pb-0 md:flex-wrap">
      {all.map((c) => {
        const selected = c.id === active;
        return (
          <Button variant="ghost"
            key={c.id}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(c.id)}
            className={cn(
              "h-12 shrink-0 rounded-none border-0 border-b-2 px-4 text-sm font-medium shadow-none transition-colors",
              selected
                ? "border-primary bg-transparent text-primary hover:bg-accent"
                : "border-transparent bg-transparent text-muted-foreground hover:bg-surface hover:text-foreground",
            )}
          >
            {c.label}
          </Button>
        );
      })}
    </div>
  );
}
