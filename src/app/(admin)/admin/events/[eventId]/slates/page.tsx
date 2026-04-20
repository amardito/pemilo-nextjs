"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import {
  useSlates,
  useCreateSlate,
  useUpdateSlate,
  useDeleteSlate,
  useCreateMember,
  useDeleteMember,
} from "@/lib/queries/slates";
import { useEvent } from "@/lib/queries/events";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Modal } from "@/components/ui/modal";
import { Plus, Trash2, UserPlus, AlertTriangle } from "lucide-react";
import { ApiError } from "@/lib/api";
import type { Event, Slate } from "@/lib/types";

export default function SlatesPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const router = useRouter();
  const { data: eventData } = useEvent(eventId);
  const { data, isLoading } = useSlates(eventId);
  const createSlate = useCreateSlate(eventId);
  const updateSlate = useUpdateSlate(eventId);
  const deleteSlate = useDeleteSlate(eventId);
  const createMember = useCreateMember(eventId);
  const deleteMember = useDeleteMember(eventId);

  const event = eventData?.data as Event | undefined;
  const slates = (data?.data ?? []) as Slate[];
  const canEdit = event?.status === "DRAFT" || event?.status === "SCHEDULED";

  const [showAdd, setShowAdd] = useState(false);
  const [newNumber, setNewNumber] = useState(slates.length + 1);
  const [newName, setNewName] = useState("");
  const [newVision, setNewVision] = useState("");
  const [newMission, setNewMission] = useState("");
  const [addError, setAddError] = useState("");
  const [limitReached, setLimitReached] = useState(false);

  const [addMemberSlateId, setAddMemberSlateId] = useState<string | null>(null);
  const [memberRole, setMemberRole] = useState("Ketua");
  const [memberName, setMemberName] = useState("");

  async function handleAddSlate() {
    if (!newName.trim()) return;
    setAddError("");
    setLimitReached(false);
    try {
      await createSlate.mutateAsync({
        number: newNumber,
        name: newName.trim(),
        vision: newVision || undefined,
        mission: newMission || undefined,
      });
      setNewName("");
      setNewVision("");
      setNewMission("");
      setNewNumber(slates.length + 2);
      setShowAdd(false);
    } catch (err) {
      if (err instanceof ApiError && err.message.toLowerCase().includes("maximum number of slates")) {
        setLimitReached(true);
      } else {
        setAddError(err instanceof ApiError ? err.message : "Gagal menambahkan paslon");
      }
    }
  }

  async function handleAddMember() {
    if (!addMemberSlateId || !memberName.trim()) return;
    await createMember.mutateAsync({
      slateId: addMemberSlateId,
      data: { role: memberRole, full_name: memberName.trim() },
    });
    setMemberName("");
    setMemberRole("Ketua");
    setAddMemberSlateId(null);
  }

  if (isLoading) return <p className="text-gray-500">Memuat...</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Paslon</h1>
        {canEdit && (
          <Button size="sm" onClick={() => { setNewNumber(slates.length + 1); setShowAdd(true); }}>
            <Plus size={16} className="mr-1" /> Tambah Paslon
          </Button>
        )}
      </div>

      {slates.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
          <p className="text-gray-500">Belum ada paslon. Tambahkan paslon pertama!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {slates.map((slate) => (
            <div key={slate.id} className="rounded-lg border bg-white p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Paslon #{slate.number} — {slate.name}
                  </h3>
                  {slate.vision && (
                    <p className="mt-1 text-sm text-gray-600">
                      <span className="font-medium">Visi:</span> {slate.vision}
                    </p>
                  )}
                  {slate.mission && (
                    <p className="mt-1 text-sm text-gray-600">
                      <span className="font-medium">Misi:</span> {slate.mission}
                    </p>
                  )}
                </div>
                {canEdit && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (confirm("Hapus paslon ini?")) deleteSlate.mutate(slate.id);
                    }}
                  >
                    <Trash2 size={16} className="text-red-500" />
                  </Button>
                )}
              </div>

              {/* Members */}
              <div className="mt-3 space-y-1">
                <p className="text-xs font-medium text-gray-500 uppercase">Anggota</p>
                {slate.members?.length > 0 ? (
                  <ul className="space-y-1">
                    {slate.members.map((m) => (
                      <li key={m.id} className="flex items-center justify-between text-sm">
                        <span>
                          <span className="font-medium text-gray-700">{m.role}:</span>{" "}
                          {m.full_name}
                        </span>
                        {canEdit && (
                          <button
                            onClick={() => {
                              if (confirm(`Hapus ${m.full_name}?`)) deleteMember.mutate(m.id);
                            }}
                            className="text-red-400 hover:text-red-600"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-400">Belum ada anggota</p>
                )}
                {canEdit && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setAddMemberSlateId(slate.id)}
                    className="mt-1"
                  >
                    <UserPlus size={14} className="mr-1" /> Tambah Anggota
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Slate Modal */}
      <Modal open={showAdd} onClose={() => { setShowAdd(false); setAddError(""); setLimitReached(false); }}>
        <h2 className="text-lg font-semibold mb-4">Tambah Paslon</h2>

        {limitReached ? (
          <div className="space-y-4">
            <div className="flex gap-3 rounded-lg bg-amber-50 border border-amber-200 p-4">
              <AlertTriangle size={20} className="text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-amber-800">Batas paket tercapai</p>
                <p className="mt-1 text-sm text-amber-700">
                  Paket <span className="font-semibold">{event?.package}</span> hanya mendukung maksimal{" "}
                  <span className="font-semibold">{event?.max_slates} paslon</span>. Upgrade paket untuk menambah lebih banyak paslon.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => { setShowAdd(false); setLimitReached(false); }}>Batal</Button>
              <Button onClick={() => { setShowAdd(false); setLimitReached(false); router.push(`/admin/events/${eventId}/billing`); }}>
                Upgrade Paket
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">No. Urut</label>
              <Input type="number" min={1} value={newNumber} onChange={(e) => setNewNumber(Number(e.target.value))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Paslon</label>
              <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Misal: Ahmad & Budi" autoFocus />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Visi</label>
              <Textarea value={newVision} onChange={(e) => setNewVision(e.target.value)} rows={2} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Misi</label>
              <Textarea value={newMission} onChange={(e) => setNewMission(e.target.value)} rows={2} />
            </div>
            {addError && <p className="text-sm text-red-500">{addError}</p>}
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="secondary" onClick={() => { setShowAdd(false); setAddError(""); }}>Batal</Button>
              <Button onClick={handleAddSlate} disabled={createSlate.isPending}>
                {createSlate.isPending ? "Menambahkan..." : "Tambah"}
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Add Member Modal */}
      <Modal open={!!addMemberSlateId} onClose={() => setAddMemberSlateId(null)}>
        <h2 className="text-lg font-semibold mb-4">Tambah Anggota</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jabatan</label>
            <Input value={memberRole} onChange={(e) => setMemberRole(e.target.value)} placeholder="Ketua / Wakil / ..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
            <Input value={memberName} onChange={(e) => setMemberName(e.target.value)} placeholder="Nama anggota" autoFocus />
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setAddMemberSlateId(null)}>Batal</Button>
          <Button onClick={handleAddMember} disabled={createMember.isPending}>
            {createMember.isPending ? "Menambahkan..." : "Tambah"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
