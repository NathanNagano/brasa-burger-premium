import type { Product } from "@/data/products";
import { formatPrice } from "@/lib/whatsapp";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border bg-surface transition-colors hover:border-primary/40">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={product.image}
          alt={`Imagem ilustrativa: ${product.name}`}
          width={816}
          height={816}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary-foreground">
            {product.badge}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="min-w-0 text-xl text-cream">{product.name}</h3>
          <span className="shrink-0 font-bold text-primary">{formatPrice(product.price)}</span>
        </div>
        <p className="text-sm text-muted-foreground">{product.description}</p>
      </div>
    </article>
  );
}
