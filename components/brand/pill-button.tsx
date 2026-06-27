import { Slot } from "radix-ui";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export type BrandColor = "orange" | "blue" | "pink" | "yellow" | "purple" | "teal" | "red" | "white";

export const filledStyles: Record<BrandColor, string> = {
  orange: "bg-brand-orange text-white",
  blue:   "bg-brand-blue text-white",
  pink:   "bg-brand-pink text-[#0d0d0d]",
  yellow: "bg-brand-yellow text-[#0d0d0d]",
  purple: "bg-brand-purple text-white",
  teal:   "bg-brand-teal text-white",
  red:    "bg-brand-red text-white",
  white:  "bg-white text-[#0d0d0d]",
};

export const outlinedStyles: Record<BrandColor, string> = {
  orange: "border-2 border-brand-orange text-brand-orange bg-transparent",
  blue:   "border-2 border-brand-blue text-brand-blue bg-transparent",
  pink:   "border-2 border-brand-pink text-brand-pink bg-transparent",
  yellow: "border-2 border-brand-yellow text-brand-yellow bg-transparent",
  purple: "border-2 border-brand-purple text-brand-purple bg-transparent",
  teal:   "border-2 border-brand-teal text-brand-teal bg-transparent",
  red:    "border-2 border-brand-red text-brand-red bg-transparent",
  white:  "border-2 border-white text-white bg-transparent",
};

const sizeStyles = {
  sm: "px-4 py-1.5 text-xs",
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3 text-base",
};

export function PillButton({
  variant = "filled",
  color = "orange",
  size = "md",
  asChild = false,
  className,
  children,
  ...props
}: {
  variant?: "filled" | "outlined";
  color?: BrandColor;
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
  className?: string;
  children: ReactNode;
  [key: string]: any;
}) {
  const Comp = asChild ? Slot.Root : "button";
  return (
    <Comp
      className={cn(
        "inline-flex items-center justify-center rounded-full font-bold leading-none transition-transform duration-150 hover:scale-[1.03] active:scale-[0.98] cursor-pointer select-none whitespace-nowrap",
        variant === "filled" ? filledStyles[color] : outlinedStyles[color],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}
