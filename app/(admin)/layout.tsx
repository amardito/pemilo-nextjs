"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
            <Link key={item.href} href={item.href}>
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
          <Link href="/voter">
            <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive">
              <LogOut className="h-4 w-4" />
              Switch to Voter View
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b bg-card flex items-center justify-between px-4 md:hidden">
          <div className="flex items-center gap-2">
             <Vote className="h-6 w-6 text-primary" />
             <span className="font-bold">VoteAdmin</span>
          </div>
          
          {/* Mobile Navigation Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Vote className="h-6 w-6 text-primary" />
                  VoteAdmin
                </SheetTitle>
              </SheetHeader>
              
              <nav className="flex flex-col gap-2 mt-6">
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)}>
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

              <div className="absolute bottom-4 left-4 right-4 space-y-2">
                <LogoutButton />
                <Link href="/voter" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground">
                    <LogOut className="h-4 w-4" />
                    Switch to Voter View
                  </Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </header>
        <div className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
