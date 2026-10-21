export type Modelo = "premium" | "retro" | "minimalista";

type Props = {
  modeloAtual: Modelo;
  aoTrocar: (modelo: Modelo) => void;
};

const modelos: Array<{ id: Modelo; nome: string }> = [
  { id: "premium", nome: "Premium" },
  { id: "retro", nome: "Retro" },
  { id: "minimalista", nome: "Minimalista" },
];

export function SeletorDeModelo({ modeloAtual, aoTrocar }: Props) {
  return (
    <div className="fixed bottom-5 left-1/2 z-[100] -translate-x-1/2 rounded-full border border-white/20 bg-zinc-950/90 p-1.5 shadow-2xl backdrop-blur">
      <div className="flex gap-1">
        {modelos.map((modelo) => (
          <button
            key={modelo.id}
            type="button"
            onClick={() => aoTrocar(modelo.id)}
            aria-pressed={modeloAtual === modelo.id}
            className={
              modeloAtual === modelo.id
                ? "rounded-full bg-orange-500 px-4 py-2 text-sm font-bold text-zinc-950 transition"
                : "rounded-full px-4 py-2 text-sm font-bold text-white/75 transition hover:bg-white/10 hover:text-white"
            }
          >
            {modelo.nome}
          </button>
        ))}
      </div>
    </div>
  );
}
