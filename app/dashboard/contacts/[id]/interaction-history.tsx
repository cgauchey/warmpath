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
        <h2 className="text-xs font-black uppercase tracking-widest text-white/30">History</h2>
        {interactions.length > 0 && (
          <button
            onClick={() => setAscending(!ascending)}
            className="text-xs font-bold text-white/30 hover:text-white transition-colors"
          >
            {ascending ? "oldest first ↑" : "newest first ↓"}
          </button>
        )}
      </div>
      {!interactions.length && (
        <p className="text-sm text-white/40">no interactions yet.</p>
      )}
      <div className="flex flex-col divide-y divide-white/10">
        {sorted.map((i) => (
          <div key={i.id} className="py-4">
            <div className="flex justify-between text-xs text-white/40">
              <span>{i.type?.replace(/_/g, " ")}</span>
              <span>{new Date(i.interaction_date || i.created_at).toLocaleDateString()}</span>
            </div>
            {i.summary && <p className="text-sm text-white/70 mt-1.5 leading-relaxed">{i.summary}</p>}
            {i.follow_up_date && (
              <p className="text-xs text-white/30 mt-1">
                follow up: {new Date(i.follow_up_date).toLocaleDateString()}
              </p>
            )}
            <form action={deleteInteraction.bind(null, contactId, i.id)} className="mt-2">
              <button type="submit" className="text-xs font-bold text-brand-red/60 hover:text-brand-red transition-colors">
                delete
              </button>
            </form>
          </div>
        ))}
      </div>
    </section>
  );
}
