import { Facebook, Instagram, Music2 } from "lucide-react";
import { siteConfig } from "@/config/site";

export function Footer() {
  const socials = [
    { label: "Instagram", href: siteConfig.social.instagram, icon: Instagram },
    { label: "Facebook", href: siteConfig.social.facebook, icon: Facebook },
    { label: "TikTok", href: siteConfig.social.tiktok, icon: Music2 },
  ];
  return (
    <footer className="border-t py-12">
      <div className="container-page grid gap-8 md:grid-cols-3 md:items-center">
        <div>
          <p className="font-display text-2xl text-cream">
            BRASA<span className="text-primary"> BURGER</span>
          </p>
          <p className="mt-1 text-sm text-muted-foreground">{siteConfig.tagline}</p>
        </div>
        <nav aria-label="Rodapé">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 md:justify-center">
            {siteConfig.nav.map((n) => (
              <li key={n.href}>
                <a href={n.href} className="text-sm text-cream/70 hover:text-primary">{n.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <ul className="flex gap-3 md:justify-end">
          {socials.map(({ label, href, icon: Icon }) => (
            <li key={label}>
              <a href={href} aria-label={label} className="flex size-10 items-center justify-center rounded-full border text-cream/80 transition-colors hover:border-primary hover:text-primary">
                <Icon className="size-4" aria-hidden />
              </a>
            </li>
          ))}
        </ul>
      </div>
      <p className="container-page mt-10 text-xs text-muted-foreground">
        © {new Date().getFullYear()} {siteConfig.name}. Marca fictícia — modelo demonstrativo. Imagens ilustrativas.
      </p>
    </footer>
  );
}
