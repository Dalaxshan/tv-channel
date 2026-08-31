"use client";

import { useState, FormEvent, useMemo } from "react";
import { Field, Input, Button } from "@/components/admin/ui/form-controls";
import { SCHEDULE_DAYS, computeBlock, isValidTime } from "@/lib/schedule-block";
import type { ScheduleResponse } from "@/types/admin";

export type ScheduleFormValues = {
  day: string;
  time: string;
  title: string;
  category: string;
};

export function ScheduleForm({
  initial,
  defaultDay,
  onCancel,
  onSubmit,
}: {
  initial?: ScheduleResponse;
  defaultDay?: string;
  onCancel: () => void;
  onSubmit: (values: ScheduleFormValues) => Promise<Record<string, string> | void>;
}) {
  const [values, setValues] = useState<ScheduleFormValues>({
    day: initial?.day ?? defaultDay ?? SCHEDULE_DAYS[0],
    time: initial?.time ?? "",
    title: initial?.title ?? "",
    category: initial?.category ?? "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  function set<K extends keyof ScheduleFormValues>(key: K, value: ScheduleFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  const blockPreview = useMemo(
    () => (isValidTime(values.time) ? computeBlock(values.time) : null),
    [values.time]
  );

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const nextErrors: Record<string, string> = {};
    if (!values.day) nextErrors.day = "Day is required";
    if (!values.time || !isValidTime(values.time)) nextErrors.time = "Enter a valid time";
    if (!values.title.trim()) nextErrors.title = "Title is required";
    if (!values.category.trim()) nextErrors.category = "Category is required";

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setSubmitting(true);
    const serverErrors = await onSubmit(values);
    if (serverErrors) setErrors(serverErrors);
    setSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <Field label="Day" htmlFor="schedule-day" error={errors.day}>
        <select
          id="schedule-day"
          value={values.day}
          onChange={(e) => set("day", e.target.value)}
          className={`w-full rounded-md border bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none transition focus:ring-2 focus:ring-offset-0 ${
            errors.day ? "border-red-600 focus:ring-red-600/40" : "border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/40"
          }`}
        >
          {SCHEDULE_DAYS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </Field>

      <Field
        label="Time"
        htmlFor="schedule-time"
        error={errors.time}
        hint={blockPreview ? `Falls under the "${blockPreview}" block` : "24-hour format, e.g. 19:30"}
      >
        <Input
          id="schedule-time"
          type="time"
          value={values.time}
          hasError={Boolean(errors.time)}
          onChange={(e) => set("time", e.target.value)}
          required
        />
      </Field>

      <Field label="Title" htmlFor="schedule-title" error={errors.title}>
        <Input
          id="schedule-title"
          value={values.title}
          hasError={Boolean(errors.title)}
          onChange={(e) => set("title", e.target.value)}
          placeholder="Evening News"
          maxLength={150}
          required
        />
      </Field>

      <Field label="Category" htmlFor="schedule-category" error={errors.category}>
        <Input
          id="schedule-category"
          value={values.category}
          hasError={Boolean(errors.category)}
          onChange={(e) => set("category", e.target.value)}
          placeholder="News, Teledrama, Kids, Movie…"
          maxLength={40}
          required
        />
      </Field>

      <div className="mt-2 flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
        <Button type="submit" loading={submitting}>
          {initial ? "Save Changes" : "Add Schedule"}
        </Button>
      </div>
    </form>
  );
}
