"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ExportsPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const router = useRouter();
  useEffect(() => {
    router.replace(`/admin/events/${eventId}/voters`);
  }, [eventId, router]);
  return null;
}
