"use client";

import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface RetroInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const RetroInput = forwardRef<HTMLInputElement, RetroInputProps>(
  ({ className, label, error, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";

    return (
      <div className="flex flex-col gap-1.5">
        {label && <label className="text-sm font-medium text-retro-text-dim">{label}</label>}
        <div className="relative">
          <input
            ref={ref}
            type={isPassword && showPassword ? "text" : type}
            className={cn(
              "w-full bg-retro-surface-2 border border-retro-border rounded-xl px-4 py-3",
              "text-sm text-retro-text placeholder:text-retro-text-muted",
              "focus:outline-none focus:border-retro-accent/50 focus:ring-1 focus:ring-retro-accent/30",
              "transition-all",
              isPassword && "pr-10",
              error && "border-retro-error",
              className
            )}
            {...props}
          />
          {isPassword && (
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-retro-text-dim hover:text-retro-text">
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          )}
        </div>
        {error && <p className="text-xs text-retro-error">{error}</p>}
      </div>
    );
  }
);
RetroInput.displayName = "RetroInput";

interface RetroTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const RetroTextarea = forwardRef<HTMLTextAreaElement, RetroTextareaProps>(
  ({ className, label, error, ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-retro-text-dim">{label}</label>}
      <textarea
        ref={ref}
        className={cn(
          "w-full bg-retro-surface-2 border border-retro-border rounded-xl px-4 py-3",
          "text-sm text-retro-text placeholder:text-retro-text-muted resize-none",
          "focus:outline-none focus:border-retro-accent/50 focus:ring-1 focus:ring-retro-accent/30",
          error && "border-retro-error",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-retro-error">{error}</p>}
    </div>
  )
);
RetroTextarea.displayName = "RetroTextarea";
