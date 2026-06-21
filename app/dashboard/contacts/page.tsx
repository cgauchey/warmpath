import { createClient } from "@/lib/supabase/server";
import { Contact } from "@/lib/types";
import Link from "next/link";

export default async function ContactsPage() {
  const supabase = await createClient();
  const { data: contacts } = await supabase
    .from("contacts")
    .select("*, companies(name)")
    .order("created_at", { ascending: false })
    .returns<Contact[]>();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Contacts</h1>
        <Link href="/dashboard/contacts/new" className="text-sm underline">
          + New contact
        </Link>
      </div>

      {!contacts?.length && (
        <p className="text-muted-foreground">No contacts yet. Add your first one.</p>
      )}

      <div className="grid gap-3">
        {contacts?.map((c) => (
          <Link
            key={c.id}
            href={`/dashboard/contacts/${c.id}`}
            className="border rounded-lg p-4 hover:bg-muted/50 block"
          >
            <div className="flex justify-between">
              <span className="font-medium">{c.name}</span>
              <span className="text-xs text-muted-foreground">{c.stage}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              {c.role_title} {c.companies?.name && `· ${c.companies.name}`}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
