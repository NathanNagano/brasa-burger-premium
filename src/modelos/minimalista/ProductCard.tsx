import type { Product } from "@/data/products";
import { formatPrice } from "@/lib/whatsapp";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-lg border bg-card shadow-soft transition-colors hover:border-primary/30">
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
          <span className="absolute left-3 top-3 rounded-md bg-background/95 px-3 py-1.5 text-xs font-semibold text-foreground">
            {product.badge}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5 md:p-6">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
          <h3 className="min-w-0 text-lg font-semibold leading-snug text-foreground">{product.name}</h3>
          <span className="shrink-0 whitespace-nowrap text-base font-bold tabular-nums text-primary">{formatPrice(product.price)}</span>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">{product.description}</p>
      </div>
    </article>
  );
}
