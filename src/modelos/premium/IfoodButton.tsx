import { useState } from "react";
import { IfoodMark } from "@/components/site/IfoodMark";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
}

/** Botão reutilizável do iFood. Sem URL configurada, avisa em vez de abrir um link incorreto. */
export function IfoodButton({ className }: Props) {
  const link = siteConfig.contact.ifood.trim();
  const [notice, setNotice] = useState(false);
  const base = cn(
    "inline-flex items-center justify-center gap-2 rounded-lg border border-cream/25 px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-cream transition-colors hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-ring",
    className,
  );

  if (link) {
    return (
      <a href={link} target="_blank" rel="noopener noreferrer" className={base}>
        <IfoodMark /> Pedir pelo iFood
      </a>
    );
  }

  return (
    <span className="relative inline-flex flex-col">
      <button
        type="button"
        className={base}
        onClick={() => setNotice(true)}
        aria-describedby="ifood-notice"
      >
        <IfoodMark /> Pedir pelo iFood
      </button>
      {notice && (
        <span id="ifood-notice" role="status" className="mt-2 text-xs text-muted-foreground">
          Demonstração: link da loja no iFood ainda não configurado.
        </span>
      )}
    </span>
  );
}
