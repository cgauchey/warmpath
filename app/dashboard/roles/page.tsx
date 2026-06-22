import { createClient } from "@/lib/supabase/server";
import { Role } from "@/lib/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default async function RolesPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const supabase = await createClient();

  const { data: allRoles } = await supabase
    .from("roles")
    .select("*, companies(name)")
    .order("created_at", { ascending: false })
    .returns<Role[]>();

  const roles = q
    ? allRoles?.filter((r) => {
        const search = q.toLowerCase();
        return (
          r.title?.toLowerCase().includes(search) ||
          r.stage?.replace(/_/g, " ").toLowerCase().includes(search) ||
          r.job_description?.toLowerCase().includes(search) ||
          r.companies?.name?.toLowerCase().includes(search)
        );
      })
    : allRoles;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Roles</h1>
        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard/roles/new">Add role</Link>
        </Button>
      </div>

      <form className="mb-6">
        <Input type="search" name="q" placeholder="Search roles" defaultValue={q ?? ""} />
      </form>

      {!roles?.length && (
        <p className="text-sm text-muted-foreground">{q ? "No roles found." : "No roles yet. Add your first one."}</p>
      )}

      <div className="flex flex-col divide-y">
        {roles?.map((r) => (
          <Link
            key={r.id}
            href={`/dashboard/roles/${r.id}`}
            className="py-4 flex justify-between items-start hover:bg-muted/50 -mx-3 px-3 rounded-lg transition-colors"
          >
            <div>
              <p className="font-medium">{r.title}</p>
              <p className="text-sm text-muted-foreground mt-0.5">{r.companies?.name}</p>
            </div>
            <span className="text-xs text-muted-foreground mt-1">{r.stage?.replace(/_/g, " ")}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
