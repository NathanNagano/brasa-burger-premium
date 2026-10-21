import type { Product } from "@/data/products";
import { formatPrice } from "@/lib/whatsapp";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border-2 border-brown bg-card shadow-retro transition-transform hover:-translate-y-1">
      <div className="relative aspect-[4/3] overflow-hidden border-b-2 border-brown">
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
          <span className="absolute left-3 top-3 -rotate-6 rounded-full border-2 border-brown bg-secondary px-3 py-1 text-secondary-foreground text-xs font-bold uppercase tracking-wider">
            {product.badge}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="min-w-0 text-xl text-foreground">{product.name}</h3>
          <span className="shrink-0 rounded-full bg-primary px-3 py-1 font-display text-sm text-primary-foreground">{formatPrice(product.price)}</span>
        </div>
        <p className="text-sm text-muted-foreground">{product.description}</p>
      </div>
    </article>
  );
}
