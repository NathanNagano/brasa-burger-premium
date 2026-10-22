import heroImg from "@/assets/hero-burger.jpg";
import { IfoodButton } from "./IfoodButton";
import { WhatsappButton } from "./WhatsappButton";

export function Hero() {
  return (
    <section
      id="inicio"
      className="relative isolate flex min-h-[92svh] items-end overflow-hidden pb-16 pt-28 md:items-center md:pb-0"
    >
      <img
        src={heroImg}
        alt="Imagem ilustrativa de hambúrguer com cheddar derretido sobre brasa"
        width={1600}
        height={1008}
        fetchPriority="high"
        className="absolute inset-0 -z-20 h-full w-full object-cover object-[70%_center]"
      />
      <div className="absolute inset-0 -z-10 bg-hero-fade" aria-hidden />
      <div className="container-page">
        <div className="max-w-xl animate-rise">
          <p className="eyebrow mb-4">Hamburgueria artesanal</p>
          <h1 className="text-5xl leading-[0.95] text-cream sm:text-6xl md:text-7xl lg:text-8xl">
            O sabor que <span className="text-primary text-fire-outline">acende</span> sua fome
          </h1>
          <p className="mt-6 max-w-md text-base text-cream/75 md:text-lg">
            Burgers na chapa bem quente, ingredientes escolhidos a dedo e aquele ponto de brasa que
            faz voltar.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-start">
            <a
              href="#cardapio"
              className="inline-flex items-center justify-center rounded-lg bg-fire px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-primary-foreground shadow-glow transition-transform hover:-translate-y-0.5"
            >
              Explorar cardápio
            </a>
            <WhatsappButton />
            <IfoodButton />
          </div>
        </div>
      </div>
    </section>
  );
}
