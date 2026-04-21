"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { api, ApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Event, ApiSuccessResponse } from "@/lib/types";

export default function EventLandingPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        // Use the public event info from stats or a public endpoint
        // For now we fetch stats which is publicly-ish accessible
        const res = (await api.events.get(eventId)) as ApiSuccessResponse<Event>;
        setEvent(res.data as Event);
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
      <div suppressHydrationWarning className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 px-4">
        <div className="w-full max-w-md space-y-4 rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm">
          <Skeleton className="mx-auto h-14 w-14 rounded-full bg-white/40" />
          <Skeleton className="h-7 w-3/4 mx-auto bg-white/40" />
          <Skeleton className="h-4 w-full bg-white/30" />
          <Skeleton className="h-4 w-5/6 mx-auto bg-white/30" />
          <Skeleton className="h-11 w-full rounded-lg bg-white/40" />
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div suppressHydrationWarning className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 px-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-xl">
          <h1 className="text-xl font-bold text-gray-900">Oops!</h1>
          <p className="mt-2 text-gray-500">{error || "Event tidak ditemukan"}</p>
        </div>
      </div>
    );
  }

  const isOpen = event.status === "OPEN";
  const isClosed = event.status === "CLOSED" || event.status === "LOCKED";

  return (
    <div suppressHydrationWarning className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 px-4 py-8 text-white">
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-xl text-center space-y-6 rounded-2xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-sm sm:p-8">
          <div className="text-6xl">🗳️</div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{event.title}</h1>
            {event.description && (
              <p className="mt-3 text-sm text-blue-100 sm:text-base">{event.description}</p>
            )}
          </div>

          <div>
            {isOpen ? (
              <span className="inline-flex rounded-full bg-emerald-500/20 px-4 py-1 text-sm font-semibold text-emerald-100 ring-1 ring-emerald-300/40">
                Voting Dibuka
              </span>
            ) : isClosed ? (
              <span className="inline-flex rounded-full bg-red-500/20 px-4 py-1 text-sm font-semibold text-red-100 ring-1 ring-red-300/40">
                Voting Ditutup
              </span>
            ) : (
              <span className="inline-flex rounded-full bg-yellow-400/20 px-4 py-1 text-sm font-semibold text-yellow-100 ring-1 ring-yellow-300/40">
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
      <p className="mt-6 text-center text-xs text-blue-100/90">Powered by Pemilo</p>
    </div>
  );
}
