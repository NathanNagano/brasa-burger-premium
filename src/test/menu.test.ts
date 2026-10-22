import { describe, expect, it } from "vitest";
import { filterProducts, products } from "@/data/products";
import { buildWhatsappLink } from "@/lib/whatsapp";

describe("cardápio", () => {
  it("filtra milkshakes", () => {
    expect(filterProducts(products, "milkshakes").map((p) => p.id)).toEqual([
      "milkshake-chocolate",
      "milkshake-morango",
      "milkshake-caramelo-crocante",
      "brownie-na-brasa",
    ]);
  });
  it("Brasa Smash custa R$ 29,90", () => {
    expect(products.find((p) => p.id === "brasa-smash")?.price).toBe(29.9);
  });
});

describe("whatsapp", () => {
  it("sem número configurado não gera link", () => {
    expect(buildWhatsappLink("oi", "")).toBeNull();
  });
  it("com número gera link wa.me", () => {
    expect(buildWhatsappLink("oi", "5511900000000")).toBe("https://wa.me/5511900000000?text=oi");
  });
});
