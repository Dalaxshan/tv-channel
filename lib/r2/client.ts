import "server-only";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";

/**
 * Cloudflare R2 is S3-compatible, so we use the AWS SDK's S3 client pointed
 * at the account's R2 endpoint. This file is server-only: access keys are
 * read from environment variables and never sent to the browser.
 */

function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing ${name} environment variable. Add it to your .env.local file.`);
  }
  return value;
}

let cachedClient: S3Client | null = null;

function getR2Client(): S3Client {
  if (cachedClient) return cachedClient;

  cachedClient = new S3Client({
    region: "auto",
    endpoint: getEnv("R2_ENDPOINT"),
    credentials: {
      accessKeyId: getEnv("R2_ACCESS_KEY_ID"),
      secretAccessKey: getEnv("R2_SECRET_ACCESS_KEY"),
    },
  });

  return cachedClient;
}

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export function isAllowedImageType(mimeType: string): boolean {
  return ALLOWED_MIME_TYPES.has(mimeType);
}

export function isAllowedFileSize(sizeBytes: number): boolean {
  return sizeBytes > 0 && sizeBytes <= MAX_FILE_SIZE_BYTES;
}

export const MAX_UPLOAD_SIZE_MB = MAX_FILE_SIZE_BYTES / (1024 * 1024);

function extensionFromMimeType(mimeType: string): string {
  switch (mimeType) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/gif":
      return "gif";
    default:
      return "bin";
  }
}

/**
 * Uploads a file buffer directly to R2 from the server (used by our API
 * route, which receives the multipart file from the browser, validates it,
 * then streams it to R2 - the R2 credentials never touch the client).
 */
export async function uploadImageToR2(
  buffer: Buffer,
  mimeType: string,
  folder: "heroes" | "teledramas"
): Promise<{ key: string; url: string }> {
  const key = `${folder}/${randomUUID()}.${extensionFromMimeType(mimeType)}`;

  await getR2Client().send(
    new PutObjectCommand({
      Bucket: getEnv("R2_BUCKET_NAME"),
      Key: key,
      Body: buffer,
      ContentType: mimeType,
    })
  );

  return { key, url: publicUrlForKey(key) };
}

/** Deletes an object from R2 (used when replacing/removing an image). */
export async function deleteImageFromR2(key: string): Promise<void> {
  if (!key) return;
  try {
    await getR2Client().send(
      new DeleteObjectCommand({
        Bucket: getEnv("R2_BUCKET_NAME"),
        Key: key,
      })
    );
  } catch (error) {
    // Non-fatal: log and continue. We don't want a stale-file cleanup
    // failure to block the primary DB operation the user is waiting on.
    console.error(`Failed to delete R2 object "${key}":`, error);
  }
}

/** Builds the public URL for an object key using the configured public base URL. */
export function publicUrlForKey(key: string): string {
  const base = getEnv("R2_PUBLIC_URL").replace(/\/$/, "");
  return `${base}/${key}`;
}

/**
 * Generates a short-lived presigned PUT URL, for clients that want to
 * upload directly to R2 without proxying bytes through the Next.js server.
 * Not used by the default form flow (which proxies through /api/admin/upload
 * for simpler validation), but exposed for future direct-upload flows.
 */
export async function createPresignedUploadUrl(
  mimeType: string,
  folder: "heroes" | "teledramas"
): Promise<{ key: string; uploadUrl: string; publicUrl: string }> {
  const key = `${folder}/${randomUUID()}.${extensionFromMimeType(mimeType)}`;

  const command = new PutObjectCommand({
    Bucket: getEnv("R2_BUCKET_NAME"),
    Key: key,
    ContentType: mimeType,
  });

  const uploadUrl = await getSignedUrl(getR2Client(), command, { expiresIn: 300 });

  return { key, uploadUrl, publicUrl: publicUrlForKey(key) };
}
