import { cn } from "@/lib/cn";
import { InputHTMLAttributes, forwardRef } from "react";

const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "flex h-10 w-full rounded-lg border border-[#2E4CA6] bg-[#121D59] px-3 py-2 text-sm text-[#e8eaf6] placeholder:text-[#5983D9]/50 focus:outline-none focus:ring-2 focus:ring-[#5983D9] focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
