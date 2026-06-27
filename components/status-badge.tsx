import { cn } from "@/lib/utils";
import type { BrandColor } from "@/components/brand/pill-button";
import { filledStyles } from "@/components/brand/pill-button";

export const stageToBrandColor: Record<string, BrandColor> = {
  // role stages
  researching:  "white",
  applied:      "blue",
  phone_screen: "yellow",
  onsite:       "purple",
  offer:        "teal",
  rejected:     "red",
  // contact stages
  not_contacted:  "white",
  reached_out:    "blue",
  responded:      "yellow",
  call_scheduled: "purple",
  intro_made:     "teal",
};

export function getStageColor(stage: string, type: "role" | "contact" = "role"): string {
  const color = stageToBrandColor[stage] ?? "white";
  return filledStyles[color];
}

export function StatusBadge({
  stage,
  type = "role",
  className,
}: {
  stage: string;
  type?: "role" | "contact";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center text-xs font-bold px-3 py-1 rounded-full lowercase",
        getStageColor(stage, type),
        className
      )}
    >
      {stage.replace(/_/g, " ")}
    </span>
  );
}
