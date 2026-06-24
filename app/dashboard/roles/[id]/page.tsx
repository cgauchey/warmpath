import { createClient } from "@/lib/supabase/server";
import { Role } from "@/lib/types";
import { notFound } from "next/navigation";
import { StageSelect } from "./stage-select";

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
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">{role.title}</h1>
        <p className="text-sm text-muted-foreground mt-1">{role.companies?.name}</p>
        <StageSelect roleId={id} currentStage={role.stage} />
      </div>

      {role.source_url && (
        <a
          href={role.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-sm underline underline-offset-4 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          View job posting
        </a>
      )}

      {role.job_description && (
        <div>
          <h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-3">Description</h2>
          <p className="text-sm whitespace-pre-wrap text-muted-foreground leading-relaxed">{role.job_description}</p>
        </div>
      )}
    </div>
  );
}
