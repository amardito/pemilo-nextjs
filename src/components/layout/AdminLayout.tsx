import React from 'react';
import { View } from '../../App';
import { Button } from "../ui/button";
import { LayoutDashboard, PlusCircle, List, PieChart, LogOut, Vote } from 'lucide-react';
import { cn } from "../../lib/utils";

interface AdminLayoutProps {
  children: React.ReactNode;
  currentView: View;
  onNavigate: (view: View) => void;
}

export function AdminLayout({ children, currentView, onNavigate }: AdminLayoutProps) {
  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, view: 'admin-dashboard' as const },
    { label: 'Create Room', icon: PlusCircle, view: 'admin-create-room' as const },
    { label: 'All Rooms', icon: List, view: 'admin-rooms' as const },
    { label: 'Quota Management', icon: PieChart, view: 'admin-quota' as const },
  ];

  return (
    <div className="flex h-screen bg-muted/20">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r flex flex-col hidden md:flex">
        <div className="p-6 border-b flex items-center gap-2">
          <Vote className="h-6 w-6 text-primary" />
          <h1 className="font-bold text-xl tracking-tight">VoteAdmin</h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Button
              key={item.view}
              variant={currentView === item.view || (item.view === 'admin-rooms' && currentView === 'admin-room-detail') ? "secondary" : "ghost"}
              className={cn("w-full justify-start gap-3", (currentView === item.view || (item.view === 'admin-rooms' && currentView === 'admin-room-detail')) && "bg-secondary font-medium")}
              onClick={() => onNavigate(item.view)}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Button>
          ))}
        </nav>

        <div className="p-4 border-t">
          <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive" onClick={() => onNavigate('voter-landing')}>
            <LogOut className="h-4 w-4" />
            Switch to Voter View
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b bg-card flex items-center px-6 md:hidden">
          <div className="flex items-center gap-2">
             <Vote className="h-6 w-6 text-primary" />
             <span className="font-bold">VoteAdmin</span>
          </div>
          {/* Mobile menu could go here */}
        </header>
        <div className="flex-1 overflow-auto p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
