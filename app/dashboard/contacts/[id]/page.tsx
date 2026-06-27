import { createClient } from "@/lib/supabase/server";
import { Contact, Interaction } from "@/lib/types";
import Link from "next/link";
import { addInteraction } from "./actions";
import { InteractionHistory } from "./interaction-history";
import { StageSelect } from "./stage-select";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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

  const [{ data: interactions }, { data: roleConnections }] = await Promise.all([
    supabase
      .from("interactions")
      .select("*")
      .eq("contact_id", id)
      .order("interaction_date", { ascending: false, nullsFirst: false })
      .returns<Interaction[]>(),
    supabase
      .from("contact_role_connections")
      .select("id, angle, tier, roles(id, title, companies(name))")
      .eq("contact_id", id)
      .order("tier", { ascending: true }),
  ]);

  return (
    <div className="max-w-xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">{contact.name}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {contact.role_title}{contact.companies?.name && ` · ${contact.companies.name}`}
        </p>
        {contact.relationship && (
          <p className="text-sm text-muted-foreground mt-1">{contact.relationship}</p>
        )}
        <StageSelect contactId={id} currentStage={contact.stage} />
        {contact.linkedin_url && (
          <a
            href={contact.linkedin_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground transition-colors mt-2 inline-block"
          >
            LinkedIn
          </a>
        )}
      </div>

      {contact.notes && (
        <p className="text-sm whitespace-pre-wrap mb-10 text-muted-foreground leading-relaxed">{contact.notes}</p>
      )}

      <section className="mb-12">
        <h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-4">Log interaction</h2>
        <Card>
          <CardContent>
            <form action={addInteraction.bind(null, id)} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="type">Type</Label>
                <select id="type" name="type" required className="w-full border border-input rounded-lg h-9 px-3 text-sm bg-transparent text-foreground transition-colors focus:border-ring focus:ring-3 focus:ring-ring/50 focus:outline-none">
                  <option value="email">Email</option>
                  <option value="call">Call</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="coffee_chat">Coffee chat</option>
                  <option value="interview">Interview</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="summary">Summary</Label>
                <Textarea id="summary" name="summary" placeholder="What happened" rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="interaction_date">Interaction date</Label>
                  <Input id="interaction_date" type="date" name="interaction_date" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="follow_up_date">Follow up by</Label>
                  <Input id="follow_up_date" type="date" name="follow_up_date" />
                </div>
              </div>
              <Button type="submit" size="sm" className="self-start">Add</Button>
            </form>
          </CardContent>
        </Card>
      </section>

      <InteractionHistory interactions={interactions ?? []} contactId={id} />

      {roleConnections && roleConnections.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-4">
            Can help with
          </h2>
          <div className="flex flex-col divide-y">
            {roleConnections.map((conn: any) => (
              <Link
                key={conn.id}
                href={`/dashboard/roles/${conn.roles?.id}`}
                className="py-4 -mx-3 px-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <p className="font-medium text-sm">{conn.roles?.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {conn.roles?.companies?.name}
                </p>
                <p className="text-sm text-muted-foreground mt-1.5">{conn.angle}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
