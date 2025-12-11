export type RoomType = 'custom_tickets' | 'wild_limited' | 'wild_unlimited';
export type RoomStatus = 'draft' | 'published' | 'closed';

export interface Candidate {
  id: string;
  name: string;
  description: string;
  photoUrl: string;
  subCandidates?: SubCandidate[];
  voteCount: number;
}

export interface SubCandidate {
  id: string;
  name: string;
  description: string;
  photoUrl: string;
}

export interface Room {
  id: string;
  name: string;
  description: string;
  type: RoomType;
  status: RoomStatus;
  createdAt: string;
  candidates: Candidate[];
  
  // Type specific logic
  totalTickets?: number;
  ticketsUsed?: number;
  
  startDate?: string;
  endDate?: string;
}

export interface Stats {
  totalRoomQuota: number;
  roomsCreated: number;
  totalVoterQuota: number;
  votersUsed: number;
  activeRooms: number;
}
