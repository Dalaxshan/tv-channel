"use client";

import { useRef, useState } from "react";
import { ImagePlus, X, Loader2, ImageOff } from "lucide-react";
import { useToast } from "@/components/admin/toast";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

export type UploadedImage = { key: string; url: string };

export function ImageUpload({
  folder,
  value,
  onChange,
  error,
  label = "Image",
}: {
  folder: "heroes" | "teledramas";
  value: UploadedImage | null;
  onChange: (image: UploadedImage | null) => void;
  error?: string;
  label?: string;
}) {
  const toast = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);

  const displayUrl = previewUrl ?? value?.url ?? null;

  async function handleFileSelected(file: File) {
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("Only JPEG, PNG, WEBP, or GIF images are allowed");
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      toast.error("Image must be smaller than 5MB");
      return;
    }

    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);
    setLoadFailed(false);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || "Upload failed");
      }

      onChange({ key: json.data.key, url: json.data.url });
      toast.success("Image uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed. Please try again.");
      setPreviewUrl(null);
      onChange(null);
    } finally {
      setUploading(false);
    }
  }

  function handleRemove() {
    setPreviewUrl(null);
    onChange(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-slate-200">{label}</span>

      <div
        className={`relative flex min-h-[10rem] flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-dashed transition ${
          error ? "border-red-600" : "border-slate-700 hover:border-indigo-500"
        }`}
      >
        {displayUrl && !loadFailed ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={displayUrl}
              alt="Preview"
              className="h-40 w-full object-cover"
              onError={() => setLoadFailed(true)}
            />
            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                <Loader2 className="h-6 w-6 animate-spin text-white" />
              </div>
            )}
            {!uploading && (
              <div className="absolute right-2 top-2 flex gap-1.5">
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="rounded-md bg-slate-900/90 px-2 py-1 text-xs font-medium text-white hover:bg-slate-800"
                >
                  Change
                </button>
                <button
                  type="button"
                  onClick={handleRemove}
                  className="rounded-md bg-slate-900/90 p-1.5 text-white hover:bg-red-700"
                  aria-label="Remove image"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex flex-col items-center gap-2 px-4 py-8 text-slate-400 hover:text-indigo-400"
          >
            {loadFailed ? <ImageOff className="h-8 w-8" /> : <ImagePlus className="h-8 w-8" />}
            <span className="text-sm font-medium">
              {loadFailed ? "Image failed to load - click to replace" : "Click to upload an image"}
            </span>
            <span className="text-xs text-slate-500">JPEG, PNG, WEBP, or GIF - up to 5MB</span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ALLOWED_TYPES.join(",")}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileSelected(file);
        }}
      />

      {error && <p className="text-xs font-medium text-red-400">{error}</p>}
    </div>
  );
}
