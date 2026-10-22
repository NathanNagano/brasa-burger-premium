import { createHash, timingSafeEqual } from "node:crypto";
import { Storage } from "@google-cloud/storage";
import express from "express";
import sharp from "sharp";

const bucketName = requiredEnvironment("STAGING_BUCKET");
const sharedSecret = requiredEnvironment("CONVERTER_SHARED_SECRET");
const storage = new Storage();
const bucket = storage.bucket(bucketName);
const app = express();

function requiredEnvironment(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Variável obrigatória ausente: ${name}`);
  return value;
}

function secretIsValid(received) {
  if (typeof received !== "string") return false;
  const expectedBuffer = Buffer.from(sharedSecret);
  const receivedBuffer = Buffer.from(received);
  return (
    expectedBuffer.length === receivedBuffer.length &&
    timingSafeEqual(expectedBuffer, receivedBuffer)
  );
}

function requireSecret(request, response, next) {
  if (!secretIsValid(request.get("x-converter-secret"))) {
    response.status(401).json({ error: "não autorizado" });
    return;
  }
  next();
}

function productId(value) {
  if (typeof value !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) || value.length > 80) {
    throw new Error("ID de produto inválido");
  }
  return value;
}

function errorHandler(error, request, response, next) {
  console.error(error);
  response
    .status(400)
    .json({ error: error instanceof Error ? error.message : "requisição inválida" });
}

app.get("/health", (request, response) => response.json({ ok: true }));

app.post(
  "/convert",
  requireSecret,
  express.raw({ type: "*/*", limit: "15mb" }),
  async (request, response, next) => {
    try {
      const id = productId(request.get("x-product-id"));
      const source = Buffer.from(request.body || []);
      if (!source.length) throw new Error("imagem ausente");

      const metadata = await sharp(source, {
        limitInputPixels: 40_000_000,
        failOn: "error",
      }).metadata();
      if (!metadata.format || !["jpeg", "png", "webp"].includes(metadata.format)) {
        throw new Error("a foto deve ser JPEG, PNG ou WebP");
      }

      const output = await sharp(source, { limitInputPixels: 40_000_000, failOn: "error" })
        .rotate()
        .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
        .webp({ quality: 84, effort: 5 })
        .toBuffer();
      const sha256 = createHash("sha256").update(output).digest("hex");
      const objectName = `products/${id}/${sha256}.webp`;
      await bucket.file(objectName).save(output, {
        resumable: false,
        contentType: "image/webp",
        metadata: {
          cacheControl: "private, max-age=0, no-transform",
          metadata: { productId: id, sha256 },
        },
      });

      response.json({ objectName, sha256, bytes: output.length });
    } catch (error) {
      next(error);
    }
  },
);

app.post(
  "/signed-download",
  requireSecret,
  express.json({ limit: "8kb" }),
  async (request, response, next) => {
    try {
      const objectName = String(request.body?.objectName || "");
      if (!/^products\/[a-z0-9]+(?:-[a-z0-9]+)*\/[a-f0-9]{64}\.webp$/.test(objectName)) {
        throw new Error("objeto de staging inválido");
      }
      const file = bucket.file(objectName);
      const [exists] = await file.exists();
      if (!exists) throw new Error("imagem de staging não encontrada");
      const [url] = await file.getSignedUrl({
        version: "v4",
        action: "read",
        expires: Date.now() + 15 * 60 * 1000,
      });
      response.json({ url, expiresInSeconds: 900 });
    } catch (error) {
      next(error);
    }
  },
);

app.use(errorHandler);

const port = Number(process.env.PORT || 8080);
app.listen(port, () => console.log(`Conversor de produtos ouvindo na porta ${port}`));
