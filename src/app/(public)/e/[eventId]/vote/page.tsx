"use client";

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
    <div className="min-h-screen bg-[#261C16] px-4 py-6 pb-28 md:pb-6">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="rounded-2xl border border-[#F26241]/40 bg-[#321F14] p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-[#F26241]">Halaman Voting</p>
          <h1 className="mt-1 text-xl font-bold text-[#FAF0EB]">Pilih Pasangan Kandidat</h1>
          <div className="mt-3 inline-flex items-center rounded-full bg-[#F26241]/20 border border-[#F26241]/40 px-3 py-1 text-sm text-[#A69A97]">
            {session.voter_display.full_name}
            {session.voter_display.class_name && ` • ${session.voter_display.class_name}`}
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-300 bg-red-900/30 border border-red-600/30 p-3 rounded-xl text-center">
            {error}
          </p>
        )}

        <div className="space-y-4">
          {session.slates.map((slate) => (
            <div
              key={slate.id}
              className={`w-full rounded-2xl border-2 p-4 transition-all duration-200 ${
                selected === slate.id
                  ? "border-[#F26241]/80 bg-[#321F14] shadow-[0_0_20px_rgba(242,98,65,0.15)]"
                  : "border-[#F26241]/30 bg-[#321F14] hover:border-[#F29580]/60"
              }`}
            >
              <button
                type="button"
                onClick={() => setSelected(slate.id)}
                className="w-full text-left"
              >
                <div className="flex items-start gap-3">
                  {slate.photo_url ? (
                    <img src={slate.photo_url} alt={slate.name} className="h-12 w-12 shrink-0 rounded-full object-cover ring-2 ring-[#F26241]/60" />
                  ) : (
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F26241] text-[#FAF0EB] text-lg font-bold">
                      {slate.number}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[#FAF0EB]">
                      Pasangan #{slate.number} — {slate.name}
                    </h3>

                    {slate.members.length > 0 && (
                      <ul className="mt-1 space-y-0.5">
                        {slate.members.map((m, i) => (
                          <li key={i} className="text-sm text-[#A69A97]">
                            <span className="font-medium text-[#FAF0EB]">{m.role}:</span> {m.full_name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div
                    className={`mt-1 h-6 w-6 shrink-0 rounded-full border-2 flex items-center justify-center ${
                      selected === slate.id
                        ? "border-[#F26241] ring-4 ring-[#F26241]/20"
                        : "border-[#F26241]/40"
                    }`}
                  >
                    {selected === slate.id && (
                      <div className="flex h-4 w-4 items-center justify-center rounded-full bg-[#F26241] text-[#FAF0EB]">
                        <Check size={12} />
                      </div>
                    )}
                  </div>
                </div>
              </button>
              {(slate.vision || slate.mission) && (
                <div className="mt-3 rounded-xl border border-[#F26241]/30 bg-[#261C16]/50">
                  <button
                    type="button"
                    onClick={() => setExpandedSlate((prev) => (prev === slate.id ? null : slate.id))}
                    className="flex w-full items-center justify-between px-3 py-2 text-left text-sm font-medium text-[#A69A97] hover:text-[#FAF0EB]"
                  >
                    <span>Lihat Visi &amp; Misi</span>
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${expandedSlate === slate.id ? "rotate-180" : ""}`}
                    />
                  </button>
                  {expandedSlate === slate.id && (
                    <div className="space-y-2 border-t border-[#F26241]/20 px-3 py-2 text-sm text-[#A69A97]">
                      {slate.vision && (
                        <p>
                          <span className="font-medium text-[#FAF0EB]">Visi:</span> {slate.vision}
                        </p>
                      )}
                      {slate.mission && (
                        <p>
                          <span className="font-medium text-[#FAF0EB]">Misi:</span> {slate.mission}
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
          Pilih Pasangan Ini
        </Button>

        {selected && (
          <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[#F26241]/30 bg-[#261C16]/95 p-3 shadow-[0_-8px_20px_rgba(0,0,0,0.4)] backdrop-blur md:hidden">
            <Button
              size="lg"
              className="w-full"
              onClick={() => setShowConfirm(true)}
            >
              Pilih Pasangan Ini
            </Button>
          </div>
        )}

        {/* Confirm modal */}
        <Modal open={showConfirm} onClose={() => !submitting && setShowConfirm(false)}>
          <div className="text-center space-y-4">
            <h2 className="text-lg font-bold text-[#FAF0EB]">Konfirmasi Pilihan</h2>
            {selectedSlate && (
              <div className="rounded-xl border border-[#F26241]/40 bg-[#261C16] p-3 text-[#FAF0EB]">
                <p className="text-xs uppercase tracking-wide text-[#A69A97]">Pilihan Kamu</p>
                <p className="font-semibold">
                  Pasangan #{selectedSlate.number} — {selectedSlate.name}
                </p>
              </div>
            )}
            <p className="text-sm text-red-300">
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
