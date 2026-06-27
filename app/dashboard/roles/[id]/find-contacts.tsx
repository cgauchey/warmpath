"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { findContactsForRole } from "./actions";
import type { ContactResult } from "@/lib/types";

export function FindContacts({
  roleId,
  companyName,
  savedConnections,
}: {
  roleId: string;
  companyName: string;
  savedConnections: ContactResult[];
}) {
  const [results, setResults] = useState<ContactResult[]>(savedConnections);
  const [searched, setSearched] = useState(savedConnections.length > 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleFind() {
    setLoading(true);
    setError("");
    const { data, error: err } = await findContactsForRole(roleId);
    if (err) setError(err);
    if (data) {
      setResults(data);
      setSearched(true);
    }
    setLoading(false);
  }

  return (
    <section className="mt-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Contacts who can help
        </h2>
        <Button variant="outline" size="sm" onClick={handleFind} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
              Searching
            </>
          ) : searched ? "Re-run" : "Find"}
        </Button>
      </div>

      {error && <p className="text-sm text-destructive mb-4">{error}</p>}

      {searched && !loading && results.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No contacts found at {companyName}.
        </p>
      )}

      {results.length > 0 && (
        <div className="flex flex-col divide-y">
          {results.map((r) => (
            <Link
              key={r.contact_id}
              href={`/dashboard/contacts/${r.contact_id}`}
              className="py-4 -mx-3 px-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-sm">{r.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {r.role_title}{r.company_name && ` · ${r.company_name}`}
                  </p>
                </div>
                {r.tier === 1 && (
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full shrink-0 ml-3">
                    Works there
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1.5">{r.angle}</p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
