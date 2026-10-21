import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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
        scrolled || open ? "border-b bg-background/95 backdrop-blur-md" : "border-b border-transparent bg-background/90",
      )}
    >
      <div className="container-page grid h-16 grid-cols-[minmax(0,1fr)_auto] items-center gap-4 md:flex md:h-20 md:justify-between">
        <a href="#inicio" className="min-w-0 truncate font-display text-lg font-extrabold text-foreground md:text-xl" aria-label={`${siteConfig.name} — início`}>
          {siteConfig.shortName}<span className="text-primary"> {siteConfig.name.replace(siteConfig.shortName, "").trim()}</span>
        </a>
        <nav aria-label="Principal" className="hidden md:block">
          <ul className="flex items-center gap-8">
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild className="hidden h-11 px-5 shadow-none sm:inline-flex"><a href="#cardapio">Ver cardápio</a></Button>
          <Button
            variant="ghost" size="icon"
            type="button"
            className="inline-flex size-11 shrink-0 text-foreground md:hidden"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </Button>
        </div>
      </div>
      {open && (
        <nav aria-label="Menu móvel" className="container-page pb-6 md:hidden">
          <ul className="flex flex-col gap-1">
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <a href={item.href} onClick={() => setOpen(false)} className="block rounded-md px-2 py-3 font-medium text-foreground hover:bg-surface">
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <Button asChild className="mt-2 h-12 w-full shadow-none"><a href="#cardapio" onClick={() => setOpen(false)}>
                Ver cardápio
              </a></Button>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
