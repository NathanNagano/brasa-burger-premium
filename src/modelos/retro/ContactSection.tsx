import { Clock, MapPin } from "lucide-react";
import { siteConfig } from "@/config/site";
import { WhatsappButton } from "./WhatsappButton";

export function ContactSection() {
  const { address, hours } = siteConfig;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address.mapsQuery)}`;

  return (
    <section id="contato" aria-labelledby="contato-title" className="relative border-t-4 border-brown bg-secondary py-20 md:py-28">
      <div className="container-page">
        <p className="font-script text-2xl text-primary">Contato</p>
        <h2 id="contato-title" className="mt-2 text-4xl text-foreground md:text-6xl">Vem pra brasa</h2>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border-2 border-brown bg-card p-6 shadow-retro md:p-8">
            <div className="flex items-center gap-3 text-primary">
              <Clock className="size-5" aria-hidden />
              <h3 className="text-xl text-foreground">Horário de funcionamento</h3>
            </div>
            <dl className="mt-6 divide-y">
              {hours.map((h) => (
                <div key={h.days} className="flex justify-between gap-4 py-3 text-sm">
                  <dt className="text-muted-foreground">{h.days}</dt>
                  <dd className="font-semibold text-foreground">{h.time}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="flex flex-col rounded-3xl border-2 border-brown bg-card p-6 shadow-retro md:p-8">
            <div className="flex items-center gap-3 text-primary">
              <MapPin className="size-5" aria-hidden />
              <h3 className="text-xl text-foreground">Endereço</h3>
            </div>
            <address className="mt-6 not-italic text-foreground">
              {address.street} — {address.district}
              <br />
              {address.city} / {address.state}
            </address>
            <p className="mt-2 text-xs text-muted-foreground">Endereço demonstrativo.</p>
            <div className="mt-auto flex flex-col gap-3 pt-8 sm:flex-row sm:items-start">
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-brown bg-primary px-6 py-3.5 shadow-glow text-sm font-bold uppercase tracking-wider text-primary-foreground"
              >
                <MapPin className="size-4" aria-hidden /> Abrir no mapa
              </a>
              <WhatsappButton />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
