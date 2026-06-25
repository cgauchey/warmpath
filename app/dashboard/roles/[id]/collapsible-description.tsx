"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function CollapsibleDescription({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <p
        className={`text-sm whitespace-pre-wrap text-muted-foreground leading-relaxed ${
          expanded ? "" : "line-clamp-4"
        }`}
      >
        {text}
      </p>
      <Button
        variant="ghost"
        size="sm"
        className="mt-1 h-auto px-0 text-muted-foreground hover:text-foreground hover:bg-transparent"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? "Show less" : "Show more"}
      </Button>
    </div>
  );
}
