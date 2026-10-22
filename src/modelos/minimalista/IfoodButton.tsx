import { useState } from "react";
import { Button } from "@/components/ui/button";
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
    "inline-flex min-h-12 h-auto items-center justify-center gap-2 whitespace-normal rounded-md border border-border bg-transparent px-5 py-3 text-sm font-medium text-foreground shadow-none transition-colors hover:border-primary hover:bg-accent hover:text-primary focus-visible:outline-2 focus-visible:outline-ring",
    className,
  );

  if (link) {
    return (
      <Button asChild variant="outline" className={base}>
        <a href={link} target="_blank" rel="noopener noreferrer">
          <IfoodMark /> Pedir pelo iFood
        </a>
      </Button>
    );
  }

  return (
    <span className="relative inline-flex flex-col">
      <Button
        variant="outline"
        type="button"
        className={base}
        onClick={() => setNotice(true)}
        aria-describedby="ifood-notice"
      >
        <IfoodMark /> Pedir pelo iFood
      </Button>
      {notice && (
        <span id="ifood-notice" role="status" className="mt-2 text-xs text-muted-foreground">
          Demonstração: link da loja no iFood ainda não configurado.
        </span>
      )}
    </span>
  );
}
