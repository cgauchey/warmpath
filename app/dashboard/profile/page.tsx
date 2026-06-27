import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { type ResumeEntry } from "./actions";
import { ResumeManager } from "./resume-manager";
import { ProfileFields } from "./profile-fields";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("user_profile")
    .select(
      "resume_text, background_notes, values_motivations, career_narrative, writing_samples, linkedin_url, github_url"
    )
    .eq("user_id", user.id)
    .single();

  const resumes: ResumeEntry[] =
    (profile?.resume_text as ResumeEntry[] | null) ?? [];

  const fields = [
    {
      name: "linkedin_url",
      label: "LinkedIn",
      placeholder: "https://linkedin.com/in/yourname",
      value: profile?.linkedin_url ?? "",
      inputType: "url" as const,
    },
    {
      name: "github_url",
      label: "GitHub",
      placeholder: "https://github.com/yourname",
      value: profile?.github_url ?? "",
      inputType: "url" as const,
    },
    {
      name: "background_notes",
      label: "Background notes",
      placeholder:
        "Anything else about your background — education, projects, skills",
      value: profile?.background_notes ?? "",
    },
    {
      name: "values_motivations",
      label: "Values & motivations",
      placeholder:
        "What matters to you in a role? What kind of work energizes you?",
      value: profile?.values_motivations ?? "",
    },
    {
      name: "career_narrative",
      label: "Career narrative",
      placeholder:
        "How do you describe your career arc? What's the thread that connects your experience?",
      value: profile?.career_narrative ?? "",
    },
    {
      name: "writing_samples",
      label: "Writing samples",
      placeholder:
        "Paste examples of your writing style — cover letter excerpts, emails, etc.",
      value: profile?.writing_samples ?? "",
    },
  ];

  return (
    <div className="bg-brand-base -mx-6 -my-10 px-6 py-12 min-h-[calc(100vh-4rem)]">
      <h1 className="text-4xl font-black text-white tracking-tight mb-8">profile</h1>

      <div className="flex flex-col gap-10">
        <section>
          <h2 className="text-xs font-black uppercase tracking-widest text-white/30 mb-4">Resumes</h2>
          <ResumeManager resumes={resumes} />
        </section>

        <section>
          <h2 className="text-xs font-black uppercase tracking-widest text-white/30 mb-4">Details</h2>
          <ProfileFields fields={fields} />
        </section>
      </div>
    </div>
  );
}
