"use client";

import { useState } from "react";

export function CollapsibleDescription({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <p className={`text-sm whitespace-pre-wrap text-white/60 leading-relaxed ${expanded ? "" : "line-clamp-4"}`}>
        {text}
      </p>
      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-2 text-xs font-bold text-white/30 hover:text-white transition-colors lowercase"
      >
        {expanded ? "show less" : "show more"}
      </button>
    </div>
  );
}
