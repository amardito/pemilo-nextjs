import { Room, Stats, Candidate } from '../../types';

// Mock Data
let rooms: Room[] = [
  {
    id: '1',
    name: 'Student Council Election 2024',
    description: 'Vote for your next student council president.',
    type: 'wild_limited',
    status: 'published',
    createdAt: '2024-03-10T10:00:00Z',
    startDate: '2024-03-15T08:00:00Z',
    endDate: '2024-03-20T17:00:00Z',
    candidates: [
      { id: 'c1', name: 'Alice Johnson', description: 'Visionary leader for a better campus.', photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop', voteCount: 145 },
      { id: 'c2', name: 'Bob Smith', description: 'Practical solutions for everyday problems.', photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop', voteCount: 132 },
      { id: 'c3', name: 'Charlie Davis', description: 'Your voice, heard loud and clear.', photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop', voteCount: 89 },
    ]
  },
  {
    id: '2',
    name: 'Best Employee Q1',
    description: 'Internal voting for the best employee of the first quarter.',
    type: 'custom_tickets',
    status: 'published',
    createdAt: '2024-03-12T14:30:00Z',
    totalTickets: 100,
    ticketsUsed: 45,
    candidates: [
      { id: 'c4', name: 'Sarah Lee', description: 'Outstanding performance in Sales.', photoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop', voteCount: 20 },
      { id: 'c5', name: 'David Kim', description: 'Exceptional support in IT.', photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop', voteCount: 25 },
    ]
  },
  {
    id: '3',
    name: 'Annual Charity Theme',
    description: 'Help us decide the theme for this year\'s charity gala.',
    type: 'wild_unlimited',
    status: 'draft',
    createdAt: '2024-03-14T09:15:00Z',
    candidates: [
      { id: 'c6', name: 'Masquerade Ball', description: 'Classic elegance and mystery.', photoUrl: 'https://images.unsplash.com/photo-1514533450685-4493e01d1fdc?w=400&h=400&fit=crop', voteCount: 0 },
      { id: 'c7', name: 'Retro 80s', description: 'Fun, colorful, and nostalgic.', photoUrl: 'https://images.unsplash.com/photo-1551972873-b7e8754e8e26?w=400&h=400&fit=crop', voteCount: 0 },
    ]
  }
];

// In-memory functions
export const getRooms = () => [...rooms];
export const getRoom = (id: string) => rooms.find(r => r.id === id);
export const createRoom = (room: Room) => {
  rooms.push(room);
  return room;
};
export const updateRoom = (id: string, updates: Partial<Room>) => {
  const index = rooms.findIndex(r => r.id === id);
  if (index !== -1) {
    rooms[index] = { ...rooms[index], ...updates };
    return rooms[index];
  }
  return null;
};
export const deleteRoom = (id: string) => {
  rooms = rooms.filter(r => r.id !== id);
};

export const getStats = (): Stats => {
  const activeRooms = rooms.filter(r => r.status === 'published').length;
  const roomsCreated = rooms.length;
  
  // Mock quota logic
  const totalRoomQuota = 10;
  const totalVoterQuota = 1000;
  
  const votersUsed = rooms.reduce((acc, room) => {
    return acc + room.candidates.reduce((cAcc, cand) => cAcc + cand.voteCount, 0);
  }, 0);

  return {
    totalRoomQuota,
    roomsCreated,
    totalVoterQuota,
    votersUsed,
    activeRooms
  };
};

// Voting simulation
export const submitVote = (roomId: string, candidateId: string) => {
  const room = rooms.find(r => r.id === roomId);
  if (room) {
    const candidate = room.candidates.find(c => c.id === candidateId);
    if (candidate) {
      candidate.voteCount++;
      // If custom tickets, increment used
      if (room.type === 'custom_tickets' && room.ticketsUsed !== undefined) {
        room.ticketsUsed++;
      }
      return true;
    }
  }
  return false;
};
