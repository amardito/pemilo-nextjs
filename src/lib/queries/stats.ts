"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { StatsResponse } from "@/lib/types";

export function useStats(eventId: string, refetchInterval = 3000) {
  return useQuery({
    queryKey: ["stats", eventId],
    queryFn: () => api.stats.get(eventId) as Promise<StatsResponse>,
    enabled: !!eventId,
    refetchInterval,
  });
}
