import { createClient } from "@/lib/supabase/server";
import { Contact } from "@/lib/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Contacts</h1>
        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard/contacts/new">Add contact</Link>
        </Button>
      </div>

      <form className="mb-6">
        <Input type="search" name="q" placeholder="Search contacts" defaultValue={q ?? ""} />
      </form>

      {!contacts?.length && (
        <p className="text-sm text-muted-foreground">{q ? "No contacts found." : "No contacts yet. Add your first one."}</p>
      )}

      <div className="flex flex-col divide-y">
        {contacts?.map((c) => (
          <Link
            key={c.id}
            href={`/dashboard/contacts/${c.id}`}
            className="py-4 flex justify-between items-start hover:bg-muted/50 -mx-3 px-3 rounded-lg transition-colors"
          >
            <div>
              <p className="font-medium">{c.name}</p>
              <p className="text-sm text-muted-foreground mt-0.5">
                {c.role_title}{c.companies?.name && ` · ${c.companies.name}`}
              </p>
            </div>
            <span className="text-xs text-muted-foreground mt-1">{c.stage?.replace(/_/g, " ")}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
