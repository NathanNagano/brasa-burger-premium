import { Clock, MapPin } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { IfoodButton } from "./IfoodButton";
import { WhatsappButton } from "./WhatsappButton";

export function ContactSection() {
  const { address, hours } = siteConfig;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address.mapsQuery)}`;

  return (
    <section
      id="contato"
      aria-labelledby="contato-title"
      className="border-t bg-surface py-20 md:py-28"
    >
      <div className="container-page">
        <p className="eyebrow">Contato</p>
        <h2 id="contato-title" className="mt-3 text-3xl text-foreground md:text-5xl">
          Vem pra brasa
        </h2>
        <div className="mt-12 grid gap-12 md:grid-cols-2 md:gap-20">
          <div className="min-w-0">
            <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 text-primary">
              <Clock className="size-5" aria-hidden />
              <h3 className="text-lg text-foreground">Horário de funcionamento</h3>
            </div>
            <dl className="mt-6 divide-y">
              {hours.map((h) => (
                <div
                  key={h.days}
                  className="grid grid-cols-[minmax(0,1fr)_auto] gap-4 py-3 text-sm"
                >
                  <dt className="text-muted-foreground">{h.days}</dt>
                  <dd className="whitespace-nowrap font-semibold text-foreground">{h.time}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="flex min-w-0 flex-col">
            <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 text-primary">
              <MapPin className="size-5" aria-hidden />
              <h3 className="text-lg text-foreground">Endereço</h3>
            </div>
            <address className="mt-6 not-italic text-cream">
              {address.street} — {address.district}
              <br />
              {address.city} / {address.state}
            </address>
            <p className="mt-2 text-xs text-muted-foreground">Endereço demonstrativo.</p>
            <div className="mt-auto flex flex-col gap-3 pt-8 xl:flex-row xl:items-start">
              <Button asChild className="h-12 px-6 shadow-none">
                <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
                  <MapPin className="size-4" aria-hidden /> Abrir no mapa
                </a>
              </Button>
              <div className="flex flex-col gap-3">
                <WhatsappButton />
                <IfoodButton />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
