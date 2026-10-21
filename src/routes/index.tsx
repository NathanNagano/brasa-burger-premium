import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { SeletorDeModelo, type Modelo } from "@/components/SeletorDeModelo";
import { siteConfig } from "@/config/site";
import { ModeloMinimalista } from "@/modelos/minimalista/ModeloMinimalista";
import { ModeloPremium } from "@/modelos/premium/ModeloPremium";
import { ModeloRetro } from "@/modelos/retro/ModeloRetro";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: siteConfig.seo.title },
      { name: "description", content: siteConfig.seo.description },
      { property: "og:title", content: siteConfig.seo.title },
      { property: "og:description", content: siteConfig.seo.description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function ehModelo(valor: string | null): valor is Modelo {
  return valor === "premium" || valor === "retro" || valor === "minimalista";
}

function Index() {
  const [modelo, setModelo] = useState<Modelo>("premium");

  // Recupera a última opção escolhida no navegador.
  useEffect(() => {
    const modeloSalvo = window.localStorage.getItem("brasa-modelo-demo");

    if (ehModelo(modeloSalvo)) {
      setModelo(modeloSalvo);
    }
  }, []);

  // Atualiza o tema visual e salva a escolha atual.
  useEffect(() => {
    document.documentElement.dataset["modelo"] = modelo;
    window.localStorage.setItem("brasa-modelo-demo", modelo);
  }, [modelo]);

  return (
    <>
      <SeletorDeModelo modeloAtual={modelo} aoTrocar={setModelo} />

      {modelo === "premium" && <ModeloPremium />}
      {modelo === "retro" && <ModeloRetro />}
      {modelo === "minimalista" && <ModeloMinimalista />}
    </>
  );
}
