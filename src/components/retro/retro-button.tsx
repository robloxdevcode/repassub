"use client";

import { forwardRef, ButtonHTMLAttributes, Fragment } from "react";
import { retroButtonClasses, type RetroButtonSize, type RetroButtonVariant } from "./retro-button-styles";
import { RetroSpinner } from "./retro-loading";

interface RetroButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: RetroButtonVariant;
  size?: RetroButtonSize;
  loading?: boolean;
}

export const RetroButton = forwardRef<HTMLButtonElement, RetroButtonProps>(
  ({ className, variant = "primary", size = "md", loading, children, disabled, onClick, ...props }, ref) => {
    return (
      <button
        ref={ref}
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
        {loading ? null : <Fragment>{children}</Fragment>}
      </button>
    );
  }
);

RetroButton.displayName = "RetroButton";
