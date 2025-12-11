// API Client for Go REST Backend - Pemilo API v1

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api-pemilo.amardito.info/api/v1';

let authToken: string | null = null;

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(authToken && { 'Authorization': `Bearer ${authToken}` }),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        response.status,
        errorData.message || errorData.error || `HTTP ${response.status}: ${response.statusText}`
      );
    }

    // Handle empty responses
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      return data;
    }

    return {} as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new Error(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// API Methods - Admin Authentication
export const api = {
  // Authentication
  login: (username: string, encryptedPassword: string) =>
    fetchApi<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, encrypted_password: encryptedPassword }),
    }).then(response => {
      if (response.token) {
        authToken = response.token;
      }
      return response;
    }),

  setToken: (token: string) => {
    authToken = token;
  },

  getToken: () => authToken,

  clearToken: () => {
    authToken = null;
  },

  // Admin Quota
  getQuota: () => fetchApi<any>('/admin/quota'),

  // Rooms
  getRooms: (filters?: { status?: string; publish_state?: string; session_state?: string }) => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.publish_state) params.append('publish_state', filters.publish_state);
    if (filters?.session_state) params.append('session_state', filters.session_state);
    const query = params.toString() ? `?${params.toString()}` : '';
    return fetchApi<any>(`/admin/rooms${query}`);
  },
  
  getRoom: (id: string) => fetchApi<any>(`/admin/rooms/${id}`),
  
  createRoom: (data: any) => 
    fetchApi<any>('/admin/rooms', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  updateRoom: (id: string, data: any) =>
    fetchApi<any>(`/admin/rooms/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  deleteRoom: (id: string) =>
    fetchApi<void>(`/admin/rooms/${id}`, {
      method: 'DELETE',
    }),

  deleteBulkRooms: (ids: string[]) =>
    fetchApi<void>('/admin/rooms', {
      method: 'DELETE',
      body: JSON.stringify({ ids }),
    }),

  // Candidates
  getCandidates: (roomId: string) => 
    fetchApi<any>(`/admin/candidates/room/${roomId}`),

  getCandidate: (candidateId: string) =>
    fetchApi<any>(`/admin/candidates/${candidateId}`),
  
  createCandidate: (data: any) =>
    fetchApi<any>('/admin/candidates', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateCandidate: (candidateId: string, data: any) =>
    fetchApi<any>(`/admin/candidates/${candidateId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteCandidate: (candidateId: string) =>
    fetchApi<void>(`/admin/candidates/${candidateId}`, {
      method: 'DELETE',
    }),

  // Tickets
  createTicket: (roomId: string, ticketCode?: string) =>
    fetchApi<any>('/admin/tickets', {
      method: 'POST',
      body: JSON.stringify({ 
        room_id: roomId,
        ...(ticketCode ? { code: ticketCode } : {}) // Only include code if provided
      }),
    }),

  createBulkTickets: (roomId: string, ticketCodes: string[]) =>
    fetchApi<any>('/admin/tickets/bulk', {
      method: 'POST',
      body: JSON.stringify({ room_id: roomId, codes: ticketCodes }),
    }),

  getTickets: (roomId: string, filters?: { used?: boolean }) => {
    const params = new URLSearchParams();
    if (filters?.used !== undefined) params.append('used', String(filters.used));
    const query = params.toString() ? `?${params.toString()}` : '';
    return fetchApi<any>(`/admin/tickets/room/${roomId}${query}`);
  },

  getTicketCounts: (roomId: string) =>
    fetchApi<{
      room_id: string;
      total_count: number;
      used_count: number;
      unused_count: number;
    }>(`/admin/tickets/counts/room/${roomId}`),

  deleteTicket: (ticketId: string) =>
    fetchApi<void>(`/admin/tickets/${ticketId}`, {
      method: 'DELETE',
    }),

  // Voting - Public Endpoints
  getVotingRoom: (roomId: string) =>
    fetchApi<any>(`/vote?room_id=${roomId}`),

  verifyTicket: (roomId: string, ticketCode: string) =>
    fetchApi<any>('/vote/verify-ticket', {
      method: 'POST',
      body: JSON.stringify({ room_id: roomId, ticket_code: ticketCode }),
    }),

  submitVote: (roomId: string, candidateId: string, data?: any) =>
    fetchApi<any>('/vote', {
      method: 'POST',
      body: JSON.stringify({
        room_id: roomId,
        candidate_id: candidateId,
        ...data,
      }),
    }),

  // Realtime Stats
  getRealtimeStats: (roomId: string) =>
    fetchApi<any>(`/admin/rooms/${roomId}/realtime`),
};

export { ApiError };
