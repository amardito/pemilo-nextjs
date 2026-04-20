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
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden
      />
      <div
        className={cn(
          "relative z-50 w-full max-w-md rounded-xl bg-white p-6 shadow-xl",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}
