const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("pemilo_token");
}

export function setToken(token: string) {
  localStorage.setItem("pemilo_token", token);
}

export function clearToken() {
  localStorage.removeItem("pemilo_token");
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Don't set Content-Type for FormData
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: "Request failed" }));
    throw new ApiError(body.error || "Request failed", res.status);
  }

  // Handle CSV responses
  const contentType = res.headers.get("content-type");
  if (contentType?.includes("text/csv")) {
    return (await res.blob()) as unknown as T;
  }

  return res.json();
}

// ── Auth ──
export const api = {
  auth: {
    register: (data: { email: string; password: string; name: string }) =>
      request("/auth/register", { method: "POST", body: JSON.stringify(data) }),
    login: (data: { email: string; password: string }) =>
      request("/auth/login", { method: "POST", body: JSON.stringify(data) }),
    me: () => request("/auth/me"),
    logout: () => request("/auth/logout", { method: "POST" }),
  },

  events: {
    list: () => request("/events"),
    get: (id: string) => request(`/events/${id}`),
    create: (data: { title: string; description?: string }) =>
      request("/events", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: Record<string, unknown>) =>
      request(`/events/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
    open: (id: string) => request(`/events/${id}/open`, { method: "POST" }),
    close: (id: string) => request(`/events/${id}/close`, { method: "POST" }),
    lock: (id: string) => request(`/events/${id}/lock`, { method: "POST" }),
  },

  slates: {
    list: (eventId: string) => request(`/events/${eventId}/slates`),
    create: (eventId: string, data: { number: number; name: string; vision?: string; mission?: string; photo_url?: string }) =>
      request(`/events/${eventId}/slates`, { method: "POST", body: JSON.stringify(data) }),
    update: (slateId: string, data: Record<string, unknown>) =>
      request(`/slates/${slateId}`, { method: "PATCH", body: JSON.stringify(data) }),
    delete: (slateId: string) =>
      request(`/slates/${slateId}`, { method: "DELETE" }),
    createMember: (slateId: string, data: { role: string; full_name: string; photo_url?: string; bio?: string; sort_order?: number }) =>
      request(`/slates/${slateId}/members`, { method: "POST", body: JSON.stringify(data) }),
    updateMember: (memberId: string, data: Record<string, unknown>) =>
      request(`/slate-members/${memberId}`, { method: "PATCH", body: JSON.stringify(data) }),
    deleteMember: (memberId: string) =>
      request(`/slate-members/${memberId}`, { method: "DELETE" }),
  },

  voters: {
    import: (eventId: string, file: File) => {
      const form = new FormData();
      form.append("file", file);
      return request(`/events/${eventId}/voters/import`, { method: "POST", body: form });
    },
    list: (eventId: string, params: { page?: number; per_page?: number; q?: string; has_voted?: string }) => {
      const sp = new URLSearchParams();
      if (params.page) sp.set("page", String(params.page));
      if (params.per_page) sp.set("per_page", String(params.per_page));
      if (params.q) sp.set("q", params.q);
      if (params.has_voted) sp.set("has_voted", params.has_voted);
      return request(`/events/${eventId}/voters?${sp.toString()}`);
    },
    generateTokens: (eventId: string) =>
      request(`/events/${eventId}/voters/tokens/generate`, { method: "POST" }),
    exportTokens: (eventId: string) =>
      request<Blob>(`/events/${eventId}/voters/tokens/export`),
    exportTurnout: (eventId: string) =>
      request<Blob>(`/events/${eventId}/voters/turnout/export`),
    downloadTemplate: () =>
      request<Blob>(`/voters/template`),
  },

  stats: {
    get: (eventId: string) => request(`/events/${eventId}/stats`),
  },

  auditLogs: {
    list: (eventId: string, page = 1) =>
      request(`/events/${eventId}/audit-logs?page=${page}`),
  },

  payment: {
    upgrade: (eventId: string, pkg: string) =>
      request(`/events/${eventId}/upgrade`, { method: "POST", body: JSON.stringify({ package: pkg }) }),
    getOrder: (orderId: string) => request(`/orders/${orderId}`),
  },

  public: {
    prepare: (eventId: string, data: { token: string; nim: string }) =>
      request(`/public/events/${eventId}/vote/prepare`, { method: "POST", body: JSON.stringify(data) }),
    submit: (eventId: string, data: { token: string; nim: string; slate_id: string }) =>
      request(`/public/events/${eventId}/vote/submit`, { method: "POST", body: JSON.stringify(data) }),
  },
};
