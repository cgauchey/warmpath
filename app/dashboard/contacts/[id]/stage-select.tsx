"use client";

import { useState } from "react";
import { updateContactStage } from "./actions";
import { getStageColor } from "@/components/status-badge";

const stages = [
  { value: "not_contacted", label: "not contacted" },
  { value: "reached_out", label: "reached out" },
  { value: "responded", label: "responded" },
  { value: "call_scheduled", label: "call scheduled" },
  { value: "intro_made", label: "intro made" },
];

export function StageSelect({ contactId, currentStage }: { contactId: string; currentStage: string }) {
  const [stage, setStage] = useState(currentStage);

  return (
    <select
      value={stage}
      onChange={(e) => {
        setStage(e.target.value);
        updateContactStage(contactId, e.target.value);
      }}
      className={`inline-block mt-2 text-xs font-medium px-2.5 py-1 rounded-full border-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring/50 ${getStageColor(stage, "contact")}`}
    >
      {stages.map((s) => (
        <option key={s.value} value={s.value}>{s.label}</option>
      ))}
    </select>
  );
}
