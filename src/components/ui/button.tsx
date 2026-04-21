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
          "inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#261C16] disabled:pointer-events-none disabled:opacity-40",
          {
            "bg-[#F26241] text-[#FAF0EB] hover:bg-[#F29580] focus-visible:ring-[#F26241] shadow-[0_0_16px_rgba(242,98,65,0.25)]":
              variant === "primary",
            "bg-[#321F14] text-[#FAF0EB] border border-[#F26241]/60 hover:bg-[#F26241]/20 focus-visible:ring-[#F26241]":
              variant === "secondary",
            "bg-red-600/80 text-white hover:bg-red-600 focus-visible:ring-red-500 border border-red-500/40":
              variant === "danger",
            "text-[#A69A97] hover:bg-[#321F14] focus-visible:ring-[#F26241]":
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
