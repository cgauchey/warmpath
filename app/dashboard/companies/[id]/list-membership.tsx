"use client";

import { useTransition } from "react";
import Link from "next/link";
import { toggleCompanyList } from "./actions";

type ListEntry = {
  id: string;
  name: string;
  isMember: boolean;
};

export function ListMembership({
  companyId,
  lists,
}: {
  companyId: string;
  lists: ListEntry[];
}) {
  const [pending, startTransition] = useTransition();

  if (!lists.length) {
    return (
      <p className="text-sm text-white/25">
        no lists yet.{" "}
        <Link
          href="/dashboard/lists/new"
          className="underline underline-offset-4 hover:text-white/60 transition-colors"
        >
          create one
        </Link>
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {lists.map((list) => (
        <button
          key={list.id}
          disabled={pending}
          onClick={() =>
            startTransition(() =>
              toggleCompanyList(list.id, companyId, list.isMember)
            )
          }
          className={`flex items-center justify-between py-2.5 px-3 rounded-lg border text-sm font-bold transition-colors disabled:opacity-50 ${
            list.isMember
              ? "border-white/20 bg-white/5 text-white"
              : "border-white/10 text-white/40 hover:border-white/20 hover:text-white/60"
          }`}
        >
          <span>{list.name}</span>
          <span className="text-base leading-none">
            {list.isMember ? "✓" : "+"}
          </span>
        </button>
      ))}
    </div>
  );
}
