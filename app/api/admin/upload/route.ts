import { NextRequest } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import {
  uploadImageToR2,
  isAllowedImageType,
  isAllowedFileSize,
  MAX_UPLOAD_SIZE_MB,
} from "@/lib/r2/client";
import { apiSuccess, apiError } from "@/lib/api-response";

/**
 * Handles image uploads for Hero and Teledrama forms. The browser sends the
 * raw file as multipart/form-data; this route validates type/size on the
 * server (never trusting client-side checks alone) and streams the bytes to
 * Cloudflare R2. R2 credentials never leave the server.
 */
export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session) return apiError("Not authenticated", 401);

  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const folderRaw = formData.get("folder");
    const folder = folderRaw === "teledramas" ? "teledramas" : "heroes";

    if (!(file instanceof File)) {
      return apiError("No file was provided", 400);
    }

    if (!isAllowedImageType(file.type)) {
      return apiError("Only JPEG, PNG, WEBP, or GIF images are allowed", 400);
    }

    if (!isAllowedFileSize(file.size)) {
      return apiError(`Image must be smaller than ${MAX_UPLOAD_SIZE_MB}MB`, 400);
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { key, url } = await uploadImageToR2(buffer, file.type, folder);

    return apiSuccess({ key, url });
  } catch (error) {
    console.error("Upload error:", error);
    return apiError("Image upload failed. Please try again.", 500);
  }
}
