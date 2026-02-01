'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useWebSocket } from '@/hooks/useWebSocket';
import { VotingRoom, Candidate, Ticket, RoomStatus } from '@/types';
import api from '@/lib/api';
import { formatDate, formatPercentage } from '@/lib/utils';
import {
  ArrowLeft,
  Users,
  Ticket as TicketIcon,
  Plus,
  Play,
  Pause,
  CheckCircle,
  Download,
  Trash2,
  Settings,
  Wifi,
  WifiOff,
} from 'lucide-react';

export default function RoomDetailPage() {
  const params = useParams();
  const roomId = Number(params.id);
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [room, setRoom] = useState<VotingRoom | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [totalTickets, setTotalTickets] = useState(0);
  const [usedTickets, setUsedTickets] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'candidates' | 'tickets'>('overview');
  const [showAddCandidate, setShowAddCandidate] = useState(false);
  const [showGenerateTickets, setShowGenerateTickets] = useState(false);

  const { isConnected, lastUpdate } = useWebSocket(room?.status === 'active' ? roomId : null);

  // Update vote counts when WebSocket receives updates
  useEffect(() => {
    if (lastUpdate) {
      setCandidates((prev) =>
        prev.map((c) =>
          c.id === lastUpdate.candidate_id
            ? { ...c, vote_count: lastUpdate.vote_count }
            : c
        )
      );
    }
  }, [lastUpdate]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const loadRoom = useCallback(async () => {
    try {
      const response = await api.getRoom(roomId);
      setRoom(response.room);
      setCandidates(response.room.candidates || []);
      setTotalTickets(response.total_tickets);
      setUsedTickets(response.used_tickets);
    } catch (err) {
      console.error('Failed to load room:', err);
    } finally {
      setIsLoading(false);
    }
  }, [roomId]);

  const loadTickets = async () => {
    try {
      const response = await api.getTickets(roomId);
      setTickets(response.tickets || []);
    } catch (err) {
      console.error('Failed to load tickets:', err);
    }
  };

  useEffect(() => {
    if (user && roomId) {
      loadRoom();
    }
  }, [user, roomId, loadRoom]);

  useEffect(() => {
    if (activeTab === 'tickets' && user) {
      loadTickets();
    }
  }, [activeTab, user]);

  const handleStatusChange = async (newStatus: RoomStatus) => {
    if (!room) return;
    try {
      await api.updateRoom(roomId, { status: newStatus });
      setRoom({ ...room, status: newStatus });
    } catch (err) {
      console.error('Failed to update room status:', err);
    }
  };

  const handleDeleteRoom = async () => {
    if (!confirm('Are you sure you want to delete this room? This action cannot be undone.')) {
      return;
    }
    try {
      await api.deleteRoom(roomId);
      router.push('/dashboard');
    } catch (err) {
      console.error('Failed to delete room:', err);
    }
  };

  const totalVotes = candidates.reduce((sum, c) => sum + c.vote_count, 0);

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Room not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{room.name}</h1>
                <p className="text-sm text-gray-500">{room.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {room.status === 'active' && (
                <div className="flex items-center gap-2">
                  {isConnected ? (
                    <Wifi className="w-4 h-4 text-green-500" />
                  ) : (
                    <WifiOff className="w-4 h-4 text-red-500" />
                  )}
                  <span className="text-sm text-gray-500">
                    {isConnected ? 'Live' : 'Reconnecting...'}
                  </span>
                </div>
              )}
              <StatusDropdown status={room.status} onChange={handleStatusChange} />
            </div>
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-primary-500" />
              <div>
                <p className="text-sm text-gray-500">Candidates</p>
                <p className="text-xl font-semibold">{candidates.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center gap-3">
              <TicketIcon className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-sm text-gray-500">Tickets</p>
                <p className="text-xl font-semibold">
                  {usedTickets} / {totalTickets}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-sm text-gray-500">Total Votes</p>
                <p className="text-xl font-semibold">{totalVotes}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center gap-3">
              <Settings className="w-8 h-8 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Participation</p>
                <p className="text-xl font-semibold">
                  {totalTickets > 0
                    ? formatPercentage((usedTickets / totalTickets) * 100)
                    : '0%'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-gray-200 bg-white rounded-t-lg">
          <nav className="flex -mb-px">
            {(['overview', 'candidates', 'tickets'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-sm font-medium capitalize ${
                  activeTab === tab
                    ? 'border-b-2 border-primary-500 text-primary-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-b-lg shadow p-6">
          {activeTab === 'overview' && (
            <OverviewTab
              candidates={candidates}
              totalVotes={totalVotes}
              room={room}
            />
          )}
          {activeTab === 'candidates' && (
            <CandidatesTab
              roomId={roomId}
              candidates={candidates}
              room={room}
              onAdd={() => setShowAddCandidate(true)}
              onRefresh={loadRoom}
            />
          )}
          {activeTab === 'tickets' && (
            <TicketsTab
              roomId={roomId}
              tickets={tickets}
              room={room}
              onGenerate={() => setShowGenerateTickets(true)}
              onRefresh={loadTickets}
            />
          )}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-medium mb-2">Danger Zone</h3>
          <button
            onClick={handleDeleteRoom}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            <Trash2 className="w-4 h-4" />
            Delete Room
          </button>
        </div>
      </div>

      {/* Modals */}
      {showAddCandidate && (
        <AddCandidateModal
          roomId={roomId}
          onClose={() => setShowAddCandidate(false)}
          onCreated={() => {
            setShowAddCandidate(false);
            loadRoom();
          }}
        />
      )}
      {showGenerateTickets && (
        <GenerateTicketsModal
          roomId={roomId}
          onClose={() => setShowGenerateTickets(false)}
          onGenerated={() => {
            setShowGenerateTickets(false);
            loadTickets();
            loadRoom();
          }}
        />
      )}
    </div>
  );
}

function StatusDropdown({
  status,
  onChange,
}: {
  status: RoomStatus;
  onChange: (status: RoomStatus) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const getStatusColor = (s: RoomStatus) => {
    switch (s) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'finished':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`px-4 py-2 rounded-md font-medium capitalize ${getStatusColor(status)}`}
      >
        {status}
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg border z-10">
          {(['inactive', 'active', 'finished'] as RoomStatus[]).map((s) => (
            <button
              key={s}
              onClick={() => {
                onChange(s);
                setIsOpen(false);
              }}
              className={`block w-full text-left px-4 py-2 text-sm capitalize hover:bg-gray-50 ${
                s === status ? 'font-medium' : ''
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function OverviewTab({
  candidates,
  totalVotes,
  room,
}: {
  candidates: Candidate[];
  totalVotes: number;
  room: VotingRoom;
}) {
  const sortedCandidates = [...candidates].sort(
    (a, b) => b.vote_count - a.vote_count
  );

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Live Results</h3>
      {sortedCandidates.length === 0 ? (
        <p className="text-gray-500">No candidates added yet.</p>
      ) : (
        <div className="space-y-4">
          {sortedCandidates.map((candidate, index) => {
            const percentage = totalVotes > 0 ? (candidate.vote_count / totalVotes) * 100 : 0;
            return (
              <div key={candidate.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-gray-400">
                      #{index + 1}
                    </span>
                    <span className="font-medium">{candidate.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold">{candidate.vote_count}</span>
                    <span className="text-gray-500 ml-2">
                      ({formatPercentage(percentage)})
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-primary-500 rounded-full h-3 transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function CandidatesTab({
  roomId,
  candidates,
  room,
  onAdd,
  onRefresh,
}: {
  roomId: number;
  candidates: Candidate[];
  room: VotingRoom;
  onAdd: () => void;
  onRefresh: () => void;
}) {
  const handleDelete = async (candidateId: number) => {
    if (!confirm('Are you sure you want to delete this candidate?')) return;
    try {
      await api.deleteCandidate(roomId, candidateId);
      onRefresh();
    } catch (err) {
      console.error('Failed to delete candidate:', err);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Candidates</h3>
        {room.status === 'inactive' && (
          <button
            onClick={onAdd}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            <Plus className="w-4 h-4" />
            Add Candidate
          </button>
        )}
      </div>
      {candidates.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No candidates yet.</p>
      ) : (
        <div className="grid gap-4">
          {candidates.map((candidate) => (
            <div
              key={candidate.id}
              className="flex items-center justify-between bg-gray-50 rounded-lg p-4"
            >
              <div>
                <h4 className="font-medium">{candidate.name}</h4>
                {candidate.description && (
                  <p className="text-sm text-gray-500">{candidate.description}</p>
                )}
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">
                  {candidate.vote_count} votes
                </span>
                {room.status === 'inactive' && (
                  <button
                    onClick={() => handleDelete(candidate.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TicketsTab({
  roomId,
  tickets,
  room,
  onGenerate,
  onRefresh,
}: {
  roomId: number;
  tickets: Ticket[];
  room: VotingRoom;
  onGenerate: () => void;
  onRefresh: () => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Tickets</h3>
        <div className="flex gap-2">
          <a
            href={api.getTicketsExportUrl(roomId)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </a>
          {room.status !== 'finished' && (
            <button
              onClick={onGenerate}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              <Plus className="w-4 h-4" />
              Generate Tickets
            </button>
          )}
        </div>
      </div>
      {tickets.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No tickets generated yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Voter Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Used At
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tickets.map((ticket) => (
                <tr key={ticket.id}>
                  <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">
                    {ticket.code}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {ticket.voter_name || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        ticket.status === 'used'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {ticket.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {ticket.used_at ? formatDate(ticket.used_at) : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function AddCandidateModal({
  roomId,
  onClose,
  onCreated,
}: {
  roomId: number;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await api.createCandidate(roomId, {
        name,
        description,
        photo_url: photoUrl,
      });
      onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create candidate');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <h2 className="text-xl font-semibold mb-4">Add Candidate</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Photo URL
            </label>
            <input
              type="url"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="https://example.com/photo.jpg"
            />
          </div>
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
            >
              {isLoading ? 'Adding...' : 'Add Candidate'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function GenerateTicketsModal({
  roomId,
  onClose,
  onGenerated,
}: {
  roomId: number;
  onClose: () => void;
  onGenerated: () => void;
}) {
  const [count, setCount] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await api.generateTickets(roomId, count);
      onGenerated();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate tickets');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <h2 className="text-xl font-semibold mb-4">Generate Tickets</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Number of Tickets
            </label>
            <input
              type="number"
              min={1}
              max={1000}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <p className="text-sm text-gray-500 mt-1">
              Maximum 1000 tickets per generation
            </p>
          </div>
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
            >
              {isLoading ? 'Generating...' : 'Generate'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
