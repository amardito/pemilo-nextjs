import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ArrowRight, Vote } from 'lucide-react';
import { getRooms } from '@/lib/actions';

interface VoterLandingProps {
  onJoinRoom: (roomId: string) => void;
}

export function VoterLanding({ onJoinRoom }: VoterLandingProps) {
  const [inputRoomId, setInputRoomId] = useState('');
  const [rooms, setRooms] = useState<any[]>([]);

  useEffect(() => {
    const loadRooms = async () => {
      const data = await getRooms();
      setRooms(data.filter((r: any) => r.status === 'published'));
    };
    loadRooms();
  }, []);

  return (
    <div className="max-w-md mx-auto space-y-8 py-12">
      <div className="text-center space-y-2">
         <h1 className="text-4xl font-extrabold tracking-tight text-primary">Pemilo</h1>
         <p className="text-muted-foreground">Secure, fast, and simple voting.</p>
      </div>

      <Card className="shadow-lg border-t-4 border-t-primary">
        <CardHeader>
          <CardTitle>Join a Voting Room</CardTitle>
          <CardDescription>Enter the Room ID shared with you.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input 
             placeholder="Room ID / Code" 
             value={inputRoomId}
             onChange={e => setInputRoomId(e.target.value)}
          />
          <Button className="w-full" onClick={() => onJoinRoom(inputRoomId)} disabled={!inputRoomId}>
            Enter Room <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-slate-50 px-2 text-muted-foreground">Or choose an active public room</span>
        </div>
      </div>

      <div className="space-y-4">
        {rooms.map(room => (
          <Card key={room.id} className="cursor-pointer hover:border-primary transition-colors" onClick={() => onJoinRoom(room.id)}>
            <CardHeader className="p-4">
               <CardTitle className="text-lg">{room.name}</CardTitle>
               <CardDescription>{room.description}</CardDescription>
            </CardHeader>
            <CardFooter className="p-4 pt-0 text-xs text-muted-foreground flex justify-between">
               <span>{room.candidates.length} Candidates</span>
               <span className="uppercase">{room.type.replace('_', ' ')}</span>
            </CardFooter>
          </Card>
        ))}
        {rooms.length === 0 && (
          <div className="text-center text-muted-foreground text-sm">No public rooms available right now.</div>
        )}
      </div>
    </div>
  );
}
