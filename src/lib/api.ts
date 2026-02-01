const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api/v1';

interface FetchOptions extends RequestInit {
  data?: unknown;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: FetchOptions = {}
  ): Promise<T> {
    const { data, ...fetchOptions } = options;

    const config: RequestInit = {
      ...fetchOptions,
      headers: {
        'Content-Type': 'application/json',
        ...fetchOptions.headers,
      },
      credentials: 'include', // Important for session cookies
    };

    if (data) {
      config.body = JSON.stringify(data);
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Auth endpoints
  async login(username: string, password: string) {
    return this.request<{ message: string; user: import('@/types').User }>(
      '/auth/login',
      {
        method: 'POST',
        data: { username, password },
      }
    );
  }

  async logout() {
    return this.request<{ message: string }>('/auth/logout', {
      method: 'POST',
    });
  }

  async register(username: string, password: string) {
    return this.request<{ message: string; user: import('@/types').User }>(
      '/auth/register',
      {
        method: 'POST',
        data: { username, password },
      }
    );
  }

  async getMe() {
    return this.request<{ user: import('@/types').User }>('/me');
  }

  // Room endpoints
  async getRooms() {
    return this.request<import('@/types').RoomsResponse>('/rooms');
  }

  async getRoom(id: number) {
    return this.request<import('@/types').RoomResponse>(`/rooms/${id}`);
  }

  async createRoom(name: string, description: string) {
    return this.request<{ message: string; room: import('@/types').VotingRoom }>(
      '/rooms',
      {
        method: 'POST',
        data: { name, description },
      }
    );
  }

  async updateRoom(
    id: number,
    data: Partial<import('@/types').VotingRoom>
  ) {
    return this.request<{ message: string; room: import('@/types').VotingRoom }>(
      `/rooms/${id}`,
      {
        method: 'PUT',
        data,
      }
    );
  }

  async deleteRoom(id: number) {
    return this.request<{ message: string }>(`/rooms/${id}`, {
      method: 'DELETE',
    });
  }

  async getRoomResults(roomId: number) {
    return this.request<import('@/types').RoomResults>(`/rooms/${roomId}/results`);
  }

  // Candidate endpoints
  async getCandidates(roomId: number) {
    return this.request<import('@/types').CandidatesResponse>(
      `/rooms/${roomId}/candidates`
    );
  }

  async createCandidate(
    roomId: number,
    data: {
      name: string;
      photo_url?: string;
      description?: string;
      display_order?: number;
    }
  ) {
    return this.request<{ message: string; candidate: import('@/types').Candidate }>(
      `/rooms/${roomId}/candidates`,
      {
        method: 'POST',
        data,
      }
    );
  }

  async updateCandidate(
    roomId: number,
    candidateId: number,
    data: Partial<import('@/types').Candidate>
  ) {
    return this.request<{ message: string; candidate: import('@/types').Candidate }>(
      `/rooms/${roomId}/candidates/${candidateId}`,
      {
        method: 'PUT',
        data,
      }
    );
  }

  async deleteCandidate(roomId: number, candidateId: number) {
    return this.request<{ message: string }>(
      `/rooms/${roomId}/candidates/${candidateId}`,
      {
        method: 'DELETE',
      }
    );
  }

  // Ticket endpoints
  async getTickets(roomId: number) {
    return this.request<import('@/types').TicketsResponse>(
      `/rooms/${roomId}/tickets`
    );
  }

  async generateTickets(roomId: number, count: number, voterNames?: string[]) {
    return this.request<{ message: string; tickets: import('@/types').Ticket[] }>(
      `/rooms/${roomId}/tickets/generate`,
      {
        method: 'POST',
        data: { count, voter_names: voterNames },
      }
    );
  }

  async deleteTicket(roomId: number, ticketId: number) {
    return this.request<{ message: string }>(
      `/rooms/${roomId}/tickets/${ticketId}`,
      {
        method: 'DELETE',
      }
    );
  }

  getTicketsExportUrl(roomId: number) {
    return `${this.baseUrl}/rooms/${roomId}/tickets/export`;
  }

  // Voting endpoints (public)
  async validateTicket(code: string) {
    return this.request<{
      valid: boolean;
      room?: import('@/types').VotingRoom;
      candidates?: import('@/types').Candidate[];
      error?: string;
    }>(`/vote/validate?code=${encodeURIComponent(code)}`);
  }

  async castVote(ticketCode: string, candidateId: number) {
    return this.request<{ message: string }>('/vote/cast', {
      method: 'POST',
      data: { ticket_code: ticketCode, candidate_id: candidateId },
    });
  }
}

export const api = new ApiClient(API_BASE_URL);
export default api;
