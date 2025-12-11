"use server";

import { api } from "./api-client";
import { revalidatePath } from "next/cache";

// Get all rooms
export async function getRooms() {
  try {
    const rooms = await api.getRooms();
    return rooms;
  } catch (error) {
    console.error('Error fetching rooms:', error);
    return [];
  }
}

// Get single room
export async function getRoom(id: string) {
  try {
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
    await api.deleteRoom(id);
    
    revalidatePath('/admin');
    revalidatePath('/admin/rooms');
    revalidatePath('/voter');
  } catch (error) {
    console.error('Error deleting room:', error);
    throw error;
  }
}

// Get stats
export async function getStats() {
  try {
    const stats = await api.getStats();
    return stats;
  } catch (error) {
    console.error('Error fetching stats:', error);
    return {
      totalRoomQuota: 50,
      roomsCreated: 0,
      totalVoterQuota: 1000,
      votersUsed: 0,
      activeRooms: 0
    };
  }
}

// Submit vote
export async function submitVote(roomId: string, candidateId: string, additionalData?: any) {
  try {
    await api.submitVote(roomId, candidateId, additionalData);
    
    revalidatePath('/admin');
    revalidatePath(`/admin/room/${roomId}`);
    revalidatePath(`/voter/room/${roomId}`);
    
    return true;
  } catch (error) {
    console.error('Error submitting vote:', error);
    return false;
  }
}
