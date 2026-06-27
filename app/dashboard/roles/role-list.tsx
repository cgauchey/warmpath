"use client";

import { useState } from "react";
import Link from "next/link";
import { StatusBadge } from "@/components/status-badge";

type Role = {
  id: string;
  title: string;
  stage: string;
  job_description: string | null;
  companies: { name: string } | null;
};

export function RoleList({ roles, hasFilters }: { roles: Role[]; hasFilters: boolean }) {
  const [query, setQuery] = useState("");

  const filtered = query
    ? roles.filter((r) => {
        const q = query.toLowerCase();
        return (
          r.title?.toLowerCase().includes(q) ||
          r.stage?.replace(/_/g, " ").toLowerCase().includes(q) ||
          r.job_description?.toLowerCase().includes(q) ||
          r.companies?.name?.toLowerCase().includes(q)
        );
      })
    : roles;

  return (
    <>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="search roles"
        className="w-full bg-brand-surface border border-white/10 text-white placeholder:text-white/30 rounded-full px-5 py-2.5 text-sm font-medium focus:outline-none focus:border-white/30 transition-colors mb-6"
      />

      {!filtered.length && (
        <p className="text-sm text-white/40 font-medium">
          {query || hasFilters ? "no roles found." : "no roles yet. add your first one."}
        </p>
      )}

      <div className="flex flex-col divide-y divide-white/10">
        {filtered.map((r) => (
          <Link
            key={r.id}
            href={`/dashboard/roles/${r.id}`}
            className="py-4 flex justify-between items-start hover:bg-white/5 -mx-3 px-3 rounded-lg transition-colors"
          >
            <div>
              <p className="font-bold text-white">{r.title}</p>
              <p className="text-sm text-white/50 mt-0.5">{r.companies?.name}</p>
            </div>
            <StatusBadge stage={r.stage} type="role" />
          </Link>
        ))}
      </div>
    </>
  );
}
