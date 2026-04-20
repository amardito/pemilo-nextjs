"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useEvent, useUpdateEvent, useOpenEvent, useCloseEvent, useLockEvent } from "@/lib/queries/events";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/ui/status-badge";
import type { Event } from "@/lib/types";

export default function EventSetupPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const { data, isLoading } = useEvent(eventId);
  const updateEvent = useUpdateEvent(eventId);
  const openEvent = useOpenEvent(eventId);
  const closeEvent = useCloseEvent(eventId);
  const lockEvent = useLockEvent(eventId);

  const event = data?.data as Event | undefined;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDescription(event.description ?? "");
    }
  }, [event]);

  if (isLoading) return <p className="text-gray-500">Memuat...</p>;
  if (!event) return <p className="text-red-600">Event tidak ditemukan</p>;

  const canEdit = event.status === "DRAFT" || event.status === "SCHEDULED";

  async function handleSave() {
    await updateEvent.mutateAsync({ title, description: description || null });
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-bold text-gray-900">Setup Event</h1>
        <StatusBadge status={event.status} />
      </div>

      <div className="space-y-4 rounded-lg border bg-white p-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Judul</label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} disabled={!canEdit} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} disabled={!canEdit} />
        </div>

        {canEdit && (
          <Button onClick={handleSave} disabled={updateEvent.isPending}>
            {updateEvent.isPending ? "Menyimpan..." : "Simpan"}
          </Button>
        )}
      </div>

      {/* Status transitions */}
      <div className="rounded-lg border bg-white p-6 space-y-3">
        <h2 className="font-semibold text-gray-900">Status Event</h2>
        <p className="text-sm text-gray-500">
          Status saat ini: <span className="font-medium">{event.status}</span>
        </p>

        <div className="flex flex-wrap gap-2">
          {(event.status === "DRAFT" || event.status === "SCHEDULED") && (
            <Button onClick={() => openEvent.mutate()} disabled={openEvent.isPending}>
              {openEvent.isPending ? "Membuka..." : "Buka Voting"}
            </Button>
          )}
          {event.status === "OPEN" && (
            <Button variant="secondary" onClick={() => closeEvent.mutate()} disabled={closeEvent.isPending}>
              {closeEvent.isPending ? "Menutup..." : "Tutup Voting"}
            </Button>
          )}
          {event.status === "CLOSED" && (
            <Button variant="danger" onClick={() => lockEvent.mutate()} disabled={lockEvent.isPending}>
              {lockEvent.isPending ? "Mengunci..." : "Kunci Hasil"}
            </Button>
          )}
        </div>
      </div>

      <div className="rounded-lg border bg-white p-6">
        <h2 className="font-semibold text-gray-900 mb-2">Info Paket</h2>
        <p className="text-sm text-gray-600">
          Paket: <span className="font-medium">{event.package}</span> &middot;
          Max {event.max_slates} paslon &middot; Max {event.max_voters} pemilih
        </p>
      </div>

      <div className="rounded-lg border bg-white p-6">
        <h2 className="font-semibold text-gray-900 mb-2">Link Voting Publik</h2>
        <code className="block rounded bg-gray-100 p-2 text-sm break-all">
          {typeof window !== "undefined" ? `${window.location.origin}/e/${eventId}` : `/e/${eventId}`}
        </code>
      </div>
    </div>
  );
}
