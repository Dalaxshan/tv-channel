"use client";

import { useState, FormEvent } from "react";
import { Field, Input, Button } from "@/components/admin/ui/form-controls";
import { ImageUpload, UploadedImage } from "@/components/admin/image-upload";
import type { HeroResponse } from "@/types/admin";

export type HeroFormValues = {
  title: string;
  subtitle: string;
  badge: string;
  ctaButtonText: string;
  ctaButtonUrl: string;
};

export function HeroForm({
  initial,
  onCancel,
  onSubmit,
}: {
  initial?: HeroResponse;
  onCancel: () => void;
  onSubmit: (values: HeroFormValues, image: UploadedImage | null) => Promise<Record<string, string> | void>;
}) {
  const [values, setValues] = useState<HeroFormValues>({
    title: initial?.title ?? "",
    subtitle: initial?.subtitle ?? "",
    badge: initial?.badge ?? "",
    ctaButtonText: initial?.cta.buttonText ?? "",
    ctaButtonUrl: initial?.cta.buttonUrl ?? "",
  });
  const [image, setImage] = useState<UploadedImage | null>(
    initial ? { key: initial.imageKey, url: initial.imageUrl } : null
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  function set<K extends keyof HeroFormValues>(key: K, value: HeroFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const nextErrors: Record<string, string> = {};
    if (!values.title.trim()) nextErrors.title = "Title is required";
    if (!values.subtitle.trim()) nextErrors.subtitle = "Subtitle is required";
    if (!values.badge.trim()) nextErrors.badge = "Badge is required";
    if (!values.ctaButtonText.trim()) nextErrors.ctaButtonText = "Button text is required";
    if (!values.ctaButtonUrl.trim()) nextErrors.ctaButtonUrl = "Button URL is required";
    if (!image) nextErrors.image = "Please upload a hero image";

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setSubmitting(true);
    const serverErrors = await onSubmit(values, image);
    if (serverErrors) setErrors(serverErrors);
    setSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <ImageUpload folder="heroes" value={image} onChange={setImage} error={errors.image} label="Hero Image" />

      <Field label="Title" htmlFor="hero-title" error={errors.title}>
        <Input
          id="hero-title"
          value={values.title}
          hasError={Boolean(errors.title)}
          onChange={(e) => set("title", e.target.value)}
          placeholder="Breaking News Tonight"
          maxLength={150}
          required
        />
      </Field>

      <Field label="Subtitle" htmlFor="hero-subtitle" error={errors.subtitle}>
        <Input
          id="hero-subtitle"
          value={values.subtitle}
          hasError={Boolean(errors.subtitle)}
          onChange={(e) => set("subtitle", e.target.value)}
          placeholder="Stay ahead with our live coverage"
          maxLength={300}
          required
        />
      </Field>

      <Field label="Badge" htmlFor="hero-badge" error={errors.badge} hint="A short label, e.g. 'Live Now' or 'New'">
        <Input
          id="hero-badge"
          value={values.badge}
          hasError={Boolean(errors.badge)}
          onChange={(e) => set("badge", e.target.value)}
          placeholder="Live Now"
          maxLength={40}
          required
        />
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="CTA Button Text" htmlFor="hero-cta-text" error={errors.ctaButtonText}>
          <Input
            id="hero-cta-text"
            value={values.ctaButtonText}
            hasError={Boolean(errors.ctaButtonText)}
            onChange={(e) => set("ctaButtonText", e.target.value)}
            placeholder="Watch Live"
            maxLength={40}
            required
          />
        </Field>

        <Field label="CTA Button URL" htmlFor="hero-cta-url" error={errors.ctaButtonUrl}>
          <Input
            id="hero-cta-url"
            value={values.ctaButtonUrl}
            hasError={Boolean(errors.ctaButtonUrl)}
            onChange={(e) => set("ctaButtonUrl", e.target.value)}
            placeholder="/watch-live"
            required
          />
        </Field>
      </div>

      <div className="mt-2 flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
        <Button type="submit" loading={submitting}>
          {initial ? "Save Changes" : "Add Hero"}
        </Button>
      </div>
    </form>
  );
}
