import heroImg from "@/assets/hero-burger-light.jpg";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { IfoodButton } from "./IfoodButton";
import { WhatsappButton } from "./WhatsappButton";

export function Hero() {
  return (
    <section
      id="inicio"
      className="relative isolate flex min-h-[700px] items-start overflow-hidden bg-surface pb-72 pt-28 md:min-h-[640px] md:items-center md:pb-16 md:pt-28"
    >
      <img
        src={heroImg}
        alt="Imagem ilustrativa de hambúrguer artesanal com cheddar"
        width={1264}
        height={848}
        fetchPriority="high"
        className="hero-photo absolute inset-0 -z-20 h-full w-full object-cover"
      />
      <div className="container-page">
        <div className="max-w-lg animate-rise md:max-w-[46%]">
          <p className="eyebrow mb-4">Hamburgueria artesanal</p>
          <h1 className="text-5xl font-semibold leading-[1.1] text-foreground sm:text-6xl lg:text-7xl">
            {siteConfig.shortName}
            <br />
            <span className="text-primary">
              {siteConfig.name.replace(siteConfig.shortName, "").trim()}
            </span>
          </h1>
          <p className="mt-5 text-lg font-medium text-foreground">O sabor que acende sua fome.</p>
          <p className="mt-3 max-w-sm text-sm text-muted-foreground md:text-base">
            Burgers na chapa bem quente, ingredientes escolhidos a dedo e aquele ponto de brasa que
            faz voltar.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-start">
            <Button asChild className="h-12 px-6 shadow-none">
              <a href="#cardapio">
                Explorar cardápio <ArrowUpRight aria-hidden />
              </a>
            </Button>
            <WhatsappButton />
            <IfoodButton />
          </div>
        </div>
      </div>
    </section>
  );
}
