/**
 * Cardápio local. Estrutura pensada para ser substituída futuramente por uma
 * fonte externa (ex.: Google Sheets) — basta produzir um array `Product[]`
 * com os mesmos campos. Imagens são ilustrativas (geradas para demonstração).
 */
import agua from "@/assets/agua.webp";
import baconFire from "@/assets/bacon-fire.webp";
import batataBrasa from "@/assets/batata-brasa.webp";
import batataCrocante from "@/assets/batata-crocante.webp";
import brasaClassic from "@/assets/brasa-classic.webp";
import brasaDuplo from "@/assets/brasa-duplo.webp";
import brasaSmash from "@/assets/brasa-smash.webp";
import brownie from "@/assets/brownie.webp";
import chaGelado from "@/assets/cha-gelado.webp";
import cheddarOnion from "@/assets/cheddar-onion.webp";
import chickenBites from "@/assets/chicken-bites.webp";
import chickenCrunch from "@/assets/chicken-crunch.webp";
import comboClassic from "@/assets/combo-classic.webp";
import comboDuplo from "@/assets/combo-duplo.webp";
import comboFire from "@/assets/combo-fire.webp";
import comboSmash from "@/assets/combo-smash.webp";
import limonada from "@/assets/limonada.webp";
import milkshakeCaramelo from "@/assets/milkshake-caramelo.webp";
import milkshakeChocolate from "@/assets/milkshake-chocolate.webp";
import milkshakeMorango from "@/assets/milkshake-morango.webp";
import miniChurros from "@/assets/mini-churros.webp";
import onionRings from "@/assets/onion-rings.webp";
import veggieBrasa from "@/assets/veggie-brasa.webp";
import automatedProductsData from "./automated-products.json";

export type CategoryId = "hamburgueres" | "combos" | "acompanhamentos" | "bebidas" | "milkshakes";

export interface Category {
  id: CategoryId;
  label: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: CategoryId;
  image: string;
  badge?: string;
  featured?: boolean;
}

/**
 * Produtos enviados pelo fluxo de cadastro. O GitHub Actions só inclui dados
 * validados neste arquivo depois da aprovação na planilha.
 */
const automatedProducts = automatedProductsData as Product[];

export const categories: Category[] = [
  { id: "hamburgueres", label: "Hambúrgueres" },
  { id: "combos", label: "Combos" },
  { id: "acompanhamentos", label: "Acompanhamentos" },
  { id: "bebidas", label: "Bebidas" },
  { id: "milkshakes", label: "Milkshakes & sobremesas" },
];

