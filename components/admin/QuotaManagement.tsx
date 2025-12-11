import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Progress } from "../ui/progress";
import { useAuth } from '@/components/providers/AuthProvider';
import { api } from '@/lib/api-client';

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

export function QuotaManagement() {
  const { token, loading: authLoading } = useAuth();
  const [quota, setQuota] = useState<QuotaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    const loadQuota = async () => {
      try {
        if (!token) {
          throw new Error('Not authenticated');
        }
        
        api.setToken(token);
        const data = await api.getQuota();
        setQuota(data);
      } catch (err) {
        console.error('Error loading quota:', err);
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };
    loadQuota();
  }, [token, authLoading]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;
  if (!quota) return <div>Failed to load quota</div>;

  const roomPercentage = (quota.current_rooms / quota.room_limit) * 100;
  const voterPercentage = (quota.current_voters / quota.voters_limit) * 100;

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Quota Management</h2>
        <p className="text-muted-foreground">Monitor your resource consumption.</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Room Quota</CardTitle>
            <CardDescription>Number of voting rooms you can create.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="flex justify-between items-end">
               <div className="text-4xl font-bold">{quota.current_rooms} <span className="text-muted-foreground text-lg font-normal">/ {quota.room_limit}</span></div>
               <div className="text-sm font-medium text-muted-foreground">{Math.round(roomPercentage)}% Used</div>
             </div>
             <Progress value={roomPercentage} className="h-4" />
             <div className="text-sm text-muted-foreground pt-2">
               You have {quota.room_limit - quota.current_rooms} rooms remaining in your plan.
             </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Voter Quota</CardTitle>
            <CardDescription>Total number of votes allowed across all rooms.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="flex justify-between items-end">
               <div className="text-4xl font-bold">{quota.current_voters} <span className="text-muted-foreground text-lg font-normal">/ {quota.voters_limit}</span></div>
               <div className="text-sm font-medium text-muted-foreground">{Math.round(voterPercentage)}% Used</div>
             </div>
             <Progress value={voterPercentage} className="h-4" />
             <div className="text-sm text-muted-foreground pt-2">
               You have {quota.voters_limit - quota.current_voters} votes remaining in your plan.
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
