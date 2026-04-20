"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { ApiSuccessResponse, Slate } from "@/lib/types";

export function useSlates(eventId: string) {
  return useQuery({
    queryKey: ["slates", eventId],
    queryFn: () =>
      api.slates.list(eventId) as Promise<ApiSuccessResponse<Slate[]>>,
    enabled: !!eventId,
  });
}

export function useCreateSlate(eventId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      number: number;
      name: string;
      vision?: string;
      mission?: string;
      photo_url?: string;
    }) => api.slates.create(eventId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["slates", eventId] }),
  });
}

export function useUpdateSlate(eventId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      slateId,
      data,
    }: {
      slateId: string;
      data: Record<string, unknown>;
    }) => api.slates.update(slateId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["slates", eventId] }),
  });
}

export function useDeleteSlate(eventId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (slateId: string) => api.slates.delete(slateId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["slates", eventId] }),
  });
}

export function useCreateMember(eventId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      slateId,
      data,
    }: {
      slateId: string;
      data: {
        role: string;
        full_name: string;
        photo_url?: string;
        bio?: string;
        sort_order?: number;
      };
    }) => api.slates.createMember(slateId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["slates", eventId] }),
  });
}

export function useUpdateMember(eventId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      memberId,
      data,
    }: {
      memberId: string;
      data: Record<string, unknown>;
    }) => api.slates.updateMember(memberId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["slates", eventId] }),
  });
}

export function useDeleteMember(eventId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (memberId: string) => api.slates.deleteMember(memberId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["slates", eventId] }),
  });
}
