import { siteConfig } from "@/config/site";

export function isWhatsappConfigured(phone: string = siteConfig.contact.whatsapp): boolean {
  return /^\d{10,15}$/.test(phone);
}

/** Retorna o link do WhatsApp ou null quando o número não está configurado. */
export function buildWhatsappLink(
  message: string = siteConfig.contact.whatsappMessage,
  phone: string = siteConfig.contact.whatsapp,
): string | null {
  if (!isWhatsappConfigured(phone)) return null;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function formatPrice(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
