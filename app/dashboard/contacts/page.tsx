import { createClient } from "@/lib/supabase/server";
import { Contact } from "@/lib/types";
import Link from "next/link";
import { StatusBadge } from "@/components/status-badge";
import { PillButton } from "@/components/brand/pill-button";

export default async function ContactsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const supabase = await createClient();

  const { data: allContacts } = await supabase
    .from("contacts")
    .select("*, companies(name)")
    .order("created_at", { ascending: false })
    .returns<Contact[]>();

  const contacts = q
    ? allContacts?.filter((c) => {
        const search = q.toLowerCase();
        return (
          c.name?.toLowerCase().includes(search) ||
          c.role_title?.toLowerCase().includes(search) ||
          c.stage?.replace(/_/g, " ").toLowerCase().includes(search) ||
          c.notes?.toLowerCase().includes(search) ||
          c.companies?.name?.toLowerCase().includes(search)
        );
      })
    : allContacts;

  return (
    <div className="bg-brand-base -mx-6 -my-10 px-6 py-12 min-h-[calc(100vh-4rem)]">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-black text-white tracking-tight">contacts</h1>
        <PillButton color="orange" asChild>
          <Link href="/dashboard/contacts/new">add contact</Link>
        </PillButton>
      </div>

      <form className="mb-6">
        <input
          type="search"
          name="q"
          placeholder="search contacts"
          defaultValue={q ?? ""}
          className="w-full bg-brand-surface border border-white/10 text-white placeholder:text-white/30 rounded-full px-5 py-2.5 text-sm focus:outline-none focus:border-white/30 transition-colors"
        />
      </form>

      {!contacts?.length && (
        <p className="text-sm text-white/40 font-medium">
          {q ? "no contacts found." : "no contacts yet. add your first one."}
        </p>
      )}

      <div className="flex flex-col divide-y divide-white/10">
        {contacts?.map((c) => (
          <Link
            key={c.id}
            href={`/dashboard/contacts/${c.id}`}
            className="py-4 flex justify-between items-start hover:bg-white/5 -mx-3 px-3 rounded-lg transition-colors"
          >
            <div>
              <p className="font-bold text-white">{c.name}</p>
              <p className="text-sm text-white/50 mt-0.5">
                {c.role_title}{c.companies?.name && ` · ${c.companies.name}`}
              </p>
            </div>
            <StatusBadge stage={c.stage} type="contact" />
          </Link>
        ))}
      </div>
    </div>
  );
}
