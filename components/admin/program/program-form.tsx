"use client";

import { useState, FormEvent, useMemo } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Field, Input, Button } from "@/components/admin/ui/form-controls";
import { ImageUpload, UploadedImage } from "@/components/admin/image-upload";
import { slugify } from "@/lib/slugify";
import { SCHEDULE_DAYS, SCHEDULE_DAY_SHORT, type ScheduleDay } from "@/lib/schedule-block";
import { PROGRAM_CATEGORIES, type ProgramCategory, type ProgramResponse, type ProgramScheduleEntry } from "@/types/admin";
import { cn } from "@/lib/utils";

export type ProgramFormValues = {
  title: string;
  category: ProgramCategory;
  effectiveFrom: string;
  effectiveEnd: string;
  schedule: ProgramScheduleEntry[];
};

/**
 * One row in the schedule editor. A row represents a single starting/end
 * time shared across one or more days — e.g. "Mon–Fri, 19:00–20:00" is one
 * row with five days selected, not five separate rows. This is purely a
 * form-editing convenience: on submit, each row is flattened back into the
 * flat `{ day, startingTime, endTime }[]` shape the API and database use,
 * so no backend changes are needed and no duplicate program records are
 * ever created.
 */
type ScheduleGroup = {
  key: string;
  days: ScheduleDay[];
  startingTime: string;
  endTime: string;
};

function makeKey(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `row-${Math.random().toString(36).slice(2)}`;
}

function emptyGroup(): ScheduleGroup {
  return { key: makeKey(), days: [], startingTime: "", endTime: "" };
}

/** Collapses flat schedule entries into grouped rows for editing — entries that share the same time become one row with multiple days selected. */
function groupsFromEntries(entries: ProgramScheduleEntry[]): ScheduleGroup[] {
  const byTime = new Map<string, ScheduleGroup>();
  for (const entry of entries) {
    const timeKey = `${entry.startingTime}|${entry.endTime}`;
    const existing = byTime.get(timeKey);
    if (existing) {
      if (!existing.days.includes(entry.day)) existing.days.push(entry.day);
    } else {
      byTime.set(timeKey, {
        key: makeKey(),
        days: [entry.day],
        startingTime: entry.startingTime,
        endTime: entry.endTime,
      });
    }
  }
  return Array.from(byTime.values()).map((group) => ({
    ...group,
    days: SCHEDULE_DAYS.filter((d) => group.days.includes(d)), // stable Mon→Sun order
  }));
}

/** Expands grouped rows back into one flat entry per selected day — the shape stored in MongoDB. */
function entriesFromGroups(groups: ScheduleGroup[]): ProgramScheduleEntry[] {
  return groups.flatMap((group) =>
    group.days.map((day) => ({ day, startingTime: group.startingTime, endTime: group.endTime }))
  );
}

const DAY_PRESETS: { label: string; days: ScheduleDay[] }[] = [
  { label: "Weekdays", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] },
  { label: "Weekend", days: ["Saturday", "Sunday"] },
  { label: "Every day", days: [...SCHEDULE_DAYS] },
];

