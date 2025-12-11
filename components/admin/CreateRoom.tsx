import React, { useState, useMemo } from 'react';
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import { Badge } from "../ui/badge";
import { Trash2, Plus, Image as ImageIcon, ArrowLeft, ArrowRight, Save, Check, Users } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import { api } from '@/lib/api-client';

interface CreateRoomProps {}

interface CandidateFormData {
  name: string;
  photo_url: string;
  description: string;
  sub_candidates: SubCandidateFormData[];
}

interface SubCandidateFormData {
  name: string;
  photo_url: string;
  description: string;
}

interface RoomFormData {
  name: string;
  voters_type: 'custom_tickets' | 'wild_limited' | 'wild_unlimited';
  status: string;
  publish_state: 'draft' | 'published';
  voters_limit?: number;
  session_start_time?: string;
  session_end_time?: string;
}

const ROOM_NAME_PLACEHOLDERS = [
  'Presidential Election 2024',
  'Student Council Voting',
  'Board Member Selection',
  'Community Council Election',
  'Class President Campaign',
  'Team Lead Nomination',
  'Committee Member Vote',
  'Leadership Election 2024',
  'Department Head Selection',
  'Organization Officer Vote',
  'Public Opinion Poll',
  'Fair Vote Assessment',
  'Popular Choice Contest',
  'Democratic Decision Making',
  'Ballot Initiative Vote',
  'Community Preference Poll',
  'Merit-Based Selection Vote',
  'Representative Election',
  'Stakeholder Input Survey',
  'Open Forum Election',
  'Annual General Meeting Vote',
  'Citizen Referendum',
  'Campus Wide Election',
  'Organization Census Poll'
];

function getRandomPlaceholder(): string {
  return ROOM_NAME_PLACEHOLDERS[Math.floor(Math.random() * ROOM_NAME_PLACEHOLDERS.length)];
}

