/**
 * Cardápio local. Estrutura pensada para ser substituída futuramente por uma
 * fonte externa (ex.: Google Sheets) — basta produzir um array `Product[]`
 * com os mesmos campos. Imagens são ilustrativas (geradas para demonstração).
 */
import brasaSmash from "@/assets/brasa-smash.jpg";
import baconFire from "@/assets/bacon-fire.jpg";
import classicBurger from "@/assets/classic-burger.jpg";
import comboBrasa from "@/assets/combo-brasa.webp";
import batata from "@/assets/batata.jpg";
import refrigerante from "@/assets/refrigerante.jpg";
import milkshakes from "@/assets/milkshakes.jpg";

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

export const categories: Category[] = [
  { id: "hamburgueres", label: "Hambúrgueres" },
  { id: "combos", label: "Combos" },
  { id: "acompanhamentos", label: "Acompanhamentos" },
  { id: "bebidas", label: "Bebidas" },
  { id: "milkshakes", label: "Milkshakes" },
];

export const products: Product[] = [
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
    description: "Hambúrguer, queijo, alface e tomate.",
    price: 27.9,
    category: "hamburgueres",
    image: classicBurger,
  },
  {
    id: "combo-brasa",
    name: "Combo Brasa",
    description: "Brasa Smash, batata e bebida.",
    price: 44.9,
    category: "combos",
    image: comboBrasa,
    badge: "Combo",
  },
  {
    id: "batata-crocante",
    name: "Batata Crocante",
    description: "Batatas douradas e crocantes, temperadas na hora.",
    price: 16.9,
    category: "acompanhamentos",
    image: batata,
  },
  {
    id: "refrigerante-lata",
    name: "Refrigerante Lata",
    description: "Lata 350 ml bem gelada.",
    price: 7.9,
    category: "bebidas",
    image: refrigerante,
  },
  {
    id: "milkshake-chocolate",
    name: "Milkshake Chocolate",
    description: "Cremoso, com chantilly e calda de chocolate.",
    price: 19.9,
    category: "milkshakes",
    image: milkshakes,
  },
  {
    id: "milkshake-morango",
    name: "Milkshake Morango",
    description: "Cremoso, com chantilly e calda de morango.",
    price: 19.9,
    category: "milkshakes",
    image: milkshakes,
  },
];

export function filterProducts(list: Product[], category: CategoryId | "todos"): Product[] {
  return category === "todos" ? list : list.filter((p) => p.category === category);
}
