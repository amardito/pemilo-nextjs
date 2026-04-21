import { cn } from "@/lib/cn";
import { InputHTMLAttributes, forwardRef } from "react";

const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "flex h-10 w-full rounded-lg border border-[#F26241]/50 bg-[#321F14] px-3 py-2 text-sm text-[#FAF0EB] placeholder:text-[#A69A97]/50 focus:outline-none focus:ring-2 focus:ring-[#F26241] focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
