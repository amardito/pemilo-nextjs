import React, { useState } from 'react';
import { Button } from "./components/ui/button";
import { AdminLayout } from "./components/layout/AdminLayout";
import { VoterLayout } from "./components/layout/VoterLayout";
import { AdminDashboard } from "./components/admin/Dashboard";
import { CreateRoom } from "./components/admin/CreateRoom";
import { RoomDetail } from "./components/admin/RoomDetail";
import { RoomList } from "./components/admin/RoomList";
import { QuotaManagement } from "./components/admin/QuotaManagement";
import { VoterLanding } from "./components/voter/VoterLanding";
import { VotingRoom } from "./components/voter/VotingRoom";
import { Toaster } from "./components/ui/sonner";

// Simple Router Type
export type View = 
  | 'admin-dashboard' 
  | 'admin-create-room' 
  | 'admin-rooms' 
  | 'admin-room-detail' 
  | 'admin-quota'
  | 'voter-landing'
  | 'voter-room';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('admin-dashboard');
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

  // Simple router function
  const renderView = () => {
    switch (currentView) {
      // Admin Views
      case 'admin-dashboard':
        return <AdminLayout currentView={currentView} onNavigate={setCurrentView}><AdminDashboard onNavigate={setCurrentView} /></AdminLayout>;
      case 'admin-create-room':
        return <AdminLayout currentView={currentView} onNavigate={setCurrentView}><CreateRoom onNavigate={setCurrentView} /></AdminLayout>;
      case 'admin-rooms':
        return <AdminLayout currentView={currentView} onNavigate={setCurrentView}><RoomList onNavigate={setCurrentView} onSelectRoom={(id) => { setSelectedRoomId(id); setCurrentView('admin-room-detail'); }} /></AdminLayout>;
      case 'admin-room-detail':
        return <AdminLayout currentView={currentView} onNavigate={setCurrentView}><RoomDetail roomId={selectedRoomId} onNavigate={setCurrentView} /></AdminLayout>;
      case 'admin-quota':
        return <AdminLayout currentView={currentView} onNavigate={setCurrentView}><QuotaManagement /></AdminLayout>;
      
      // Voter Views
      case 'voter-landing':
        return <VoterLayout onNavigate={setCurrentView}><VoterLanding onJoinRoom={(id) => { setSelectedRoomId(id); setCurrentView('voter-room'); }} /></VoterLayout>;
      case 'voter-room':
        return <VoterLayout onNavigate={setCurrentView}><VotingRoom roomId={selectedRoomId} onExit={() => setCurrentView('voter-landing')} /></VoterLayout>;
        
      default:
        return <AdminLayout currentView={currentView} onNavigate={setCurrentView}><AdminDashboard onNavigate={setCurrentView} /></AdminLayout>;
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      {renderView()}
      
      {/* Dev Switcher - Floating bottom right */}
      <div className="fixed bottom-4 right-4 z-50 flex gap-2 p-2 bg-background/80 backdrop-blur border rounded-lg shadow-lg">
        <Button 
          variant={currentView.startsWith('admin') ? "default" : "outline"} 
          size="sm" 
          onClick={() => setCurrentView('admin-dashboard')}
        >
          Admin POV
        </Button>
        <Button 
          variant={currentView.startsWith('voter') ? "default" : "outline"} 
          size="sm" 
          onClick={() => setCurrentView('voter-landing')}
        >
          Voter POV
        </Button>
      </div>
      <Toaster />
    </div>
  );
}
