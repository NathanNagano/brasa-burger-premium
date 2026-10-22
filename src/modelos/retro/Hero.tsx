import heroImg from "@/assets/hero-burger.jpg";
import { IfoodButton } from "./IfoodButton";
import { WhatsappButton } from "./WhatsappButton";

export function Hero() {
  return (
    <section
      id="inicio"
      className="relative isolate flex min-h-[92svh] items-end overflow-hidden pb-16 pt-32 md:items-center md:pb-0"
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
          <span className="inline-block -rotate-3 rounded-full border-2 border-cream bg-secondary px-4 py-1 text-xs font-bold uppercase tracking-[0.2em] text-secondary-foreground shadow-glow">
            ★ Desde 1955 · Hamburgueria ★
          </span>
          <p className="mt-6 font-script text-3xl text-secondary md:text-4xl">
            Classic American Diner
          </p>
          <h1 className="mt-2 text-5xl leading-[1] text-cream drop-shadow-[3px_3px_0_var(--primary)] sm:text-6xl md:text-7xl">
            O sabor que <span className="text-fire">acende</span> sua fome
          </h1>
          <p className="mt-6 max-w-md text-base text-cream/85 md:text-lg">
            Burgers na chapa bem quente, ingredientes escolhidos a dedo e aquele ponto de brasa que
            faz voltar.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-start">
            <a
              href="#cardapio"
              className="inline-flex items-center justify-center rounded-full border-2 border-cream bg-primary px-7 py-3.5 text-sm font-bold uppercase tracking-wider text-primary-foreground shadow-glow transition-transform hover:-translate-y-0.5"
            >
              Explorar cardápio
            </a>
            <WhatsappButton />
            <IfoodButton />
          </div>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-3 bg-checker" aria-hidden />
    </section>
  );
}
