import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import sharp from "sharp";

const sourcePath = process.env.SOURCE_IMAGE_PATH;
const targetPath = process.env.TARGET_WEBP_PATH;

if (!sourcePath || !targetPath) {
  throw new Error("SOURCE_IMAGE_PATH e TARGET_WEBP_PATH são obrigatórias.");
}

const source = await readFile(sourcePath);
if (source.length === 0 || source.length > 10 * 1024 * 1024) {
  throw new Error("a imagem original deve ter entre 1 byte e 10 MB.");
}

const metadata = await sharp(source, { limitInputPixels: 40_000_000, failOn: "error" }).metadata();
if (!metadata.format || !["jpeg", "png", "webp"].includes(metadata.format)) {
  throw new Error("a foto deve ser JPEG, PNG ou WebP.");
}

const converted = await sharp(source, { limitInputPixels: 40_000_000, failOn: "error" })
  .rotate()
  .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
  .webp({ quality: 84, effort: 5 })
  .toBuffer();

if (converted.length > 5 * 1024 * 1024) {
  throw new Error("o WebP resultante excede 5 MB.");
}

await mkdir(dirname(targetPath), { recursive: true });
await writeFile(targetPath, converted);
