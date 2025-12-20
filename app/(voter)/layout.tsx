"use client";

import React from 'react';
import Link from 'next/link';
import { Vote } from 'lucide-react';

export default function VoterLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto max-w-5xl px-4 h-16 flex items-center justify-between">
          <Link href="/voter" className="flex items-center gap-2 cursor-pointer">
            <div className="bg-primary/10 p-2 rounded-full">
              <Vote className="h-5 w-5 text-primary" />
            </div>
            <span className="font-bold text-lg tracking-tight">Pemilo</span>
          </Link>
          <div className="text-sm text-muted-foreground">
            Online Voting Portal
          </div>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto max-w-5xl p-4 md:py-8">
        {children}
      </main>

      <footer className="bg-white border-t py-6 mt-auto">
        <div className="container mx-auto max-w-5xl px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Pemilo. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
