"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, Clapperboard, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Button, Spinner } from "@/components/admin/ui/form-controls";
import { Modal } from "@/components/admin/ui/modal";
import { ConfirmDialog } from "@/components/admin/ui/confirm-dialog";
import { EmptyState } from "@/components/admin/ui/empty-state";
import { ProgramForm, ProgramFormValues } from "@/components/admin/program/program-form";
import { UploadedImage } from "@/components/admin/image-upload";
import { useToast } from "@/components/admin/toast";
import { SCHEDULE_DAY_SHORT } from "@/lib/schedule-block";
import type { ProgramResponse } from "@/types/admin";
import { PROGRAM_CATEGORIES } from "@/types/admin";

const PAGE_SIZE = 10;

export default function ProgramManagementPage() {
  const toast = useToast();
  const [programs, setPrograms] = useState<ProgramResponse[] | null>(null);
  const [loadError, setLoadError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ProgramResponse | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<ProgramResponse | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (!programs) return [];
    return programs.filter((p) => {
      const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
      const matchCategory = categoryFilter ? p.category === categoryFilter : true;
      return matchSearch && matchCategory;
    });
  }, [programs, search, categoryFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleSearchChange(val: string) {
    setSearch(val);
    setPage(1);
  }

  function handleCategoryChange(val: string) {
    setCategoryFilter(val);
    setPage(1);
  }

  async function loadPrograms() {
    try {
      const res = await fetch("/api/admin/programs");
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Failed to load programs");
      setPrograms(json.data);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Failed to load programs");
    }
  }

  useEffect(() => {
    loadPrograms();
  }, []);

  function openAddModal() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEditModal(item: ProgramResponse) {
    setEditing(item);
    setModalOpen(true);
  }

  async function handleSubmit(values: ProgramFormValues, image: UploadedImage | null) {
    const payload = {
      title: values.title,
      category: values.category,
      effectiveFrom: values.effectiveFrom,
      effectiveEnd: values.effectiveEnd,
      schedule: values.schedule,
      thumbnailKey: image?.key,
      thumbnailUrl: image?.url,
    };

    const url = editing ? `/api/admin/programs/${editing.id}` : "/api/admin/programs";
    const method = editing ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        if (json.fieldErrors) return json.fieldErrors;
        toast.error(json.error || "Something went wrong");
        return;
      }

      toast.success(editing ? "Program updated successfully" : "Program created successfully");
      setModalOpen(false);
      setEditing(null);
      loadPrograms();
    } catch {
      toast.error("Network error. Please try again.");
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/programs/${deleteTarget.id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Failed to delete program");

      toast.success("Program deleted");
      setDeleteTarget(null);
      loadPrograms();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete program");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Program Management</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage every TV program, its category, and its weekly airing schedule.
          </p>
        </div>
        <Button onClick={openAddModal}>
          <Plus className="h-4 w-4" />
          Add Program
        </Button>
      </div>

      {programs === null && !loadError && (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      )}

      {loadError && (
        <div className="rounded-lg border border-red-800 bg-red-950/40 px-4 py-3 text-sm text-red-300">
          {loadError}
        </div>
      )}

      {programs && programs.length > 0 && (
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search programs…"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 py-2 pl-9 pr-3 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
          >
            <option value="">All Categories</option>
            {PROGRAM_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      )}

      {programs && programs.length === 0 && (
        <EmptyState
          icon={<Clapperboard className="h-6 w-6" />}
          title="No programs yet"
          description="Add your first program to build out the schedule."
          action={
            <Button onClick={openAddModal}>
              <Plus className="h-4 w-4" />
              Add Program
            </Button>
          }
        />
      )}

      {programs && filtered.length === 0 && (search || categoryFilter) && (
        <p className="py-10 text-center text-sm text-slate-500">No programs match your filters.</p>
      )}

      {programs && paginated.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-slate-800">
          <div className="hidden grid-cols-[64px_1fr_120px_1.4fr_160px] gap-4 border-b border-slate-800 bg-slate-900 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:grid">
            <span>Thumb</span>
            <span>Title</span>
            <span>Category</span>
            <span>Schedule</span>
            <span className="text-right">Actions</span>
          </div>
          <div className="divide-y divide-slate-800 bg-slate-900/40">
            {paginated.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-3 px-4 py-3 sm:grid sm:grid-cols-[64px_1fr_120px_1.4fr_160px] sm:items-center sm:gap-4"
              >
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-slate-800">
                  <Image src={item.thumbnailUrl} alt={item.title} fill unoptimized className="object-cover" sizes="48px" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white">{item.title}</p>
                  <p className="truncate font-mono text-xs text-indigo-400">{item.slug}</p>
                </div>
                <span className="w-fit rounded-full bg-slate-800 px-2 py-0.5 text-xs font-medium text-slate-300">
                  {item.category}
                </span>
                <div className="flex flex-wrap gap-1">
                  {item.schedule.map((entry, i) => (
                    <span
                      key={i}
                      className="rounded-md bg-slate-800 px-1.5 py-0.5 font-mono text-[11px] text-slate-400"
                      title={`${entry.day} ${entry.startingTime}–${entry.endTime}`}
                    >
                      {SCHEDULE_DAY_SHORT[entry.day]} {entry.startingTime}
                    </span>
                  ))}
                </div>
                <div className="flex gap-2 sm:justify-end">
                  <Button variant="secondary" onClick={() => openEditModal(item)}>
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </Button>
                  <Button variant="danger" onClick={() => setDeleteTarget(item)} aria-label={`Delete ${item.title}`}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-slate-400">
          <span>{filtered.length} program{filtered.length !== 1 ? "s" : ""}</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-lg border border-slate-700 p-1.5 hover:bg-slate-800 disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span>Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="rounded-lg border border-slate-700 p-1.5 hover:bg-slate-800 disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Program" : "Add Program"}
        maxWidth="max-w-2xl"
      >
        <ProgramForm
          initial={editing ?? undefined}
          onCancel={() => setModalOpen(false)}
          onSubmit={handleSubmit}
        />
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete program?"
        description={`This will permanently delete "${deleteTarget?.title}" and remove all of its schedule entries from the site. This action cannot be undone.`}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
