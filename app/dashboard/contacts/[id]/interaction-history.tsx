"use client";

import { useState } from "react";
import { Interaction } from "@/lib/types";
import { deleteInteraction } from "./actions";

export function InteractionHistory({ interactions, contactId }: { interactions: Interaction[]; contactId: string }) {
  const [ascending, setAscending] = useState(false);

  const sorted = [...interactions].sort((a, b) => {
    const dateA = a.interaction_date || a.created_at;
    const dateB = b.interaction_date || b.created_at;
    return ascending
      ? dateA.localeCompare(dateB)
      : dateB.localeCompare(dateA);
  });

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">History</h2>
        {interactions.length > 0 && (
          <button
            onClick={() => setAscending(!ascending)}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {ascending ? "Oldest first ↑" : "Newest first ↓"}
          </button>
        )}
      </div>
      {!interactions.length && <p className="text-sm text-muted-foreground">No interactions yet.</p>}
      <div className="flex flex-col divide-y">
        {sorted.map((i) => (
          <div key={i.id} className="py-3">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{i.type?.replace(/_/g, " ")}</span>
              <span>{new Date(i.interaction_date || i.created_at).toLocaleDateString()}</span>
            </div>
            {i.summary && <p className="text-sm mt-1">{i.summary}</p>}
            {i.follow_up_date && (
              <p className="text-xs text-muted-foreground mt-1">Follow up: {new Date(i.follow_up_date).toLocaleDateString()}</p>
            )}
            <form action={deleteInteraction.bind(null, contactId, i.id)} className="mt-2">
              <button type="submit" className="text-xs text-destructive hover:underline">Delete</button>
            </form>
          </div>
        ))}
      </div>
    </section>
  );
}
