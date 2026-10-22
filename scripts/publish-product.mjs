import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const rootDirectory = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const cataloguePath = resolve(rootDirectory, "src/data/automated-products.json");
const productsDirectory = resolve(rootDirectory, "public/assets/products");
const categories = new Set(["hamburgueres", "combos", "acompanhamentos", "bebidas", "milkshakes"]);

function fail(message) {
  throw new Error(`Produto inválido: ${message}`);
}

function requiredString(value, field, maxLength) {
  if (typeof value !== "string") fail(`${field} precisa ser texto.`);
  const normalized = value.trim().replace(/\s+/g, " ");
  if (!normalized) fail(`${field} é obrigatório.`);
  if (normalized.length > maxLength) fail(`${field} excede ${maxLength} caracteres.`);
  return normalized;
}

function normalizeProduct(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    fail("o conteúdo recebido não é um objeto.");
  }

  const raw = input;
  const id = requiredString(raw.id, "id", 80);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) {
    fail("id deve conter apenas letras minúsculas, números e hífens.");
  }

  const category = requiredString(raw.category, "categoria", 40);
  if (!categories.has(category)) fail("categoria não existe no cardápio.");
  if (!Number.isSafeInteger(raw.priceCents) || raw.priceCents < 1 || raw.priceCents > 1_000_000) {
    fail("preço deve ser informado em centavos entre 1 e 1.000.000.");
  }

  const product = {
    id,
    name: requiredString(raw.name, "nome", 100),
    description: requiredString(raw.description, "descrição", 300),
    price: raw.priceCents / 100,
    category,
    image: `/assets/products/${id}.webp`,
  };

  if (raw.badge !== undefined && raw.badge !== null && String(raw.badge).trim()) {
    product.badge = requiredString(raw.badge, "selo", 40);
  }
  if (raw.featured !== undefined) {
    if (typeof raw.featured !== "boolean") fail("destaque deve ser verdadeiro ou falso.");
    product.featured = raw.featured;
  }
  return product;
}

function isWebp(buffer) {
  return (
    buffer.length >= 12 &&
    buffer.subarray(0, 4).toString("ascii") === "RIFF" &&
    buffer.subarray(8, 12).toString("ascii") === "WEBP"
  );
}

async function readCatalogue() {
  const parsed = JSON.parse(await readFile(cataloguePath, "utf8"));
  if (!Array.isArray(parsed)) throw new Error("automated-products.json precisa conter um array.");
  return parsed;
}

async function main() {
  const rawProduct = process.env.PRODUCT_JSON;
  const sourceImagePath = process.env.IMAGE_PATH;
  if (!rawProduct) fail("PRODUCT_JSON não foi informado.");
  if (!sourceImagePath) fail("IMAGE_PATH não foi informada.");

  let parsedProduct;
  try {
    parsedProduct = JSON.parse(rawProduct);
  } catch {
    fail("PRODUCT_JSON não contém JSON válido.");
  }

  const product = normalizeProduct(parsedProduct);
  const image = await readFile(sourceImagePath);
  if (image.length === 0 || image.length > 5 * 1024 * 1024 || !isWebp(image)) {
    fail("a imagem convertida deve ser um WebP válido de até 5 MB.");
  }

  const catalogue = await readCatalogue();
  const replacementIndex = catalogue.findIndex((item) => item?.id === product.id);
  if (replacementIndex >= 0) catalogue[replacementIndex] = product;
  else catalogue.push(product);

  await mkdir(productsDirectory, { recursive: true });
  const imagePath = resolve(productsDirectory, `${product.id}.webp`);
  const temporaryImagePath = `${imagePath}.tmp`;
  const temporaryCataloguePath = `${cataloguePath}.tmp`;
  await writeFile(temporaryImagePath, image);
  await writeFile(temporaryCataloguePath, `${JSON.stringify(catalogue, null, 2)}\n`, "utf8");
  await rename(temporaryImagePath, imagePath);
  await rename(temporaryCataloguePath, cataloguePath);

  process.stdout.write(`${JSON.stringify({ id: product.id, imagePath, cataloguePath })}\n`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
