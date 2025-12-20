"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { LayoutDashboard, PlusCircle, List, PieChart, LogOut, Vote, Menu } from 'lucide-react';
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/providers/AuthProvider";

function LogoutButton() {
  const { logout } = useAuth();
  
  return (
    <Button 
      variant="destructive" 
      className="w-full justify-start gap-3"
      onClick={logout}
    >
      <LogOut className="h-4 w-4" />
      Logout
    </Button>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
    { label: 'Create Room', icon: PlusCircle, href: '/admin/create' },
    { label: 'All Rooms', icon: List, href: '/admin/rooms' },
    { label: 'Quota Management', icon: PieChart, href: '/admin/quota' },
  ];

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    if (href === '/admin/rooms') {
      return pathname === '/admin/rooms' || pathname.startsWith('/admin/room/');
    }
    return pathname === href;
  };

  const NavigationContent = () => (
    <>
      <div className="p-6 border-b flex items-center gap-2">
        <Vote className="h-6 w-6 text-primary" />
        <h1 className="font-bold text-xl tracking-tight">VoteAdmin</h1>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <Link 
            key={item.href} 
            href={item.href}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Button
              variant={isActive(item.href) ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start gap-3",
                isActive(item.href) && "bg-secondary font-medium"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Button>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t space-y-2">
        <LogoutButton />
        <Link href="/voter" onClick={() => setIsMobileMenuOpen(false)}>
          <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive">
            <LogOut className="h-4 w-4" />
            Switch to Voter View
          </Button>
        </Link>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-muted/20">
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-card border-r flex-col hidden md:flex">
        <NavigationContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="h-16 border-b bg-card flex items-center px-4 md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="mr-2">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <div className="flex flex-col h-full">
                <NavigationContent />
              </div>
            </SheetContent>
          </Sheet>
          <div className="flex items-center gap-2">
            <Vote className="h-6 w-6 text-primary" />
            <span className="font-bold">VoteAdmin</span>
          </div>
        </header>
        
        {/* Content Area */}
        <div className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
