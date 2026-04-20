"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { api, ApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
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
      <div suppressHydrationWarning className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Memuat...</p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div suppressHydrationWarning className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <h1 className="text-xl font-bold text-gray-900">Oops!</h1>
          <p className="mt-2 text-gray-500">{error || "Event tidak ditemukan"}</p>
        </div>
      </div>
    );
  }

  const isOpen = event.status === "OPEN";
  const isClosed = event.status === "CLOSED" || event.status === "LOCKED";

  return (
    <div suppressHydrationWarning className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white px-4">
      <div className="w-full max-w-md text-center space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{event.title}</h1>
          {event.description && (
            <p className="mt-2 text-gray-600">{event.description}</p>
          )}
        </div>

        {isOpen ? (
          <Link href={`/e/${eventId}/login`}>
            <Button size="lg" className="w-full text-lg">
              Mulai Memilih
            </Button>
          </Link>
        ) : isClosed ? (
          <div className="rounded-lg bg-gray-100 p-4">
            <p className="text-gray-600 font-medium">Voting sudah ditutup</p>
          </div>
        ) : (
          <div className="rounded-lg bg-yellow-50 p-4">
            <p className="text-yellow-700 font-medium">Voting belum dibuka</p>
          </div>
        )}

        <p className="text-xs text-gray-400">Powered by Pemilo</p>
      </div>
    </div>
  );
}
