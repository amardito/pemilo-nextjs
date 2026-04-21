import { cn } from "@/lib/cn";
import { TextareaHTMLAttributes, forwardRef } from "react";

const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "flex min-h-[80px] w-full rounded-lg border border-[#2E4CA6] bg-[#121D59] px-3 py-2 text-sm text-[#e8eaf6] placeholder:text-[#5983D9]/50 focus:outline-none focus:ring-2 focus:ring-[#5983D9] focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
          className
        )}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
