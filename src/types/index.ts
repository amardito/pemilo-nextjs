// API Types for the Online Voting Platform

export interface User {
  id: number;
  username: string;
  created_at: string;
  last_login: string | null;
}

export type RoomStatus = 'inactive' | 'active' | 'finished';

export interface VotingRoom {
  id: number;
  name: string;
  description: string;
  status: RoomStatus;
  created_by: number;
  created_at: string;
  candidates?: Candidate[];
}

export interface Candidate {
  id: number;
  room_id: number;
  parent_candidate_id: number | null;
  name: string;
  photo_url: string;
  description: string;
  display_order: number;
  vote_count: number;
  children?: Candidate[];
}

export type TicketStatus = 'unused' | 'used';

export interface Ticket {
  id: number;
  code: string;
  room_id: number;
  voter_name: string | null;
  status: TicketStatus;
  used_at: string | null;
  created_at: string;
}

export interface Vote {
  id: number;
  ticket_id: number;
  candidate_id: number;
  created_at: string;
}

export interface CandidateResult extends Candidate {
  vote_count: number;
  percentage: number;
}

export interface RoomResults {
  results: CandidateResult[];
  total_votes: number;
  total_tickets: number;
  used_tickets: number;
  participation: number;
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface AuthResponse {
  message: string;
  user?: User;
}

export interface RoomsResponse {
  rooms: VotingRoom[];
}

export interface RoomResponse {
  room: VotingRoom;
  total_tickets: number;
  used_tickets: number;
}

export interface CandidatesResponse {
  candidates: Candidate[];
}

export interface TicketsResponse {
  tickets: Ticket[];
}

// WebSocket message types
export interface VoteUpdate {
  room_id: number;
  candidate_id: number;
  vote_count: number;
}
