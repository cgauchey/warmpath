import { Slot } from "radix-ui";
import { cn } from "@/lib/utils";
import { filledStyles, outlinedStyles, type BrandColor } from "./pill-button";
import type { ReactNode } from "react";

const sizeStyles = {
  sm: "w-8 h-8 text-sm",
  md: "w-10 h-10 text-base",
  lg: "w-12 h-12 text-lg",
};

export function IconButton({
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
        "inline-flex items-center justify-center rounded-full font-bold transition-transform duration-150 hover:scale-[1.05] active:scale-[0.97] cursor-pointer shrink-0",
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
