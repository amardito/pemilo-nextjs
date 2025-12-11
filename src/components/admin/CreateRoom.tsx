import React, { useState } from 'react';
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Trash2, Plus, Image as ImageIcon, ArrowLeft, ArrowRight, Save, Check } from 'lucide-react';
import { Room, Candidate, RoomType, SubCandidate } from '../../types';
import { createRoom } from '../data/store';
import { View } from '../../App';
import { toast } from 'sonner';

interface CreateRoomProps {
  onNavigate: (view: View) => void;
}

export function CreateRoom({ onNavigate }: CreateRoomProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<Room>>({
    name: '',
    description: '',
    type: 'wild_limited',
    status: 'draft',
    candidates: [],
    // Defaults for specific types
    totalTickets: 100,
    startDate: '',
    endDate: ''
  });

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const updateField = (field: keyof Room, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCreate = () => {
    // Validation could go here
    const newRoom: Room = {
      ...formData as Room,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      ticketsUsed: 0,
    };
    createRoom(newRoom);
    toast.success("Room created successfully!");
    onNavigate('admin-rooms');
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
            step === 1 ? "Basic Information" : 
            step === 2 ? "Candidates & Subcandidates" : 
            "Room Rules & Settings"
          }</CardTitle>
          <CardDescription>
            {step === 1 && "Define the core details of the voting room."}
            {step === 2 && "Add the people or items to be voted on."}
            {step === 3 && "Configure how the voting logic works based on room type."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 1 && <Step1Basic formData={formData} updateField={updateField} />}
          {step === 2 && <Step2Candidates formData={formData} updateField={updateField} />}
          {step === 3 && <Step3Logic formData={formData} updateField={updateField} />}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleBack} disabled={step === 1}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          
          {step < 3 ? (
            <Button onClick={handleNext}>
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleCreate}>
              Create Room <Save className="ml-2 h-4 w-4" />
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

// --- Step Components ---

function Step1Basic({ formData, updateField }: { formData: Partial<Room>, updateField: Function }) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Room Name</Label>
        <Input 
          id="name" 
          value={formData.name} 
          onChange={e => updateField('name', e.target.value)} 
          placeholder="e.g. Student Council Election" 
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea 
          id="description" 
          value={formData.description} 
          onChange={e => updateField('description', e.target.value)} 
          placeholder="Describe the purpose of this vote..." 
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Room Type</Label>
          <Select value={formData.type} onValueChange={v => updateField('type', v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="custom_tickets">Custom Tickets (Unique Codes)</SelectItem>
              <SelectItem value="wild_limited">Wild Limited (Public, Time-bound)</SelectItem>
              <SelectItem value="wild_unlimited">Wild Unlimited (Public, Open)</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            {formData.type === 'custom_tickets' && "Voters need a unique ticket code to vote. Good for strict elections."}
            {formData.type === 'wild_limited' && "Anyone with the link can vote within the time window."}
            {formData.type === 'wild_unlimited' && "Anyone can vote until you manually close the room."}
          </p>
        </div>

        <div className="space-y-2">
          <Label>Publish State</Label>
          <RadioGroup value={formData.status} onValueChange={v => updateField('status', v)} className="flex gap-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="draft" id="draft" />
              <Label htmlFor="draft">Draft</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="published" id="published" />
              <Label htmlFor="published">Published</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </div>
  );
}

function Step2Candidates({ formData, updateField }: { formData: Partial<Room>, updateField: Function }) {
  const [newCandidateName, setNewCandidateName] = useState('');

  const addCandidate = () => {
    if (!newCandidateName.trim()) return;
    const newCand: Candidate = {
      id: Math.random().toString(36).substr(2, 9),
      name: newCandidateName,
      description: '',
      photoUrl: '',
      voteCount: 0,
      subCandidates: []
    };
    updateField('candidates', [...(formData.candidates || []), newCand]);
    setNewCandidateName('');
  };

  const removeCandidate = (id: string) => {
    updateField('candidates', formData.candidates?.filter(c => c.id !== id));
  };

  const updateCandidate = (id: string, field: keyof Candidate, value: any) => {
    updateField('candidates', formData.candidates?.map(c => 
      c.id === id ? { ...c, [field]: value } : c
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <Input 
          value={newCandidateName} 
          onChange={e => setNewCandidateName(e.target.value)} 
          placeholder="Enter candidate name"
          onKeyDown={e => e.key === 'Enter' && addCandidate()}
        />
        <Button onClick={addCandidate}><Plus className="mr-2 h-4 w-4" /> Add</Button>
      </div>

      <div className="space-y-4">
        {formData.candidates?.map((candidate, index) => (
          <Card key={candidate.id} className="relative">
             <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-muted-foreground hover:text-destructive" onClick={() => removeCandidate(candidate.id)}>
               <Trash2 className="h-4 w-4" />
             </Button>
             <CardHeader className="pb-2">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center overflow-hidden border">
                    {candidate.photoUrl ? (
                      <img src={candidate.photoUrl} alt={candidate.name} className="h-full w-full object-cover" />
                    ) : (
                      <ImageIcon className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <Input 
                      value={candidate.name} 
                      onChange={e => updateCandidate(candidate.id, 'name', e.target.value)}
                      className="font-bold"
                    />
                    <Input 
                      value={candidate.description} 
                      onChange={e => updateCandidate(candidate.id, 'description', e.target.value)}
                      placeholder="Candidate slogan or description"
                      className="text-sm"
                    />
                    <Input 
                      value={candidate.photoUrl} 
                      onChange={e => updateCandidate(candidate.id, 'photoUrl', e.target.value)}
                      placeholder="Photo URL (e.g. https://...)"
                      className="text-xs font-mono"
                    />
                  </div>
                </div>
             </CardHeader>
             {/* Subcandidates could be expanded here */}
          </Card>
        ))}
        {formData.candidates?.length === 0 && (
          <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
            No candidates added yet.
          </div>
        )}
      </div>
    </div>
  );
}

function Step3Logic({ formData, updateField }: { formData: Partial<Room>, updateField: Function }) {
  const type = formData.type;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 p-4 bg-secondary/50 rounded-lg">
        <Badge variant="outline" className="uppercase">{type?.replace('_', ' ')}</Badge>
        <span className="text-sm text-muted-foreground">Configuring specific rules for this room type.</span>
      </div>

      {type === 'custom_tickets' && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Total Tickets (Quota)</Label>
            <Input 
              type="number" 
              value={formData.totalTickets} 
              onChange={e => updateField('totalTickets', parseInt(e.target.value))} 
            />
            <p className="text-sm text-muted-foreground">This consumes from your total voter quota.</p>
          </div>
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium mb-2">Logic Preview</h4>
            <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
              <li>System will generate unique codes.</li>
              <li>Voting closes automatically when all {formData.totalTickets} tickets are used.</li>
              <li>You can also close it manually at any time.</li>
            </ul>
          </div>
        </div>
      )}

      {type === 'wild_limited' && (
        <div className="space-y-4">
           <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
               <Label>Start Date</Label>
               <Input 
                 type="datetime-local" 
                 value={formData.startDate}
                 onChange={e => updateField('startDate', e.target.value)}
               />
             </div>
             <div className="space-y-2">
               <Label>End Date</Label>
               <Input 
                 type="datetime-local" 
                 value={formData.endDate}
                 onChange={e => updateField('endDate', e.target.value)}
               />
             </div>
           </div>
           <div className="p-4 border rounded-lg">
            <h4 className="font-medium mb-2">Logic Preview</h4>
            <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
              <li>Room opens automatically at Start Date.</li>
              <li>Room closes automatically at End Date.</li>
              <li>Anonymous voting allowed (1 vote per browser session/IP limit applied in production).</li>
            </ul>
          </div>
        </div>
      )}

      {type === 'wild_unlimited' && (
        <div className="space-y-4">
           <div className="p-4 border rounded-lg">
            <h4 className="font-medium mb-2">Logic Preview</h4>
            <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
              <li>Room is open as long as Status is "Published".</li>
              <li>Manually close the room to stop voting.</li>
              <li>No end date required.</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
