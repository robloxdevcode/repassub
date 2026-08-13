import Link from "next/link";
import type { ComponentProps } from "react";
import { retroButtonClasses, type RetroButtonSize, type RetroButtonVariant } from "./retro-button-styles";

type RetroLinkProps = Omit<ComponentProps<typeof Link>, "className"> & {
  variant?: RetroButtonVariant;
  size?: RetroButtonSize;
  className?: string;
  prefetch?: boolean;
};

export function RetroLink({
  href,
  variant = "primary",
  size = "md",
  className,
  prefetch = true,
  children,
  ...props
}: RetroLinkProps) {
  return (
    <Link
      href={href}
      prefetch={prefetch}
      className={retroButtonClasses({ variant, size, className })}
      {...props}
    >
      {children}
    </Link>
  );
}
