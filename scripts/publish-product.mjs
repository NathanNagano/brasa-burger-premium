import { createHash } from "node:crypto";
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
  if (!input || typeof input !== "object" || Array.isArray(input))
    fail("o conteúdo recebido não é um objeto.");

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

  const checksum = requiredString(raw.imageSha256, "checksum da imagem", 64).toLowerCase();
  if (!/^[a-f0-9]{64}$/.test(checksum)) fail("checksum da imagem deve usar SHA-256.");

  return { product, checksum };
}

function isWebp(buffer) {
  return (
    buffer.length >= 12 &&
    buffer.subarray(0, 4).toString("ascii") === "RIFF" &&
    buffer.subarray(8, 12).toString("ascii") === "WEBP"
  );
}

async function fetchImage(url) {
  let parsedUrl;
  try {
    parsedUrl = new URL(url);
  } catch {
    fail("URL temporária da imagem não é válida.");
  }
  if (parsedUrl.protocol !== "https:") fail("URL temporária da imagem deve usar HTTPS.");

  const response = await fetch(parsedUrl, { redirect: "error" });
  if (!response.ok) fail(`não foi possível baixar a imagem (${response.status}).`);

  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length === 0 || bytes.length > 5 * 1024 * 1024) {
    fail("imagem convertida deve ter entre 1 byte e 5 MB.");
  }
  if (!isWebp(bytes)) fail("arquivo recebido não é um WebP válido.");
  return bytes;
}

async function readCatalogue() {
  const parsed = JSON.parse(await readFile(cataloguePath, "utf8"));
  if (!Array.isArray(parsed)) throw new Error("automated-products.json precisa conter um array.");
  return parsed;
}

async function main() {
  const rawProduct = process.env.PRODUCT_JSON;
  const imageUrl = process.env.IMAGE_URL;
  if (!rawProduct) fail("PRODUCT_JSON não foi informado.");
  if (!imageUrl) fail("IMAGE_URL não foi informada.");

  let parsedProduct;
  try {
    parsedProduct = JSON.parse(rawProduct);
  } catch {
    fail("PRODUCT_JSON não contém JSON válido.");
  }

  const { product, checksum } = normalizeProduct(parsedProduct);
  const image = await fetchImage(imageUrl);
  const actualChecksum = createHash("sha256").update(image).digest("hex");
  if (actualChecksum !== checksum) fail("checksum da imagem não confere.");

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
