"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, Clapperboard } from "lucide-react";
import { Button, Spinner } from "@/components/admin/ui/form-controls";
import { Modal } from "@/components/admin/ui/modal";
import { ConfirmDialog } from "@/components/admin/ui/confirm-dialog";
import { EmptyState } from "@/components/admin/ui/empty-state";
import { TeledramaForm, TeledramaFormValues } from "@/components/admin/teledrama/teledrama-form";
import { UploadedImage } from "@/components/admin/image-upload";
import { useToast } from "@/components/admin/toast";
import type { TeledramaResponse } from "@/types/admin";

export default function TeledramaManagementPage() {
  const toast = useToast();
  const [teledramas, setTeledramas] = useState<TeledramaResponse[] | null>(null);
  const [loadError, setLoadError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<TeledramaResponse | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<TeledramaResponse | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function loadTeledramas() {
    try {
      const res = await fetch("/api/admin/teledramas");
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Failed to load teledramas");
      setTeledramas(json.data);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Failed to load teledramas");
    }
  }

  useEffect(() => {
    loadTeledramas();
  }, []);

  function openAddModal() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEditModal(item: TeledramaResponse) {
    setEditing(item);
    setModalOpen(true);
  }

  async function handleSubmit(values: TeledramaFormValues, image: UploadedImage | null) {
    const payload = {
      title: values.title,
      duration: values.duration,
      startingAt: values.startingAt,
      thumbnailKey: image?.key,
      thumbnailUrl: image?.url,
    };

    const url = editing ? `/api/admin/teledramas/${editing.id}` : "/api/admin/teledramas";
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

      toast.success(editing ? "Teledrama updated successfully" : "Teledrama created successfully");
      setModalOpen(false);
      setEditing(null);
      loadTeledramas();
    } catch {
      toast.error("Network error. Please try again.");
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/teledramas/${deleteTarget.id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Failed to delete teledrama");

      toast.success("Teledrama deleted");
      setDeleteTarget(null);
      loadTeledramas();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete teledrama");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Teledrama Management</h1>
          <p className="mt-1 text-sm text-slate-500">Manage your teledrama catalogue.</p>
        </div>
        <Button onClick={openAddModal}>
          <Plus className="h-4 w-4" />
          Add Teledrama
        </Button>
      </div>

      {teledramas === null && !loadError && (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      )}

      {loadError && (
        <div className="rounded-lg border border-red-800 bg-red-950/40 px-4 py-3 text-sm text-red-300">
          {loadError}
        </div>
      )}

      {teledramas && teledramas.length === 0 && (
        <EmptyState
          icon={<Clapperboard className="h-6 w-6" />}
          title="No teledramas yet"
          description="Add your first teledrama to build out the catalogue."
          action={
            <Button onClick={openAddModal}>
              <Plus className="h-4 w-4" />
              Add Teledrama
            </Button>
          }
        />
      )}

      {teledramas && teledramas.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-slate-800">
          <div className="hidden grid-cols-[80px_1fr_120px_120px_140px_120px_160px] gap-4 border-b border-slate-800 bg-slate-900 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:grid">
            <span>Thumbnail</span>
            <span>Title</span>
            <span>Duration</span>
            <span>Starting At</span>
            <span>Slug</span>
            <span>Updated</span>
            <span className="text-right">Actions</span>
          </div>
          <div className="divide-y divide-slate-800 bg-slate-900/40">
            {teledramas.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-3 px-4 py-3 sm:grid sm:grid-cols-[80px_1fr_120px_120px_140px_120px_160px] sm:items-center sm:gap-4"
              >
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-slate-800">
                  <Image src={item.thumbnailUrl} alt={item.title} fill unoptimized className="object-cover" sizes="56px" />
                </div>
                <p className="truncate text-sm font-medium text-white">{item.title}</p>
                <p className="truncate text-sm text-slate-300">{item.duration}</p>
                <p className="truncate text-sm text-slate-300">{item.startingAt}</p>
                <p className="truncate font-mono text-xs text-indigo-400">{item.slug}</p>
                <p className="text-xs text-slate-500">{new Date(item.updatedAt).toLocaleDateString()}</p>
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

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Teledrama" : "Add Teledrama"}
      >
        <TeledramaForm
          initial={editing ?? undefined}
          onCancel={() => setModalOpen(false)}
          onSubmit={handleSubmit}
        />
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete teledrama?"
        description={`This will permanently delete "${deleteTarget?.title}". This action cannot be undone.`}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
