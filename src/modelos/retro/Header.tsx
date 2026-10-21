import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled || open ? "bg-brown shadow-lg" : "bg-brown/70 backdrop-blur-sm",
      )}
    >
      <div className="h-1.5 bg-stripes" aria-hidden />
      <div className="container-page flex h-16 items-center justify-between gap-4 md:h-20">
        <a href="#inicio" className="font-display text-2xl tracking-wide text-cream" aria-label={`${siteConfig.name} — início`}>
          BRASA<span className="font-script text-secondary"> Burger</span>
        </a>
        <nav aria-label="Principal" className="hidden md:block">
          <ul className="flex items-center gap-8">
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="text-sm font-bold uppercase tracking-wider text-cream/85 transition-colors hover:text-secondary">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <a
            href="#cardapio"
            className="hidden rounded-full border-2 border-cream bg-primary px-5 py-2 text-sm font-bold uppercase tracking-wider text-primary-foreground transition-transform hover:-translate-y-0.5 sm:inline-flex"
          >
            Ver cardápio
          </a>
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-full text-cream md:hidden"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>
      {open && (
        <nav aria-label="Menu móvel" className="container-page pb-6 md:hidden">
          <ul className="flex flex-col gap-1">
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <a href={item.href} onClick={() => setOpen(false)} className="block rounded-lg px-2 py-3 font-semibold text-cream hover:bg-cream/10">
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <a href="#cardapio" onClick={() => setOpen(false)} className="mt-2 block rounded-full border-2 border-cream bg-primary px-4 py-3 text-center font-bold uppercase text-primary-foreground">
                Ver cardápio
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
