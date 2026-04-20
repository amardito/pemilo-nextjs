"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type {
  ApiSuccessResponse,
  VoterListResponse,
  ImportResult,
} from "@/lib/types";

export function useVoters(
  eventId: string,
  params: { page?: number; per_page?: number; q?: string; has_voted?: string }
) {
  return useQuery({
    queryKey: ["voters", eventId, params],
    queryFn: () =>
      api.voters.list(eventId, params) as Promise<
        ApiSuccessResponse<VoterListResponse>
      >,
    enabled: !!eventId,
  });
}

export function useImportVoters(eventId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (file: File) =>
      api.voters.import(eventId, file) as Promise<
        ApiSuccessResponse<ImportResult>
      >,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["voters", eventId] });
    },
  });
}

export function useGenerateTokens(eventId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.voters.generateTokens(eventId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["voters", eventId] });
    },
  });
}
