// API Client for Go REST Backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

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
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        response.status,
        errorData.message || `HTTP ${response.status}: ${response.statusText}`
      );
    }

    // Handle empty responses
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }

    return {} as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new Error(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// API Methods
export const api = {
  // Rooms
  getRooms: () => fetchApi<any[]>('/rooms'),
  
  getRoom: (id: string) => fetchApi<any>(`/rooms/${id}`),
  
  createRoom: (data: any) => 
    fetchApi<any>('/rooms', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  updateRoom: (id: string, data: any) =>
    fetchApi<any>(`/rooms/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  deleteRoom: (id: string) =>
    fetchApi<void>(`/rooms/${id}`, {
      method: 'DELETE',
    }),

  // Votes
  submitVote: (roomId: string, candidateId: string, data?: any) =>
    fetchApi<any>('/votes', {
      method: 'POST',
      body: JSON.stringify({
        roomId,
        candidateId,
        ...data,
      }),
    }),

  // Stats
  getStats: () => fetchApi<any>('/stats'),

  // Candidates (if your API has these endpoints)
  getCandidates: (roomId: string) => 
    fetchApi<any[]>(`/rooms/${roomId}/candidates`),
};

export { ApiError };
