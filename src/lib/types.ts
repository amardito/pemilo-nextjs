// ── Auth ──
export interface UserDTO {
  id: string;
  email: string;
  name: string;
}

export interface AuthResponse {
  token: string;
  user: UserDTO;
}

// ── Event ──
export type EventStatus = "DRAFT" | "SCHEDULED" | "OPEN" | "CLOSED" | "LOCKED";
export type PackageType = "FREE" | "STARTER" | "PRO";

export interface Event {
  id: string;
  owner_user_id: string;
  title: string;
  description: string | null;
  status: EventStatus;
  opens_at: string | null;
  closes_at: string | null;
  max_slates: number;
  max_voters: number;
  package: PackageType;
  created_at: string;
  updated_at: string;
}

// ── Slate ──
export interface SlateMember {
  id: string;
  slate_id: string;
  role: string;
  full_name: string;
  photo_url: string | null;
  bio: string | null;
  sort_order: number;
}

export interface Slate {
  id: string;
  event_id: string;
  number: number;
  name: string;
  vision: string | null;
  mission: string | null;
  photo_url: string | null;
  created_at: string;
  members: SlateMember[];
}

// ── Public Slate (voting) ──
export interface SlateMemberPublic {
  role: string;
  full_name: string;
  photo_url: string | null;
  bio: string | null;
  sort_order: number;
}

export interface SlatePublic {
  id: string;
  number: number;
  name: string;
  vision: string | null;
  mission: string | null;
  photo_url: string | null;
  members: SlateMemberPublic[];
}

// ── Voting ──
export interface VotePrepareResponse {
  ok: boolean;
  voter_display: {
    full_name: string;
    class_name: string | null;
  };
  slates: SlatePublic[];
  expires_at: string;
}

// ── Voter ──
export interface VoterDTO {
  id: string;
  full_name: string;
  nim_raw: string;
  class_name: string | null;
  has_voted: boolean;
  voted_at: string | null;
  status: string;
  token?: string | null;
}

export interface VoterListResponse {
  voters: VoterDTO[];
  total: number;
  page: number;
  per_page: number;
}

export interface ImportResult {
  imported_count: number;
  rejected: { row: number; reason: string }[];
}

// ── Stats ──
export interface SlateVotes {
  slate_id: string;
  number: number;
  name: string;
  votes: number;
}

export interface LatestVoter {
  full_name: string;
  class_name: string | null;
  voted_at: string;
}

export interface StatsResponse {
  event_id: string;
  total_voters: number;
  voted_count: number;
  not_voted_count: number;
  votes_by_slate: SlateVotes[];
  latest_voters: LatestVoter[];
  updated_at: string;
}

// ── Payment ──
export interface UpgradeResponse {
  payment_url: string;
  order_id: string;
}

export interface OrderDTO {
  id: string;
  event_id: string;
  package: string;
  amount: number;
  status: string;
  ipaymu_reference: string | null;
  created_at: string;
  updated_at: string;
}

// ── Audit ──
export interface AuditLogDTO {
  id: string;
  action: string;
  actor_user_id: string | null;
  meta: string;
  created_at: string;
}

export interface AuditLogListResponse {
  logs: AuditLogDTO[];
  total: number;
  page: number;
  per_page: number;
}

// ── Generic ──
export interface ApiSuccessResponse<T = unknown> {
  ok: true;
  message?: string;
  data?: T;
}

export interface ApiErrorResponse {
  ok: false;
  error: string;
}

// ── Package Limits ──
export const PACKAGE_LIMITS: Record<PackageType, { maxSlates: number; maxVoters: number; price: number }> = {
  FREE: { maxSlates: 2, maxVoters: 30, price: 0 },
  STARTER: { maxSlates: 6, maxVoters: 200, price: 79000 },
  PRO: { maxSlates: 12, maxVoters: 1500, price: 149000 },
};