export function CreateRoom({}: CreateRoomProps) {
  const router = useRouter();
  const { token } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [createdRoomId, setCreatedRoomId] = useState<string | null>(null);
  const [showTicketDialog, setShowTicketDialog] = useState(false);
  
  // Generate random placeholder on component mount
  const randomPlaceholder = useMemo(() => getRandomPlaceholder(), []);
  
  const [roomData, setRoomData] = useState<RoomFormData>({
    name: '',
    voters_type: 'custom_tickets',
    status: 'enabled',
    publish_state: 'draft'
  });

  const [candidates, setCandidates] = useState<CandidateFormData[]>([]);
  const [newCandidate, setNewCandidate] = useState<CandidateFormData>({
    name: '',
    photo_url: '',
    description: '',
    sub_candidates: []
  });

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const addCandidate = () => {
    if (!newCandidate.name.trim()) {
      toast.error('Please enter candidate name');
      return;
    }
    setCandidates([...candidates, { ...newCandidate }]);
    setNewCandidate({
      name: '',
      photo_url: '',
      description: '',
      sub_candidates: []
    });
  };

  const removeCandidate = (index: number) => {
    setCandidates(candidates.filter((_, i) => i !== index));
  };

  const updateCandidate = (index: number, field: keyof CandidateFormData, value: any) => {
    setCandidates(candidates.map((c, i) => 
      i === index ? { ...c, [field]: value } : c
    ));
  };

  const addSubCandidate = (candidateIndex: number) => {
    setCandidates(candidates.map((c, i) => 
      i === candidateIndex 
        ? { ...c, sub_candidates: [...c.sub_candidates, { name: '', photo_url: '', description: '' }] }
        : c
    ));
  };

  const removeSubCandidate = (candidateIndex: number, subIndex: number) => {
    setCandidates(candidates.map((c, i) => 
      i === candidateIndex 
        ? { ...c, sub_candidates: c.sub_candidates.filter((_, j) => j !== subIndex) }
        : c
    ));
  };

  const updateSubCandidate = (candidateIndex: number, subIndex: number, field: keyof SubCandidateFormData, value: any) => {
    setCandidates(candidates.map((c, i) => 
      i === candidateIndex 
        ? {
            ...c,
            sub_candidates: c.sub_candidates.map((sub, j) => 
              j === subIndex ? { ...sub, [field]: value } : sub
            )
          }
        : c
    ));
  };

  const handleCreate = async () => {
    try {
      if (!token) {
        toast.error('Not authenticated');
        return;
      }

      setLoading(true);

      // Step 1: Create the room
      api.setToken(token);
      const roomPayload = {
        name: roomData.name,
        voters_type: roomData.voters_type,
        status: roomData.status,
        publish_state: roomData.publish_state,
        ...(roomData.voters_type === 'wild_limited' && { voters_limit: roomData.voters_limit }),
        ...(roomData.voters_type === 'wild_unlimited' && {
          session_start_time: roomData.session_start_time,
          session_end_time: roomData.session_end_time,
        })
      };

      const room = await api.createRoom(roomPayload);
      toast.success('Room created successfully!');
      setCreatedRoomId(room.id);

      // Step 2: Create candidates
      if (candidates.length > 0) {
        for (const candidate of candidates) {
          await api.createCandidate({
            room_id: room.id,
            name: candidate.name,
            photo_url: candidate.photo_url,
            description: candidate.description,
            sub_candidates: candidate.sub_candidates
          });
        }
        toast.success(`${candidates.length} candidate(s) created!`);
      }

      // Show ticket dialog for custom_tickets rooms
      if (roomData.voters_type === 'custom_tickets') {
        setShowTicketDialog(true);
      } else {
        router.push(`/admin/room/${room.id}`);
      }
    } catch (error) {
      console.error('Error creating room:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create room');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Create New Room</h2>
          <p className="text-muted-foreground">Follow the steps to set up a new voting session.</p>
        </div>
        <div className="flex items-center gap-2">
          {[1, 2, 3].map(i => (
            <div key={i} className={`h-2 w-8 rounded-full ${step >= i ? 'bg-primary' : 'bg-muted'}`} />
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Step {step}: {
            step === 1 ? "Room Configuration" : 
            step === 2 ? "Add Candidates & Running Mates" : 
            "Review & Create"
          }</CardTitle>
          <CardDescription>
            {step === 1 && "Configure the voting room type and basic settings."}
            {step === 2 && "Add candidates with optional running mates (sub-candidates)."}
            {step === 3 && "Review your configuration before creating."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 1 && <Step1RoomConfig roomData={roomData} setRoomData={setRoomData} randomPlaceholder={randomPlaceholder} />}
          {step === 2 && (
            <Step2Candidates 
              candidates={candidates}
              newCandidate={newCandidate}
              setNewCandidate={setNewCandidate}
              addCandidate={addCandidate}
              removeCandidate={removeCandidate}
              updateCandidate={updateCandidate}
              addSubCandidate={addSubCandidate}
              removeSubCandidate={removeSubCandidate}
              updateSubCandidate={updateSubCandidate}
            />
          )}
          {step === 3 && <Step3Review roomData={roomData} candidates={candidates} />}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleBack} disabled={step === 1}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          
          {step < 3 ? (
            <Button onClick={handleNext} disabled={step === 1 && !roomData.name}>
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleCreate} disabled={loading || !roomData.name}>
              {loading ? 'Creating...' : 'Create Room'} <Save className="ml-2 h-4 w-4" />
            </Button>
          )}
        </CardFooter>
      </Card>

      {/* Ticket Generation Dialog for custom_tickets rooms */}
      <Dialog open={showTicketDialog} onOpenChange={(open) => {
        if (!open && createdRoomId) {
          router.push(`/admin/room/${createdRoomId}`);
        }
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Room Created Successfully!
            </DialogTitle>
            <DialogDescription>
              Your room is ready. Would you like to generate voting tickets now?
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Voting tickets are required for voters to participate. You can generate them now or do it later from the room's edit page.
            </p>
            <div className="space-y-2">
              <Button 
                onClick={() => {
                  setShowTicketDialog(false);
                  router.push(`/admin/room/${createdRoomId}/tickets/single`);
                }}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                Generate Single Ticket
              </Button>
              <Button 
                onClick={() => {
                  setShowTicketDialog(false);
                  router.push(`/admin/room/${createdRoomId}/tickets/bulk`);
                }}
                variant="outline"
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" />
                Generate Tickets in Bulk
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline"
              onClick={() => {
                setShowTicketDialog(false);
                router.push(`/admin/room/${createdRoomId}`);
              }}
            >
              Do It Later
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Step1RoomConfig({ roomData, setRoomData, randomPlaceholder }: { roomData: RoomFormData, setRoomData: Function, randomPlaceholder: string }) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Room Name *</Label>
        <Input 
          id="name" 
          value={roomData.name} 
          onChange={e => setRoomData({ ...roomData, name: e.target.value })} 
          placeholder={randomPlaceholder}
        />
      </div>

      <div className="space-y-3">
        <Label>Room Type *</Label>
        <Select value={roomData.voters_type} onValueChange={v => setRoomData({ ...roomData, voters_type: v })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="custom_tickets">Custom Tickets</SelectItem>
            <SelectItem value="wild_limited">Wild Limited (Time-bound)</SelectItem>
            <SelectItem value="wild_unlimited">Wild Unlimited (Open)</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          {roomData.voters_type === 'custom_tickets' && "Voters need unique ticket codes. Best for controlled elections."}
          {roomData.voters_type === 'wild_limited' && "Anyone can vote within a specific time window."}
          {roomData.voters_type === 'wild_unlimited' && "Anyone can vote until you manually close the room."}
        </p>
      </div>

      {roomData.voters_type === 'wild_limited' && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="voters_limit">Voter Limit</Label>
            <Input 
              id="voters_limit"
              type="number" 
              value={roomData.voters_limit || ''} 
              onChange={e => setRoomData({ ...roomData, voters_limit: parseInt(e.target.value) || undefined })} 
              placeholder="e.g. 500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="start_time">Start Time</Label>
            <Input 
              id="start_time"
              type="datetime-local" 
              value={roomData.session_start_time || ''} 
              onChange={e => setRoomData({ ...roomData, session_start_time: e.target.value })} 
            />
          </div>
        </div>
      )}

      {roomData.voters_type === 'wild_unlimited' && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="start_time">Start Time</Label>
            <Input 
              id="start_time"
              type="datetime-local" 
              value={roomData.session_start_time || ''} 
              onChange={e => setRoomData({ ...roomData, session_start_time: e.target.value })} 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="end_time">End Time (Optional)</Label>
            <Input 
              id="end_time"
              type="datetime-local" 
              value={roomData.session_end_time || ''} 
              onChange={e => setRoomData({ ...roomData, session_end_time: e.target.value })} 
            />
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label>Initial State</Label>
        <RadioGroup value={roomData.publish_state} onValueChange={v => setRoomData({ ...roomData, publish_state: v })} className="flex gap-6">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="draft" id="draft" />
            <Label htmlFor="draft" className="cursor-pointer">Draft (Not visible to voters)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="published" id="published" />
            <Label htmlFor="published" className="cursor-pointer">Published (Visible to voters)</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}

function Step2Candidates({
  candidates,
  newCandidate,
  setNewCandidate,
  addCandidate,
  removeCandidate,
  updateCandidate,
  addSubCandidate,
  removeSubCandidate,
  updateSubCandidate
}: any) {
  return (
    <div className="space-y-6">
      <Card className="bg-secondary/30">
        <CardHeader>
          <CardTitle className="text-lg">Add New Candidate</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="new_name">Candidate Name *</Label>
              <Input 
                id="new_name"
                value={newCandidate.name} 
                onChange={e => setNewCandidate({ ...newCandidate, name: e.target.value })} 
                placeholder="e.g. John Doe"
                onKeyDown={e => e.key === 'Enter' && addCandidate()}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new_photo">Photo URL</Label>
              <Input 
                id="new_photo"
                value={newCandidate.photo_url} 
                onChange={e => setNewCandidate({ ...newCandidate, photo_url: e.target.value })} 
                placeholder="https://example.com/photo.jpg"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="new_desc">Description / Platform</Label>
            <Textarea 
              id="new_desc"
              value={newCandidate.description} 
              onChange={e => setNewCandidate({ ...newCandidate, description: e.target.value })} 
              placeholder="Brief description or campaign platform"
              rows={2}
            />
          </div>
          <Button onClick={addCandidate} className="w-full">
            <Plus className="mr-2 h-4 w-4" /> Add Candidate
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="font-semibold">Candidates List ({candidates.length})</h3>
        {candidates.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
            No candidates added yet. Add at least one to continue.
          </div>
        ) : (
          <div className="space-y-4">
            {candidates.map((candidate, index) => (
              <Card key={index} className="relative shadow-md hover:shadow-lg transition-shadow border-l-4 border-l-primary">
                {/* Candidate Number Badge */}
                <div className="absolute -top-3 -left-3 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shadow-md z-10">
                  {index + 1}
                </div>

                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute top-2 right-2 text-muted-foreground hover:text-destructive" 
                  onClick={() => removeCandidate(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                
                <CardHeader className="pb-3 bg-gradient-to-r from-primary/5 to-transparent">
                  <div className="flex gap-4 mt-2">
                    <div className="h-16 w-16 bg-muted rounded-lg flex items-center justify-center overflow-hidden border-2 border-primary/20 flex-shrink-0 shadow-sm">
                      {candidate.photo_url ? (
                        <img src={candidate.photo_url} alt={candidate.name} className="h-full w-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                      ) : (
                        <ImageIcon className="h-6 w-6 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      <Input 
                        value={candidate.name} 
                        onChange={e => updateCandidate(index, 'name', e.target.value)}
                        className="font-bold text-base bg-white"
                        placeholder="Candidate name"
                      />
                      <Textarea 
                        value={candidate.description} 
                        onChange={e => updateCandidate(index, 'description', e.target.value)}
                        placeholder="Description or platform"
                        rows={2}
                        className="text-sm bg-white"
                      />
                      <Input 
                        value={candidate.photo_url} 
                        onChange={e => updateCandidate(index, 'photo_url', e.target.value)}
                        placeholder="Photo URL"
                        className="text-xs bg-white"
                      />
                    </div>
                  </div>
                </CardHeader>

                {/* Sub-candidates Section */}
                <CardContent className="space-y-3 border-t pt-4">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2 text-base font-semibold">
                      <Users className="h-4 w-4 text-primary" />
                      Running Mates / Sub-candidates ({candidate.sub_candidates.length})
                    </Label>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => addSubCandidate(index)}
                      className="hover:bg-primary hover:text-primary-foreground"
                    >
                      <Plus className="h-3 w-3 mr-1" /> Add
                    </Button>
                  </div>

                  {candidate.sub_candidates.length === 0 ? (
                    <div className="text-xs text-muted-foreground italic p-2 bg-muted/30 rounded border border-dashed">
                      No running mates. Click "Add" to add sub-candidates.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {candidate.sub_candidates.map((sub, subIndex) => (
                        <div key={subIndex} className="border rounded-lg p-3 relative bg-gradient-to-br from-muted/30 to-muted/50 shadow-sm hover:shadow-md transition-shadow">
                          {/* Sub-candidate Number Badge */}
                          <div className="absolute -top-2 -left-2 h-6 w-6 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-semibold text-xs shadow-sm z-10 border border-primary/20">
                            {String.fromCharCode(65 + subIndex)}
                          </div>

                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="absolute top-2 right-2 h-6 w-6 text-muted-foreground hover:text-destructive" 
                            onClick={() => removeSubCandidate(index, subIndex)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>

                          <div className="flex gap-3 mt-1">
                            <div className="h-14 w-14 bg-muted rounded flex items-center justify-center overflow-hidden border border-secondary/30 flex-shrink-0 shadow-sm">
                              {sub.photo_url ? (
                                <img src={sub.photo_url} alt={sub.name} className="h-full w-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                              ) : (
                                <ImageIcon className="h-5 w-5 text-muted-foreground" />
                              )}
                            </div>
                            <div className="flex-1 space-y-2 pr-6">
                              <Input 
                                value={sub.name} 
                                onChange={e => updateSubCandidate(index, subIndex, 'name', e.target.value)}
                                placeholder="Sub-candidate name"
                                className="text-sm font-medium bg-white"
                              />
                              <Textarea 
                                value={sub.description} 
                                onChange={e => updateSubCandidate(index, subIndex, 'description', e.target.value)}
                                placeholder="Description or role"
                                rows={1}
                                className="text-xs bg-white"
                              />
                              <Input 
                                value={sub.photo_url} 
                                onChange={e => updateSubCandidate(index, subIndex, 'photo_url', e.target.value)}
                                placeholder="Photo URL"
                                className="text-xs bg-white"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Step3Review({ roomData, candidates }: any) {
  return (
    <div className="space-y-6">
      <Card className="bg-secondary/50">
        <CardHeader>
          <CardTitle className="text-lg">Room Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-semibold">{roomData.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Type</p>
              <p className="font-semibold capitalize">{roomData.voters_type.replace('_', ' ')}</p>
            </div>
            {roomData.voters_limit && (
              <div>
                <p className="text-sm text-muted-foreground">Voter Limit</p>
                <p className="font-semibold">{roomData.voters_limit}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground">Initial State</p>
              <Badge variant={roomData.publish_state === 'published' ? 'default' : 'secondary'}>
                {roomData.publish_state}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Candidates Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {candidates.map((candidate, index) => (
            <div key={index} className="p-3 border rounded-lg">
              <div className="flex items-start gap-3">
                <div className="h-12 w-12 bg-muted rounded flex items-center justify-center overflow-hidden">
                  {candidate.photo_url ? (
                    <img src={candidate.photo_url} alt={candidate.name} className="h-full w-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                  ) : (
                    <ImageIcon className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{candidate.name}</p>
                  {candidate.description && <p className="text-sm text-muted-foreground">{candidate.description}</p>}
                  {candidate.sub_candidates.length > 0 && (
                    <div className="mt-2 ml-2 space-y-1">
                      <p className="text-xs font-medium text-muted-foreground">Running Mates:</p>
                      {candidate.sub_candidates.map((sub, subIndex) => (
                        <p key={subIndex} className="text-xs text-muted-foreground">• {sub.name}</p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {roomData.voters_type === 'custom_tickets' && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Ticket Generation
            </CardTitle>
            <CardDescription>
              After creating the room, you can generate voting tickets for voters. Choose to generate tickets in bulk or individually.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Tickets are unique codes that voters will use to access and participate in this voting session. Generate them in bulk for efficiency or create individual tickets as needed.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" disabled className="text-xs">
                <Plus className="mr-2 h-4 w-4" />
                Generate Single Ticket
              </Button>
              <Button variant="outline" disabled className="text-xs">
                <Plus className="mr-2 h-4 w-4" />
                Generate Tickets in Bulk
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              💡 These buttons will be available after room creation
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
