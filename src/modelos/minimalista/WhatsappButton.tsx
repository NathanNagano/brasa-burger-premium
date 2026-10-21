import { MessageCircle } from "lucide-react";
import { useState, type ReactNode } from "react";
import { buildWhatsappLink } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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
    "inline-flex min-h-12 h-auto items-center justify-center gap-2 whitespace-normal rounded-md border border-border bg-transparent px-5 py-3 text-sm font-medium text-foreground shadow-none transition-colors hover:border-primary hover:bg-accent hover:text-primary focus-visible:outline-2 focus-visible:outline-ring",
    className,
  );

  if (link) {
    return (
      <Button asChild variant="outline" className={base}><a href={link} target="_blank" rel="noopener noreferrer">
        <MessageCircle className="size-4" aria-hidden /> {children}
      </a></Button>
    );
  }

  return (
    <span className="relative inline-flex flex-col">
      <Button variant="outline" type="button" className={base} onClick={() => setNotice(true)} aria-describedby="wa-notice">
        <MessageCircle className="size-4" aria-hidden /> {children}
      </Button>
      {notice && (
        <span id="wa-notice" role="status" className="mt-2 text-xs text-muted-foreground">
          Demonstração: número de WhatsApp ainda não configurado.
        </span>
      )}
    </span>
  );
}
