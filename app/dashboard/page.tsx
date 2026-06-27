import { createClient } from "@/lib/supabase/server";
import { StatCard } from "@/components/brand/stat-card";
import { FollowUpCalendar } from "./follow-up-calendar";
import Link from "next/link";

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

  return (
    <div className="bg-brand-base -mx-6 -my-10 px-6 py-12 min-h-[calc(100vh-4rem)]">
      <h1 className="text-4xl font-black text-white lowercase tracking-tight mb-10">
        dashboard
      </h1>

      <div className="grid grid-cols-3 gap-4 mb-14">
        <Link href="/dashboard/contacts"><StatCard label="contacts" value={contactCount ?? 0} color="orange" /></Link>
        <Link href="/dashboard/roles"><StatCard label="roles" value={roleCount ?? 0} color="blue" /></Link>
        <StatCard label="follow-ups this week" value={followUpCount ?? 0} color="yellow" />
      </div>

      <FollowUpCalendar followUps={followUps} />
    </div>
  );
}
