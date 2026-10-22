import comboImg from "@/assets/combo-smash.webp";

export function AboutSection() {
  return (
    <section id="sobre" aria-labelledby="sobre-title" className="py-20 md:py-28">
      <div className="container-page grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
        <img src={comboImg} alt="Imagem ilustrativa de burger com batata e bebida" width={1024} height={1024} loading="lazy" className="aspect-[4/3] w-full rounded-lg object-cover" />
        <div>
          <p className="eyebrow">Sobre nós</p>
          <h2 id="sobre-title" className="mt-3 text-3xl text-foreground md:text-5xl">Nascida na brasa</h2>
          <div className="mt-6 space-y-4 text-muted-foreground">
            <p>
              A Brasa Burger começou com uma chapa, uma receita de molho e a vontade de fazer o hambúrguer que a gente
              sempre quis comer: simples, suculento e com crosta de verdade.
            </p>
            <p>Hoje seguimos do mesmo jeito — poucos ingredientes, muito cuidado e fogo alto.</p>
          </div>
          <p className="mt-6 border-l-2 pl-4 text-xs text-muted-foreground">
            História fictícia, criada apenas para demonstração deste modelo.
          </p>
        </div>
      </div>
    </section>
  );
}
