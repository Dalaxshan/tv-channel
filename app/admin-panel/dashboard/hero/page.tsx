"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, ImageOff, ExternalLink } from "lucide-react";
import { Button, Spinner } from "@/components/admin/ui/form-controls";
import { Modal } from "@/components/admin/ui/modal";
import { ConfirmDialog } from "@/components/admin/ui/confirm-dialog";
import { EmptyState } from "@/components/admin/ui/empty-state";
import { HeroForm, HeroFormValues } from "@/components/admin/hero/hero-form";
import { UploadedImage } from "@/components/admin/image-upload";
import { useToast } from "@/components/admin/toast";
import type { HeroResponse } from "@/types/admin";

export default function HeroManagementPage() {
  const toast = useToast();
  const [heroes, setHeroes] = useState<HeroResponse[] | null>(null);
  const [loadError, setLoadError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<HeroResponse | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<HeroResponse | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function loadHeroes() {
    try {
      const res = await fetch("/api/admin/heroes");
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Failed to load heroes");
      setHeroes(json.data);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Failed to load heroes");
    }
  }

  useEffect(() => {
    loadHeroes();
  }, []);

  function openAddModal() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEditModal(hero: HeroResponse) {
    setEditing(hero);
    setModalOpen(true);
  }

  async function handleSubmit(values: HeroFormValues, image: UploadedImage | null) {
    const payload = {
      title: values.title,
      subtitle: values.subtitle,
      badge: values.badge,
      ctaButtonText: values.ctaButtonText,
      ctaButtonUrl: values.ctaButtonUrl,
      imageKey: image?.key,
      imageUrl: image?.url,
    };

    const url = editing ? `/api/admin/heroes/${editing.id}` : "/api/admin/heroes";
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

      toast.success(editing ? "Hero updated successfully" : "Hero created successfully");
      setModalOpen(false);
      setEditing(null);
      loadHeroes();
    } catch {
      toast.error("Network error. Please try again.");
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/heroes/${deleteTarget.id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Failed to delete hero");

      toast.success("Hero deleted");
      setDeleteTarget(null);
      loadHeroes();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete hero");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Hero Management</h1>
          <p className="mt-1 text-sm text-slate-500">Manage the homepage hero slides.</p>
        </div>
        <Button onClick={openAddModal}>
          <Plus className="h-4 w-4" />
          Add Hero
        </Button>
      </div>

      {heroes === null && !loadError && (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      )}

      {loadError && (
        <div className="rounded-lg border border-red-800 bg-red-950/40 px-4 py-3 text-sm text-red-300">
          {loadError}
        </div>
      )}

      {heroes && heroes.length === 0 && (
        <EmptyState
          icon={<ImageOff className="h-6 w-6" />}
          title="No hero slides yet"
          description="Add your first hero slide to feature it on the homepage."
          action={
            <Button onClick={openAddModal}>
              <Plus className="h-4 w-4" />
              Add Hero
            </Button>
          }
        />
      )}

      {heroes && heroes.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {heroes.map((hero) => (
            <div
              key={hero.id}
              className="flex flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60"
            >
              <div className="relative h-40 w-full bg-slate-800">
                <Image
                  src={hero.imageUrl}
                  alt={hero.title}
                  fill
                  unoptimized
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <span className="absolute left-2 top-2 rounded-full bg-indigo-600 px-2 py-0.5 text-xs font-semibold text-white">
                  {hero.badge}
                </span>
              </div>
              <div className="flex flex-1 flex-col gap-2 p-4">
                <h3 className="line-clamp-1 text-sm font-semibold text-white">{hero.title}</h3>
                <p className="line-clamp-2 text-xs text-slate-400">{hero.subtitle}</p>
                <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                  <ExternalLink className="h-3 w-3" />
                  <span className="truncate">
                    {hero.cta.buttonText} → {hero.cta.buttonUrl}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Updated {new Date(hero.updatedAt).toLocaleDateString()}
                </p>
                <div className="mt-auto flex gap-2 pt-2">
                  <Button variant="secondary" className="flex-1" onClick={() => openEditModal(hero)}>
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </Button>
                  <Button variant="danger" onClick={() => setDeleteTarget(hero)} aria-label={`Delete ${hero.title}`}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Hero" : "Add Hero"}
      >
        <HeroForm
          initial={editing ?? undefined}
          onCancel={() => setModalOpen(false)}
          onSubmit={handleSubmit}
        />
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete hero slide?"
        description={`This will permanently delete "${deleteTarget?.title}". This action cannot be undone.`}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
