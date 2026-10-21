import comboImg from "@/assets/combo-brasa.webp";
import { siteConfig } from "@/config/site";

export function AboutSection() {
  const { about } = siteConfig;

  return (
    <section id="sobre" aria-labelledby="sobre-title" className="py-20 md:py-28">
      <div className="container-page grid items-center gap-12 lg:grid-cols-2">
        <img src={comboImg} alt="Imagem ilustrativa de burger com batata e bebida" width={1024} height={1024} loading="lazy" className="aspect-[4/3] w-full rounded-2xl object-cover" />
        <div>
          <p className="eyebrow">{about.eyebrow}</p>
          <h2 id="sobre-title" className="mt-2 text-4xl text-cream md:text-6xl">{about.title}</h2>
          <div className="mt-6 space-y-4 text-muted-foreground">
            {about.paragraphs.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>
          {about.demoNotice && (
            <p className="mt-6 rounded-lg border border-dashed px-4 py-3 text-xs text-muted-foreground">
              {about.demoNotice}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
