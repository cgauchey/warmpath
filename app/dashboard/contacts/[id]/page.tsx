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
      <h1 className="text-2xl font-semibold">{contact.name}</h1>
      <p className="text-muted-foreground mb-1">
        {contact.role_title} {contact.companies?.name && `· ${contact.companies.name}`}
      </p>
      <p className="text-sm text-muted-foreground mb-6">Stage: {contact.stage}</p>

      {contact.notes && <p className="mb-6 whitespace-pre-wrap">{contact.notes}</p>}

      <h2 className="font-medium mb-3">Log an interaction</h2>
      <form action={addInteraction.bind(null, id)} className="flex flex-col gap-3 mb-8">
        <select name="type" required className="border rounded-md h-9 px-3 text-sm">
          <option value="email">Email</option>
          <option value="call">Call</option>
          <option value="linkedin">LinkedIn</option>
          <option value="coffee_chat">Coffee chat</option>
          <option value="interview">Interview</option>
        </select>
        <Textarea name="summary" placeholder="What happened / what was said" rows={3} />
        <div>
          <label className="text-sm text-muted-foreground block mb-1">Follow up by</label>
          <Input type="date" name="follow_up_date" />
        </div>
        <Button type="submit" size="sm">Add</Button>
      </form>

      <h2 className="font-medium mb-3">History</h2>
      <div className="flex flex-col gap-3">
        {!interactions?.length && <p className="text-sm text-muted-foreground">No interactions logged yet.</p>}
        {interactions?.map((i) => (
          <div key={i.id} className="border rounded-md p-3 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>{i.type}</span>
              <span>{new Date(i.created_at).toLocaleDateString()}</span>
            </div>
            {i.summary && <p className="mt-1">{i.summary}</p>}
            {i.follow_up_date && (
              <p className="mt-1 text-xs">Follow up: {i.follow_up_date}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
