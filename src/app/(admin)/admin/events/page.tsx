"use client";

import { useState } from "react";
import Link from "next/link";
import { useEvents, useCreateEvent } from "@/lib/queries/events";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { StatusBadge } from "@/components/ui/status-badge";
import { Plus } from "lucide-react";
import type { Event } from "@/lib/types";

export default function EventsListPage() {
  const { data, isLoading } = useEvents();
  const createEvent = useCreateEvent();
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState("");

  const events = (data?.data ?? []) as Event[];

  async function handleCreate() {
    if (!title.trim()) return;
    await createEvent.mutateAsync({ title: title.trim() });
    setTitle("");
    setShowCreate(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Event Pemilihan</h1>
        <Button onClick={() => setShowCreate(true)} size="sm">
          <Plus size={16} className="mr-1" /> Buat Event
        </Button>
      </div>

      {isLoading ? (
        <p className="text-gray-500">Memuat...</p>
      ) : events.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
          <p className="text-gray-500">Belum ada event. Buat event pertamamu!</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <Link
              key={event.id}
              href={`/admin/events/${event.id}/setup`}
              className="block rounded-lg border bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <h2 className="font-semibold text-gray-900 line-clamp-1">
                  {event.title}
                </h2>
                <StatusBadge status={event.status} />
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Paket: {event.package} &middot; Max {event.max_voters} pemilih
              </p>
              <p className="mt-1 text-xs text-gray-400">
                {new Date(event.created_at).toLocaleDateString("id-ID")}
              </p>
            </Link>
          ))}
        </div>
      )}

      <Modal open={showCreate} onClose={() => setShowCreate(false)}>
        <h2 className="text-lg font-semibold mb-4">Buat Event Baru</h2>
        <Input
          placeholder="Judul event, misal: Pemilihan Ketua OSIS 2026"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCreate()}
          autoFocus
        />
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setShowCreate(false)}>
            Batal
          </Button>
          <Button onClick={handleCreate} disabled={createEvent.isPending || !title.trim()}>
            {createEvent.isPending ? "Membuat..." : "Buat"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
