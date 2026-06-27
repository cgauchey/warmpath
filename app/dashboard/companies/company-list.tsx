"use client";

import { useState } from "react";
import Link from "next/link";

type Company = {
  id: string;
  name: string;
  industry: string | null;
  roles: { id: string }[];
  contacts: { id: string }[];
};

export function CompanyList({ companies }: { companies: Company[] }) {
  const [query, setQuery] = useState("");

  const filtered = query
    ? companies.filter((c) => {
        const q = query.toLowerCase();
        return (
          c.name?.toLowerCase().includes(q) ||
          c.industry?.toLowerCase().includes(q)
        );
      })
    : companies;

  return (
    <>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="search companies"
        className="w-full bg-brand-surface border border-white/10 text-white placeholder:text-white/30 rounded-full px-5 py-2.5 text-sm font-medium focus:outline-none focus:border-white/30 transition-colors mb-6"
      />

      {!filtered.length && (
        <p className="text-sm text-white/40 font-medium">
          {query ? "no companies found." : "no companies yet. add your first one."}
        </p>
      )}

      <div className="flex flex-col divide-y divide-white/10">
        {filtered.map((c) => {
          const roleCount = c.roles?.length ?? 0;
          const contactCount = c.contacts?.length ?? 0;
          return (
            <Link
              key={c.id}
              href={`/dashboard/companies/${c.id}`}
              className="py-4 flex justify-between items-center hover:bg-white/5 -mx-3 px-3 rounded-lg transition-colors"
            >
              <div>
                <p className="font-bold text-white">{c.name}</p>
                {c.industry && (
                  <p className="text-sm text-white/40 mt-0.5">{c.industry}</p>
                )}
              </div>
              <div className="flex gap-3 text-xs font-bold text-white/30">
                {roleCount > 0 && (
                  <span>{roleCount} role{roleCount !== 1 ? "s" : ""}</span>
                )}
                {contactCount > 0 && (
                  <span>{contactCount} contact{contactCount !== 1 ? "s" : ""}</span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
