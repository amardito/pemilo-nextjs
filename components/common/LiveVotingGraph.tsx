import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Activity } from 'lucide-react';
import { Candidate } from '../../types';

interface LiveVotingGraphProps {
  candidates: Candidate[];
  title?: string;
  height?: number;
}

export function LiveVotingGraph({ candidates, title = "Live Voting Results", height = 300 }: LiveVotingGraphProps) {
  // Simulate live updates for visual effect
  const [data, setData] = useState(candidates);
  
  // Colors for bars
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  useEffect(() => {
    setData(candidates);
  }, [candidates]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">
          {title}
        </CardTitle>
        <Badge variant="outline" className="flex items-center gap-1 text-green-600 border-green-200 bg-green-50 animate-pulse">
          <Activity className="h-3 w-3" />
          Live
        </Badge>
      </CardHeader>
      <CardContent>
        <div style={{ width: '100%', height: height }}>
          <ResponsiveContainer>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{fontSize: 12}} tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} tick={{fontSize: 12}} />
              <Tooltip 
                cursor={{fill: 'transparent'}}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="voteCount" radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
