import { Facebook, Instagram, MessageCircle, Music2 } from "lucide-react";
import { IfoodMark } from "@/components/site/IfoodMark";
import { siteConfig } from "@/config/site";
import { buildWhatsappLink } from "@/lib/whatsapp";

export function Footer() {
  const socials = [
    { label: "Instagram", href: siteConfig.social.instagram, icon: Instagram },
    { label: "Facebook", href: siteConfig.social.facebook, icon: Facebook },
    { label: "TikTok", href: siteConfig.social.tiktok, icon: Music2 },
    { label: "WhatsApp", href: buildWhatsappLink(), icon: MessageCircle },
    { label: "iFood", href: siteConfig.contact.ifood, icon: IfoodMark },
  ];
  return (
    <footer className="border-t-4 border-primary bg-brown py-12 text-cream">
      <div className="container-page grid gap-8 md:grid-cols-3 md:items-center">
        <div>
          <p className="font-display text-2xl text-cream">
            BRASA<span className="font-script text-secondary"> Burger</span>
          </p>
          <p className="mt-1 text-sm text-cream/70">{siteConfig.tagline}</p>
        </div>
        <nav aria-label="Rodapé">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 md:justify-center">
            {siteConfig.nav.map((n) => (
              <li key={n.href}>
                <a href={n.href} className="text-sm text-cream/80 hover:text-secondary">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <ul className="flex gap-3 md:justify-end">
          {socials.map(({ label, href, icon: Icon }) => (
            <li key={label}>
              {href ? (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex size-10 items-center justify-center rounded-full border border-cream/40 text-cream/85 transition-colors hover:border-secondary hover:text-secondary"
                >
                  <Icon className="size-4" aria-hidden />
                </a>
              ) : (
                <span
                  aria-label={`${label} — link ainda não configurado`}
                  title={`${label}: link ainda não configurado`}
                  className="flex size-10 items-center justify-center rounded-full border border-cream/25 text-cream/45"
                >
                  <Icon className="size-4" aria-hidden />
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
      <p className="container-page mt-10 text-xs text-cream/70">
        © {new Date().getFullYear()} {siteConfig.name}. Marca fictícia — modelo demonstrativo.
        Imagens ilustrativas.
      </p>
    </footer>
  );
}
