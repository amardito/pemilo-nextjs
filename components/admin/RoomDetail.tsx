import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { ArrowLeft, Play, Square, Download, Copy, Pencil, Plus } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { LiveVotingGraph } from '../common/LiveVotingGraph';
import { toast } from 'sonner';
import { api } from '@/lib/api-client';
import { Candidate } from '@/types';

interface RoomDetailProps {
  roomId: string | null;
}

interface Room {
  id: string;
  name: string;
  description?: string;
  publish_state?: 'draft' | 'published' | 'closed';
  candidates?: Candidate[];
  voters_type?: string;
  session_state?: string;
  voters_limit?: number;
  current_voters?: number;
  created_at?: string;
}

export function RoomDetail({ roomId }: Readonly<RoomDetailProps>) {
  const router = useRouter();
  const { token, loading: authLoading } = useAuth();
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
        console.error('Failed to load room details:', error);
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
      console.error('Failed to update room:', error);
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
      console.error('Failed to update session state:', error);
      toast.error('Failed to update session state');
    }
  };

  const totalVotes = candidates.reduce((acc, c) => acc + (c.voteCount || 0), 0);

  const getPublishStateVariant = () => {
    if (room.publish_state === 'published') return 'default';
    if (room.publish_state === 'closed') return 'destructive';
    return 'secondary';
  };

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
              <Badge variant={getPublishStateVariant()}>
                {room.publish_state}
              </Badge>
            </h2>
            <p className="text-muted-foreground">{room.id} • {room.voters_type?.replaceAll('_', ' ')}</p>
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
                        {candidate.photoUrl && <img src={candidate.photoUrl} alt={candidate.name} className="h-full w-full object-cover" />}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{candidate.name}</div>
                        <div className="text-xs text-muted-foreground truncate max-w-[200px]">{candidate.description}</div>
                        {candidate.subCandidates && candidate.subCandidates.length > 0 && (
                          <div className="text-xs text-muted-foreground">
                            {candidate.subCandidates.map(sc => sc.name).join(', ')}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                         <div className="font-bold text-lg">{candidate.voteCount || 0}</div>
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
                 <span className="font-medium">{room.voters_type?.replaceAll('_', ' ')}</span>
               </div>
               <div className="flex justify-between">
                 <span className="text-muted-foreground">Created:</span>
                 <span className="font-medium">{room.created_at ? new Date(room.created_at).toLocaleDateString() : 'N/A'}</span>
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

          {room.voters_type === 'custom_tickets' && (
            <Card>
              <CardHeader>
                <CardTitle>Ticket Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-xs text-muted-foreground">Generate voting tickets for this room</p>
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => router.push(`/admin/room/${room.id}/tickets/single`)}
                  >
                    <Plus className="mr-2 h-4 w-4" /> Single Ticket
                  </Button>
                  <Button 
                    className="w-full justify-start bg-primary hover:bg-primary/90"
                    onClick={() => router.push(`/admin/room/${room.id}/tickets/bulk`)}
                  >
                    <Plus className="mr-2 h-4 w-4" /> Bulk Tickets
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
             <CardHeader>
               <CardTitle>Share</CardTitle>
             </CardHeader>
             <CardContent className="space-y-4">
               <div className="p-3 bg-muted rounded text-xs break-all font-mono">
                 https://pemilo.amardito.info/voter/room/{room.id}
               </div>
               <Button variant="outline" className="w-full" onClick={() => {
                 navigator.clipboard.writeText(`https://pemilo.amardito.info/voter/room/${room.id}`);
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
