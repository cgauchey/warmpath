import { createClient } from "@/lib/supabase/server";
import { Role } from "@/lib/types";
import { notFound } from "next/navigation";

export default async function RoleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: role } = await supabase
    .from("roles")
    .select("*, companies(name)")
    .eq("id", id)
    .single<Role>();

  if (!role) notFound();

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-semibold">{role.title}</h1>
      <p className="text-muted-foreground mb-1">
        {role.companies?.name}
      </p>
      <p className="text-sm text-muted-foreground mb-6">Stage: {role.stage}</p>

      {role.source_url && (
        <a href={role.source_url} target="_blank" rel="noopener noreferrer" className="text-sm underline block mb-4">
          Job posting
        </a>
      )}

      {role.job_description && <p className="mb-6 whitespace-pre-wrap">{role.job_description}</p>}
    </div>
  );
}
