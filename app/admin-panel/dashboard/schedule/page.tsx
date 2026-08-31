"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, CalendarClock } from "lucide-react";
import { Button, Spinner } from "@/components/admin/ui/form-controls";
import { Modal } from "@/components/admin/ui/modal";
import { ConfirmDialog } from "@/components/admin/ui/confirm-dialog";
import { EmptyState } from "@/components/admin/ui/empty-state";
import { ScheduleForm, ScheduleFormValues } from "@/components/admin/schedule/schedule-form";
import { useToast } from "@/components/admin/toast";
import { SCHEDULE_DAYS, type ScheduleBlock } from "@/lib/schedule-block";
import type { ScheduleResponse } from "@/types/admin";
import { cn } from "@/lib/utils";

// Mirrors the four columns rendered by components/home/schedule-timeline.tsx
const BLOCKS: { name: ScheduleBlock; time: string }[] = [
  { name: "Morning", time: "12AM – 12PM" },
  { name: "Afternoon", time: "12PM – 5PM" },
  { name: "Evening", time: "5PM – 9PM" },
  { name: "Night", time: "9PM – 12AM" },
];

export default function ScheduleManagementPage() {
  const toast = useToast();
  const [schedule, setSchedule] = useState<ScheduleResponse[] | null>(null);
  const [loadError, setLoadError] = useState("");
  const [activeDay, setActiveDay] = useState<string>(SCHEDULE_DAYS[0]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ScheduleResponse | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<ScheduleResponse | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function loadSchedule() {
    try {
      const res = await fetch("/api/admin/schedules");
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Failed to load schedule");
      setSchedule(json.data);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Failed to load schedule");
    }
  }

  useEffect(() => {
    loadSchedule();
  }, []);

  function openAddModal() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEditModal(item: ScheduleResponse) {
    setEditing(item);
    setModalOpen(true);
  }

  async function handleSubmit(values: ScheduleFormValues) {
    const url = editing ? `/api/admin/schedules/${editing.id}` : "/api/admin/schedules";
    const method = editing ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        if (json.fieldErrors) return json.fieldErrors;
        toast.error(json.error || "Something went wrong");
        return;
      }

      toast.success(editing ? "Schedule item updated" : "Schedule item added");
      setModalOpen(false);
      setEditing(null);
      loadSchedule();
    } catch {
      toast.error("Network error. Please try again.");
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/schedules/${deleteTarget.id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Failed to delete schedule item");

      toast.success("Schedule item deleted");
      setDeleteTarget(null);
      loadSchedule();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete schedule item");
    } finally {
      setDeleting(false);
    }
  }

  const dayItems = schedule?.filter((item) => item.day === activeDay) ?? [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">TV Schedule</h1>
          <p className="mt-1 text-sm text-slate-500">Manage the programming schedule shown on the homepage.</p>
        </div>
        <Button onClick={openAddModal}>
          <Plus className="h-4 w-4" />
          Add Schedule
        </Button>
      </div>

      {schedule === null && !loadError && (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      )}

      {loadError && (
        <div className="rounded-lg border border-red-800 bg-red-950/40 px-4 py-3 text-sm text-red-300">
          {loadError}
        </div>
      )}

      {schedule && (
        <>
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Day selector">
            {SCHEDULE_DAYS.map((d) => (
              <button
                key={d}
                role="tab"
                aria-selected={activeDay === d}
                onClick={() => setActiveDay(d)}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  activeDay === d
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-900 text-slate-400 hover:bg-slate-800"
                )}
              >
                {d}
              </button>
            ))}
          </div>

          {schedule.length === 0 ? (
            <EmptyState
              icon={<CalendarClock className="h-6 w-6" />}
              title="No schedule items yet"
              description="Add your first programming slot to build out the weekly schedule."
              action={
                <Button onClick={openAddModal}>
                  <Plus className="h-4 w-4" />
                  Add Schedule
                </Button>
              }
            />
          ) : (
            <div className="grid gap-6 lg:grid-cols-4">
              {BLOCKS.map((block) => {
                const items = dayItems.filter((item) => item.block === block.name);
                return (
                  <div key={block.name} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                    <div className="mb-4 flex items-baseline justify-between">
                      <h3 className="text-lg font-semibold text-white">{block.name}</h3>
                      <span className="text-xs text-slate-500">{block.time}</span>
                    </div>
                    <ol className="space-y-3">
                      {items.length === 0 ? (
                        <p className="text-sm text-slate-500">No listings.</p>
                      ) : (
                        items.map((item) => (
                          <li
                            key={item.id}
                            className="relative flex items-start justify-between gap-2 border-l border-slate-700 pl-4"
                          >
                            <span className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-indigo-500" />
                            <div className="min-w-0">
                              <span className="font-mono text-xs text-indigo-400">{item.time}</span>
                              <p className="mt-1 truncate text-sm font-medium text-slate-100">{item.title}</p>
                              <p className="text-xs text-slate-500">{item.category}</p>
                            </div>
                            <div className="flex shrink-0 gap-1 pt-0.5">
                              <button
                                onClick={() => openEditModal(item)}
                                className="rounded-md p-1.5 text-slate-400 hover:bg-slate-800 hover:text-indigo-400"
                                aria-label={`Edit ${item.title}`}
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => setDeleteTarget(item)}
                                className="rounded-md p-1.5 text-slate-400 hover:bg-red-950 hover:text-red-400"
                                aria-label={`Delete ${item.title}`}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </li>
                        ))
                      )}
                    </ol>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Schedule Item" : "Add Schedule Item"}
      >
        <ScheduleForm
          initial={editing ?? undefined}
          defaultDay={activeDay}
          onCancel={() => setModalOpen(false)}
          onSubmit={handleSubmit}
        />
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete schedule item?"
        description={`This will permanently remove "${deleteTarget?.title}" from the schedule. This action cannot be undone.`}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
