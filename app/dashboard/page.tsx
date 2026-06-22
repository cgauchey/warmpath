import { createClient } from "@/lib/supabase/server";
import { FollowUpCalendar } from "./follow-up-calendar";

export default async function DashboardPage() {
  const supabase = await createClient();

  const today = new Date();
  const endOfWeek = new Date(today);
  endOfWeek.setDate(today.getDate() + (7 - today.getDay()));
  const endOfWeekStr = endOfWeek.toISOString().split("T")[0];

  const [{ count: contactCount }, { count: roleCount }, { count: followUpCount }, { data: followUpInteractions }] =
    await Promise.all([
      supabase.from("contacts").select("*", { count: "exact", head: true }),
      supabase.from("roles").select("*", { count: "exact", head: true }),
      supabase
        .from("interactions")
        .select("*", { count: "exact", head: true })
        .lte("follow_up_date", endOfWeekStr)
        .gte("follow_up_date", today.toISOString().split("T")[0]),
      supabase
        .from("interactions")
        .select("id, follow_up_date, type, summary, contacts(name), roles(title)")
        .not("follow_up_date", "is", null)
        .order("follow_up_date", { ascending: true }),
    ]);

  const followUps = (followUpInteractions ?? []).map((i: any) => ({
    id: i.id,
    follow_up_date: i.follow_up_date,
    type: i.type,
    summary: i.summary,
    contact_name: i.contacts?.name ?? null,
    role_title: i.roles?.title ?? null,
  }));

  const cards = [
    { label: "Contacts", value: contactCount ?? 0 },
    { label: "Roles", value: roleCount ?? 0 },
    { label: "Follow-ups this week", value: followUpCount ?? 0 },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {cards.map((card) => (
          <div key={card.label} className="border rounded-lg p-6 bg-card">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">{card.label}</p>
            <p className="text-4xl font-semibold tracking-tight mt-2">{card.value}</p>
          </div>
        ))}
      </div>
      <FollowUpCalendar followUps={followUps} />
    </div>
  );
}
