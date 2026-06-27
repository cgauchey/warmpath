"use client";

import { useState } from "react";
import { updateRoleStage } from "./actions";
import { stageToBrandColor } from "@/components/status-badge";
import { filledStyles } from "@/components/brand/pill-button";
import { cn } from "@/lib/utils";

const stages = [
  { value: "researching",  label: "researching" },
  { value: "applied",      label: "applied" },
  { value: "phone_screen", label: "phone screen" },
  { value: "onsite",       label: "onsite" },
  { value: "offer",        label: "offer" },
  { value: "rejected",     label: "rejected" },
];

export function StageSelect({ roleId, currentStage }: { roleId: string; currentStage: string }) {
  const [stage, setStage] = useState(currentStage);
  const color = stageToBrandColor[stage] ?? "white";

  return (
    <div className="relative inline-block mt-3">
      <span
        className={cn(
          "inline-flex items-center text-xs font-bold px-3 py-1 rounded-full lowercase cursor-pointer",
          filledStyles[color]
        )}
      >
        {stage.replace(/_/g, " ")}
      </span>
      <select
        value={stage}
        onChange={(e) => {
          setStage(e.target.value);
          updateRoleStage(roleId, e.target.value);
        }}
        className="absolute inset-0 opacity-0 cursor-pointer w-full"
      >
        {stages.map((s) => (
          <option key={s.value} value={s.value}>{s.label}</option>
        ))}
      </select>
    </div>
  );
}
