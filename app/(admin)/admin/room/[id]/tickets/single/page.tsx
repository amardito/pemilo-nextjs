'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Copy, Shuffle } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/components/providers/AuthProvider';
import { api } from '@/lib/api-client';

export default function SingleTicketPage() {
  const params = useParams();
  const router = useRouter();
  const { token, loading: authLoading } = useAuth();
  const roomId = (params.id as string)?.trim() || '';

  const [loading, setLoading] = useState(false);
  const [ticketCode, setTicketCode] = useState('');
  const [createdTicket, setCreatedTicket] = useState<any>(null);
  const [ticketCount, setTicketCount] = useState<number>(0);
  const [loadingCount, setLoadingCount] = useState(true);
  const [quota, setQuota] = useState<any>(null);
  const [quotaLoading, setQuotaLoading] = useState(true);

  const isQuotaExceeded = quota && quota.current_voters >= quota.voters_limit;

  useEffect(() => {
    if (authLoading) {
      return; // Wait for auth to load
    }

    if (!roomId) {
      toast.error('Invalid room ID');
      router.back();
      return;
    }

    // Fetch ticket count and quota on mount
    const fetchData = async () => {
      try {
        if (!token) {
          toast.error('Not authenticated');
          setLoadingCount(false);
          setQuotaLoading(false);
          return;
        }

        api.setToken(token);
        const [counts, quotaData] = await Promise.all([
          api.getTicketCounts(roomId),
          api.getQuota(),
        ]);
        setTicketCount(counts.total_count);
        setQuota(quotaData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoadingCount(false);
        setQuotaLoading(false);
      }
    };

    fetchData();
  }, [roomId, router, token, authLoading]);

  const generateRandomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setTicketCode(code);
  };

  const handleCreateTicket = async () => {
    if (!roomId) {
      toast.error('Invalid room ID');
      return;
    }

    // Validate ticket code is provided
    if (!ticketCode.trim()) {
      toast.warning('Please enter a ticket code or click the shuffle icon to generate one');
      return;
    }

    // Validate ticket code format
    if (!/^[A-Z0-9]{3,20}$/i.test(ticketCode.trim())) {
      toast.error('Ticket code must be 3-20 alphanumeric characters');
      return;
    }

    // Check voter quota
    if (isQuotaExceeded) {
      toast.error('❌ You have reached your voter quota limit. Cannot create more tickets.');
      return;
    }

    try {
      setLoading(true);

      if (!token) {
        toast.error('Not authenticated');
        return;
      }

      api.setToken(token);
      const code = ticketCode.trim().toUpperCase();
      const result = await api.createTicket(roomId, code);

      setCreatedTicket(result);
      setTicketCount(prev => prev + 1);
      
      // Update quota
      if (quota) {
        setQuota((prev: any) => ({
          ...prev,
          current_voters: prev.current_voters + 1,
        }));
      }
      
      toast.success('Ticket created successfully!');
      setTicketCode('');
    } catch (error: any) {
      console.error('Error creating ticket:', error);
      const errorMsg = error.message || 'Failed to create ticket';
      if (error.status === 400) {
        if (errorMsg.toLowerCase().includes('already exists')) {
          toast.warning(`⚠️ ${errorMsg}`);
        } else {
          toast.error(`Bad request: ${errorMsg}`);
        }
      } else if (error.status === 401) {
        toast.error('Unauthorized - please login again');
      } else if (error.status === 403) {
        toast.error('❌ Voter quota exceeded. Cannot create more tickets.');
      } else {
        toast.error(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => router.back()}
              className="rounded-lg"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Create Single Ticket</h1>
              <p className="text-slate-600 mt-1">Generate one voting ticket</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-600">Room Tickets</p>
            <Badge variant="secondary" className="text-lg px-3 py-1 mt-1">
              {loadingCount ? '...' : ticketCount}
            </Badge>
          </div>
        </div>

        {/* Create Ticket Card */}
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-blue-50 border-b">
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" />
              New Ticket
            </CardTitle>
            <CardDescription>
              Enter a custom ticket code or generate a random one
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-3">
              <Label htmlFor="code">Ticket Code (Required)</Label>
              <div className="flex gap-2">
                <Input
                  id="code"
                  value={ticketCode}
                  onChange={e => setTicketCode(e.target.value.toUpperCase())}
                  onKeyDown={e => e.key === 'Enter' && handleCreateTicket()}
                  placeholder="Enter code or generate random"
                  className="font-mono text-lg tracking-widest"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={generateRandomCode}
                  title="Generate random code"
                  className="px-4"
                >
                  <Shuffle className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-slate-500">
                3-20 alphanumeric characters. Use the shuffle button to generate a random code.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 pt-4 border-t">
              <Button
                onClick={handleCreateTicket}
                disabled={loading || !quota || isQuotaExceeded}
                className="w-full"
              >
                {loading
                  ? 'Creating...'
                  : isQuotaExceeded
                    ? 'Quota Exceeded'
                    : 'Create Ticket'}
              </Button>
              <Button
                variant="outline"
                onClick={() => router.back()}
                className="w-full"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Created Ticket Info */}
        {createdTicket && (
          <Card className="shadow-lg border-0 border-l-4 border-l-green-500 bg-gradient-to-br from-green-50 to-green-50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-green-900">Ticket Created Successfully</CardTitle>
                <Badge className="bg-green-600">Success</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm text-slate-600">Ticket Code</Label>
                <div className="flex gap-2 items-center">
                  <div className="flex-1 p-4 bg-white rounded-lg border-2 border-green-200 font-mono text-2xl font-bold text-green-900 tracking-widest text-center">
                    {createdTicket.code}
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(createdTicket.code)}
                    className="rounded-lg"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-slate-600">Ticket ID</Label>
                  <p className="text-xs font-mono text-slate-700 break-all mt-1">
                    {createdTicket.id}
                  </p>
                </div>
                <div>
                  <Label className="text-xs text-slate-600">Status</Label>
                  <p className="text-sm font-semibold mt-1">
                    {createdTicket.used ? (
                      <Badge className="bg-red-500">Used</Badge>
                    ) : (
                      <Badge className="bg-green-500">Available</Badge>
                    )}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button
                  onClick={() => {
                    setCreatedTicket(null);
                    setTicketCode('');
                    generateRandomCode();
                  }}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Another Ticket
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
