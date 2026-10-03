import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cyan-bright,#38d1ff)] disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
          variant === "default" && "bg-white text-black hover:bg-white/90 shadow",
          variant === "outline" &&
            "border border-[rgba(255,255,255,0.2)] bg-transparent text-white hover:bg-white/10",
          variant === "ghost" && "hover:bg-white/10 text-white",
          size === "default" && "h-10 px-4 py-2 rounded-md",
          size === "sm" && "h-8 px-3 rounded-md text-xs",
          size === "lg" && "h-12 px-8 rounded-md text-base",
          size === "icon" && "h-9 w-9",
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
