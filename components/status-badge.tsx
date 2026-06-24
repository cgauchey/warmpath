import { cn } from "@/lib/utils";

const roleStageColors: Record<string, string> = {
  researching:  "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300",
  applied:      "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300",
  phone_screen: "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300",
  onsite:       "bg-violet-50 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300",
  offer:        "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300",
  rejected:     "bg-red-50 text-red-600 dark:bg-red-950/60 dark:text-red-400",
};

const contactStageColors: Record<string, string> = {
  not_contacted:  "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300",
  reached_out:    "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300",
  responded:      "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300",
  call_scheduled: "bg-violet-50 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300",
  intro_made:     "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300",
};

export function getStageColor(stage: string, type: "role" | "contact" = "role"): string {
  const map = type === "role" ? roleStageColors : contactStageColors;
  return map[stage] ?? roleStageColors.researching;
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
        "inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full capitalize",
        getStageColor(stage, type),
        className
      )}
    >
      {stage.replace(/_/g, " ")}
    </span>
  );
}
