import { createClient } from "@/lib/supabase/server";
import { Role } from "@/lib/types";
import Link from "next/link";

export default async function RolesPage() {
  const supabase = await createClient();
  const { data: roles } = await supabase
    .from("roles")
    .select("*, companies(name)")
    .order("created_at", { ascending: false })
    .returns<Role[]>();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Roles</h1>
        <Link href="/dashboard/roles/new" className="text-sm underline">
          + New role
        </Link>
      </div>

      {!roles?.length && (
        <p className="text-muted-foreground">No roles yet. Add your first one.</p>
      )}

      <div className="grid gap-3">
        {roles?.map((r) => (
          <Link
            key={r.id}
            href={`/dashboard/roles/${r.id}`}
            className="border rounded-lg p-4 hover:bg-muted/50 block"
          >
            <div className="flex justify-between">
              <span className="font-medium">{r.title}</span>
              <span className="text-xs text-muted-foreground">{r.stage}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              {r.companies?.name}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
