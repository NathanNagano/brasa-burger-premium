import { UtensilsCrossed } from "lucide-react";
import { useState } from "react";
import { categories, filterProducts, products, type CategoryId } from "@/data/products";
import { CategoryFilter } from "./CategoryFilter";
import { ProductCard } from "./ProductCard";

export function MenuSection() {
  const [active, setActive] = useState<CategoryId | "todos">("todos");
  const list = filterProducts(products, active);

  return (
    <section id="cardapio" aria-labelledby="cardapio-title" className="bg-dots py-20 md:py-28">
      <div className="container-page">
        <p className="font-script text-2xl text-primary">Cardápio</p>
        <h2 id="cardapio-title" className="mt-2 text-4xl text-foreground md:text-6xl">Escolha o seu</h2>
        <div className="mt-8">
          <CategoryFilter categories={categories} active={active} onChange={setActive} />
        </div>
        <div aria-live="polite" className="mt-10">
          {list.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center rounded-xl border border-dashed py-16 text-center">
              <UtensilsCrossed className="size-10 text-primary" aria-hidden />
              <p className="mt-4 font-semibold text-foreground">Nenhum item nesta categoria por enquanto.</p>
              <button type="button" onClick={() => setActive("todos")} className="mt-3 text-sm font-semibold text-primary hover:underline">
                Ver cardápio completo
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
