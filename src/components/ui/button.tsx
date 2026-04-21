import { cn } from "@/lib/cn";
import { ButtonHTMLAttributes, forwardRef } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0E26] disabled:pointer-events-none disabled:opacity-40",
          {
            "bg-[#EAF205] text-[#0A0E26] hover:bg-yellow-300 focus-visible:ring-[#EAF205] shadow-[0_0_16px_rgba(234,242,5,0.25)]":
              variant === "primary",
            "bg-[#121D59] text-[#e8eaf6] border border-[#2E4CA6] hover:bg-[#2E4CA6] focus-visible:ring-[#5983D9]":
              variant === "secondary",
            "bg-red-600/80 text-white hover:bg-red-600 focus-visible:ring-red-500 border border-red-500/40":
              variant === "danger",
            "text-[#5983D9] hover:bg-[#121D59] focus-visible:ring-[#5983D9]":
              variant === "ghost",
          },
          {
            "h-8 px-3 text-sm": size === "sm",
            "h-10 px-4 text-sm": size === "md",
            "h-12 px-6 text-base": size === "lg",
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
