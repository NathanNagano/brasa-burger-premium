import { products } from "@/data/products";
import { formatPrice } from "@/lib/whatsapp";
import { WhatsappButton } from "./WhatsappButton";

export function Highlights() {
  const featured = products.filter((p) => p.featured).slice(0, 2);
  if (featured.length === 0) return null;

  return (
    <section aria-labelledby="destaques" className="bg-surface py-20 md:py-28">
      <div className="container-page">
        <p className="eyebrow">Populares da casa</p>
        <h2 id="destaques" className="mt-2 text-4xl text-cream md:text-6xl">Os queridinhos</h2>
        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {featured.map((p) => (
            <article key={p.id} className="grid overflow-hidden rounded-2xl border bg-background sm:grid-cols-2">
              <img src={p.image} alt={`Imagem ilustrativa: ${p.name}`} width={816} height={816} loading="lazy" className="aspect-square h-full w-full object-cover" />
              <div className="flex flex-col justify-center gap-4 p-6 md:p-8">
                <h3 className="text-3xl text-cream">{p.name}</h3>
                <p className="text-muted-foreground">{p.description}</p>
                <p className="font-display text-3xl text-primary">{formatPrice(p.price)}</p>
                <WhatsappButton message={`Olá! Quero pedir um ${p.name}.`} className="self-start px-4 py-3">
                  Pedir este
                </WhatsappButton>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
