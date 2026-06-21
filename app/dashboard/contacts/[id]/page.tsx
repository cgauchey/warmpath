import { createClient } from "@/lib/supabase/server";
import { Contact, Interaction } from "@/lib/types";
import { addInteraction } from "./actions";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";

export default async function ContactDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: contact } = await supabase
    .from("contacts")
    .select("*, companies(name)")
    .eq("id", id)
    .single<Contact>();

  if (!contact) notFound();

  const { data: interactions } = await supabase
    .from("interactions")
    .select("*")
    .eq("contact_id", id)
    .order("created_at", { ascending: false })
    .returns<Interaction[]>();

  return (
    <div className="max-w-xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">{contact.name}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {contact.role_title}{contact.companies?.name && ` · ${contact.companies.name}`}
        </p>
        <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded-full border text-muted-foreground">
          {contact.stage?.replace(/_/g, " ")}
        </span>
      </div>

      {contact.notes && (
        <p className="text-sm whitespace-pre-wrap mb-8 text-muted-foreground">{contact.notes}</p>
      )}

      <section className="mb-10">
        <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground mb-4">Log interaction</h2>
        <form action={addInteraction.bind(null, id)} className="flex flex-col gap-3">
          <select name="type" required className="w-full border border-input rounded-md h-9 px-3 text-sm bg-transparent">
            <option value="email">Email</option>
            <option value="call">Call</option>
            <option value="linkedin">LinkedIn</option>
            <option value="coffee_chat">Coffee chat</option>
            <option value="interview">Interview</option>
          </select>
          <Textarea name="summary" placeholder="What happened" rows={3} />
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-muted-foreground">Follow up by</label>
            <Input type="date" name="follow_up_date" />
          </div>
          <Button type="submit" size="sm">Add</Button>
        </form>
      </section>

      <section>
        <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground mb-4">History</h2>
        {!interactions?.length && <p className="text-sm text-muted-foreground">No interactions yet.</p>}
        <div className="flex flex-col divide-y">
          {interactions?.map((i) => (
            <div key={i.id} className="py-3">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{i.type?.replace(/_/g, " ")}</span>
                <span>{new Date(i.created_at).toLocaleDateString()}</span>
              </div>
              {i.summary && <p className="text-sm mt-1">{i.summary}</p>}
              {i.follow_up_date && (
                <p className="text-xs text-muted-foreground mt-1">Follow up: {i.follow_up_date}</p>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
