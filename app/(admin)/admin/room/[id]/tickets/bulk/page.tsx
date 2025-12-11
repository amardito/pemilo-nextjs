'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Trash2, Copy, Download } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/components/providers/AuthProvider';
import { api } from '@/lib/api-client';

export default function BulkTicketsPage() {
  const params = useParams();
  const router = useRouter();
  const { token, loading: authLoading } = useAuth();
  const roomId = (params.id as string)?.trim() || '';

  const [loading, setLoading] = useState(false);
  const [ticketCodes, setTicketCodes] = useState<string[]>([]);
  const [newTicket, setNewTicket] = useState('');
  const [csvText, setCsvText] = useState('');
  const [showCsvInput, setShowCsvInput] = useState(false);
  const [quota, setQuota] = useState<any>(null);
  const [quotaLoading, setQuotaLoading] = useState(true);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!roomId) {
      toast.error('Invalid room ID');
      router.back();
      return;
    }

    // Fetch quota on mount
    const fetchQuota = async () => {
      try {
        if (!token) {
          toast.error('Not authenticated');
          setQuotaLoading(false);
          return;
        }

        api.setToken(token);
        const quotaData = await api.getQuota();
        setQuota(quotaData);
      } catch (error) {
        console.error('Failed to fetch quota:', error);
      } finally {
        setQuotaLoading(false);
      }
    };

    fetchQuota();
  }, [roomId, router, token, authLoading]);

  const addTicket = () => {
    if (!newTicket.trim()) {
      toast.error('Please enter a ticket code');
      return;
    }

    if (ticketCodes.includes(newTicket.trim())) {
      toast.error('This ticket code already exists');
      return;
    }

    setTicketCodes([...ticketCodes, newTicket.trim()]);
    setNewTicket('');
    toast.success('Ticket added');
  };

  const removeTicket = (index: number) => {
    setTicketCodes(ticketCodes.filter((_, i) => i !== index));
  };

  const handleGenerateRandom = (count: number) => {
    const newCodes = Array.from({ length: count }, () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let code = '';
      for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return code;
    }).filter(code => !ticketCodes.includes(code));

    setTicketCodes([...ticketCodes, ...newCodes]);
    toast.success(`Generated ${newCodes.length} random ticket codes`);
  };

  const handlePasteCSV = () => {
    if (!csvText.trim()) {
      toast.error('Please paste CSV content');
      return;
    }

    const codes = csvText
      .split(/[\n,;]/)
      .map(code => code.trim())
      .filter(code => code.length > 0 && !ticketCodes.includes(code));

    if (codes.length === 0) {
      toast.error('No new unique codes found in CSV');
      return;
    }

    setTicketCodes([...ticketCodes, ...codes]);
    setCsvText('');
    setShowCsvInput(false);
    toast.success(`Added ${codes.length} tickets from CSV`);
  };

  const handleCreateBulk = async () => {
    if (ticketCodes.length === 0) {
      toast.error('Please add at least one ticket code');
      return;
    }

    if (!roomId) {
      toast.error('Invalid room ID');
      return;
    }

    // Check voter quota
    if (quota) {
      const remainingVoters = quota.voters_limit - quota.current_voters;
      if (remainingVoters < ticketCodes.length) {
        toast.error(
          `❌ Insufficient voter quota. You have ${remainingVoters} slots remaining but trying to create ${ticketCodes.length} tickets.`
        );
        return;
      }
    }

    try {
      setLoading(true);

      if (!token) {
        toast.error('Not authenticated');
        return;
      }

      api.setToken(token);
      const result = await api.createBulkTickets(roomId, ticketCodes);

      const createdCount = result.tickets?.length || 0;
      toast.success(`Created ${createdCount} tickets successfully!`);
      setTimeout(() => {
        router.push(`/admin/room/${roomId}`);
      }, 1000);
    } catch (error: any) {
      console.error('Error creating tickets:', error);
      const errorMsg = error.message || 'Failed to create tickets';
      if (error.status === 400) {
        toast.error(`Bad request: ${errorMsg}`);
      } else if (error.status === 401) {
        toast.error('Unauthorized - please login again');
      } else {
        toast.error(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    const text = ticketCodes.join('\n');
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const downloadAsCSV = () => {
    const csv = ticketCodes.join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = globalThis.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tickets-${roomId}.csv`;
    a.click();
    globalThis.URL.revokeObjectURL(url);
    toast.success('Downloaded as CSV');
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
              <h1 className="text-3xl font-bold text-slate-900">Bulk Ticket Generation</h1>
              <p className="text-slate-600 mt-1">Create multiple voting tickets at once</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-600">Voter Quota</p>
            {quotaLoading ? (
              <Badge variant="secondary" className="text-lg px-3 py-1 mt-1">
                ...
              </Badge>
            ) : quota ? (
              <Badge variant="secondary" className="text-lg px-3 py-1 mt-1">
                {quota.current_voters}/{quota.voters_limit}
              </Badge>
            ) : (
              <Badge variant="secondary" className="text-lg px-3 py-1 mt-1">
                N/A
              </Badge>
            )}
          </div>
        </div>

        {/* Add Tickets Card */}
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-blue-50 border-b">
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" />
              Add Ticket Codes
            </CardTitle>
            <CardDescription>
              Manually add ticket codes or use CSV import
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            {/* Manual Add */}
            <div className="space-y-3">
              <Label htmlFor="ticket">Ticket Code</Label>
              <div className="flex gap-2">
                <Input
                  id="ticket"
                  value={newTicket}
                  onChange={e => setNewTicket(e.target.value.toUpperCase())}
                  onKeyDown={e => e.key === 'Enter' && addTicket()}
                  placeholder="e.g., TICKET001"
                  className="font-mono"
                />
                <Button onClick={addTicket} className="px-6">
                  Add
                </Button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2 border-t pt-4">
              <Label className="text-sm text-slate-600">Quick Actions</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleGenerateRandom(10)}
                  className="text-xs"
                >
                  Generate 10 Random
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleGenerateRandom(50)}
                  className="text-xs"
                >
                  Generate 50 Random
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCsvInput(!showCsvInput)}
                  className="text-xs col-span-2"
                >
                  {showCsvInput ? 'Hide CSV Import' : 'Import from CSV'}
                </Button>
              </div>
            </div>

            {/* CSV Input */}
            {showCsvInput && (
              <div className="space-y-2 border-t pt-4">
                <Label htmlFor="csv">CSV or Newline Separated Codes</Label>
                <Textarea
                  id="csv"
                  value={csvText}
                  onChange={e => setCsvText(e.target.value)}
                  placeholder="TICKET001, TICKET002, TICKET003&#10;or&#10;TICKET001&#10;TICKET002&#10;TICKET003"
                  rows={5}
                  className="font-mono text-xs"
                />
                <Button onClick={handlePasteCSV} className="w-full" size="sm">
                  Import Codes
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tickets List Card */}
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-blue-50 border-b flex flex-row items-center justify-between">
            <div>
              <CardTitle>Ticket Codes</CardTitle>
              <CardDescription>
                {ticketCodes.length} ticket{ticketCodes.length === 1 ? '' : 's'} ready to create
              </CardDescription>
            </div>
            <Badge variant="secondary" className="text-base px-3 py-1">
              {ticketCodes.length}
            </Badge>
          </CardHeader>
          <CardContent className="pt-6">
            {ticketCodes.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                <p>No ticket codes added yet. Add codes above to get started.</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-96 overflow-y-auto p-2">
                  {ticketCodes.map((code) => (
                    <div
                      key={code}
                      className="relative group bg-slate-50 rounded-lg p-2 border border-slate-200 hover:border-primary/50 transition-colors"
                    >
                      <div className="font-mono text-sm font-semibold text-center text-slate-700 break-all">
                        {code}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity bg-destructive text-white hover:bg-destructive/90"
                        onClick={() => removeTicket(ticketCodes.indexOf(code))}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>

                {/* Export Options */}
                <div className="border-t pt-4 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyToClipboard}
                    className="flex-1"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy All
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={downloadAsCSV}
                    className="flex-1"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download CSV
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateBulk}
            disabled={
              loading ||
              ticketCodes.length === 0 ||
              !quota ||
              quota.current_voters + ticketCodes.length > quota.voters_limit
            }
            className="flex-1"
          >
            {(() => {
              if (loading) return 'Creating...';
              if (quota && quota.current_voters + ticketCodes.length > quota.voters_limit) {
                return `Quota Exceeded (${quota.current_voters + ticketCodes.length}/${quota.voters_limit})`;
              }
              return `Create ${ticketCodes.length} Tickets`;
            })()}
          </Button>
        </div>
      </div>
    </div>
  );
}
