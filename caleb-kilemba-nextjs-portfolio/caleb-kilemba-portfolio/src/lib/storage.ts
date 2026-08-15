import "server-only";
import crypto from "node:crypto";
import path from "node:path";
import { mkdir, writeFile } from "node:fs/promises";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const maxBytes = 5 * 1024 * 1024;

export async function uploadImage(file: File) {
  if (!allowedTypes.has(file.type)) throw new Error("Only JPG, PNG, WebP and GIF images are allowed.");
  if (file.size > maxBytes) throw new Error("Image must be 5 MB or smaller.");

  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const key = `uploads/${Date.now()}-${crypto.randomBytes(6).toString("hex")}.${extension}`;
  const bytes = Buffer.from(await file.arrayBuffer());
  const mode = process.env.IMAGE_STORAGE_MODE || "local";

  if (mode === "s3") {
    const bucket = process.env.S3_BUCKET;
    const publicBase = process.env.S3_PUBLIC_BASE_URL;
    if (!bucket || !publicBase) throw new Error("S3 storage is not fully configured.");
    const client = new S3Client({
      region: process.env.S3_REGION || "auto",
      endpoint: process.env.S3_ENDPOINT || undefined,
      forcePathStyle: process.env.S3_FORCE_PATH_STYLE === "true",
      credentials: process.env.S3_ACCESS_KEY_ID && process.env.S3_SECRET_ACCESS_KEY
        ? { accessKeyId: process.env.S3_ACCESS_KEY_ID, secretAccessKey: process.env.S3_SECRET_ACCESS_KEY }
        : undefined
    });
    await client.send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: bytes, ContentType: file.type }));
    return `${publicBase.replace(/\/$/, "")}/${key}`;
  }

  const destination = path.join(process.cwd(), "public", key);
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, bytes);
  return `/${key}`;
}
