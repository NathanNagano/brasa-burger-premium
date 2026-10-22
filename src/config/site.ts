/**
 * Configuração central da marca. Edite aqui para personalizar o modelo
 * para outra hamburgueria. Todos os dados abaixo são DEMONSTRATIVOS.
 */
export const siteConfig = {
  name: "BRASA BURGER",
  shortName: "BRASA",
  tagline: "Hamburgueria artesanal",

  /** Partes do logo para renderização. `accent` recebe a cor primária. */
  logo: {
    main: "BRASA",
    accent: "BURGER",
  },

  seo: {
    title: "BRASA BURGER — Hamburgueria artesanal | Cardápio digital",
    description:
      "Conheça o cardápio da Brasa Burger: smash burgers, combos, acompanhamentos, bebidas e milkshakes. Peça pelo WhatsApp.",
  },
  contact: {
    /** Número no formato internacional, só dígitos (ex.: "5511999999999"). Vazio = não configurado. */
    whatsapp: "",
    whatsappMessage: "Olá! Vim pelo site e gostaria de fazer um pedido.",
    /** Link completo da loja no iFood. Vazio = demonstração sem redirecionamento. */
    ifood: "",
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

  /** Conteúdo da seção "Sobre nós". */
  about: {
    eyebrow: "Sobre nós",
    title: "Nascida na brasa",
    paragraphs: [
      "A Brasa Burger começou com uma chapa, uma receita de molho e a vontade de fazer o hambúrguer que a gente sempre quis comer: simples, suculento e com crosta de verdade.",
      "Hoje seguimos do mesmo jeito — poucos ingredientes, muito cuidado e fogo alto.",
    ],
    /** Aviso exibido em sites de demonstração. Vazio = não exibe. */
    demoNotice: "História fictícia, criada apenas para demonstração deste modelo.",
  },

  /** Aviso de rodapé exibido em sites de demonstração. */
  footerNotice: "Marca fictícia — modelo demonstrativo. Imagens ilustrativas.",

  nav: [
    { label: "Início", href: "#inicio" },
    { label: "Cardápio", href: "#cardapio" },
    { label: "Sobre", href: "#sobre" },
    { label: "Contato", href: "#contato" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
