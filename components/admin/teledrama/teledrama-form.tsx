"use client";

import { useState, FormEvent, useMemo } from "react";
import { Field, Input, Button } from "@/components/admin/ui/form-controls";
import { ImageUpload, UploadedImage } from "@/components/admin/image-upload";
import { slugify } from "@/lib/slugify";
import type { TeledramaResponse } from "@/types/admin";

export type TeledramaFormValues = { title: string, startingAt: string, duration: string };

export function TeledramaForm({
  initial,
  onCancel,
  onSubmit,
}: {
  initial?: TeledramaResponse;
  onCancel: () => void;
  onSubmit: (
    values: TeledramaFormValues,
    image: UploadedImage | null
  ) => Promise<Record<string, string> | void>;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [startingAt, setStartingAt] = useState(initial?.startingAt ?? "");
  const [duration, setDuration] = useState(initial?.duration ?? "30 Mins")
  const [image, setImage] = useState<UploadedImage | null>(
    initial ? { key: initial.thumbnailKey, url: initial.thumbnailUrl } : null
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  // Live preview only - the server independently derives and validates the
  // final (guaranteed-unique) slug, since frontend validation can't be trusted.
  const slugPreview = useMemo(() => slugify(title) || "your-title-here", [title]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const nextErrors: Record<string, string> = {};
    if (!title.trim()) nextErrors.title = "Title is required";
    if (!image) nextErrors.image = "Please upload a thumbnail image";

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setSubmitting(true);
    const serverErrors = await onSubmit({ title, duration, startingAt }, image);
    if (serverErrors) setErrors(serverErrors);
    setSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <ImageUpload
        folder="teledramas"
        value={image}
        onChange={setImage}
        error={errors.image}
        label="Thumbnail Image"
      />

      <Field label="Title" htmlFor="teledrama-title" error={errors.title}>
        <Input
          id="teledrama-title"
          value={title}
          hasError={Boolean(errors.title)}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="My New Teledrama"
          maxLength={150}
          required
        />
      </Field>
      <Field label="Starting at" htmlFor="teledrama-time" error={errors.startingAt}>
        <Input
          id="teledrama-time"
          value={startingAt}
          hasError={Boolean(errors.startingAt)}
          onChange={(e) => setStartingAt(e.target.value)}
          placeholder="5p.m - 6p.m"
          maxLength={150}
          required
        />
      </Field>
      <Field label="Duration" htmlFor="teledrama-duration" error={errors.duration}>
        <Input
          id="teledrama-duration"
          value={duration}
          hasError={Boolean(errors.duration)}
          onChange={(e) => setDuration(e.target.value)}
          placeholder="1 hr"
          maxLength={15}
          required
        />
      </Field>

      <div>
        <span className="text-sm font-medium text-slate-200">Slug (auto-generated)</span>
        <p className="mt-1.5 rounded-md border border-slate-800 bg-slate-950 px-3 py-2 font-mono text-sm text-indigo-400">
          {slugPreview}
        </p>
        <p className="mt-1 text-xs text-slate-500">
          The final slug is generated and validated on the server, and a numeric suffix is added automatically if it&apos;s already taken.
        </p>
      </div>

      <div className="mt-2 flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
        <Button type="submit" loading={submitting}>
          {initial ? "Save Changes" : "Add Teledrama"}
        </Button>
      </div>
    </form>
  );
}
