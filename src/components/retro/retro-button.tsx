"use client";

import { forwardRef, ButtonHTMLAttributes } from "react";
import { retroButtonClasses, type RetroButtonSize, type RetroButtonVariant } from "./retro-button-styles";
import { RetroSpinner } from "./retro-loading";

interface RetroButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: RetroButtonVariant;
  size?: RetroButtonSize;
  loading?: boolean;
}

export const RetroButton = forwardRef<HTMLButtonElement, RetroButtonProps>(
  ({ className, variant = "primary", size = "md", loading, children, disabled, onClick, type = "button", ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        className={retroButtonClasses({ variant, size, className, loading })}
        onClick={(event) => {
          if (disabled || loading) return;
          onClick?.(event);
        }}
        {...props}
      >
        {loading ? <RetroSpinner size="sm" /> : null}
        {children}
      </button>
    );
  }
);

RetroButton.displayName = "RetroButton";
