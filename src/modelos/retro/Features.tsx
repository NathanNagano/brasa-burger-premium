import { Flame, HandPlatter, Leaf } from "lucide-react";

const features = [
  { icon: Leaf, title: "Ingredientes selecionados", text: "Carnes frescas, pães macios e vegetais escolhidos todos os dias." },
  { icon: HandPlatter, title: "Preparo artesanal", text: "Cada burger é moldado e montado na hora, do jeito certo." },
  { icon: Flame, title: "Sabor marcante", text: "Chapa bem quente para a crosta caramelizada que define o smash." },
];

export function Features() {
  return (
    <section aria-labelledby="diferenciais" className="border-y-4 border-brown bg-primary text-primary-foreground py-16 md:py-20">
      <h2 id="diferenciais" className="sr-only">Nossos diferenciais</h2>
      <div className="container-page grid gap-10 md:grid-cols-3">
        {features.map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-full border-2 border-cream bg-secondary text-secondary-foreground">
              <Icon className="size-6" aria-hidden />
            </div>
            <div className="min-w-0">
              <h3 className="text-xl text-cream">{title}</h3>
              <p className="mt-1 text-sm text-cream/85">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
