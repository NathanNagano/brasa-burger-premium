import { cn } from "@/lib/utils";

interface IfoodMarkProps {
  className?: string;
}

/** Marca compacta para identificar o canal de pedidos pelo iFood. */
export function IfoodMark({ className }: IfoodMarkProps) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex size-4 items-center justify-center rounded-[0.3rem] bg-[#ea1d2c] text-[8px] font-black italic leading-none tracking-tighter text-white",
        className,
      )}
    >
      iF
    </span>
  );
}
