import { Flame, HandPlatter, Leaf } from "lucide-react";

const features = [
  { icon: Leaf, title: "Ingredientes selecionados", text: "Carnes frescas, pães macios e vegetais escolhidos todos os dias." },
  { icon: HandPlatter, title: "Preparo artesanal", text: "Cada burger é moldado e montado na hora, do jeito certo." },
  { icon: Flame, title: "Sabor marcante", text: "Chapa bem quente para a crosta caramelizada que define o smash." },
];

export function Features() {
  return (
    <section aria-labelledby="diferenciais" className="border-b bg-background py-10 md:py-12">
      <h2 id="diferenciais" className="sr-only">Nossos diferenciais</h2>
      <div className="container-page grid gap-10 md:grid-cols-3">
        {features.map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex gap-4">
            <div className="flex size-8 shrink-0 items-center justify-center text-primary">
              <Icon className="size-5" aria-hidden />
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-semibold text-foreground">{title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
