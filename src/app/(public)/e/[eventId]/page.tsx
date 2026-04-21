"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { api, ApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { ApiSuccessResponse } from "@/lib/types";

interface PublicEventInfo {
  id: string;
  title: string;
  description?: string | null;
  status: string;
  opens_at?: string | null;
  closes_at?: string | null;
}

export default function EventLandingPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const [event, setEvent] = useState<PublicEventInfo | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = (await api.public.getEvent(eventId)) as ApiSuccessResponse<PublicEventInfo>;
        setEvent(res.data as PublicEventInfo);
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError("Event tidak ditemukan");
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [eventId]);

  if (loading) {
    return (
      <div suppressHydrationWarning className="min-h-screen flex items-center justify-center bg-[#261C16] px-4">
        <div className="w-full max-w-md space-y-4 rounded-2xl border border-[#F26241]/40 bg-[#321F14] p-6">
          <Skeleton className="mx-auto h-14 w-14 rounded-full bg-[#F26241]/40" />
          <Skeleton className="h-7 w-3/4 mx-auto bg-[#F26241]/30" />
          <Skeleton className="h-4 w-full bg-[#F26241]/20" />
          <Skeleton className="h-4 w-5/6 mx-auto bg-[#F26241]/20" />
          <Skeleton className="h-11 w-full rounded-lg bg-[#F26241]/30" />
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div suppressHydrationWarning className="min-h-screen flex items-center justify-center bg-[#261C16] px-4">
        <div className="w-full max-w-md rounded-2xl bg-[#321F14] border border-[#F26241]/40 p-6 text-center shadow-xl">
          <h1 className="text-xl font-bold text-[#FAF0EB]">Oops!</h1>
          <p className="mt-2 text-[#A69A97]">{error || "Event tidak ditemukan"}</p>
        </div>
      </div>
    );
  }

  const isOpen = event.status === "OPEN";
  const isClosed = event.status === "CLOSED" || event.status === "LOCKED";

  return (
    <div suppressHydrationWarning className="min-h-screen flex flex-col justify-between bg-[#261C16] px-4 py-8 text-[#FAF0EB]">
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-xl text-center space-y-6 rounded-2xl border border-[#F26241]/40 bg-[#321F14] p-6 shadow-2xl sm:p-8">
          <div className="text-6xl">🗳️</div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-[#FAF0EB]">{event.title}</h1>
            {event.description && (
              <p className="mt-3 text-sm text-[#A69A97] sm:text-base">{event.description}</p>
            )}
          </div>

          <div>
            {isOpen ? (
              <span className="inline-flex rounded-full bg-emerald-900/30 border border-emerald-600/40 px-4 py-1 text-sm font-semibold text-emerald-300">
                Voting Dibuka
              </span>
            ) : isClosed ? (
              <span className="inline-flex rounded-full bg-red-900/30 border border-red-600/40 px-4 py-1 text-sm font-semibold text-red-300">
                Voting Ditutup
              </span>
            ) : (
              <span className="inline-flex rounded-full bg-yellow-900/30 border border-yellow-600/40 px-4 py-1 text-sm font-semibold text-yellow-300">
                Belum Dibuka
              </span>
            )}
          </div>

          {isOpen ? (
            <Link href={`/e/${eventId}/login`} className="block">
              <Button size="lg" className="w-full text-lg">
                Mulai Memilih →
              </Button>
            </Link>
          ) : null}
        </div>
      </div>
      <p className="mt-6 text-center text-xs text-[#A69A97]/60">Powered by Pemilo</p>
    </div>
  );
}
