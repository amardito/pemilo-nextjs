import { cn } from "@/lib/cn";
import { TextareaHTMLAttributes, forwardRef } from "react";

const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "flex min-h-[80px] w-full rounded-lg border border-[#F26241]/50 bg-[#321F14] px-3 py-2 text-sm text-[#FAF0EB] placeholder:text-[#A69A97]/50 focus:outline-none focus:ring-2 focus:ring-[#F26241] focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
          className
        )}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
