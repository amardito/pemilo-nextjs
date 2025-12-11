import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Progress } from "../ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ArrowLeft, Play, Square, Download, Copy, Share2, Users, Ticket } from 'lucide-react';
import { getRoom, updateRoom } from '../data/store';
import { Room } from '../../types';
import { LiveVotingGraph } from '../common/LiveVotingGraph';
import { View } from '../../App';
import { toast } from 'sonner';

interface RoomDetailProps {
  roomId: string | null;
  onNavigate: (view: View) => void;
}

export function RoomDetail({ roomId, onNavigate }: RoomDetailProps) {
  const [room, setRoom] = useState<Room | undefined>(undefined);
  const [refreshKey, setRefreshKey] = useState(0); // Trigger graph refresh

  useEffect(() => {
    if (roomId) {
      setRoom(getRoom(roomId));
    }
  }, [roomId, refreshKey]);

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
       setRefreshKey(k => k + 1);
       if (roomId) setRoom(getRoom(roomId)); // Re-fetch to get new votes
    }, 5000);
    return () => clearInterval(interval);
  }, [roomId]);

  if (!room) return <div>Room not found</div>;

  const handleStatusChange = (status: Room['status']) => {
    const updated = updateRoom(room.id, { status });
    if (updated) setRoom(updated);
    toast.success(`Room status changed to ${status}`);
  };

  const totalVotes = room.candidates.reduce((acc, c) => acc + c.voteCount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <Button variant="ghost" size="icon" onClick={() => onNavigate('admin-rooms')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              {room.name}
              <Badge variant={room.status === 'published' ? 'default' : (room.status === 'closed' ? 'destructive' : 'secondary')}>
                {room.status}
              </Badge>
            </h2>
            <p className="text-muted-foreground">{room.id} • {room.type.replace('_', ' ')}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {room.status !== 'published' && (
            <Button onClick={() => handleStatusChange('published')} className="bg-green-600 hover:bg-green-700">
              <Play className="mr-2 h-4 w-4" /> Start Voting
            </Button>
          )}
          {room.status === 'published' && (
             <Button variant="destructive" onClick={() => handleStatusChange('closed')}>
               <Square className="mr-2 h-4 w-4 fill-current" /> Stop Voting
             </Button>
          )}
          <Button variant="outline" onClick={() => toast.success("Data exported to CSV!")}>
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Content Area */}
        <div className="md:col-span-2 space-y-6">
          <LiveVotingGraph candidates={room.candidates} height={400} />
          
          <Card>
            <CardHeader>
              <CardTitle>Candidates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {room.candidates.map(candidate => (
                   <div key={candidate.id} className="flex items-center gap-4 p-3 border rounded-lg">
                      <div className="h-12 w-12 rounded-full bg-muted overflow-hidden">
                        {candidate.photoUrl && <img src={candidate.photoUrl} className="h-full w-full object-cover" />}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{candidate.name}</div>
                        <div className="text-xs text-muted-foreground truncate max-w-[200px]">{candidate.description}</div>
                      </div>
                      <div className="text-right">
                         <div className="font-bold text-lg">{candidate.voteCount}</div>
                         <div className="text-xs text-muted-foreground">Votes</div>
                      </div>
                   </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card>
             <CardHeader>
               <CardTitle>Quick Stats</CardTitle>
             </CardHeader>
             <CardContent className="space-y-4">
                <div>
                   <div className="text-sm font-medium text-muted-foreground mb-1">Total Votes</div>
                   <div className="text-3xl font-bold">{totalVotes}</div>
                </div>
                
                {room.type === 'custom_tickets' && (
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">Ticket Usage</div>
                    <div className="flex items-center justify-between text-sm mb-2">
                       <span>{room.ticketsUsed || 0} used</span>
                       <span>{room.totalTickets || 0} total</span>
                    </div>
                    <Progress value={((room.ticketsUsed || 0) / (room.totalTickets || 1)) * 100} />
                  </div>
                )}
             </CardContent>
          </Card>

          <Card>
             <CardHeader>
               <CardTitle>Share</CardTitle>
             </CardHeader>
             <CardContent className="space-y-4">
               <div className="p-3 bg-muted rounded text-xs break-all font-mono">
                 {window.location.origin}?room={room.id}
               </div>
               <Button variant="outline" className="w-full" onClick={() => {
                 navigator.clipboard.writeText(`${window.location.origin}?room=${room.id}`);
                 toast.success("Link copied!");
               }}>
                 <Copy className="mr-2 h-4 w-4" /> Copy Link
               </Button>
             </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
