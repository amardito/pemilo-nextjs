'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import { api } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Save, Plus, Users } from 'lucide-react';
import { toast } from 'sonner';

interface Room {
  id: string;
  name: string;
  voters_type: string;
  publish_state: 'draft' | 'published';
  created_at: string;
  voters_limit?: number;
  session_start_time?: string;
  session_end_time?: string;
}

export default function EditRoomPage() {
  const params = useParams();
  const router = useRouter();
  const { token, authLoading } = useAuth();
  const roomId = params.id as string;

  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<Room>>({});

  useEffect(() => {
    const loadRoom = async () => {
      if (!roomId || !token || authLoading) return;
      try {
        setLoading(true);
        api.setToken(token);
        const response = await api.getRoom(roomId);
        setRoom(response);
        setFormData(response);
      } catch (error) {
        console.error('Failed to load room:', error);
        toast.error('Failed to load room');
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      loadRoom();
    }
  }, [roomId, token, authLoading]);

  const handleChange = (field: keyof Room, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!room || !token) return;
    try {
      setSaving(true);
      api.setToken(token);
      await api.updateRoom(room.id, {
        name: formData.name,
        voters_limit: formData.voters_limit,
        session_start_time: formData.session_start_time,
        session_end_time: formData.session_end_time,
      });
      toast.success('Room updated successfully');
      router.back();
    } catch (error) {
      console.error('Failed to save room:', error);
      toast.error('Failed to save room');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6">Loading room...</div>;
  if (!room) return <div className="p-6">Room not found</div>;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Edit Room</h1>
          <p className="text-muted-foreground">{room.id}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 max-w-2xl">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Update room details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Room Name</Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Enter room name"
              />
            </div>

            <div className="space-y-2">
              <Label>Type</Label>
              <div className="flex items-center">
                <Badge variant="secondary">{room.voters_type.replace(/_/g, ' ')}</Badge>
                <span className="text-sm text-muted-foreground ml-2">(cannot be changed)</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <div className="flex items-center">
                <Badge variant={room.publish_state === 'published' ? 'default' : 'secondary'}>
                  {room.publish_state}
                </Badge>
                <span className="text-sm text-muted-foreground ml-2">(use quick actions to change)</span>
              </div>
            </div>

            {room.voters_type === 'custom_tickets' && (
              <div className="space-y-2">
                <Label htmlFor="voters_limit">Voter Limit</Label>
                <Input
                  id="voters_limit"
                  type="number"
                  value={formData.voters_limit || ''}
                  onChange={(e) => handleChange('voters_limit', parseInt(e.target.value) || undefined)}
                  placeholder="Max number of voters"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Timing (for wild_limited) */}
        {room.voters_type === 'wild_limited' && (
          <Card>
            <CardHeader>
              <CardTitle>Session Timing</CardTitle>
              <CardDescription>Set voting session time window</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="session_start">Session Start</Label>
                <Input
                  id="session_start"
                  type="datetime-local"
                  value={formData.session_start_time?.slice(0, 16) || ''}
                  onChange={(e) => handleChange('session_start_time', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="session_end">Session End</Label>
                <Input
                  id="session_end"
                  type="datetime-local"
                  value={formData.session_end_time?.slice(0, 16) || ''}
                  onChange={(e) => handleChange('session_end_time', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {room.voters_type === 'custom_tickets' && (
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Ticket Management
              </CardTitle>
              <CardDescription>
                Manage voting tickets for this room
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Generate and manage voting tickets for voters. You can create tickets individually or in bulk.
              </p>
              <div className="flex gap-3">
                <Button variant="outline" className="text-xs">
                  <Plus className="mr-2 h-4 w-4" />
                  Generate Single Ticket
                </Button>
                <Button variant="outline" className="text-xs">
                  <Plus className="mr-2 h-4 w-4" />
                  Generate Tickets in Bulk
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Button onClick={handleSave} disabled={saving} className="bg-green-600 hover:bg-green-700">
            <Save className="mr-2 h-4 w-4" /> Save Changes
          </Button>
          <Button variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
