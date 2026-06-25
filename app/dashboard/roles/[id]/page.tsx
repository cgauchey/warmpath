import { createClient } from "@/lib/supabase/server";
import { Role } from "@/lib/types";
import { notFound } from "next/navigation";
import { StageSelect } from "./stage-select";
import { WhyGenerator } from "./why-generator";
import { SavedAnswers } from "./saved-answers";

export default async function RoleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: role }, { data: profile }, { data: savedAnswers }] = await Promise.all([
    supabase
      .from("roles")
      .select("*, companies(name)")
      .eq("id", id)
      .single<Role>(),
    supabase
      .from("user_profile")
      .select("resume_text")
      .single(),
    supabase
      .from("why_answers")
      .select("id, question_type, answer_text, created_at")
      .eq("role_id", id)
      .order("created_at", { ascending: false }),
  ]);

  if (!role) notFound();

  const resumes = (profile?.resume_text as { label: string; text: string; created_at: string }[] | null) ?? [];
  const answers = savedAnswers ?? [];

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
        <div className="mb-10">
          <h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-3">Description</h2>
          <p className="text-sm whitespace-pre-wrap text-muted-foreground leading-relaxed">{role.job_description}</p>
        </div>
      )}

      <section>
        <h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-4">
          Prep
        </h2>
        <WhyGenerator roleId={id} sourceUrl={role.source_url} resumes={resumes} generationNotes={role.generation_notes} />
      </section>

      {answers.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-4">
            Saved answers
          </h2>
          <SavedAnswers answers={answers} roleId={id} />
        </section>
      )}
    </div>
  );
}
