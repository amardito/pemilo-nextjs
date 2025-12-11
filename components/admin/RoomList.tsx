import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";
import { Search, MoreHorizontal, Plus } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { getRooms, deleteRoom } from '@/lib/actions';
import { Room } from '@/types';
import { useRouter } from 'next/navigation';

interface RoomListProps {}

export function RoomList({}: RoomListProps) {
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadRooms = async () => {
      const data = await getRooms();
      setRooms(data);
    };
    loadRooms();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this room?")) {
      await deleteRoom(id);
      const data = await getRooms();
      setRooms(data);
    }
  };

  const filteredRooms = rooms.filter(r => r.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">All Rooms</h2>
          <p className="text-muted-foreground">Manage your voting sessions here.</p>
        </div>
        <Button onClick={() => router.push('/admin/create')}>
          <Plus className="mr-2 h-4 w-4" /> Create Room
        </Button>
      </div>

      <Card>
        <CardHeader>
           <div className="flex items-center gap-2">
             <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search rooms..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>
           </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Room Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Total Votes</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRooms.map((room) => (
                <TableRow key={room.id}>
                  <TableCell className="font-medium cursor-pointer hover:underline" onClick={() => router.push(`/admin/room/${room.id}`)}>
                    {room.name}
                  </TableCell>
                  <TableCell className="capitalize">{room.type.replace('_', ' ')}</TableCell>
                  <TableCell>
                    <Badge variant={room.status === 'published' ? 'default' : (room.status === 'closed' ? 'destructive' : 'secondary')}>
                      {room.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(room.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    {room.candidates.reduce((acc, c) => acc + c.voteCount, 0)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => router.push(`/admin/room/${room.id}`)}>View Details</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => alert("Edit not implemented in demo")}>Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(room.id)}>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filteredRooms.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No rooms found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
