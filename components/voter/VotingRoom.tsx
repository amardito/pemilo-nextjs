import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import { getRoom, submitVote } from '@/lib/actions';
import { Room, Candidate } from '@/types';
import { toast } from 'sonner';

interface VotingRoomProps {
  roomId: string | null;
  onExit: () => void;
}

export function VotingRoom({ roomId, onExit }: VotingRoomProps) {
  const [room, setRoom] = useState<Room | undefined>(undefined);
  const [ticketCode, setTicketCode] = useState('');
  const [hasAccess, setHasAccess] = useState(false);
  
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [selectedSubCandidate, setSelectedSubCandidate] = useState<string | null>(null);
  
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const loadRoom = async () => {
      if (roomId) {
        const r = await getRoom(roomId);
        setRoom(r);
        // Auto-grant access if not ticket-based
        if (r && r.type !== 'custom_tickets') {
          setHasAccess(true);
        }
      }
    };
    loadRoom();
  }, [roomId]);

  if (!room) return <div className="p-8 text-center">Room not found. <Button variant="link" onClick={onExit}>Go Home</Button></div>;

  const handleTicketSubmit = () => {
    // Mock validation: accept any code > 3 chars
    if (ticketCode.length > 3) {
      setHasAccess(true);
      toast.success("Ticket validated!");
    } else {
      toast.error("Invalid ticket code");
    }
  };

  const handleSubmitVote = async () => {
    if (selectedCandidate && roomId) {
      const success = await submitVote(roomId, selectedCandidate);
      if (success) {
        setIsSuccess(true);
        setIsConfirmOpen(false);
      }
    }
  };

  // --- VIEW 1: TICKET GATE ---
  if (!hasAccess) {
    return (
      <div className="max-w-md mx-auto py-8 md:py-12 px-4">
        <Card>
          <CardHeader>
             <div className="mx-auto bg-muted rounded-full p-3 w-fit mb-4">
               <Lock className="h-6 w-6 text-muted-foreground" />
             </div>
             <CardTitle className="text-center">Ticket Required</CardTitle>
             <CardDescription className="text-center">
               This voting room ({room.name}) requires a valid ticket code.
             </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="space-y-2">
               <Label>Enter Ticket Code</Label>
               <Input 
                 value={ticketCode} 
                 onChange={e => setTicketCode(e.target.value)} 
                 placeholder="e.g. ABC-123"
               />
             </div>
             <Button className="w-full" onClick={handleTicketSubmit}>
               Validate & Enter
             </Button>
          </CardContent>
          <CardFooter className="justify-center">
            <Button variant="ghost" onClick={onExit}>Cancel</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // --- VIEW 2: SUCCESS ---
  if (isSuccess) {
    return (
      <div className="max-w-md mx-auto py-8 md:py-12 px-4 text-center space-y-6">
        <div className="mx-auto bg-green-100 p-6 rounded-full w-fit animate-in zoom-in duration-300">
          <CheckCircle2 className="h-12 w-12 text-green-600" />
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Thanks for voting!</h2>
          <p className="text-sm md:text-base text-muted-foreground mt-2">Your vote has been securely recorded.</p>
        </div>
        <Card className="bg-muted/50">
           <CardContent className="pt-6">
             <p className="text-sm">Room: {room.name}</p>
             <p className="text-sm font-medium text-green-600 mt-1">Status: Confirmed</p>
           </CardContent>
        </Card>
        <Button onClick={onExit} size="lg">Return to Home</Button>
      </div>
    );
  }

  // --- VIEW 3: BALLOT ---
  return (
    <div className="space-y-6 md:space-y-8 pb-20 md:pb-12">
      {/* Extra bottom padding on mobile to account for fixed submit button */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold px-4">{room.name}</h1>
        <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto px-4">{room.description}</p>
      </div>

      <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {room.candidates.map(candidate => (
          <Card 
            key={candidate.id} 
            className={`cursor-pointer transition-all hover:shadow-md ${selectedCandidate === candidate.id ? 'ring-2 ring-primary border-primary' : ''}`}
            onClick={() => setSelectedCandidate(candidate.id)}
          >
            <div className="aspect-video w-full bg-muted relative overflow-hidden">
               {candidate.photoUrl ? (
                 <img src={candidate.photoUrl} alt={candidate.name} className="w-full h-full object-cover" />
               ) : (
                 <div className="flex items-center justify-center h-full text-muted-foreground">No Photo</div>
               )}
               {selectedCandidate === candidate.id && (
                 <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                    <div className="bg-primary text-primary-foreground rounded-full p-2">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                 </div>
               )}
            </div>
            <CardHeader>
              <CardTitle>{candidate.name}</CardTitle>
              <CardDescription>{candidate.description}</CardDescription>
            </CardHeader>
            {candidate.subCandidates && candidate.subCandidates.length > 0 && (
              <CardContent className="border-t pt-4 bg-muted/20">
                <Label className="text-xs text-muted-foreground mb-2 block">Select Running Mate (Optional)</Label>
                <RadioGroup value={selectedSubCandidate || ''} onValueChange={setSelectedSubCandidate}>
                  {candidate.subCandidates.map(sub => (
                    <div key={sub.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={sub.id} id={sub.id} />
                      <Label htmlFor={sub.id} className="text-sm">{sub.name}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-lg md:static md:bg-transparent md:border-0 md:shadow-none md:p-0 flex justify-center">
         <Button 
           size="lg" 
           className="w-full md:w-auto md:px-12" 
           disabled={!selectedCandidate}
           onClick={() => setIsConfirmOpen(true)}
         >
           Submit My Vote
         </Button>
      </div>

      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Your Vote</DialogTitle>
            <DialogDescription>
              Are you sure you want to vote for <strong>{room.candidates.find(c => c.id === selectedCandidate)?.name}</strong>?
              <br/>
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmitVote}>Confirm & Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
