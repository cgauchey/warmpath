import { createClient } from "@/lib/supabase/server";
import { Role } from "@/lib/types";
import Link from "next/link";
import { PillButton } from "@/components/brand/pill-button";
import { StatusBadge, stageToBrandColor } from "@/components/status-badge";
import { RoleList } from "./role-list";

const stages = [
  { value: "researching",  label: "researching" },
  { value: "applied",      label: "applied" },
  { value: "phone_screen", label: "phone screen" },
  { value: "onsite",       label: "onsite" },
  { value: "offer",        label: "offer" },
  { value: "rejected",     label: "rejected" },
] as const;

export default async function RolesPage({ searchParams }: { searchParams: Promise<{ stage?: string }> }) {
  const { stage } = await searchParams;
  const supabase = await createClient();

  const { data: allRoles } = await supabase
    .from("roles")
    .select("*, companies(name)")
    .order("created_at", { ascending: false })
    .returns<Role[]>();

  const roles = stage ? allRoles?.filter((r) => r.stage === stage) : allRoles;

  return (
    <div className="bg-brand-base -mx-6 -my-10 px-6 py-12 min-h-[calc(100vh-4rem)]">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-black text-white lowercase tracking-tight">roles</h1>
        <PillButton color="orange" size="sm" asChild>
          <Link href="/dashboard/roles/new">add role</Link>
        </PillButton>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <PillButton
          variant={!stage ? "filled" : "outlined"}
          color="white"
          size="sm"
          asChild
        >
          <Link href="/dashboard/roles">all</Link>
        </PillButton>
        {stages.map((s) => {
          const color = stageToBrandColor[s.value] ?? "white";
          return (
            <PillButton
              key={s.value}
              variant={stage === s.value ? "filled" : "outlined"}
              color={color}
              size="sm"
              asChild
            >
              <Link href={{ pathname: "/dashboard/roles", query: { stage: s.value } }}>
                {s.label}
              </Link>
            </PillButton>
          );
        })}
      </div>

      <RoleList roles={(roles ?? []) as any} hasFilters={!!stage} />
    </div>
  );
}
