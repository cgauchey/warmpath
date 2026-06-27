import { cn } from "@/lib/utils";
import { filledStyles, outlinedStyles, type BrandColor } from "./pill-button";
import type { ReactNode } from "react";

export function Pill({
  color = "orange",
  variant = "filled",
  size = "sm",
  className,
  children,
}: {
  color?: BrandColor;
  variant?: "filled" | "outlined";
  size?: "sm" | "md";
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-bold lowercase leading-none",
        variant === "filled" ? filledStyles[color] : outlinedStyles[color],
        size === "sm" ? "px-3 py-1 text-xs" : "px-4 py-1.5 text-sm",
        className
      )}
    >
      {children}
    </span>
  );
}
