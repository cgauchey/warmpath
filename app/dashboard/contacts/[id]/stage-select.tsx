"use client";

import { useState } from "react";
import { updateContactStage } from "./actions";
import { stageToBrandColor } from "@/components/status-badge";
import { filledStyles } from "@/components/brand/pill-button";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

const stages = [
  { value: "not_contacted",  label: "not contacted" },
  { value: "reached_out",    label: "reached out" },
  { value: "responded",      label: "responded" },
  { value: "call_scheduled", label: "call scheduled" },
  { value: "intro_made",     label: "intro made" },
];

export function StageSelect({ contactId, currentStage }: { contactId: string; currentStage: string }) {
  const [stage, setStage] = useState(currentStage);
  const color = stageToBrandColor[stage] ?? "white";

  return (
    <div className="relative inline-block mt-3">
      <span
        className={cn(
          "inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full lowercase cursor-pointer",
          filledStyles[color]
        )}
      >
        {stage.replace(/_/g, " ")}
        <ChevronDown className="h-3 w-3 opacity-70" />
      </span>
      <select
        value={stage}
        onChange={(e) => {
          setStage(e.target.value);
          updateContactStage(contactId, e.target.value);
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
