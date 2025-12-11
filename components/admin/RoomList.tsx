import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Checkbox } from "../ui/checkbox";
import { Badge } from "../ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import { Search, MoreHorizontal, Plus, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import { api } from '@/lib/api-client';

interface RoomData {
  id: string;
  name: string;
  voters_type: string;
  publish_state: string;
  status: string;
  created_at: string;
  session_state: string;
}

interface RoomListProps {}

export function RoomList({}: RoomListProps) {
  const router = useRouter();
  const { token, loading: authLoading } = useAuth();
  const [rooms, setRooms] = useState<RoomData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<string | null>(null);
  const [selectedRoomIds, setSelectedRoomIds] = useState<Set<string>>(new Set());
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    const loadRooms = async () => {
      try {
        if (!token) {
          return;
        }
        api.setToken(token);
        const response = await api.getRooms();
        setRooms(response.rooms || []);
      } catch (error) {
        console.error('Error loading rooms:', error);
      } finally {
        setLoading(false);
      }
    };
    loadRooms();
  }, [token, authLoading]);

  const handleDelete = async (id: string) => {
    setRoomToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!roomToDelete || !token) return;
    try {
      api.setToken(token);
      await api.deleteRoom(roomToDelete);
      const response = await api.getRooms();
      setRooms(response.rooms || []);
      setDeleteDialogOpen(false);
      setRoomToDelete(null);
    } catch (error) {
      console.error('Error deleting room:', error);
    }
  };

  const toggleRoomSelection = (roomId: string) => {
    const newSelection = new Set(selectedRoomIds);
    if (newSelection.has(roomId)) {
      newSelection.delete(roomId);
    } else {
      newSelection.add(roomId);
    }
    setSelectedRoomIds(newSelection);
  };

  const toggleSelectAll = () => {
    if (selectedRoomIds.size === filteredRooms.length) {
      setSelectedRoomIds(new Set());
    } else {
      setSelectedRoomIds(new Set(filteredRooms.map(r => r.id)));
    }
  };

  const confirmBulkDelete = async () => {
    if (selectedRoomIds.size === 0 || !token) return;
    try {
      api.setToken(token);
      await api.deleteBulkRooms(Array.from(selectedRoomIds));
      const response = await api.getRooms();
      setRooms(response.rooms || []);
      setSelectedRoomIds(new Set());
      setBulkDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting rooms:', error);
    }
  };

  const handlePublishStateChange = async (id: string, newState: 'draft' | 'published') => {
    try {
      if (!token) return;
      api.setToken(token);
      await api.updateRoom(id, { publish_state: newState });
      const response = await api.getRooms();
      setRooms(response.rooms || []);
    } catch (error) {
      console.error('Error updating room:', error);
    }
  };

  const filteredRooms = rooms.filter(r => r.name.toLowerCase().includes(searchTerm.toLowerCase()));

  if (loading) {
    return <div className="p-8">Loading rooms...</div>;
  }

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
           <div className="flex items-center justify-between gap-2">
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
             {selectedRoomIds.size > 0 && (
               <Button 
                 variant="destructive" 
                 size="sm"
                 onClick={() => setBulkDeleteDialogOpen(true)}
               >
                 <Trash2 className="mr-2 h-4 w-4" />
                 Delete {selectedRoomIds.size} selected
               </Button>
             )}
           </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]">
                  <Checkbox 
                    checked={selectedRoomIds.size === filteredRooms.length && filteredRooms.length > 0}
                    onCheckedChange={toggleSelectAll}
                  />
                </TableHead>
                <TableHead>Room Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Publish State</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Session</TableHead>
                <TableHead>Quick Actions</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRooms.map((room) => (
                <TableRow key={room.id}>
                  <TableCell>
                    <Checkbox 
                      checked={selectedRoomIds.has(room.id)}
                      onCheckedChange={() => toggleRoomSelection(room.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium cursor-pointer hover:underline" onClick={() => router.push(`/admin/room/${room.id}`)}>
                    {room.name}
                  </TableCell>
                  <TableCell className="capitalize">{room.voters_type.replace('_', ' ')}</TableCell>
                  <TableCell>
                    <Badge variant={room.publish_state === 'published' ? 'default' : 'secondary'}>
                      {room.publish_state}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(room.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant={room.session_state === 'open' ? 'default' : 'destructive'}>
                      {room.session_state}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => router.push(`/admin/room/${room.id}`)}
                        className="text-xs"
                      >
                        View
                      </Button>
                      {room.publish_state !== 'published' && (
                        <Button 
                          size="sm" 
                          onClick={() => handlePublishStateChange(room.id, 'published')}
                          className="text-xs bg-green-600 hover:bg-green-700"
                        >
                          Publish
                        </Button>
                      )}
                      {room.publish_state !== 'draft' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handlePublishStateChange(room.id, 'draft')}
                          className="text-xs border-amber-600 text-amber-600 hover:bg-amber-50"
                        >
                          Draft
                        </Button>
                      )}
                    </div>
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
                        <DropdownMenuLabel>More Options</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => router.push(`/admin/room/${room.id}/edit`)}>Edit</DropdownMenuItem>
                        <DropdownMenuLabel className="text-xs text-muted-foreground mt-2">Danger Zone</DropdownMenuLabel>
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(room.id)}>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filteredRooms.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    No rooms found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Room</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this room? This action cannot be undone. All votes and candidates in this room will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-end gap-3">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={bulkDeleteDialogOpen} onOpenChange={setBulkDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {selectedRoomIds.size} Rooms</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedRoomIds.size} selected room(s)? This action cannot be undone. All votes and candidates in these rooms will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-end gap-3">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmBulkDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete All
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
