"use client";

import { updateContactStage } from "./actions";

const stages = [
  { value: "not_contacted", label: "not contacted" },
  { value: "reached_out", label: "reached out" },
  { value: "responded", label: "responded" },
  { value: "call_scheduled", label: "call scheduled" },
  { value: "intro_made", label: "intro made" },
];

export function StageSelect({ contactId, currentStage }: { contactId: string; currentStage: string }) {
  return (
    <select
      defaultValue={currentStage}
      onChange={(e) => updateContactStage(contactId, e.target.value)}
      className="inline-block mt-2 text-xs px-2 py-0.5 rounded-full border text-muted-foreground bg-transparent cursor-pointer"
    >
      {stages.map((s) => (
        <option key={s.value} value={s.value}>{s.label}</option>
      ))}
    </select>
  );
}