const builtInProducts: Product[] = [
  {
    id: "brasa-smash",
    name: "Brasa Smash",
    description: "Pão brioche, burger smash, cheddar e molho especial.",
    price: 29.9,
    category: "hamburgueres",
    image: brasaSmash,
    badge: "Da casa",
    featured: true,
  },
  {
    id: "bacon-fire",
    name: "Bacon Fire",
    description: "Hambúrguer, bacon crocante, cheddar e cebola caramelizada.",
    price: 36.9,
    category: "hamburgueres",
    image: baconFire,
    badge: "Picante",
    featured: true,
  },
  {
    id: "classic-burger",
    name: "Classic Burger",
    description: "Hambúrguer, queijo, alface, tomate e maionese da casa.",
    price: 27.9,
    category: "hamburgueres",
    image: brasaClassic,
    badge: "Clássico",
  },
  {
    id: "brasa-duplo",
    name: "Brasa Duplo",
    description: "Dois burgers smash, cheddar duplo, picles e molho especial.",
    price: 39.9,
    category: "hamburgueres",
    image: brasaDuplo,
    badge: "Mais pedido",
  },
  {
    id: "cheddar-onion",
    name: "Cheddar Onion",
    description: "Burger smash, cheddar cremoso, cebola caramelizada e farofa de bacon.",
    price: 35.9,
    category: "hamburgueres",
    image: cheddarOnion,
    badge: "Novo",
  },
  {
    id: "chicken-crunch",
    name: "Chicken Crunch",
    description: "Frango empanado crocante, queijo, alface, picles e maionese temperada.",
    price: 31.9,
    category: "hamburgueres",
    image: chickenCrunch,
    badge: "Crocante",
  },
  {
    id: "veggie-brasa",
    name: "Veggie Brasa",
    description: "Burger vegetal, queijo, cebola caramelizada, rúcula e molho especial.",
    price: 30.9,
    category: "hamburgueres",
    image: veggieBrasa,
    badge: "Vegetariano",
  },
  {
    id: "combo-brasa",
    name: "Combo Brasa",
    description: "Brasa Smash, batata crocante e bebida lata.",
    price: 44.9,
    category: "combos",
    image: comboSmash,
    badge: "Combo",
  },
  {
    id: "combo-fire",
    name: "Combo Fire",
    description: "Bacon Fire, batata crocante e bebida lata.",
    price: 51.9,
    category: "combos",
    image: comboFire,
    badge: "Picante",
  },
  {
    id: "combo-classic",
    name: "Combo Classic",
    description: "Classic Burger, batata crocante e bebida lata.",
    price: 42.9,
    category: "combos",
    image: comboClassic,
    badge: "Econômico",
  },
  {
    id: "combo-duplo",
    name: "Combo Duplo",
    description: "Brasa Duplo, batata com cheddar e bacon, bebida lata.",
    price: 57.9,
    category: "combos",
    image: comboDuplo,
    badge: "Para matar a fome",
  },
  {
    id: "batata-crocante",
    name: "Batata Crocante",
    description: "Batatas douradas e crocantes, temperadas na hora.",
    price: 16.9,
    category: "acompanhamentos",
    image: batataCrocante,
  },
  {
    id: "batata-brasa",
    name: "Batata Brasa",
    description: "Batata frita com cheddar cremoso, bacon crocante e cheiro-verde.",
    price: 24.9,
    category: "acompanhamentos",
    image: batataBrasa,
    badge: "Da casa",
  },
  {
    id: "onion-rings",
    name: "Onion Rings",
    description: "Anéis de cebola empanados, sequinhos e crocantes.",
    price: 18.9,
    category: "acompanhamentos",
    image: onionRings,
  },
  {
    id: "chicken-bites",
    name: "Chicken Bites",
    description: "Pedaços de frango empanado acompanhados de molho da casa.",
    price: 22.9,
    category: "acompanhamentos",
    image: chickenBites,
  },
  {
    id: "mini-churros",
    name: "Mini Churros",
    description: "Mini churros com açúcar, canela e doce de leite.",
    price: 15.9,
    category: "acompanhamentos",
    image: miniChurros,
  },
  {
    id: "cha-gelado-limao",
    name: "Chá Gelado de Limão",
    description: "Chá preto gelado com limão.",
    price: 9.9,
    category: "bebidas",
    image: chaGelado,
  },
  {
    id: "limonada-da-casa",
    name: "Limonada da Casa",
    description: "Limão espremido, água com gás e toque de hortelã.",
    price: 10.9,
    category: "bebidas",
    image: limonada,
  },
  {
    id: "agua-mineral",
    name: "Água Mineral",
    description: "Sem gás ou com gás.",
    price: 5.9,
    category: "bebidas",
    image: agua,
  },
  {
    id: "milkshake-chocolate",
    name: "Milkshake Chocolate",
    description: "Cremoso, com chantilly e calda de chocolate.",
    price: 19.9,
    category: "milkshakes",
    image: milkshakeChocolate,
  },
  {
    id: "milkshake-morango",
    name: "Milkshake Morango",
    description: "Cremoso, com chantilly e calda de morango.",
    price: 19.9,
    category: "milkshakes",
    image: milkshakeMorango,
  },
  {
    id: "milkshake-caramelo-crocante",
    name: "Milkshake Caramelo Crocante",
    description: "Sorvete de baunilha, caramelo, chantilly e farofa crocante.",
    price: 21.9,
    category: "milkshakes",
    image: milkshakeCaramelo,
    badge: "Novo",
  },
  {
    id: "brownie-na-brasa",
    name: "Brownie na Brasa",
    description: "Brownie de chocolate quente com sorvete de baunilha e calda.",
    price: 18.9,
    category: "milkshakes",
    image: brownie,
  },
];

export const products: Product[] = [...builtInProducts, ...automatedProducts];

export function filterProducts(list: Product[], category: CategoryId | "todos"): Product[] {
  return category === "todos" ? list : list.filter((p) => p.category === category);
}
