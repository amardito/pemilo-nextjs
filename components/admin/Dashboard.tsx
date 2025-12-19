import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Button } from "../ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";
import { Plus, Users, Layout, Clock, BarChart3, ArrowRight } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api-client';

interface DashboardProps {}

interface QuotaData {
  admin: {
    id: string;
    username: string;
    max_room: number;
    max_voters: number;
    is_active: boolean;
  };
  current_rooms: number;
  current_voters: number;
  room_limit: number;
  voters_limit: number;
}

interface Room {
  id: string;
  name: string;
  voters_type: string;
  status: string;
  publish_state: string;
  created_at: string;
}

export function AdminDashboard({}: DashboardProps) {
  const router = useRouter();
  const { token, loading: authLoading } = useAuth();
  const [quota, setQuota] = useState<QuotaData | null>(null);
  const [recentRooms, setRecentRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) {
      // Wait for auth to finish loading
      return;
    }

    const loadData = async () => {
      try {
        if (!token) {
          throw new Error('Not authenticated');
        }
        
        api.setToken(token);
        const quotaData = await api.getQuota();
        
        const roomsResponse = await api.getRooms();
        const roomsData = roomsResponse.rooms || [];
        
        setQuota(quotaData);
        setRecentRooms(roomsData.slice(0, 5));
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [token, authLoading]);

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>;
  if (!quota) return <div className="p-8 text-red-600">Failed to load quota data</div>;

  const activeRooms = recentRooms.filter(r => r.publish_state === 'published').length;
  
  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-sm sm:text-base text-muted-foreground">Overview of your voting system performance and quotas.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6">
            <CardTitle className="text-xs sm:text-sm font-medium">Room Quota</CardTitle>
            <Layout className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="text-xl sm:text-2xl font-bold">{quota.current_rooms} / {quota.room_limit}</div>
            <p className="text-xs text-muted-foreground">
              {quota.room_limit - quota.current_rooms} remaining
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6">
            <CardTitle className="text-xs sm:text-sm font-medium">Voter Quota</CardTitle>
            <Users className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="text-xl sm:text-2xl font-bold">{quota.current_voters} / {quota.voters_limit}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((quota.current_voters / quota.voters_limit) * 100)}% used
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6">
            <CardTitle className="text-xs sm:text-sm font-medium">Active Rooms</CardTitle>
            <ActivityIcon className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="text-xl sm:text-2xl font-bold">{activeRooms}</div>
            <p className="text-xs text-muted-foreground">
              Accepting votes
            </p>
          </CardContent>
        </Card>
        <Card className="bg-primary text-primary-foreground col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-primary-foreground/90">Quick Action</CardTitle>
            <Plus className="h-3 w-3 sm:h-4 sm:w-4 text-primary-foreground/70" />
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <Button variant="secondary" className="w-full text-sm" onClick={() => router.push('/admin/create')}>
              Create New Room
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Rooms List */}
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-lg sm:text-xl">Recent Rooms</CardTitle>
          <CardDescription className="text-sm">
            Recently created voting rooms.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <div className="space-y-3 sm:space-y-4">
            {recentRooms.length > 0 ? (
              <>
                {recentRooms.map(room => (
                  <div key={room.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 border-b pb-3 sm:pb-4 last:border-0 last:pb-0">
                    <div className="space-y-1 flex-1 min-w-0">
                      <p className="text-sm font-medium leading-none truncate">{room.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{room.voters_type.replace('_', ' ')}</p>
                    </div>
                    <Badge variant={room.publish_state === 'published' ? 'default' : 'secondary'} className="w-fit">
                      {room.publish_state}
                    </Badge>
                  </div>
                ))}
                <Button variant="ghost" className="w-full text-xs sm:text-sm" onClick={() => router.push('/admin/rooms')}>
                  View all rooms <ArrowRight className="ml-2 h-3 w-3" />
                </Button>
              </>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">No rooms created yet</p>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Full Table Preview - Hidden on mobile since we have Recent Rooms card */}
      {recentRooms.length > 0 && (
        <Card className="hidden lg:block">
          <CardHeader>
            <CardTitle>All Rooms</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Room Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Publish State</TableHead>
                    <TableHead>Created At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentRooms.map((room) => (
                    <TableRow key={room.id}>
                      <TableCell className="font-medium">{room.name}</TableCell>
                      <TableCell className="capitalize">{room.voters_type.replace('_', ' ')}</TableCell>
                      <TableCell>
                        <Badge variant={room.publish_state === 'published' ? 'default' : (room.status === 'disabled' ? 'destructive' : 'secondary')}>
                          {room.publish_state}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(room.created_at).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function ActivityIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  )
}
