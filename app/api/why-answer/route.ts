import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await request.json();
  const { roleUrl, questionType, roleText } = body as {
    roleUrl: string;
    questionType: "why_company" | "why_role" | "both";
    roleText?: string;
  };

  if (!roleUrl || !questionType) {
    return Response.json(
      { error: "roleUrl and questionType are required" },
      { status: 400 }
    );
  }

  const { data: profile, error: profileError } = await supabase
    .from("user_profile")
    .select(
      "resume_text, background_notes, values_motivations, career_narrative, writing_samples"
    )
    .eq("user_id", user.id)
    .single();

  if (profileError || !profile) {
    return Response.json(
      { error: "Please fill out your profile first" },
      { status: 400 }
    );
  }

  return Response.json({ data: profile });
}
