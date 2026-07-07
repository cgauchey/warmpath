"use client";

import { useState } from "react";
import { addCompanyToList } from "./actions";

type Company = { id: string; name: string; industry: string | null };

export function AddCompanies({
  listId,
  companies,
}: {
  listId: string;
  companies: Company[];
}) {
  const [query, setQuery] = useState("");
  const [pending, setPending] = useState<string | null>(null);

  const filtered = query
    ? companies.filter((c) => {
        const q = query.toLowerCase();
        return (
          c.name.toLowerCase().includes(q) ||
          c.industry?.toLowerCase().includes(q)
        );
      })
    : companies;

  async function handleAdd(companyId: string) {
    setPending(companyId);
    await addCompanyToList(listId, companyId);
    setQuery("");
    setPending(null);
  }

  if (!companies.length) {
    return (
      <p className="text-sm text-white/25">
        all your companies are already in this list.
      </p>
    );
  }

  return (
    <div>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="search your companies..."
        className="w-full bg-brand-surface border border-white/10 text-white placeholder:text-white/30 rounded-full px-5 py-2.5 text-sm font-medium focus:outline-none focus:border-white/30 transition-colors mb-3"
      />

      {query && !filtered.length && (
        <p className="text-sm text-white/40">no companies found.</p>
      )}

      {filtered.length > 0 && (
        <div className="flex flex-col divide-y divide-white/10">
          {filtered.map((c) => (
            <button
              key={c.id}
              disabled={pending === c.id}
              onClick={() => handleAdd(c.id)}
              className="py-3 flex items-center justify-between -mx-3 px-3 rounded-lg hover:bg-white/5 transition-colors text-left w-full disabled:opacity-40"
            >
              <div>
                <p className="font-bold text-white text-sm">{c.name}</p>
                {c.industry && (
                  <p className="text-xs text-white/40 mt-0.5">{c.industry}</p>
                )}
              </div>
              <span className="text-white/30 text-lg font-bold leading-none ml-4">+</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