export function ProgramForm({
  initial,
  onCancel,
  onSubmit,
}: {
  initial?: ProgramResponse;
  onCancel: () => void;
  onSubmit: (
    values: ProgramFormValues,
    image: UploadedImage | null
  ) => Promise<Record<string, string> | void>;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [category, setCategory] = useState<ProgramCategory>(initial?.category ?? PROGRAM_CATEGORIES[0]);
  const [effectiveFrom, setEffectiveFrom] = useState(
    initial ? toDateValue(initial.effectiveFrom) : ""
  );
  const [effectiveEnd, setEffectiveEnd] = useState(
    initial ? toDateValue(initial.effectiveEnd) : ""
  );
  const [groups, setGroups] = useState<ScheduleGroup[]>(
    initial?.schedule?.length ? groupsFromEntries(initial.schedule) : [emptyGroup()]
  );
  const [image, setImage] = useState<UploadedImage | null>(
    initial ? { key: initial.thumbnailKey, url: initial.thumbnailUrl } : null
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  // Live preview only — the server independently derives and validates the
  // final (guaranteed-unique) slug, since frontend validation can't be trusted.
  const slugPreview = useMemo(() => slugify(title) || "your-title-here", [title]);

  function updateGroup(key: string, patch: Partial<ScheduleGroup>) {
    setGroups((rows) => rows.map((row) => (row.key === key ? { ...row, ...patch } : row)));
  }

  function toggleDay(key: string, day: ScheduleDay) {
    setGroups((rows) =>
      rows.map((row) => {
        if (row.key !== key) return row;
        const nextDays = row.days.includes(day)
          ? row.days.filter((d) => d !== day)
          : SCHEDULE_DAYS.filter((d) => d === day || row.days.includes(d));
        return { ...row, days: nextDays };
      })
    );
  }

  function applyPreset(key: string, days: ScheduleDay[]) {
    updateGroup(key, { days });
  }

  function addGroup() {
    setGroups((rows) => [...rows, emptyGroup()]);
  }

  function removeGroup(key: string) {
    setGroups((rows) => rows.filter((row) => row.key !== key));
  }

  /** Days already claimed by other rows — disabled here so one program can't accidentally get two conflicting time slots on the same day. */
  function daysUsedElsewhere(currentKey: string): Set<ScheduleDay> {
    const used = new Set<ScheduleDay>();
    for (const row of groups) {
      if (row.key === currentKey) continue;
      for (const d of row.days) used.add(d);
    }
    return used;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const nextErrors: Record<string, string> = {};
    if (!title.trim()) nextErrors.title = "Title is required";
    if (!image) nextErrors.image = "Please upload a thumbnail image";
    if (!effectiveFrom) nextErrors.effectiveFrom = "Effective From is required";
    if (!effectiveEnd) nextErrors.effectiveEnd = "Effective End is required";
    if (effectiveFrom && effectiveEnd && new Date(effectiveEnd) < new Date(effectiveFrom)) {
      nextErrors.effectiveEnd = "Effective End must not be earlier than Effective From";
    }

    if (groups.length === 0) {
      nextErrors.schedule = "Add at least one schedule entry";
    } else {
      const claimedDays = new Map<ScheduleDay, number>();
      groups.forEach((row, i) => {
        if (row.days.length === 0) nextErrors[`group.${i}.days`] = "Select at least one day";
        if (!row.startingTime) nextErrors[`group.${i}.startingTime`] = "Required";
        if (!row.endTime) nextErrors[`group.${i}.endTime`] = "Required";
        if (row.startingTime && row.endTime && row.endTime <= row.startingTime) {
          nextErrors[`group.${i}.endTime`] = "Must be later than starting time";
        }
        row.days.forEach((day) => {
          if (claimedDays.has(day)) {
            nextErrors.schedule = `${day} is selected in more than one schedule row`;
          }
          claimedDays.set(day, i);
        });
      });
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setSubmitting(true);
    const schedule = entriesFromGroups(groups);
    const serverErrors = await onSubmit({ title, category, effectiveFrom, effectiveEnd, schedule }, image);
    if (serverErrors) setErrors(serverErrors);
    setSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <ImageUpload folder="programs" value={image} onChange={setImage} error={errors.image} label="Thumbnail Image" />

      <Field label="Title" htmlFor="program-title" error={errors.title}>
        <Input
          id="program-title"
          value={title}
          hasError={Boolean(errors.title)}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Evening News"
          maxLength={150}
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

      <Field label="Category" htmlFor="program-category" error={errors.category}>
        <select
          id="program-category"
          value={category}
          onChange={(e) => setCategory(e.target.value as ProgramCategory)}
          className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40"
        >
          {PROGRAM_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Effective From" htmlFor="program-effective-from" error={errors.effectiveFrom}>
          <Input
            id="program-effective-from"
            type="date"
            value={effectiveFrom}
            hasError={Boolean(errors.effectiveFrom)}
            onChange={(e) => setEffectiveFrom(e.target.value)}
            className="[color-scheme:dark]"
            required
          />
        </Field>
        <Field label="Effective End" htmlFor="program-effective-end" error={errors.effectiveEnd}>
          <Input
            id="program-effective-end"
            type="date"
            value={effectiveEnd}
            hasError={Boolean(errors.effectiveEnd)}
            onChange={(e) => setEffectiveEnd(e.target.value)}
            className="[color-scheme:dark]"
            required
          />
        </Field>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-200">Schedule</span>
          <Button type="button" variant="secondary" onClick={addGroup}>
            <Plus className="h-3.5 w-3.5" />
            Add Schedule
          </Button>
        </div>
        <p className="text-xs text-slate-500">
          Pick every day this airs at the same time in one row — e.g. select Mon–Fri once instead of adding
          five rows. Use a new row only when the time changes, like a Friday-night special.
        </p>

        {errors.schedule && <p className="text-xs font-medium text-red-400">{errors.schedule}</p>}

        <div className="flex flex-col gap-3">
          {groups.map((row, i) => {
            const usedElsewhere = daysUsedElsewhere(row.key);
            const isRecurring = row.days.length > 1;
            return (
              <div key={row.key} className="rounded-lg border border-slate-800 bg-slate-950/60 p-3">
                <div className="mb-3 flex items-center justify-between">
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
                      row.days.length === 0
                        ? "bg-slate-800 text-slate-400"
                        : isRecurring
                        ? "bg-indigo-950 text-indigo-300"
                        : "bg-slate-800 text-slate-300"
                    )}
                  >
                    {row.days.length === 0
                      ? "No days selected"
                      : isRecurring
                      ? `Recurring · ${row.days.length} days`
                      : "One-time"}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeGroup(row.key)}
                    disabled={groups.length === 1}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-slate-400 transition hover:bg-red-950 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label={`Remove schedule row ${i + 1}`}
                    title={groups.length === 1 ? "At least one schedule entry is required" : "Remove this row"}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="mb-3">
                  <span className="mb-1.5 block text-xs font-medium text-slate-400">Days</span>
                  <div className="flex flex-wrap gap-1.5">
                    {SCHEDULE_DAYS.map((day) => {
                      const selected = row.days.includes(day);
                      const disabled = !selected && usedElsewhere.has(day);
                      return (
                        <button
                          key={day}
                          type="button"
                          disabled={disabled}
                          onClick={() => toggleDay(row.key, day)}
                          title={disabled ? `${day} is already used in another row` : day}
                          className={cn(
                            "h-8 min-w-[2.75rem] rounded-md px-2 text-xs font-semibold transition",
                            selected
                              ? "bg-indigo-600 text-white"
                              : disabled
                              ? "cursor-not-allowed bg-slate-900 text-slate-700"
                              : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                          )}
                        >
                          {SCHEDULE_DAY_SHORT[day]}
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-1.5 flex flex-wrap gap-3">
                    {DAY_PRESETS.map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => applyPreset(row.key, preset.days)}
                        className="text-xs font-medium text-indigo-400 hover:text-indigo-300 hover:underline"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                  {errors[`group.${i}.days`] && (
                    <p className="mt-1 text-xs font-medium text-red-400">{errors[`group.${i}.days`]}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Field
                    label="Starting Time"
                    htmlFor={`schedule-start-${row.key}`}
                    error={errors[`group.${i}.startingTime`]}
                  >
                    <Input
                      id={`schedule-start-${row.key}`}
                      type="time"
                      value={row.startingTime}
                      hasError={Boolean(errors[`group.${i}.startingTime`])}
                      onChange={(e) => updateGroup(row.key, { startingTime: e.target.value })}
                      required
                    />
                  </Field>

                  <Field label="End Time" htmlFor={`schedule-end-${row.key}`} error={errors[`group.${i}.endTime`]}>
                    <Input
                      id={`schedule-end-${row.key}`}
                      type="time"
                      value={row.endTime}
                      hasError={Boolean(errors[`group.${i}.endTime`])}
                      onChange={(e) => updateGroup(row.key, { endTime: e.target.value })}
                      required
                    />
                  </Field>
                </div>

                {row.days.length > 1 && (
                  <p className="mt-2 text-[11px] text-slate-500">
                    This time applies to all {row.days.length} selected days — change it once here and every
                    selected day updates together.
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-2 flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
        <Button type="submit" loading={submitting}>
          {initial ? "Save Changes" : "Add Program"}
        </Button>
      </div>
    </form>
  );
}

/** Converts a stored ISO datetime into "YYYY-MM-DD" for <input type="date">. */
function toDateValue(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
