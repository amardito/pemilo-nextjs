import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Progress } from "../ui/progress";
import { getStats } from '../data/store';
import { Stats } from '../../types';

export function QuotaManagement() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    setStats(getStats());
  }, []);

  if (!stats) return <div>Loading...</div>;

  const roomPercentage = (stats.roomsCreated / stats.totalRoomQuota) * 100;
  const voterPercentage = (stats.votersUsed / stats.totalVoterQuota) * 100;

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
               <div className="text-4xl font-bold">{stats.roomsCreated} <span className="text-muted-foreground text-lg font-normal">/ {stats.totalRoomQuota}</span></div>
               <div className="text-sm font-medium text-muted-foreground">{Math.round(roomPercentage)}% Used</div>
             </div>
             <Progress value={roomPercentage} className="h-4" />
             <div className="text-sm text-muted-foreground pt-2">
               You have {stats.totalRoomQuota - stats.roomsCreated} rooms remaining in your plan.
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
               <div className="text-4xl font-bold">{stats.votersUsed} <span className="text-muted-foreground text-lg font-normal">/ {stats.totalVoterQuota}</span></div>
               <div className="text-sm font-medium text-muted-foreground">{Math.round(voterPercentage)}% Used</div>
             </div>
             <Progress value={voterPercentage} className="h-4" />
             <div className="text-sm text-muted-foreground pt-2">
               You have {stats.totalVoterQuota - stats.votersUsed} votes remaining in your plan.
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
