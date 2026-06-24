"use client";

import { useState } from "react";
import { updateRoleStage } from "./actions";
import { getStageColor } from "@/components/status-badge";

const stages = [
  { value: "researching", label: "researching" },
  { value: "applied", label: "applied" },
  { value: "phone_screen", label: "phone screen" },
  { value: "onsite", label: "onsite" },
  { value: "offer", label: "offer" },
  { value: "rejected", label: "rejected" },
];

export function StageSelect({ roleId, currentStage }: { roleId: string; currentStage: string }) {
  const [stage, setStage] = useState(currentStage);

  return (
    <select
      value={stage}
      onChange={(e) => {
        setStage(e.target.value);
        updateRoleStage(roleId, e.target.value);
      }}
      className={`inline-block mt-2 text-xs font-medium px-2.5 py-1 rounded-full border-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring/50 ${getStageColor(stage, "role")}`}
    >
      {stages.map((s) => (
        <option key={s.value} value={s.value}>{s.label}</option>
      ))}
    </select>
  );
}
