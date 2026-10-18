/**
 * Configuração central da marca. Edite aqui para personalizar o modelo
 * para outra hamburgueria. Todos os dados abaixo são DEMONSTRATIVOS.
 */
export const siteConfig = {
  name: "BRASA BURGER",
  shortName: "BRASA",
  tagline: "Hamburgueria artesanal",
  seo: {
    title: "BRASA BURGER — Hamburgueria artesanal | Cardápio digital",
    description:
      "Conheça o cardápio da Brasa Burger: smash burgers, combos, acompanhamentos, bebidas e milkshakes. Peça pelo WhatsApp.",
  },
  contact: {
    /** Número no formato internacional, só dígitos (ex.: "5511999999999"). Vazio = não configurado. */
    whatsapp: "",
    whatsappMessage: "Olá! Vim pelo site e gostaria de fazer um pedido.",
    email: "contato@exemplo.com",
  },
  address: {
    street: "Rua Exemplo, 123",
    district: "Centro",
    city: "Sua Cidade",
    state: "UF",
    /** Texto usado na busca do mapa. */
    mapsQuery: "Rua Exemplo, 123, Centro",
  },
  hours: [
    { days: "Segunda", time: "Fechado" },
    { days: "Terça a Quinta", time: "18h — 23h" },
    { days: "Sexta e Sábado", time: "18h — 00h" },
    { days: "Domingo", time: "18h — 22h" },
  ],
  social: {
    instagram: "#",
    facebook: "#",
    tiktok: "#",
  },
  nav: [
    { label: "Início", href: "#inicio" },
    { label: "Cardápio", href: "#cardapio" },
    { label: "Sobre", href: "#sobre" },
    { label: "Contato", href: "#contato" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
