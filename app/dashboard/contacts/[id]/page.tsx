import { createClient } from "@/lib/supabase/server";
import { Contact, Interaction } from "@/lib/types";
import Link from "next/link";
import { addInteraction } from "./actions";
import { InteractionHistory } from "./interaction-history";
import { StageSelect } from "./stage-select";
import { PillButton } from "@/components/brand/pill-button";
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
    <div className="bg-brand-base -mx-6 -my-10 px-6 py-12 min-h-[calc(100vh-4rem)]">
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white tracking-tight leading-tight">{contact.name}</h1>
          <p className="text-white/50 font-medium mt-1">
            {contact.role_title}{contact.companies?.name && ` · ${contact.companies.name}`}
          </p>
          {contact.relationship && (
            <p className="text-sm text-white/40 mt-1">{contact.relationship}</p>
          )}
          <StageSelect contactId={id} currentStage={contact.stage} />
          {contact.linkedin_url && (
            <a
              href={contact.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-bold text-white/40 underline underline-offset-4 hover:text-white transition-colors mt-3 block"
            >
              LinkedIn ↗
            </a>
          )}
        </div>

        {contact.notes && (
          <p className="text-sm whitespace-pre-wrap mb-10 text-white/60 leading-relaxed">{contact.notes}</p>
        )}

        <section className="mb-12">
          <h2 className="text-xs font-black uppercase tracking-widest text-white/30 mb-4">Log interaction</h2>
          <div className="bg-brand-surface rounded-2xl p-5">
            <form action={addInteraction.bind(null, id)} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="type" className="text-xs font-black uppercase tracking-widest text-white/40">Type</label>
                <select
                  id="type"
                  name="type"
                  required
                  className="w-full bg-brand-base border border-white/10 text-white rounded-full px-5 py-2.5 text-sm font-medium focus:outline-none focus:border-white/30 transition-colors appearance-none cursor-pointer"
                >
                  <option value="email">Email</option>
                  <option value="call">Call</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="coffee_chat">Coffee chat</option>
                  <option value="interview">Interview</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="summary" className="text-xs font-black uppercase tracking-widest text-white/40">Summary</label>
                <textarea
                  id="summary"
                  name="summary"
                  placeholder="What happened"
                  rows={3}
                  className="w-full bg-brand-base border border-white/10 text-white placeholder:text-white/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/30 transition-colors resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="interaction_date" className="text-xs font-black uppercase tracking-widest text-white/40">Date</label>
                  <input
                    id="interaction_date"
                    type="date"
                    name="interaction_date"
                    className="w-full bg-brand-base border border-white/10 text-white rounded-full px-4 py-2.5 text-sm focus:outline-none focus:border-white/30 transition-colors [color-scheme:dark]"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="follow_up_date" className="text-xs font-black uppercase tracking-widest text-white/40">Follow up by</label>
                  <input
                    id="follow_up_date"
                    type="date"
                    name="follow_up_date"
                    className="w-full bg-brand-base border border-white/10 text-white rounded-full px-4 py-2.5 text-sm focus:outline-none focus:border-white/30 transition-colors [color-scheme:dark]"
                  />
                </div>
              </div>
              <PillButton type="submit" color="orange" size="sm" className="self-start">add</PillButton>
            </form>
          </div>
        </section>

        <InteractionHistory interactions={interactions ?? []} contactId={id} />

        {roleConnections && roleConnections.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xs font-black uppercase tracking-widest text-white/30 mb-4">Can help with</h2>
            <div className="flex flex-col divide-y divide-white/10">
              {roleConnections.map((conn: any) => (
                <Link
                  key={conn.id}
                  href={`/dashboard/roles/${conn.roles?.id}`}
                  className="py-4 -mx-3 px-3 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <p className="font-bold text-white text-sm">{conn.roles?.title}</p>
                  <p className="text-xs text-white/50 mt-0.5">{conn.roles?.companies?.name}</p>
                  <p className="text-sm text-white/50 mt-1.5">{conn.angle}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
