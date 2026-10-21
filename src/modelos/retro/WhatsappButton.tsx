import { MessageCircle } from "lucide-react";
import { useState, type ReactNode } from "react";
import { buildWhatsappLink } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

interface Props {
  message?: string;
  className?: string;
  children?: ReactNode;
}

/** Botão reutilizável de WhatsApp. Sem número configurado, avisa em vez de abrir link falso. */
export function WhatsappButton({ message, className, children = "Pedir pelo WhatsApp" }: Props) {
  const link = buildWhatsappLink(message);
  const [notice, setNotice] = useState(false);
  const base = cn(
    "inline-flex items-center justify-center gap-2 rounded-full border-2 border-brown bg-secondary px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-secondary-foreground shadow-glow transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-ring",
    className,
  );

  if (link) {
    return (
      <a href={link} target="_blank" rel="noopener noreferrer" className={base}>
        <MessageCircle className="size-4" aria-hidden /> {children}
      </a>
    );
  }

  return (
    <span className="relative inline-flex flex-col">
      <button type="button" className={base} onClick={() => setNotice(true)} aria-describedby="wa-notice">
        <MessageCircle className="size-4" aria-hidden /> {children}
      </button>
      {notice && (
        <span id="wa-notice" role="status" className="mt-2 text-xs text-muted-foreground">
          Demonstração: número de WhatsApp ainda não configurado.
        </span>
      )}
    </span>
  );
}
