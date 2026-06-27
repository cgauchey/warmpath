import { cn } from "@/lib/utils";
import type { BrandColor } from "./pill-button";

const colorConfig: Record<BrandColor, { bg: string; value: string; label: string }> = {
  orange: { bg: "bg-brand-orange", value: "text-white",      label: "text-white/75" },
  blue:   { bg: "bg-brand-blue",   value: "text-white",      label: "text-white/75" },
  pink:   { bg: "bg-brand-pink",   value: "text-[#0d0d0d]",  label: "text-[#0d0d0d]/60" },
  yellow: { bg: "bg-brand-yellow", value: "text-[#0d0d0d]",  label: "text-[#0d0d0d]/60" },
  purple: { bg: "bg-brand-purple", value: "text-white",      label: "text-white/75" },
  teal:   { bg: "bg-brand-teal",   value: "text-white",      label: "text-white/75" },
  red:    { bg: "bg-brand-red",    value: "text-white",      label: "text-white/75" },
  white:  { bg: "bg-white",        value: "text-[#0d0d0d]",  label: "text-[#0d0d0d]/60" },
};

export function StatCard({
  label,
  value,
  color = "orange",
  className,
}: {
  label: string;
  value: number | string;
  color?: BrandColor;
  className?: string;
}) {
  const { bg, value: valueColor, label: labelColor } = colorConfig[color];
  return (
    <div
      className={cn(
        "rounded-full px-8 py-5 flex flex-col gap-1 transition-transform duration-150 hover:scale-[1.02]",
        bg,
        className
      )}
    >
      <span className={cn("text-5xl font-black leading-none tabular-nums", valueColor)}>
        {value}
      </span>
      <span className={cn("text-sm font-bold lowercase", labelColor)}>
        {label}
      </span>
    </div>
  );
}
