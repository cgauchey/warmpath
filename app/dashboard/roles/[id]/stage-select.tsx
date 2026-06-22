"use client";

import { updateRoleStage } from "./actions";

const stages = [
  { value: "researching", label: "researching" },
  { value: "applied", label: "applied" },
  { value: "phone_screen", label: "phone screen" },
  { value: "onsite", label: "onsite" },
  { value: "offer", label: "offer" },
  { value: "rejected", label: "rejected" },
];

export function StageSelect({ roleId, currentStage }: { roleId: string; currentStage: string }) {
  return (
    <select
      defaultValue={currentStage}
      onChange={(e) => updateRoleStage(roleId, e.target.value)}
      className="inline-block mt-2 text-xs px-2 py-0.5 rounded-full border text-muted-foreground bg-transparent cursor-pointer"
    >
      {stages.map((s) => (
        <option key={s.value} value={s.value}>{s.label}</option>
      ))}
    </select>
  );
}
