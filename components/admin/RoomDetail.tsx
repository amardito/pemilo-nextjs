import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Progress } from "../ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ArrowLeft, Play, Square, Download, Copy, Share2, Users, Ticket, Pencil } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { LiveVotingGraph } from '../common/LiveVotingGraph';
import { toast } from 'sonner';
import { api } from '@/lib/api-client';

interface RoomDetailProps {
  roomId: string | null;
}

interface Candidate {
  id: string;
  name: string;
  photo_url?: string;
  description?: string;
  vote_count?: number;
  sub_candidates?: Array<{
    id: string;
    name: string;
    photo_url?: string;
    description?: string;
  }>;
}

interface Room {
  id: string;
  name: string;
  voters_type: string;
  publish_state: 'draft' | 'published' | 'closed';
  created_at: string;
  session_state?: string;
  voters_limit?: number;
  current_voters?: number;
}

export function RoomDetail({ roomId }: RoomDetailProps) {
  const router = useRouter();
  const { token, authLoading } = useAuth();
  const [room, setRoom] = useState<Room | undefined>(undefined);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRoom = async () => {
      if (!roomId || !token) return;
      try {
        setLoading(true);
        api.setToken(token);
        const roomResponse = await api.getRoom(roomId);
        const candidatesResponse = await api.getCandidates(roomId);
        setRoom(roomResponse);
        setCandidates(candidatesResponse.candidates || []);
      } catch (error) {
        console.error('Failed to load room:', error);
        toast.error('Failed to load room details');
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      loadRoom();
    }
  }, [roomId, token, authLoading]);

  if (loading) return <div>Loading room details...</div>;
  if (!room) return <div>Room not found</div>;

  const handlePublishStateChange = async (newState: 'draft' | 'published') => {
    if (!room || !token) return;
    try {
      api.setToken(token);
      await api.updateRoom(room.id, { publish_state: newState });
      setRoom({ ...room, publish_state: newState });
      toast.success(`Room ${newState}`);
    } catch (error) {
      console.error('Error updating room:', error);
      toast.error('Failed to update room');
    }
  };

  const handleSessionStateChange = async (newState: 'open' | 'closed') => {
    if (!room || !token) return;
    try {
      api.setToken(token);
      await api.updateRoom(room.id, { session_state: newState });
      setRoom({ ...room, session_state: newState });
      toast.success(`Session ${newState}`);
    } catch (error) {
      console.error('Error updating session state:', error);
      toast.error('Failed to update session state');
    }
  };

  const totalVotes = candidates.reduce((acc, c) => acc + (c.vote_count || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              {room.name}
              <Badge variant={room.publish_state === 'published' ? 'default' : (room.publish_state === 'closed' ? 'destructive' : 'secondary')}>
                {room.publish_state}
              </Badge>
            </h2>
            <p className="text-muted-foreground">{room.id} • {room.voters_type.replace(/_/g, ' ')}</p>
          </div>
        </div>
        <TooltipProvider>
          <div className="flex gap-2">
            {room.publish_state !== 'published' && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={() => handlePublishStateChange('published')} className="bg-green-600 hover:bg-green-700">
                    <Play className="mr-2 h-4 w-4" /> Publish
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Make this room visible and available for voting
                </TooltipContent>
              </Tooltip>
            )}
            {room.publish_state === 'published' && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={() => handlePublishStateChange('draft')} className="bg-amber-600 hover:bg-amber-700">
                    <Square className="mr-2 h-4 w-4 fill-current" /> Set as Draft
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Hide this room from voters
                </TooltipContent>
              </Tooltip>
            )}
            {room.session_state === 'open' && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={() => handleSessionStateChange('closed')} variant="destructive">
                    <Square className="mr-2 h-4 w-4 fill-current" /> Close Session
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Stop accepting new votes from voters
                </TooltipContent>
              </Tooltip>
            )}
            {room.session_state === 'closed' && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={() => handleSessionStateChange('open')} className="bg-blue-600 hover:bg-blue-700">
                    <Play className="mr-2 h-4 w-4" /> Open Session
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Start accepting votes from voters
                </TooltipContent>
              </Tooltip>
            )}
            <Button variant="outline" onClick={() => router.push(`/admin/room/${room.id}/edit`)}>
              <Pencil className="mr-2 h-4 w-4" /> Edit
            </Button>
            <Button variant="outline" onClick={() => toast.success("Data exported to CSV!")}>
              <Download className="mr-2 h-4 w-4" /> Export
            </Button>
          </div>
        </TooltipProvider>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Content Area */}
        <div className="md:col-span-2 space-y-6">
          <LiveVotingGraph candidates={candidates} height={400} />
          
          <Card>
            <CardHeader>
              <CardTitle>Candidates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {candidates.map((candidate, idx) => (
                   <div key={candidate.id} className="flex items-center gap-4 p-3 border rounded-lg">
                      <div className="h-12 w-12 rounded-full bg-muted overflow-hidden flex-shrink-0">
                        {candidate.photo_url && <img src={candidate.photo_url} className="h-full w-full object-cover" />}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{candidate.name}</div>
                        <div className="text-xs text-muted-foreground truncate max-w-[200px]">{candidate.description}</div>
                        {candidate.sub_candidates && candidate.sub_candidates.length > 0 && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {candidate.sub_candidates.map(sc => sc.name).join(', ')}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                         <div className="font-bold text-lg">{candidate.vote_count || 0}</div>
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
                
                {room.voters_type === 'custom_tickets' && (
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">Voters</div>
                    <div className="flex items-center justify-between text-sm mb-2">
                       <span>{room.current_voters || 0} voted</span>
                       <span>{room.voters_limit || 0} total</span>
                    </div>
                    <Progress value={((room.current_voters || 0) / (room.voters_limit || 1)) * 100} />
                  </div>
                )}
             </CardContent>
          </Card>

          <Card>
             <CardHeader>
               <CardTitle>Room Info</CardTitle>
             </CardHeader>
             <CardContent className="space-y-2 text-sm">
               <div className="flex justify-between">
                 <span className="text-muted-foreground">Type:</span>
                 <span className="font-medium">{room.voters_type.replace(/_/g, ' ')}</span>
               </div>
               <div className="flex justify-between">
                 <span className="text-muted-foreground">Created:</span>
                 <span className="font-medium">{new Date(room.created_at).toLocaleDateString()}</span>
               </div>
               {room.session_state && (
                 <div className="flex justify-between">
                   <span className="text-muted-foreground">Session:</span>
                   <Badge variant={room.session_state === 'open' ? 'default' : 'secondary'}>
                     {room.session_state}
                   </Badge>
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
                 https://pemilo.amardito.info?room={room.id}
               </div>
               <Button variant="outline" className="w-full" onClick={() => {
                 navigator.clipboard.writeText(`https://pemilo.amardito.info?room=${room.id}`);
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
