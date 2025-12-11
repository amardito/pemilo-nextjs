"use server";

import { api } from "./api-client";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

// Helper to set token from cookies
async function setTokenFromCookies() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  if (token) {
    api.setToken(token);
  }
}

// Authentication
export async function login(username: string, encryptedPassword: string) {
  try {
    const response = await api.login(username, encryptedPassword);
    return response;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
}

// Get admin quota
export async function getQuota() {
  try {
    await setTokenFromCookies();
    const quota = await api.getQuota();
    console.log('[getQuota] Response:', quota);
    return quota;
  } catch (error) {
    console.error('[getQuota] Error fetching quota:', error);
    if (error instanceof Error) {
      console.error('[getQuota] Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    }
    throw error;
  }
}

// Get all rooms
export async function getRooms(filters?: { status?: string; publish_state?: string; session_state?: string }) {
  try {
    await setTokenFromCookies();
    const response = await api.getRooms(filters);
    return response.rooms || [];
  } catch (error) {
    console.error('Error fetching rooms:', error);
    return [];
  }
}

// Get single room
export async function getRoom(id: string) {
  try {
    await setTokenFromCookies();
    const room = await api.getRoom(id);
    return room;
  } catch (error) {
    console.error('Error fetching room:', error);
    return null;
  }
}

// Create room
export async function createRoom(data: any) {
  try {
    await setTokenFromCookies();
    const room = await api.createRoom(data);
    
    revalidatePath('/admin');
    revalidatePath('/admin/rooms');
    revalidatePath('/voter');
    
    return room;
  } catch (error) {
    console.error('Error creating room:', error);
    throw error;
  }
}

// Update room
export async function updateRoom(id: string, updates: any) {
  try {
    await setTokenFromCookies();
    const room = await api.updateRoom(id, updates);
    
    revalidatePath('/admin');
    revalidatePath('/admin/rooms');
    revalidatePath(`/admin/room/${id}`);
    revalidatePath('/voter');
    
    return room;
  } catch (error) {
    console.error('Error updating room:', error);
    throw error;
  }
}

// Delete room
export async function deleteRoom(id: string) {
  try {
    await setTokenFromCookies();
    await api.deleteRoom(id);
    
    revalidatePath('/admin');
    revalidatePath('/admin/rooms');
    revalidatePath('/voter');
  } catch (error) {
    console.error('Error deleting room:', error);
    throw error;
  }
}

// Get candidates for a room
export async function getCandidates(roomId: string) {
  try {
    await setTokenFromCookies();
    const response = await api.getCandidates(roomId);
    return response.candidates || [];
  } catch (error) {
    console.error('Error fetching candidates:', error);
    return [];
  }
}

// Get single candidate
export async function getCandidate(candidateId: string) {
  try {
    await setTokenFromCookies();
    const candidate = await api.getCandidate(candidateId);
    return candidate;
  } catch (error) {
    console.error('Error fetching candidate:', error);
    return null;
  }
}

// Create candidate
export async function createCandidate(data: any) {
  try {
    await setTokenFromCookies();
    const candidate = await api.createCandidate(data);
    revalidatePath('/admin');
    return candidate;
  } catch (error) {
    console.error('Error creating candidate:', error);
    throw error;
  }
}

// Update candidate
export async function updateCandidate(candidateId: string, data: any) {
  try {
    await setTokenFromCookies();
    const candidate = await api.updateCandidate(candidateId, data);
    revalidatePath('/admin');
    return candidate;
  } catch (error) {
    console.error('Error updating candidate:', error);
    throw error;
  }
}

// Delete candidate
export async function deleteCandidate(candidateId: string) {
  try {
    await setTokenFromCookies();
    await api.deleteCandidate(candidateId);
    revalidatePath('/admin');
  } catch (error) {
    console.error('Error deleting candidate:', error);
    throw error;
  }
}

// Create ticket
export async function createTicket(roomId: string, ticketCode?: string) {
  try {
    await setTokenFromCookies();
    const ticket = await api.createTicket(roomId, ticketCode);
    revalidatePath('/admin');
    return ticket;
  } catch (error) {
    console.error('Error creating ticket:', error);
    throw error;
  }
}

// Create bulk tickets
export async function createBulkTickets(roomId: string, ticketCodes: string[]) {
  try {
    await setTokenFromCookies();
    const response = await api.createBulkTickets(roomId, ticketCodes);
    revalidatePath('/admin');
    return response;
  } catch (error) {
    console.error('Error creating bulk tickets:', error);
    throw error;
  }
}

// Get tickets for a room
export async function getTickets(roomId: string, filters?: { used?: boolean }) {
  try {
    await setTokenFromCookies();
    const response = await api.getTickets(roomId, filters);
    return response.tickets || [];
  } catch (error) {
    console.error('Error fetching tickets:', error);
    return [];
  }
}

// Delete ticket
export async function deleteTicket(ticketId: string) {
  try {
    await setTokenFromCookies();
    await api.deleteTicket(ticketId);
    revalidatePath('/admin');
  } catch (error) {
    console.error('Error deleting ticket:', error);
    throw error;
  }
}

// Get voting room info (public)
export async function getVotingRoom(roomId: string) {
  try {
    const response = await api.getVotingRoom(roomId);
    return response;
  } catch (error) {
    console.error('Error fetching voting room:', error);
    return null;
  }
}

// Verify ticket (public)
export async function verifyTicket(roomId: string, ticketCode: string) {
  try {
    const response = await api.verifyTicket(roomId, ticketCode);
    return response;
  } catch (error) {
    console.error('Error verifying ticket:', error);
    throw error;
  }
}

// Submit vote (public)
export async function submitVote(roomId: string, candidateId: string, additionalData?: any) {
  try {
    const vote = await api.submitVote(roomId, candidateId, additionalData);
    
    revalidatePath('/admin');
    revalidatePath(`/admin/room/${roomId}`);
    revalidatePath(`/voter/room/${roomId}`);
    
    return vote;
  } catch (error) {
    console.error('Error submitting vote:', error);
    throw error;
  }
}

// Get realtime voting statistics
export async function getRealtimeStats(roomId: string) {
  try {
    const stats = await api.getRealtimeStats(roomId);
    return stats;
  } catch (error) {
    console.error('Error fetching realtime stats:', error);
    return null;
  }
}
