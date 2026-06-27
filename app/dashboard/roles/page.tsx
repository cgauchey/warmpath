import { createClient } from "@/lib/supabase/server";
import { Role } from "@/lib/types";
import Link from "next/link";
import { PillButton } from "@/components/brand/pill-button";
import { StatusBadge, stageToBrandColor } from "@/components/status-badge";

const stages = [
  { value: "researching",  label: "researching" },
  { value: "applied",      label: "applied" },
  { value: "phone_screen", label: "phone screen" },
  { value: "onsite",       label: "onsite" },
  { value: "offer",        label: "offer" },
  { value: "rejected",     label: "rejected" },
] as const;

export default async function RolesPage({ searchParams }: { searchParams: Promise<{ q?: string; stage?: string }> }) {
  const { q, stage } = await searchParams;
  const supabase = await createClient();

  const { data: allRoles } = await supabase
    .from("roles")
    .select("*, companies(name)")
    .order("created_at", { ascending: false })
    .returns<Role[]>();

  const roles = allRoles?.filter((r) => {
    if (stage && r.stage !== stage) return false;
    if (q) {
      const search = q.toLowerCase();
      return (
        r.title?.toLowerCase().includes(search) ||
        r.stage?.replace(/_/g, " ").toLowerCase().includes(search) ||
        r.job_description?.toLowerCase().includes(search) ||
        r.companies?.name?.toLowerCase().includes(search)
      );
    }
    return true;
  });

  return (
    <div className="bg-brand-base -mx-6 -my-10 px-6 py-12 min-h-[calc(100vh-4rem)]">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-black text-white lowercase tracking-tight">roles</h1>
        <PillButton color="orange" size="sm" asChild>
          <Link href="/dashboard/roles/new">add role</Link>
        </PillButton>
      </div>

      <form className="mb-6">
        <input
          type="search"
          name="q"
          placeholder="search roles"
          defaultValue={q ?? ""}
          className="w-full bg-brand-surface border border-white/10 text-white placeholder:text-white/30 rounded-full px-5 py-2.5 text-sm font-medium focus:outline-none focus:border-white/30 transition-colors"
        />
      </form>

      <div className="mb-8 flex flex-wrap gap-2">
        <PillButton
          variant={!stage ? "filled" : "outlined"}
          color="white"
          size="sm"
          asChild
        >
          <Link href={{ pathname: "/dashboard/roles", query: q ? { q } : undefined }}>
            all
          </Link>
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
              <Link href={{ pathname: "/dashboard/roles", query: { ...(q ? { q } : {}), stage: s.value } }}>
                {s.label}
              </Link>
            </PillButton>
          );
        })}
      </div>

      {!roles?.length && (
        <p className="text-sm text-white/40 font-medium">
          {q || stage ? "no roles found." : "no roles yet. add your first one."}
        </p>
      )}

      <div className="flex flex-col divide-y divide-white/10">
        {roles?.map((r) => (
          <Link
            key={r.id}
            href={`/dashboard/roles/${r.id}`}
            className="py-4 flex justify-between items-start hover:bg-white/5 -mx-3 px-3 rounded-lg transition-colors"
          >
            <div>
              <p className="font-bold text-white">{r.title}</p>
              <p className="text-sm text-white/50 mt-0.5">{r.companies?.name}</p>
            </div>
            <StatusBadge stage={r.stage} type="role" />
          </Link>
        ))}
      </div>
    </div>
  );
}
