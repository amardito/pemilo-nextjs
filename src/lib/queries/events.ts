"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type {
  ApiSuccessResponse,
  Event,
  AuthResponse,
  UserDTO,
} from "@/lib/types";

// ── Auth ──
export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: () => api.auth.me() as Promise<ApiSuccessResponse<UserDTO>>,
    retry: false,
  });
}

export function useLogin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      api.auth.login(data) as Promise<ApiSuccessResponse<AuthResponse>>,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["me"] });
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (data: { email: string; password: string; name: string }) =>
      api.auth.register(data) as Promise<ApiSuccessResponse<AuthResponse>>,
  });
}

// ── Events ──
export function useEvents() {
  return useQuery({
    queryKey: ["events"],
    queryFn: () => api.events.list() as Promise<ApiSuccessResponse<Event[]>>,
  });
}

export function useEvent(id: string) {
  return useQuery({
    queryKey: ["events", id],
    queryFn: () => api.events.get(id) as Promise<ApiSuccessResponse<Event>>,
    enabled: !!id,
  });
}

export function useCreateEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { title: string; description?: string }) =>
      api.events.create(data) as Promise<ApiSuccessResponse<Event>>,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["events"] }),
  });
}

export function useUpdateEvent(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      api.events.update(id, data) as Promise<ApiSuccessResponse<Event>>,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["events", id] });
      qc.invalidateQueries({ queryKey: ["events"] });
    },
  });
}

export function useOpenEvent(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.events.open(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["events", id] });
      qc.invalidateQueries({ queryKey: ["events"] });
    },
  });
}

export function useCloseEvent(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.events.close(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["events", id] });
      qc.invalidateQueries({ queryKey: ["events"] });
    },
  });
}

export function useLockEvent(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.events.lock(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["events", id] });
      qc.invalidateQueries({ queryKey: ["events"] });
    },
  });
}
