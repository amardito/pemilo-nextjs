"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { api, ApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import type { SlatePublic } from "@/lib/types";

interface VoteSession {
  token: string;
  nim: string;
  voter_display: { full_name: string; class_name: string | null };
  slates: SlatePublic[];
}

export default function VotePage() {
  const { eventId } = useParams<{ eventId: string }>();
  const router = useRouter();
  const [session, setSession] = useState<VoteSession | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const raw = sessionStorage.getItem(`pemilo_vote_${eventId}`);
    if (!raw) {
      router.replace(`/e/${eventId}/login`);
      return;
    }
    try {
      setSession(JSON.parse(raw));
    } catch {
      router.replace(`/e/${eventId}/login`);
    }
  }, [eventId, router]);

  if (!session) return null;

  const selectedSlate = session.slates.find((s) => s.id === selected);

  async function handleSubmit() {
    if (!selected) return;
    setSubmitting(true);
    setError("");

    try {
      await api.public.submit(eventId, {
        token: session!.token,
        nim: session!.nim,
        slate_id: selected,
      });
      sessionStorage.removeItem(`pemilo_vote_${eventId}`);
      router.push(`/e/${eventId}/done`);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Gagal mengirim suara");
      }
      setShowConfirm(false);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="text-center">
          <p className="text-sm text-gray-500">
            Halo, <span className="font-medium">{session.voter_display.full_name}</span>
            {session.voter_display.class_name && ` (${session.voter_display.class_name})`}
          </p>
          <h1 className="text-xl font-bold text-gray-900 mt-1">Pilih Paslon</h1>
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg text-center">
            {error}
          </p>
        )}

        <div className="space-y-4">
          {session.slates.map((slate) => (
            <button
              key={slate.id}
              onClick={() => setSelected(slate.id)}
              className={`w-full text-left rounded-xl border-2 p-4 transition-all ${
                selected === slate.id
                  ? "border-blue-500 bg-blue-50 shadow-md"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white font-bold">
                  {slate.number}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900">{slate.name}</h3>

                  {/* Members */}
                  {slate.members.length > 0 && (
                    <ul className="mt-1 space-y-0.5">
                      {slate.members.map((m, i) => (
                        <li key={i} className="text-sm text-gray-600">
                          <span className="font-medium">{m.role}:</span> {m.full_name}
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Vision/Mission expandable */}
                  {slate.vision && (
                    <details className="mt-2">
                      <summary className="text-sm text-blue-600 cursor-pointer">
                        Lihat Visi & Misi
                      </summary>
                      <div className="mt-1 text-sm text-gray-600 space-y-1">
                        <p>
                          <span className="font-medium">Visi:</span> {slate.vision}
                        </p>
                        {slate.mission && (
                          <p>
                            <span className="font-medium">Misi:</span> {slate.mission}
                          </p>
                        )}
                      </div>
                    </details>
                  )}
                </div>

                {/* Radio indicator */}
                <div
                  className={`mt-1 h-5 w-5 shrink-0 rounded-full border-2 flex items-center justify-center ${
                    selected === slate.id
                      ? "border-blue-500"
                      : "border-gray-300"
                  }`}
                >
                  {selected === slate.id && (
                    <div className="h-3 w-3 rounded-full bg-blue-500" />
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>

        <Button
          size="lg"
          className="w-full"
          disabled={!selected}
          onClick={() => setShowConfirm(true)}
        >
          Pilih Paslon Ini
        </Button>

        {/* Confirm modal */}
        <Modal open={showConfirm} onClose={() => !submitting && setShowConfirm(false)}>
          <div className="text-center space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Konfirmasi Pilihan</h2>
            {selectedSlate && (
              <p className="text-gray-600">
                Anda memilih{" "}
                <span className="font-semibold">
                  Paslon #{selectedSlate.number} — {selectedSlate.name}
                </span>
              </p>
            )}
            <p className="text-sm text-red-600">
              Pilihan tidak dapat diubah setelah dikirim!
            </p>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => setShowConfirm(false)}
                disabled={submitting}
              >
                Batal
              </Button>
              <Button
                className="flex-1"
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? "Mengirim..." : "Kirim Suara"}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
