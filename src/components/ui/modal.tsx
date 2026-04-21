"use client";

import { cn } from "@/lib/cn";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ open, onClose, children, className }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div
        className={cn(
          "relative z-50 w-full max-w-md rounded-2xl bg-[#121D59] border border-[#2E4CA6] p-6 shadow-2xl shadow-black/50",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}
