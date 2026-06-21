import { createClient } from "@/lib/supabase/server";
import { Contact } from "@/lib/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function ContactsPage() {
  const supabase = await createClient();
  const { data: contacts } = await supabase
    .from("contacts")
    .select("*, companies(name)")
    .order("created_at", { ascending: false })
    .returns<Contact[]>();

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Contacts</h1>
        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard/contacts/new">Add contact</Link>
        </Button>
      </div>

      {!contacts?.length && (
        <p className="text-sm text-muted-foreground">No contacts yet. Add your first one.</p>
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
