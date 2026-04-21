"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { api, ApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Check, ChevronDown } from "lucide-react";
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
  const [session] = useState<VoteSession | null>(() => {
    if (typeof window === "undefined") return null;
    const raw = sessionStorage.getItem(`pemilo_vote_${eventId}`);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  });
  const [selected, setSelected] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [expandedSlate, setExpandedSlate] = useState<string | null>(null);

  useEffect(() => {
    if (!session) {
      router.replace(`/e/${eventId}/login`);
    }
  }, [eventId, router, session]);

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
    <div className="min-h-screen bg-gray-50 px-4 py-6 pb-28 md:pb-6">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-blue-600">Halaman Voting</p>
          <h1 className="mt-1 text-xl font-bold text-gray-900">Pilih Paslon</h1>
          <div className="mt-3 inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-700">
            {session.voter_display.full_name}
            {session.voter_display.class_name && ` • ${session.voter_display.class_name}`}
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg text-center">
            {error}
          </p>
        )}

        <div className="space-y-4">
          {session.slates.map((slate) => (
            <div
              key={slate.id}
              className={`w-full rounded-xl border-2 p-4 transition-all ${
                selected === slate.id
                  ? "border-blue-500 bg-blue-50 shadow-md"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <button
                type="button"
                onClick={() => setSelected(slate.id)}
                className="w-full text-left"
              >
                <div className="flex items-start gap-3">
                  {slate.photo_url ? (
                    <Image
                      src={slate.photo_url}
                      alt={slate.name}
                      width={48}
                      height={48}
                      unoptimized
                      loader={({ src }) => src}
                      className="h-12 w-12 shrink-0 rounded-full object-cover ring-2 ring-blue-100"
                    />
                  ) : (
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white text-lg font-bold">
                      {slate.number}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900">
                      Paslon #{slate.number} — {slate.name}
                    </h3>

                    {slate.members.length > 0 && (
                      <ul className="mt-1 space-y-0.5">
                        {slate.members.map((m, i) => (
                          <li key={i} className="text-sm text-gray-600">
                            <span className="font-medium">{m.role}:</span> {m.full_name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div
                    className={`mt-1 h-6 w-6 shrink-0 rounded-full border-2 flex items-center justify-center ${
                      selected === slate.id
                        ? "border-blue-600 ring-4 ring-blue-100"
                        : "border-gray-300"
                    }`}
                  >
                    {selected === slate.id && (
                      <div className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-white">
                        <Check size={12} />
                      </div>
                    )}
                  </div>
                </div>
              </button>
              {(slate.vision || slate.mission) && (
                <div className="mt-3 rounded-lg border bg-gray-50">
                  <button
                    type="button"
                    onClick={() => setExpandedSlate((prev) => (prev === slate.id ? null : slate.id))}
                    className="flex w-full items-center justify-between px-3 py-2 text-left text-sm font-medium text-blue-700"
                  >
                    <span>Lihat Visi & Misi</span>
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${expandedSlate === slate.id ? "rotate-180" : ""}`}
                    />
                  </button>
                  {expandedSlate === slate.id && (
                    <div className="space-y-2 border-t px-3 py-2 text-sm text-gray-600">
                      {slate.vision && (
                        <p>
                          <span className="font-medium">Visi:</span> {slate.vision}
                        </p>
                      )}
                      {slate.mission && (
                        <p>
                          <span className="font-medium">Misi:</span> {slate.mission}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <Button
          size="lg"
          className="hidden w-full md:inline-flex"
          disabled={!selected}
          onClick={() => setShowConfirm(true)}
        >
          Pilih Paslon Ini
        </Button>

        {selected && (
          <div className="fixed inset-x-0 bottom-0 z-30 border-t bg-white/95 p-3 shadow-[0_-8px_20px_rgba(0,0,0,0.08)] backdrop-blur md:hidden">
            <Button
              size="lg"
              className="w-full"
              onClick={() => setShowConfirm(true)}
            >
              Pilih Paslon Ini
            </Button>
          </div>
        )}

        {/* Confirm modal */}
        <Modal open={showConfirm} onClose={() => !submitting && setShowConfirm(false)}>
          <div className="text-center space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Konfirmasi Pilihan</h2>
            {selectedSlate && (
              <div className="rounded-lg border border-blue-100 bg-blue-50 p-3 text-blue-900">
                <p className="text-xs uppercase tracking-wide text-blue-600">Pilihan Kamu</p>
                <p className="font-semibold">
                  Paslon #{selectedSlate.number} — {selectedSlate.name}
                </p>
              </div>
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
