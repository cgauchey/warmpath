"use client";

import { useState, useTransition } from "react";
import { Textarea } from "@/components/ui/textarea";
import { PillButton } from "@/components/brand/pill-button";
import { updateCompanyNotes } from "./actions";

export function NotesEditor({
  companyId,
  initialNotes,
}: {
  companyId: string;
  initialNotes: string | null;
}) {
  const [editing, setEditing] = useState(false);
  const [notes, setNotes] = useState(initialNotes ?? "");
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    startTransition(async () => {
      await updateCompanyNotes(companyId, notes);
      setEditing(false);
    });
  }

  if (!editing) {
    return (
      <div className="flex items-start gap-3">
        {notes ? (
          <p className="text-sm text-white/60 leading-relaxed whitespace-pre-wrap flex-1">
            {notes}
          </p>
        ) : (
          <p className="text-sm text-white/25 italic flex-1">no notes yet</p>
        )}
        <button
          onClick={() => setEditing(true)}
          className="text-xs text-white/30 hover:text-white/60 transition-colors font-bold shrink-0"
        >
          edit
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <Textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={4}
        autoFocus
        className="bg-brand-surface border border-white/10 text-white placeholder:text-white/30 focus-visible:border-white/30 focus-visible:ring-0"
      />
      <div className="flex gap-2">
        <PillButton
          color="orange"
          size="sm"
          onClick={handleSave}
          disabled={isPending}
        >
          {isPending ? "saving…" : "save"}
        </PillButton>
        <PillButton
          variant="outlined"
          color="white"
          size="sm"
          onClick={() => {
            setNotes(initialNotes ?? "");
            setEditing(false);
          }}
          disabled={isPending}
        >
          cancel
        </PillButton>
      </div>
    </div>
  );
}
